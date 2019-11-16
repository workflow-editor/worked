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

export const taskScriptNodeDefaultColor = 'rgb(255,215,0)';
export const taskScriptNodeDefaultName = 'Task : script';

export class TaskScriptNodeModel extends TaskNodeModel {
    constructor(name = taskScriptNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = [
            new TaskPath('type', 'type', TASK_PATH_TYPE_TEXT, 'Type of the script, e.g. groovy'),
            new TaskPath('script', 'script', TASK_PATH_TYPE_TEXT, 'Script to be executed'),
            new TaskPath('beanRef', 'beanRef', TASK_PATH_TYPE_TEXT, 'beanRef'),
            new TaskPath('beanMethod', 'beanMethod', TASK_PATH_TYPE_TEXT, 'beanMethod')
        ];

        super(
            name,
            'script',
            path,
            taskScriptNodeDefaultColor,
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
