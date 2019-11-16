import _ from 'lodash';
import {TASK_PATH_TYPE_TEXT, TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {TaskNodeModel} from "../../TaskNodeModel";
import {generateTaskPathDSL} from "../../TaskPathDefinitions";

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

export const taskOutputNodeDefaultColor = 'rgb(255,99,71)';
export const taskOutputNodeDefaultName = 'Task : output';

export class TaskOutputNodeModel extends TaskNodeModel {
    constructor(name = taskOutputNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = [
            new TaskPath('message', 'message', TASK_PATH_TYPE_TEXT, 'Sets the log message (uses simple language)'),
            new TaskPath('loggingLevel', 'loggingLevel', TASK_PATH_TYPE_TEXT, 'Sets the logging level. The default value is INFO', 'INFO'),
            new TaskPath('logName', 'logName', TASK_PATH_TYPE_TEXT, 'Sets the name of the logger'),
            new TaskPath('marker', 'marker', TASK_PATH_TYPE_TEXT, 'To use slf4j marker'),
            new TaskPath('loggerRef', 'loggerRef', TASK_PATH_TYPE_TEXT, 'To refer to a custom logger instance to lookup from the registry.'),
        ];

        super(
            name,
            'output',
            path,
            taskOutputNodeDefaultColor,
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
