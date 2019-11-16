import _ from 'lodash';
import {getEndNode, getErrorNodes, getStartNode} from '../../../helpers/DiagramModelHelper'
import {BaseNodeModel} from "../BaseNodeModel";
import {DiagramPortModel} from "../../../model/DiagramPortModel";
import {MODE_APACHE, MODE_DSL} from "../../../model/Mode";

const defaultOptions = {};
defaultOptions[MODE_DSL] = {
    permitNameChange: false,
    permitInPortAdd: false,
    permitOutPortAdd: false,
    permitInPortRemove: false,
    permitOutPortRemove: false,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: false,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: true
};
defaultOptions[MODE_APACHE] = {
    permitNameChange: false,
    permitInPortAdd: false,
    permitOutPortAdd: false,
    permitInPortRemove: false,
    permitOutPortRemove: false,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: false,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];

export const blockNodeDefaultColor = 'rgb(148,0,211)';
export const blockNodeDefaultName = 'Block';

export class BlockNodeModel extends BaseNodeModel {
    constructor(name = blockNodeDefaultName, remoteId = null, block = null, updated = Date.now()) {
        super('block', defaultOptions, defaultBlacklist);
        this.name = name;
        this.description = 'Workflows are saved in the repository and can be re-used in another workflow.';
        this.color = blockNodeDefaultColor;
        this.remoteId = remoteId;
        this.block = block;
        this.updated = updated;

        this.addAutomaticPorts();
    }

    // add ports depending on start and end node of this block
    addAutomaticPorts() {
        if (this.block) {

            let startNode = getStartNode(this.block);
            let endNode = getEndNode(this.block);

            if (startNode) {
                if (startNode.ports) {
                    startNode.ports.forEach(port => {
                        this.addPort(new DiagramPortModel(true, port.name));
                    });
                }
            }

            if (endNode) {
                if (endNode.ports) {
                    endNode.ports.forEach(port => {
                        this.addPort(new DiagramPortModel(false, port.name));
                    });
                }
            }


            // add error nodes
            let errorNodes = getErrorNodes(this.block);
            errorNodes.forEach((errorNode) => {
                if (errorNode.ports) {
                    errorNode.ports.forEach(port => {
                        this.addPort(new DiagramPortModel(false, errorNode.name + "." + port.name));
                    });
                }
            });
        }
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.name = object.name;
        this.color = object.color;
        this.remoteId = object.remoteId;
        this.block = object.block;
        this.updated = object.updated;

        this.addAutomaticPorts();
    }

    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color,
            remoteId: this.remoteId,
            updated: this.updated,
            block: this.block,
        });
    }

    getInPorts() {
        return _.filter(this.ports, portModel => portModel.in);
    }

    getOutPorts() {
        return _.filter(this.ports, portModel => !portModel.in);
    }
}
