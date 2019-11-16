import {MODEL_OPTIONS} from "../model/DiagramModel";

/**
 * Finds all nodes of a specific clazz and category
 * @param model
 * @param clazz
 * @param category
 * @return {Array}
 */
export function getNodesOf(model, clazz, category = null) {
    let resNodes = [];

    if (model && model.nodes) {
        model.nodes.forEach(node => {
            if ((node._class === clazz) || (category && node.category && node.category === category)) {
                resNodes.push(node);
            }
        });
    }

    return resNodes;
}

/**
 * Finds first node of a specific clazz and category
 * @param model
 * @param clazz
 * @param category
 * @return {*}
 */
export function getFirstNodeOf(model, clazz, category = null) {
    let nodes = getNodesOf(model, clazz, category);

    if (nodes.length > 0) {
        return nodes.shift();
    } else {
        return null;
    }
}


/**
 * Fetches last start node
 * @param model (serialized DiagramModel)
 * @returns BaseNode
 */
export function getStartNode(model) {
    return getFirstNodeOf(model, 'StartNodeModel');
}

/**
 * Fetches last end node
 * @param model (serialized DiagramModel)
 * @returns BaseNode
 */
export function getEndNode(model) {
    return getFirstNodeOf(model, 'EndNodeModel');
}

/**
 * Fetches error nodes
 * @param model (serialized DiagramModel)
 * @returns array
 */
export function getErrorNodes(model) {
    return getNodesOf(model, 'TaskNodeModel', 'error');
}

/**
 * Checks if all required nodes for save are in the model
 *
 * @param model (serialized DiagramModel)
 * @returns boolean
 */
export function checkRequiredNodes(model) {
    if (model.nodes && Array.isArray(model.nodes)) {

        if (MODEL_OPTIONS.hasOwnProperty(model.mode) && MODEL_OPTIONS[model.mode].hasOwnProperty('nodes')) {

            for(let i = 0; i < MODEL_OPTIONS[model.mode].nodes.length; i++) {
                let node = MODEL_OPTIONS[model.mode].nodes[i];

                let amount = getNodesOf(model, node.model, node.category).length;

                if (amount < node.min || amount > node.max) {
                    return false;
                }
            }
        }
    }

    return true;
}

/**
 * Checks if all required nodes for save are in the model
 *
 * @param model (serialized DiagramModel)
 * @param droppedType
 * @returns boolean
 */
export function checkDroppedNode(model, droppedType) {
    if (MODEL_OPTIONS.hasOwnProperty(model.mode) && MODEL_OPTIONS[model.mode].hasOwnProperty('nodes')) {

        for(let i = 0; i < MODEL_OPTIONS[model.mode].nodes.length; i++) {
            let node = MODEL_OPTIONS[model.mode].nodes[i];

            if (droppedType === node.type) {
                let amount = getNodesOf(model, node.model, node.category).length;

                if (amount >= node.max) {
                    return false;
                }
            }
        }
    }

    return true;
}

/**
 * Counts number of ports of a specific type (@see isIn)
 * @param node
 * @param isIn in or outport?
 * @return {number}
 */
export function getPortsAmount(node, isIn) {
    let res = 0;

    Object.keys(node.ports).map((portId) => {
        if (node.ports[portId].in === isIn) {
            res += 1;
        }

        return true;
    });

    return res;
}

/**
 *
 * Check if blacklist match occurs:
 * 1) check if target is in sourceNode's blacklist output
 * 2) check if source is in targetNode's blacklist input
 *
 * @param mode (string)
 * @param sourceNode (instance)
 * @param targetNode (instance)
 * @return {boolean}
 */
export function checkBlacklisted(mode, sourceNode, targetNode) {
    let blacklisted = false;

    console.log('Mode %s', mode);
    console.log('Source node \'%s\'', sourceNode.name);
    console.log('Target node \'%s\'', targetNode.name);

    // check if target is in sourceNode's blacklist output
    if (sourceNode.blacklist.hasOwnProperty(mode)) {
        sourceNode.blacklist[mode].forEach((entry) => {
            if ((entry.type !== 'task') || (entry.hasOwnProperty('category') && entry.category === targetNode.category)) {

                if (entry.hasOwnProperty('output')) {
                    console.log('Checking forbidden output of source node \'%s\'', sourceNode.name);

                    entry.output.forEach((disallowed) => {
                        console.log('Checking %s with category %s', disallowed.type, disallowed.category);

                        if (disallowed.type === targetNode.nodeType) {

                            if (disallowed.type === 'task') {
                                if (disallowed.hasOwnProperty('category') && disallowed.category === targetNode.category) {
                                    blacklisted = true;
                                    console.log('!! Check failed at %s for category', disallowed.type, targetNode.category);
                                }
                            } else {
                                blacklisted = true;
                                console.log('!! Check failed at %s', disallowed.type);
                            }
                        }
                    });
                }
            }
        });
    }

    // check if source is in targetNode's blacklist input
    if (targetNode.blacklist.hasOwnProperty(mode)) {
        targetNode.blacklist[mode].forEach((entry) => {
            if ((entry.type !== 'task') || (entry.hasOwnProperty('category') && entry.category === sourceNode.category)) {

                if (entry.hasOwnProperty('input')) {
                    console.log('Checking forbidden input of target node \'%s\'', targetNode.name);

                    entry.input.forEach((disallowed) => {
                        console.log('Checking %s with category %s', disallowed.type, disallowed.category);

                        if (disallowed.type === sourceNode.nodeType) {

                            if (disallowed.type === 'task') {
                                if (disallowed.hasOwnProperty('category') && disallowed.category === sourceNode.category) {
                                    blacklisted = true;
                                    console.log('!! Check failed at %s for category', disallowed.type, sourceNode.category);
                                }
                            } else {
                                blacklisted = true;
                                console.log('!! Check failed at %s', disallowed.type);
                            }
                        }
                    });
                }
            }
        });
    }

    return blacklisted;
}