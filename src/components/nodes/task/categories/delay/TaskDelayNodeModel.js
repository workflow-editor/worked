import _ from 'lodash';
import {TASK_PATH_TYPE_TEXT, TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {TaskNodeModel} from "../../TaskNodeModel";
import {TASK_PATH_TYPE_CHECKBOX} from "../../TaskPath";
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

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];

export const taskDelayNodeDefaultColor = 'rgb(186,186,186)';
export const taskDelayNodeDefaultName = 'Task : delay';

export class TaskDelayNodeModel extends TaskNodeModel {
    constructor(name = taskDelayNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = generateTaskPathApacheCamelExpression('type_', 'Type: ', ['simple', 'constant', 'method', 'header'])
            .concat([
            new TaskPath('executorServiceRef', 'executorServiceRef', TASK_PATH_TYPE_TEXT, 'Refers to a custom Thread Pool if asyncDelay has been enabled.'),
            new TaskPath('asyncDelayed', 'asyncDelayed', TASK_PATH_TYPE_CHECKBOX, 'Enables asynchronous delay which means the thread will noy block while delaying.', false),
            new TaskPath('callerRunsWhenRejected', 'callerRunsWhenRejected', TASK_PATH_TYPE_CHECKBOX, 'Whether or not the caller should run the task when it was rejected by the thread pool. Is by default true', true),
        ]);

        super(
            name,
            'delay',
            path,
            taskDelayNodeDefaultColor,
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
