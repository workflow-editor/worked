export class Parser {

    /**
     * @param model (unserialized DiagramModel)
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * @param model (unserialized DiagramModel)
     */
    parse(model) {
        console.log('Starting to parse %s', model.name);
    }

    /**
     * Returns value for a path key
     *
     * @param key
     * @param paths
     * @return {null}
     */
    valueFor(key, paths) {
        for(let i = 0; i < paths.length; i++) {

            if (paths[i].key === key) {
                let isArray = Array.isArray(paths[i].value);

                if (!isArray && paths[i].value !== '') {
                    return paths[i].value;
                }
                else if (isArray) {

                    paths[i].value.forEach((item, index) => {
                        if (item === '') {
                            paths[i].value.splice(index, 1); // cleans up path too
                        }
                    });

                    return paths[i].value;
                }
                else {
                    return null;
                }
            }
        }
    }

    /**
     * Finds direct target nodes from all ports of a given node
     * @param model
     * @param node
     * @param ports
     * @param isIn
     * @param type
     * @param category
     * @return {Array} (BaseNodeModel)
     */
    findTargetNodesFromNode(model, node, ports, isIn, type, category = null) {
        let targetNodes = [];

        Object.keys(ports).map((portId) => {
            let port = node.ports[portId];

            if (port.in === isIn) {
                Object.keys(port.links).map((linkId) => {
                    if ((port.links[linkId].targetPort.parentNode.nodeType && port.links[linkId].targetPort.parentNode.nodeType === type) ||
                        (port.links[linkId].targetPort.parentNode.nodeType && port.links[linkId].targetPort.parentNode.nodeType === type && port.links[linkId].targetPort.parentNode.category && category && port.links[linkId].targetPort.parentNode.category === category)
                    ) {

                        if (targetNodes.indexOf(targetNodes.push(port.links[linkId].targetPort.parentNode)) !== -1) {
                            targetNodes.push(port.links[linkId].targetPort.parentNode);
                        }
                    }

                    return true;
                });
            }

            return true;
        });

        return targetNodes;
    }

    /**
     * Finds direct sources nodes from all ports of a given node
     * @param model
     * @param node
     * @param ports
     * @param isIn
     * @param type
     * @return {Array} (BaseNodeModel)
     */
    findSourceNodesFromNode(model, node, ports, isIn, type) {
        let sourceNodes = [];

        Object.keys(ports).map((portId) => {
            let port = node.ports[portId];

            if (port.in === isIn) {
                Object.keys(port.links).map((linkId) => {

                    if (port.links[linkId].sourcePort.parentNode.nodeType && port.links[linkId].sourcePort.parentNode.nodeType === type) {

                        if (sourceNodes.indexOf(sourceNodes.push(port.links[linkId].sourcePort.parentNode)) !== -1) {
                            sourceNodes.push(port.links[linkId].sourcePort.parentNode);
                        }
                    }

                    return true;
                });
            }

            return true;
        });

        return sourceNodes;
    }
}