import _ from 'lodash';
import {TASK_PATH_TYPE_TEXT, TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {TaskNodeModel} from "../../TaskNodeModel";
import {
    TASK_PATH_TYPE_LIST,
    TASK_PATH_TYPE_NUMBER
} from "../../TaskPath";
import {
    generateTaskPathApacheCamelExpression, generateTaskPathApacheCamelURI,
    generateTaskPathDSL
} from "../../TaskPathDefinitions";

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

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];

export const taskErrorNodeDefaultColor = 'rgb(255,0,0)';
export const taskErrorNodeDefaultName = 'Task : error';

export class TaskErrorNodeModel extends TaskNodeModel {
    constructor(name = taskErrorNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] =
            generateTaskPathApacheCamelExpression('handled_', 'Handled: ', ['constant'])
            .concat(generateTaskPathApacheCamelExpression('continued_', 'Continued: ', ['constant']))
            .concat(generateTaskPathApacheCamelExpression('bean_', 'Bean: ', ['bean']))
            .concat([
                new TaskPath('ref', 'ref', TASK_PATH_TYPE_TEXT, 'Set a redelivery class'),
                new TaskPath('maximumRedeliveries', 'maximumRedeliveries', TASK_PATH_TYPE_NUMBER, 'Set a maximum amount of redeliveries', 1),
                new TaskPath('delay', 'delay', TASK_PATH_TYPE_NUMBER, 'Set a delay', 0),
                new TaskPath('exceptions', 'exceptions', TASK_PATH_TYPE_LIST, 'Set all exception classes'),
            ])
            .concat(generateTaskPathApacheCamelURI());

        super(
            name,
            'error',
            path,
            taskErrorNodeDefaultColor,
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
