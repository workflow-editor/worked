import * as RJD from 'varakh-react-diagrams';
import {DiagramWidget} from 'varakh-react-diagrams';
import _ from 'lodash';
import {DiagramModel, MODEL_OPTIONS} from "../model/DiagramModel";

export class CustomDiagramWidget extends DiagramWidget {

    componentDidMount() {
        const {diagramEngine, onChange} = this.props;
        diagramEngine.setCanvas(this.refs['canvas']);
        diagramEngine.setForceUpdate(this.forceUpdate.bind(this));
        const {selectAll, deselectAll, copy, paste, deleteItems} = this.getActions();

        // Add a keyboard listener
        this.setState({
            renderedNodes: true,
            windowListener: window.addEventListener('keydown', event => {
                const selectedItems = diagramEngine.getDiagramModel().getSelectedItems();
                const ctrl = (event.metaKey || event.ctrlKey);
                const shift = event.shiftKey;
                const alt = event.altKey;

                // Select all
                if (event.keyCode === 65 && ctrl && shift && selectAll) {
                    this.selectAll(true);
                    event.preventDefault();
                    event.stopPropagation();
                }

                // Deselect all
                if (event.keyCode === 68 && ctrl && shift && deselectAll) {
                    this.selectAll(false);
                    event.preventDefault();
                    event.stopPropagation();
                }

                // Copy selected
                if (event.keyCode === 67 && ctrl && alt && selectedItems.length && copy) {
                    this.copySelectedItems(selectedItems);
                }

                // Paste from clipboard
                if (event.keyCode === 86 && ctrl && alt && this.state.clipboard && paste) {
                    this.pasteSelectedItems(selectedItems);
                }

                // Delete all selected
                if ([68].indexOf(event.keyCode) !== -1 && ctrl && alt && selectedItems.length && deleteItems) {
                    selectedItems.forEach(element => {
                        element.remove();
                    });

                    onChange(diagramEngine.getDiagramModel().serializeDiagram(), {
                        type: 'items-deleted',
                        items: selectedItems
                    });
                    this.forceUpdate();
                }
            })
        });
        window.focus();
    }

    copySelectedItems(selectedItems) {
        const { diagramEngine, onChange } = this.props;

        // Cannot copy anything without a node, so ensure some are selected
        const nodes = _.filter(selectedItems, item => item instanceof RJD.NodeModel);

        // If there are no nodes, do nothing
        if (!nodes.length) {
            return;
        }

        // check for forbidden copy
        let model = diagramEngine.diagramModel.serializeDiagram();
        let violated = false;
        selectedItems.forEach((selectedItem) => {

            if (MODEL_OPTIONS.hasOwnProperty(model.mode) && MODEL_OPTIONS[model.mode].hasOwnProperty('forbiddenCopy')) {

                MODEL_OPTIONS[model.mode].forbiddenCopy.forEach((forbiddenNode) => {
                    if (
                        (selectedItem.nodeType === forbiddenNode.type) ||
                        (selectedItem.nodeType === forbiddenNode.type && selectedItem.category && forbiddenNode.category && selectedItem.category === forbiddenNode.category)
                    ) {
                        this.props.updateNotification({message: 'Mode forbids copy and paste for node ' + forbiddenNode.type});
                        violated = true;
                    }
                });
            }
        });

        if (violated) {

            return;
        }

        // Deserialize the existing diagramModel
        const flatModel = diagramEngine.diagramModel.serializeDiagram();

        // Create a new diagramModel to hold clipboard data
        const newModel = new DiagramModel();

        // Create map of GUIDs for replacement
        const gMap = {};

        // Track what was copied to send back to onChange
        const copied = [];

        // Iterate the nodes
        _.forEach(flatModel.nodes, node => {
            if (node.selected) {
                // Get the node instance, updated the GUID and deserialize
                const nodeOb = diagramEngine.getInstanceFactory(node._class).getInstance();
                node.id = gMap[node.id] = RJD.Toolkit.UID();
                nodeOb.deSerialize(node);

                // Deserialize ports
                _.forEach(node.ports, port => {
                    const portOb = diagramEngine.getInstanceFactory(port._class).getInstance();
                    port.id = gMap[port.id] = RJD.Toolkit.UID();
                    port.links = [];
                    portOb.deSerialize(port);
                    nodeOb.addPort(portOb);
                });

                nodeOb.setSelected(true);
                newModel.addNode(nodeOb);
                copied.push(nodeOb);
            }
        });

        // Iterate the links
        _.forEach(flatModel.links, link => {
            if (link.selected) {
                const linkOb = diagramEngine.getInstanceFactory(link._class).getInstance();
                link.id = gMap[link.id] = RJD.Toolkit.UID();

                // Change point GUIDs and set selected
                link.points.forEach(point => {
                    point.id = RJD.Toolkit.UID();
                    point.selected = true;
                });

                // Deserialize the link
                linkOb.deSerialize(link);

                // Only add the target if the node was copied and the target exists
                if (gMap[link.target] && gMap[link.source]) {
                    linkOb.setTargetPort(newModel.getNode(gMap[link.target]).getPortFromID(gMap[link.targetPort]));
                }

                // Add the source if it exists
                if (gMap[link.source]) {
                    linkOb.setSourcePort(newModel.getNode(gMap[link.source]).getPortFromID(gMap[link.sourcePort]));
                    newModel.addLink(linkOb);
                    copied.push(linkOb);
                }
            }
        });

        this.setState({ clipboard: newModel });
        onChange(diagramEngine.getDiagramModel().serializeDiagram(), { type: 'items-copied', items: copied });
    }
}
