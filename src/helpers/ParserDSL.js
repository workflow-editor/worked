import {getEndNode, getErrorNodes, getStartNode} from "./DiagramModelHelper";
import {DiagramModel} from "../model/DiagramModel";
import {diagramEngine} from "./DiagramEngineHelper";
import {MODE_DSL} from "../model/Mode";
import {ParserException} from "./ParserException";
import {Parser} from "./Parser";

/**
 * Graph exploration
 * Saves paths from start to end/error
 */
class DepthFirstSearchPathFinder {

    /**
     * @param model (unserialized DiagramModel)
     */
    constructor(model) {
        this.model = model;
        this.paths = [];
    }

    /**
     * Iterates over the graph via DFS
     */
    walkGraph() {
        let startAdjacent;
        let visited = [];
        let paths = [];

        Object.keys(this.model.nodes).map((nodeId) => {
            let node = this.model.nodes[nodeId];
            visited[node.id] = false;

            if (node.nodeType === 'start') {
                startAdjacent = ParserDSL.determineAdjacent(this.model, node);
            }

            return true;
        });

        if (startAdjacent) {
           this.dfs(startAdjacent.node, visited, paths);
        }
    }

    /**
     * Processes currently known path from Start to End/Error
     * @param paths
     */
    processCurrentPath(paths) {
        let reversed = [];

        paths.forEach((path) => {
            reversed.push(path);
        });

        this.paths.push(reversed);
    }

    /**
     * Depth-first search
     * @param currentNode
     * @param visited
     * @param paths
     */
    dfs(currentNode, visited, paths) {

        visited[currentNode.id] = true;

        let currentNodeAdjacent = ParserDSL.determineAdjacent(this.model, currentNode);
        paths.push(currentNodeAdjacent);

        if (currentNode.nodeType === 'end' || (currentNode.nodeType === 'task' && currentNode.category && currentNode.category === 'error')) {
            this.processCurrentPath(paths);
        }

        currentNodeAdjacent.targets.forEach((u) => {
            //if (!visited[u.id]) { // prevent cycle if required
                this.dfs(u, visited, paths);
            //}

            return true;
        });

        paths.pop();
    }
}

/**
 * Main class for parsing unserialized DiagramModel to DSL
 */
export class ParserDSL extends Parser {

    /**
     * Add non recursive other blocks
     * @param model
     */
    parse(model) {
        super.parse(model);

        let res = this.parseModel(model);

        res += '\n\n';

        // call for all other blocks
        Object.keys(this.model.nodes).map((nodeId) => {
            let node = this.model.nodes[nodeId];

            if (node.nodeType === 'block') {
                res += '\n';

                let blockModel = new DiagramModel();
                blockModel.deSerializeDiagram(node.block, diagramEngine);
                res += this.parseModel(blockModel);
            }

            return true;
        });

        return res;
    }

    /**
     * Parse a model/block/workflow
     * @param model
     * @return {string}
     */
    parseModel(model) {
        let res = '';
        let startNode = getStartNode(model.serializeDiagram());
        let endNode = getEndNode(model.serializeDiagram());
        let errorNodes = getErrorNodes(model.serializeDiagram());

        // separate tasks from blocks
        res += this.parseTasks(model);
        res += '\n\n';

        // define blocks
        res += '(DEFBLOCK ' + this.adjustNaming(model.name) + ' ';

        // add interface
        res += '('; // events from tasks (errors)
        let raisedErrors = [];

        errorNodes.forEach((errorNode) => {
            raisedErrors.push(this.adjustNaming(errorNode.name));
        });
        res += raisedErrors.join(' ');
        res += ' ' + this.adjustNaming(endNode.name);
        res += ')';

        // ports as "state variables" from start/end/errors
        res += ' (';
        res += this.parseInterfaceVariables(startNode);
        res += ' ' + this.parseInterfaceVariables(endNode);

        errorNodes.forEach((errorNode) => {
            res += ' ' + this.parseInterfaceVariables(errorNode);
        });
        res += ')';

        // "event-handling rules"
        res += ' (';
        res += 'EH-RULES ';

        // errors
        raisedErrors.forEach((error) => {
            res += '('+ error +' true EXIT)'
        });

        // end
        res += '('+ this.adjustNaming(endNode.name) +' true EXIT)';
        res += ')';

        // output paths
        let dfsPathFinder = new DepthFirstSearchPathFinder(model);
        dfsPathFinder.walkGraph();

        dfsPathFinder.paths.forEach((path) => {
            let visualPath = [];
            path.forEach((pathItem) => {
                visualPath.push(pathItem.node.name);
            });
            console.log('Found path %s: ', visualPath.join('-'))
        });

        // body
        let body = this.parseBody(this.model);

        res += ' (';
        res += 'BODY ';
        res += '(' + body + ')';
        res += ' RAISE end STOP';
        res += ')';

        // end defblock
        res += ')';

        return res;
    }

    parseExternalEvents() {
        // NOT REQUIRED: error and end are automatically exported, extra events cannot be imported
    }

