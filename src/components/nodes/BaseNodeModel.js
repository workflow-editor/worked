import * as RJD from "varakh-react-diagrams";
import _ from 'lodash';
import {MODE_APACHE, MODE_DSL, MODE_WSBPEL2} from "../../model/Mode";

// options
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
defaultOptions[MODE_WSBPEL2] = {
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

// blacklist entries; possible item in mode array:
// {type: nodeType, category: nodeCategory, input/output: [{type: nodeType, category: nodeCategory}, ...]}
const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];
defaultBlacklist[MODE_WSBPEL2] = [];

export class BaseNodeModel extends RJD.NodeModel {
    constructor(type, options = defaultOptions, blacklist = defaultBlacklist) {
        super(type);
        this.options = {...defaultOptions, ...options};
        this.blacklist = {...defaultBlacklist, ...blacklist};
        this.requiresUpdate = false;
        this.requiresDelete = false;
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.requiresUpdate = object.requiresUpdate;
        this.requiresDelete = object.requiresDelete;
    }

    serialize() {
        return _.merge(super.serialize(), {
            requiresUpdate: this.requiresUpdate,
            requiresDelete: this.requiresDelete,
        });
    }
}