import {MODE_WSBPEL2} from "../model/Mode";
import {ParserException} from "./ParserException";
import {Parser} from "./Parser";

/**
 * Main class for parsing unserialized DiagramModel to WSBPEL2
 * TODO: This is just for demonstration on how to extend the editor.
 */
export class ParserWSBPEL2 extends Parser {

    /**
     * @param model (unserialized DiagramModel)
     */
    constructor(model) {
        super(model);

        this.visited = [];
        this.blocks = [];

        this.variables = [];
    }

    /**
     * @param model (unserialized DiagramModel)
     */
    parse(model) {
        super.parse(model);

        Object.keys(model.nodes).map((nodeId) => {
            let node = model.nodes[nodeId];
            let added = false;

            if (node.nodeType === 'block') {
                if (!added) this.blocks.push(node);
                added = true;
            }

            if (node.nodeType === 'task' && node.category === 'set') {

                // check for definition of variable
                for (let i = 0; i < node.path[MODE_WSBPEL2].length; i++) {
                    let value = this.valueFor('type', node.path[MODE_WSBPEL2]);

                    if (value === 'variable') {
                        if (!added) this.variables.push(node);
                        added = true;
                    }
                }
            }

            return true;
        });

        this.hasBlocks = this.blocks.length > 0;
        this.hasVariables = this.variables.length > 0;

        console.log('Blocks %s | Variables %s', this.hasBlocks, this.variables);
        console.log('Blocks', this.blocks);
        console.log('Variables', this.variables);

        const builder = require('xmlbuilder');

        let xmlProcess, xmlVariables;

        xmlProcess = this.xml = builder.create('process', {encoding: 'utf-8'})
            .att('xmlns', 'http://docs.oasis-open.org/wsbpel/2.0/process/executable');
        xmlProcess.att('name', model.name);

        // parse variables
        xmlVariables = this.xml.ele('variables');

        this.variables.forEach((variable) => {
            this.parseTask(variable, variable.path[MODE_WSBPEL2], variable.category, xmlVariables);
            this.visited.push(variable.id);
        });

        // parse process
        this.parseProcess(model, xmlProcess);

        return this.xml.end({pretty: true});
    }

    /**
     * Parse a model
     * @param model (unserialized DiagramModel)
     * @param parent
     */
    parseProcess(model, parent) {

        let start;

        Object.keys(model.nodes).map((nodeId) => {
            let node = model.nodes[nodeId];

            if (node.nodeType === 'start') {
                start = node;
            }

            return true;
        });

        if (start) {
            console.log('Found start node, beginning parsing for model %s...', model.name);
            this.parseNode(model, start, parent);
        }
    }

    /**
     * Parses a Task depending on it's category
     *
     * @param currentNode
     * @param paths
     * @param category
     * @param parent
     */
    parseTask(currentNode, paths, category, parent) {

        if (category === 'set') {
            let type = this.valueFor('type', paths);
            let variableName = this.valueFor('variableName', paths);

            if (type)

            switch (type) {
                case 'variable':
                    if (variableName === null) throw new ParserException('variableName is missing in node ' + currentNode.name);
                    parent.ele('variable', {
                            'name': variableName,
                            'messageType': this.valueFor('variableMessageType', paths),
                            'type': this.valueFor('variableType', paths),
                            'element': this.valueFor('variableElement', paths),
                        });
                    break;
                default:
                    console.log('parseTask(): found no handling for type %s in category %s', type, category);
                    break;
            }
        }

        // TODO
        if (category === 'delay') {
        }
    }

    /**
     * Parses a node and calls for each outgoing port
     *
     * @param model
     * @param currentNode
     * @param parent
     */
    parseNode(model, currentNode, parent) {

        console.log('Parsing %s (%s) (%s)', currentNode.name, currentNode.nodeType, currentNode.id);

        switch (currentNode.nodeType) {
            case 'block':
                this.parseProcess(currentNode.block, parent);
                break;
            case 'task':
                this.parseTask(currentNode, currentNode.path[MODE_WSBPEL2], currentNode.category, parent);
                break;
            default:
                break;
        }

        let currentNodeAdj = this.determineAdjacent(model, currentNode);

        console.log('Adjacent are', currentNodeAdj);

        currentNodeAdj.targets.forEach((v) => {

            if (this.visited.indexOf(v.id) === -1) {
                this.parseNode(model, v, parent);
                this.visited.push(v.id);
            }
        });
    }

    /**
     * H E L P E R S
     */
    /**
     * Generates XML node attributes depending on an array of keys
     *
     * @param keys
     * @param paths
     * @return {{}}
     */
    attributesFor(keys = [], paths) {
        let res = {};

        keys.forEach((key) => {
            let value = this.valueFor(key, paths);

            if (value !== null) {

                for(let i = 0; i < paths.length; i++) {
                    if (paths[i].key === key) {
                        res[paths[i].modeId] = value;
                        break;
                    }
                }
            }
        });

        return res;
    }

    /**
     * Determines adjacent outgoing nodes (targets) and type of connection (seq) between them
     *
     * @param model (unserialized DiagramModel)
     * @param currentNode
     * @return {{seq: boolean, targets: Array}}
     */
     determineAdjacent(model, currentNode) {

        let targets = [];

        Object.keys(currentNode.ports).map((portId) => {

            let port = currentNode.ports[portId];

            if (!port.in) {

                Object.keys(port.links).map((linkId) => {
                    let link = model.links[linkId];

                    if (link.targetPort && link.targetPort.parentNode) {

                        if (link.targetPort.parentNode.nodeType !== 'end') {
                            let link = model.links[linkId];
                            targets.push(link.targetPort.parentNode);
                        }
                    }

                    return true;
                });
            }

            return true;
        });

        // determine if PAR or SEQ for each port
        let isSequence = false;

        if (targets.length > 0) {
            isSequence = true;

            targets.forEach((a) => {
                targets.forEach((b) => {

                    if (a.id !== b.id) {
                        isSequence = false;
                    }
                });
            });
        }

        return {
            node: currentNode,
            seq: isSequence,
            targets: targets,
        }
    }
}