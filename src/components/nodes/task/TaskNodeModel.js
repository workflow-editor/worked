import _ from 'lodash';
import {BaseNodeModel} from "../BaseNodeModel";
import {MODE_DSL, MODE_APACHE} from "../../../model/Mode";

const defaultOptions = {};
defaultOptions[MODE_DSL] = {
    permitNameChange: true,
    permitInPortAdd: true,
    permitOutPortAdd: true,
    permitInPortRemove: true,
    permitOutPortRemove: true,
    permitInPortLabelChange: true,
    permitOutPortLabelChange: true,
    permitCategoryChange: false,
    permitPathChange: true,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: true
};
defaultOptions[MODE_APACHE] = {
    permitNameChange: false,
    permitInPortAdd: true,
    permitOutPortAdd: true,
    permitInPortRemove: true,
    permitOutPortRemove: true,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: false,
    permitCategoryChange: false,
    permitPathChange: true,
    inPortsMaxAmount: 1,
    outPortsMaxAmount: 1,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];

export const taskNodeDefaultColor = 'rgb(224, 98, 20)';

export class TaskNodeModel extends BaseNodeModel {
    constructor(name = 'Task', category = '', path = [], color = taskNodeDefaultColor, options = defaultOptions, blacklist = defaultBlacklist) {
        super('task', {...defaultOptions, ...options}, {...defaultBlacklist, ...blacklist});

        this.name = name;
        this.category = category;
        this.path = path;

        this.color = color;
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.name = object.name;
        this.color = object.color;
        this.category = object.category;
        this.path = object.path;
    }

    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color,
            category: this.category,
            path: this.path,
        });
    }

    getInPorts() {
        return _.filter(this.ports, portModel => portModel.in);
    }

    getOutPorts() {
        return _.filter(this.ports, portModel => !portModel.in);
    }
}
