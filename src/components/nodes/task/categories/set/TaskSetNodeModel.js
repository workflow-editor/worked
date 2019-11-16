import _ from 'lodash';
import {TASK_PATH_TYPE_TEXT, TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL, MODE_WSBPEL2} from "../../../../../model/Mode";
import {TaskNodeModel} from "../../TaskNodeModel";
import {TASK_PATH_TYPE_SELECT} from "../../TaskPath";
import {generateTaskPathApacheCamelExpression, generateTaskPathDSL} from "../../TaskPathDefinitions";

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
    permitNameChange: true,
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
defaultOptions[MODE_WSBPEL2] = {
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

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];
defaultBlacklist[MODE_WSBPEL2] = [];

export const taskSetNodeDefaultColor = 'rgb(1,97,78)';
export const taskSetNodeDefaultName = 'Task : set';

export class TaskSetNodeModel extends TaskNodeModel {
    constructor(name = taskSetNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = [
            new TaskPath('type', 'type', TASK_PATH_TYPE_SELECT, 'Type', 'property', ['property', 'header', 'endpoint', 'bean', 'body']),
            new TaskPath('id', 'id', TASK_PATH_TYPE_TEXT, 'Identifier (maps to propertyName, headerName, id)'),
        ].concat(generateTaskPathApacheCamelExpression('value_', 'Value: ', ['simple', 'constant', 'string', 'exchangeProperty']));
        path[MODE_WSBPEL2] = [
            new TaskPath('type', 'Type', TASK_PATH_TYPE_SELECT, 'What shall be set in the process?', 'variable', ['variable']),
            new TaskPath('variableName', 'variableName', TASK_PATH_TYPE_TEXT, 'variableName'),
            new TaskPath('variableMessageType', 'variableMessageType', TASK_PATH_TYPE_TEXT, 'variableMessageType'),
            new TaskPath('variableType', 'variableType', TASK_PATH_TYPE_TEXT, 'variableType'),
            new TaskPath('variableElement', 'variableElement', TASK_PATH_TYPE_TEXT, 'variableElement'),
        ];

        super(
            name,
            'set',
            path,
            taskSetNodeDefaultColor,
            defaultOptions,
            defaultBlacklist
        );

        this.description = 'Task nodes execute automated actions depending on their category. They have a path which holds all information for the specific mode parser.';
    }

    deSerialize(object) {
        super.deSerialize(object);
    }

    serialize() {
        return _.merge(super.serialize(), {});
    }
}
