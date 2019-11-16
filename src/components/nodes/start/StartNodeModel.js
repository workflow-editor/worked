import _ from 'lodash';
import {BaseNodeModel} from "../BaseNodeModel";
import {MODE_APACHE, MODE_DSL, MODE_WSBPEL2} from "../../../model/Mode";

const defaultOptions = {};
defaultOptions[MODE_DSL] = {
    permitNameChange: false,
    permitInPortAdd: false,
    permitOutPortAdd: true,
    permitInPortRemove: false,
    permitOutPortRemove: true,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: true,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: true
};
defaultOptions[MODE_APACHE] = {
    permitNameChange: false,
    permitInPortAdd: false,
    permitOutPortAdd: true,
    permitInPortRemove: false,
    permitOutPortRemove: true,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: true,
    inPortsMaxAmount: null,
    outPortsMaxAmount: 1,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};
defaultOptions[MODE_WSBPEL2] = {
    permitNameChange: false,
    permitInPortAdd: false,
    permitOutPortAdd: true,
    permitInPortRemove: false,
    permitOutPortRemove: true,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: true,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: true
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [{output: [{type: 'end'}, {type: 'task', category: 'error'}]}];
defaultBlacklist[MODE_APACHE] = [{output: [{type: 'end'}, {type: 'task', category: 'condition'}]}];
defaultBlacklist[MODE_WSBPEL2] = [{output: [{type: 'end'}, {type: 'task', category: 'condition'}]}];

export const startNodeDefaultColor = 'rgb(0,153,0)';
export const startNodeDefaultName = 'Start';

export class StartNodeModel extends BaseNodeModel {
    constructor(name = startNodeDefaultName) {
        super('start', defaultOptions, defaultBlacklist);

        this.name = name;
        this.description = 'Start nodes represent the start of a workflow as an entrypoint. Data begins to flow there. Outputs of this node are automatically inserted into a workflow if re-used.';
        this.color = startNodeDefaultColor;
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

    getOutPorts() {
        return _.filter(this.ports, portModel => !portModel.in);
    }
}
