import _ from 'lodash';
import {BaseNodeModel} from "../BaseNodeModel";
import {MODE_APACHE, MODE_DSL, MODE_WSBPEL2} from "../../../model/Mode";

const defaultOptions = {};
defaultOptions[MODE_DSL] = {
    permitNameChange: false,
    permitInPortAdd: true,
    permitOutPortAdd: false,
    permitInPortRemove: true,
    permitOutPortRemove: false,
    permitInPortLabelChange: true,
    permitOutPortLabelChange: false,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: true
};
defaultOptions[MODE_APACHE] = {
    permitNameChange: false,
    permitInPortAdd: true,
    permitOutPortAdd: false,
    permitInPortRemove: true,
    permitOutPortRemove: false,
    permitInPortLabelChange: true,
    permitOutPortLabelChange: false,
    inPortsMaxAmount: 1,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};
defaultOptions[MODE_WSBPEL2] = {
    permitNameChange: false,
    permitInPortAdd: true,
    permitOutPortAdd: false,
    permitInPortRemove: true,
    permitOutPortRemove: false,
    permitInPortLabelChange: true,
    permitOutPortLabelChange: false,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: true
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [{input: [{type: 'start'}]}];
defaultBlacklist[MODE_APACHE] = [{input: [{type: 'start'}]}];
defaultBlacklist[MODE_WSBPEL2] = [{input: [{type: 'start'}]}];

export const endNodeDefaultColor = 'rgb(96,96,96)';
export const endNodeDefaultName = 'End';

export class EndNodeModel extends BaseNodeModel {
    constructor(name = endNodeDefaultName) {
        super('end', defaultOptions, defaultBlacklist);

        this.name = name;
        this.description = 'End nodes are used to represent the end of a workflow. Inputs of this node are automatically inserted into a workflow if re-used';
        this.color = endNodeDefaultColor;
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.name = object.name;
        this.color = object.color;
    }

    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color,
        });
    }

    getInPorts() {
        return _.filter(this.ports, portModel => !portModel.out);
    }
}