    parseConditions() {
        // NOT REQUIRED: process flow would always be "TERMINATED? x"; handled by generateBody and SEQ/PAR
    }

    generateBodyFor(model, currentNode, res = '') {

        let currentNodeAdj = ParserDSL.determineAdjacent(model, currentNode);

        if (currentNodeAdj.targets.length > 0) {
            if (currentNodeAdj.seq) {
                res += 'SEQ (';
            } else {
                res += 'PAR (';
            }
        }

        /*if (currentNode.nodeType === 'task' && currentNode.category === 'multiplex' && currentNode.getOutPorts().length > 1) {
            res += 'PAR (';
        } else {
            res += 'SEQ (';
        }*/

        console.log('Parsing %s (%s) (%s)', currentNode.name, currentNode.nodeType, currentNode.id);

        if (currentNode.nodeType !== 'start') {
            res += ' ' + this.adjustNaming(currentNode.name) + ' (' + this.parseInterfaceEvents(model, currentNode) + ') ' + '(' + this.parseInterfaceVariables(currentNode) + ')';
        }

        currentNodeAdj.targets.forEach((v) => {
            res += this.generateBodyFor(model, v);
        });

        if (currentNodeAdj.targets.length > 0) {
            res += ') ';
        }

        return res;
    }

    parseBody(model) {
        let startAdjacent;
        let res = '';

        Object.keys(model.nodes).map((nodeId) => {
            let node = model.nodes[nodeId];

            if (node.nodeType === 'start') {
                startAdjacent = ParserDSL.determineAdjacent(model, node);
            }

            return true;
        });

        if (startAdjacent) {
            res = this.generateBodyFor(model, startAdjacent.node);
        }

        return res;
    }

    /**
     * Parse a task node model
     * @param model
     * @return {string}
     */
    parseTasks(model) {
        let tasksArr = [];

        Object.keys(model.nodes).map((nodeId) => {
            let node = model.nodes[nodeId];

            if (node.nodeType === 'task' && node.category !== 'error') {
                let path = node.path[MODE_DSL][0]['value'];
                if (path === null || path === '') throw new ParserException('Path has no value in node ' + node.name);

                tasksArr.push(
                    '(DEFTASK ' + this.adjustNaming(node.name) + ' (' + this.parseInterfaceEvents(model, node) + ') (' + this.parseInterfaceVariables(node) + ') ' + this.adjustNaming(node.category) +
                    ' ' + this.adjustNaming(path) + ')' // parse mode-dependant path (all tasks in mode 'dsl' have just one component which is string)
                );
            }

            return true;
        });

        return tasksArr.join('\n')
    }

    /**
     * Parse DSL "interface" events (error, end)
     * @param model
     * @param node
     * @return {string}
     */
    parseInterfaceEvents(model, node) {
        let errorConnections = this.findTargetNodesFromNode(model, node, node.ports, false, 'task', 'error');
        let endConnections = this.findTargetNodesFromNode(model, node, node.ports, false, 'end');

        let raisedEvents = [];
        errorConnections.forEach((errorConnection) => {
            raisedEvents.push(this.adjustNaming(errorConnection.name));
        });
        endConnections.forEach((endConnection) => {
            raisedEvents.push(this.adjustNaming(endConnection.name));
        });

        return raisedEvents.join(' ');
    }

    /**
     * Parse DSL "interface" state variables
     * @param node
     * @return {string}
     */
    parseInterfaceVariables(node) {
        let portsArr = [];

        Object.keys(node.ports).map((portId) => {
            let port = node.ports[portId];

            let separator = '';

            // adjust separator depending on in type and node type
            if (port.in) {
                separator = '+';
            } else {
                separator = '^';
            }

            if (node.type === 'start' ) separator = '+';
            if (node.type === 'end' ) separator = '^';
            if (node.type === 'error' && node.category && node.category === 'error') separator = '^';

            portsArr.push(separator + this.adjustNaming(node.name + '.' + port.name));
            return true;
        });

        return portsArr.join(' ');
    }

    /**
     * Converts a string to lower and replaces spaces with dash
     * @param str
     * @return string
     */
    adjustNaming(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
    }

    /**
     * Determines adjacent outgoing nodes (targets) and type of connection (seq) between them
     * @param model (unserialized DiagramModel)
     * @param currentNode
     * @return {{seq: boolean, targets: Array}}
     */
    static determineAdjacent(model, currentNode) {

        let targets = [];

        Object.keys(currentNode.ports).map((portId) => {

            let port = currentNode.ports[portId];

            if (!port.in) {

                Object.keys(port.links).map((linkId) => {
                    let link = model.links[linkId];

                    if (link.targetPort && link.targetPort.parentNode) {

                        if (link.targetPort.parentNode.nodeType !== 'end' || (link.targetPort.parentNode.nodeType !== 'task' && link.targetPort.parentNode.category && link.targetPort.parentNode.category === 'error')) {
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