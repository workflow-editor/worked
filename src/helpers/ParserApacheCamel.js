import {MODE_APACHE} from "../model/Mode";
import {ParserException} from "./ParserException";
import {DiagramModel} from "../model/DiagramModel";
import {diagramEngine} from "./DiagramEngineHelper";
import {Parser} from "./Parser";

/**
 * Main class for parsing unserialized DiagramModel to ApacheCamel
 */
export class ParserApacheCamel extends Parser {

    /**
     * @param model (unserialized DiagramModel)
     */
    constructor(model) {
        super(model);

        this.visited = [];
        this.blocks = [];
        this.beans = [];
        this.endpoints = [];
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

                // check for definition of bean or endpoint
                for (let i = 0; i < node.path[MODE_APACHE].length; i++) {
                    let value = this.valueFor('type', node.path[MODE_APACHE]);

                    if (value === 'bean') {
                        if (!added) this.beans.push(node);
                        added = true;
                    }

                    if (value === 'endpoint') {
                        if (!added) this.endpoints.push(node);
                        added = true;
                    }
                }
            }

            return true;
        });

        this.hasBlocks = this.blocks.length > 0;
        this.hasBeans = this.beans.length > 0;
        this.hasEndpoints = this.endpoints.length > 0;

        console.log('Blocks %s | Beans %s | Endpoints %s', this.hasBlocks, this.hasBeans, this.hasEndpoints);
        console.log('Blocks', this.blocks);
        console.log('Beans', this.beans);
        console.log('Endpoints', this.endpoints);

        const builder = require('xmlbuilder');

        let beans, context, routes;

        // parse beans
        beans = this.xml = builder.create('beans', {encoding: 'utf-8'})
            .att('xmlns', 'http://www.springframework.org/schema/beans')
            .att('xmlns:amq', 'http://activemq.apache.org/schema/core')
            .att('xmlns:camel', 'http://camel.apache.org/schema/spring')
            .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
            .att('xsi:schemaLocation', 'http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://camel.apache.org/schema/spring http://camel.apache.org/schema/spring/camel-spring.xsd');

        this.beans.forEach((bean) => {
            this.parseTask(bean, bean.path[MODE_APACHE], bean.category, beans, false);
            //this.visited.push(bean.id);
        });

        context = this.xml.ele('camelContext', {
            id: 'camel',
            trace: true,
            xmlns: 'http://camel.apache.org/schema/spring'
        });

        // parse endpoints
        this.endpoints.forEach((endpoint) => {
            this.parseTask(endpoint, endpoint.path[MODE_APACHE], endpoint.category, context, false);
            //this.visited.push(endpoint.id);
        });

        routes = context;

        // parse blocks
        this.blocks.forEach((block) => {
            let blockModel = new DiagramModel();
            blockModel.deSerializeDiagram(block.block, diagramEngine);
            this.parseRoute(blockModel, routes);
            this.visited.push(block.id);
        });

        // parse route
        this.parseRoute(model, routes);

        return this.xml.end({pretty: true});
    }

    /**
     * Parse a model
     * @param model (unserialized DiagramModel)
     * @param parent
     */
    parseRoute(model, parent) {

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
            this.parseNode(model, start, parent.ele('route', {id: model.name}));
        }
    }

    /**
     * Parses a Task depending on it's category
     *
     * @param currentNode
     * @param paths
     * @param category
     * @param parent
     * @param ignoreEndpointsAndBeans
     */
    parseTask(currentNode, paths, category, parent, ignoreEndpointsAndBeans = true) {

        if (category === 'error') {
            let onException = parent.ele('onException', this.attributesFor(['ref', 'maximumRedeliveries', 'delay'], paths));

            let exceptions = this.valueFor('exceptions', paths);

            exceptions.forEach((exception) => {
                onException.ele('exception', exception);
            });

            let handledType = this.valueFor('handled_expressionLanguage', paths);
            this.parseExpression('handled_', handledType, paths, onException.ele('handled'));

            let continuedType = this.valueFor('continued_expressionLanguage', paths);
            this.parseExpression('continued_', continuedType, paths, onException.ele('continued'));

            let beanType = this.valueFor('bean_expressionLanguage', paths);
            this.parseExpression('bean_', beanType, paths, onException, [], false);

            let uri = this.valueFor('uri', paths);
            if (uri !== null && uri !== '') {
                onException.ele('to', this.attributesFor(['uri'], paths));
            }
        }

        if (category === 'service') {
            let type = this.valueFor('type', paths);
            let uri = this.valueFor('uri', paths);

            parent.ele(type, {'uri': uri});
        }

        if (category === 'script') {
            let type = this.valueFor('type', paths);
            let script = this.valueFor('script', paths);
            let beanRef = this.valueFor('beanRef', paths);
            let beanMethod = this.valueFor('beanMethod', paths);

            parent.ele('script').ele(type, script);

            if (beanRef !== null && beanMethod !== null) {
                parent.ele('beanRef', {ref: beanRef, method: beanMethod}, this.valueFor('message', paths));
            }
        }

        if (category === 'choice') {
            let choiceXML = parent.ele('choice');

            let conditionPorts = [];
            Object.keys(currentNode.ports).map((portId) => {
                let port = currentNode.ports[portId];

                if (!port.in && port.name === 'conditions') {
                    conditionPorts[portId] = port;
                }

                return true;
            });

            let outgoingTaskConditionNodes = this.findTargetNodesFromNode(this.model, currentNode, conditionPorts, false, 'task', 'condition');

            outgoingTaskConditionNodes.forEach((taskConditionNode) => {

                let type = this.valueFor('type', taskConditionNode.path[MODE_APACHE]);
                let ifType = this.valueFor('if_expressionLanguage', taskConditionNode.path[MODE_APACHE]);

                let conditionXML = this.parseExpression('if_', ifType, taskConditionNode.path[MODE_APACHE], choiceXML.ele(type), [], false);

                this.visited.push(taskConditionNode.id);

                // continue parsing adjacent nodes
                let taskConditionAdjacent = this.determineAdjacent(this.model, taskConditionNode);

                taskConditionAdjacent.targets.forEach((v) => {
                    if (this.visited.indexOf(v.id) === -1) {
                        this.parseNode(this.model, v, conditionXML);
                        this.visited.push(v.id);
                    }
                });
            });
        }

        if (category === 'output') {
            parent.ele('log', this.attributesFor(['loggingLevel', 'logName', 'marker', 'loggerRef', 'message'], paths));
        }

        if (category === 'convert') {
            parent.ele('convertBodyTo', this.attributesFor(['type', 'charset'], paths));
        }

        if (category === 'filter') {
            let type = this.valueFor('type_expressionLanguage', paths);
            let filterXML = this.parseExpression('type_', type, paths, parent.ele('filter'));

            let uri = this.valueFor('uri', paths);
            if (uri !== null && uri !== '') {
                filterXML.ele('to', this.attributesFor(['uri'], paths));
            }
        }

        if (category === 'union') {
            let type = this.valueFor('correlationExpression_expressionLanguage', paths);
            let unionXML = parent.ele('aggregate', this.attributesFor(
                [
                    'completionPredicate',
                    'completionTimeout',
                    'completionSize',
                    'optimisticLockRetryPolicy',
                    'parallelProcessing',
                    'optimisticLocking',
                    'executorServiceRef',
                    'timeoutCheckerExecutorServiceRef',
                    'aggregationRepositoryRef',
                    'strategyRef',
                    'strategyMethodName',
                    'strategyMethodAllowNull',
                    'completionInterval',
                    'completionTimeoutCheckerInterval',
                    'completionFromBatchConsumer',
                    'groupExchanges',
                    'eagerCheckCompletion',
                    'ignoreInvalidCorrelationKeys',
                    'closeCorrelationKeyOnCompletion',
                    'discardOnCompletionTimeout',
                    'forceCompletionOnStop',
                    'completeAllOnStop',
                    'aggregateControllerRef',
                ], paths));

            this.parseExpression('correlationExpression_', type, paths, unionXML.ele('correlationExpression'));

            let uri = this.valueFor('uri', paths);
            if (uri !== null && uri !== '') {
                unionXML.ele('to', this.attributesFor(['uri'], paths));
            }
        }

        // use 'get' at all?

        if (category === 'set') {
            let type = this.valueFor('type', paths);
            let id = this.valueFor('id', paths);
            let expressionType = this.valueFor('value_expressionLanguage', paths);
            let expressionValue = this.valueFor('value_expression', paths);

            if (type)

            switch (type) {
                case 'header':
                    if (id === null) throw new ParserException('id is missing in node ' + currentNode.name);

                    this.parseExpression('value_', expressionType, paths, parent.ele('setHeader', {'headerName': id}));
                    break;
                case 'property':
                    if (id === null) throw new ParserException('id is missing in node ' + currentNode.name);

                    this.parseExpression('value_', expressionType, paths, parent.ele('setProperty', {'propertyName': id}));
                    break;
                case 'endpoint':

                    if (!ignoreEndpointsAndBeans) {
                        if (expressionValue === null) throw new ParserException('uri is missing in node ' + currentNode.name);

                        if (expressionValue === null) {
                            parent.ele('endpoint', {'uri': expressionValue});
                        } else {
                            parent.ele('endpoint', {'id': id, 'uri': expressionValue});
                        }
                    }

                    break;
                case 'bean':

                    if (!ignoreEndpointsAndBeans) {
                        if (expressionValue === null) throw new ParserException('class is missing in node ' + currentNode.name);

                        if (id === null) {
                            parent.ele('bean', {'class': expressionValue});
                        } else {
                            parent.ele('bean', {'id': id, 'class': expressionValue});
                        }
                    }

                    break;
                case 'body':
                    this.parseExpression('value_', expressionType, paths, parent.ele('setBody'));
                    break;
                default:
                    console.log('parseTask(): found no handling for type %s in category %s', type, category);
                    break;
            }
        }

        if (category === 'multiplex') {
            let multiXML = parent.ele('multicast', this.attributesFor([
                'strategyRef',
                'strategyMethodName',
                'strategyMethodAllowNull',
                'parallelProcessing',
                'parallelAggregate',
                'executorServiceRef',
                'stopOnException',
                'streaming',
                'timeout',
                'onPrepareRef',
                'shareUnitOfWork',
            ], paths));

            // continue parsing adjacent nodes
            let taskMultiplexAdjacent = this.determineAdjacent(this.model, currentNode);

            taskMultiplexAdjacent.targets.forEach((v) => {
                if (this.visited.indexOf(v.id) === -1) {
                    this.parseNode(this.model, v, multiXML);
                    this.visited.push(v.id);
                }
            });
        }

        if (category === 'split') {
            let type = this.valueFor('type_expressionLanguage', paths);
            let splitXML = this.parseExpression('type_', type, paths, parent.ele('split', this.attributesFor(
                [
                    'parallelProcessing',
                    'strategyRef',
                    'strategyMethodName',
                    'strategyMethodAllowNull',
                    'executorServiceRef',
                    'streaming',
                    'stopOnException',
                    'timeout',
                    'onPrepareRef',
                    'shareUnitOfWork',
                    'parallelAggregate',
                    'stopOnAggregateException',
                ], paths)), [], false);

            let uris = this.valueFor('uris', paths);

            uris.forEach((uri) => {
                splitXML.ele('to', {uri: uri});
            });
        }

        if (category === 'delay') {
            let type = this.valueFor('type_expressionLanguage', paths);
            this.parseExpression('type_', type, paths, parent.ele('delay', this.attributesFor(['executorServiceRef', 'asyncDelayed', 'callerRunsWhenRejected'], paths)));
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
                this.parseRoute(currentNode.block, parent);
                break;
            case 'task':
                this.parseTask(currentNode, currentNode.path[MODE_APACHE], currentNode.category, parent);
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
     * Generates XML node for simple, constant, header, method depending on selected type
     *
     * @param prefix
     * @param type
     * @param paths
     * @param parent
     * @param addExtra | add more to an inner expression besides method, header, ....; This is an array of {name : string, attributes : [array], value: string} objects
     * @param parentForceRemove remove parent as XML element
     */
    parseExpression(prefix, type, paths, parent, addExtra = [], parentForceRemove = true) {
        let remove = false;

        if (type === 'method') {
            let ref = this.valueFor(prefix + 'ref', paths);
            let method = this.valueFor(prefix + 'method', paths);

            if (ref !== null && ref !== '' && method !== null && method !== null) {
                parent.ele('method', this.attributesFor([prefix + 'ref', prefix + 'method'], paths));
            } else {
                remove = true;
            }
        }
        if (type === 'bean') {
            let ref = this.valueFor(prefix + 'ref', paths);
            let method = this.valueFor(prefix + 'method', paths);

            if (ref !== null && ref !== '' && method !== null && method !== null) {
                parent.ele('beanRef', this.attributesFor([prefix + 'ref', prefix + 'method'], paths));
            } else {
                remove = true;
            }
        }
        else if (type === 'header') {
            let value = this.valueFor(prefix + 'expression', paths);

            if (value !== null && value !== '') {
                parent.ele('header', value);
            } else {
                remove = true;
            }
        }
        else if (type === 'constant') {
            let value = this.valueFor(prefix + 'expression', paths);

            if (value !== null && value !== '') {
                parent.ele('constant', value);
            } else {
                remove = true;
            }
        }
        else if (type === 'exchangeProperty') {
            let value = this.valueFor(prefix + 'expression', paths);

            if (value !== null && value !== '') {
                parent.ele('exchangeProperty', value);
            } else {
                remove = true;
            }
        }
        else if (type === 'simple') {
            let value = this.valueFor(prefix + 'expression', paths);

            if (value !== null && value !== '') {
                parent.ele('simple', this.attributesFor([prefix + 'resultType', prefix + 'trim'], paths), value);
            } else {
                remove = true;
            }
        }
        else if (type === 'string') {
            let value = this.valueFor(prefix + 'expression', paths);

            if (value !== null && value !== '') {
                parent.txt(this.valueFor(prefix + 'expression', paths));
            } else {
                remove = true;
            }
        }
        else {
            console.log('parseExpression(): found no handling for type %s', type);
        }

        addExtra.forEach((item) => {
            let itemValue = this.valueFor(item.value, paths);
            if (itemValue !== '' && itemValue !== null) {

                if (item.hasOwnProperty('attributes') && item.attributes.length > 0) {
                    parent.ele(item.name, this.attributesFor(item.attributes, paths), itemValue);
                } else {
                    parent.ele(item.name, itemValue);
                }
            }
        });

        if (remove && parentForceRemove) {
            parent.remove();
        }

        return parent;
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