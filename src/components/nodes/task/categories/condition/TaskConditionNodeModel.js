import _ from 'lodash';
import {TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {DiagramPortModel} from "../../../../../model/DiagramPortModel";
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
    permitOutPortAdd: false,
    permitInPortRemove: true,
    permitOutPortRemove: false,
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
defaultBlacklist[MODE_DSL] = [
    {
        category: 'condition',
        input: [
            {type: 'task', category: 'error'},
            {type: 'task', category: 'service'},
            {type: 'task', category: 'condition'},
            {type: 'task', category: 'script'},
            {type: 'task', category: 'output'},
            {type: 'task', category: 'convert'},
            {type: 'task', category: 'filter'},
            {type: 'task', category: 'union'},
            {type: 'task', category: 'set'},
            {type: 'task', category: 'multiplex'},
            {type: 'task', category: 'split'},
            {type: 'task', category: 'delay'},
        ],
        output: [
            {type: 'task', category: 'choice'},
            {type: 'task', category: 'condition'},
        ],
    },
];
defaultBlacklist[MODE_APACHE] = [
    {
        category: 'condition',
        input: [
            {type: 'task', category: 'error'},
            {type: 'task', category: 'service'},
            {type: 'task', category: 'condition'},
            {type: 'task', category: 'script'},
            {type: 'task', category: 'output'},
            {type: 'task', category: 'convert'},
            {type: 'task', category: 'filter'},
            {type: 'task', category: 'union'},
            {type: 'task', category: 'set'},
            {type: 'task', category: 'multiplex'},
            {type: 'task', category: 'split'},
            {type: 'task', category: 'delay'},
        ],
        output: [
            {type: 'task', category: 'choice'},
            {type: 'task', category: 'condition'},
        ],
    },
];

export const taskConditionNodeDefaultColor = 'rgb(255,165,0)';
export const taskConditionNodeDefaultName = 'Task : condition';

export class TaskConditionNodeModel extends TaskNodeModel {
    constructor(name = taskConditionNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = [new TaskPath('type', 'Type', TASK_PATH_TYPE_SELECT, 'Select a type', 'when', ['when', 'otherwise'])]
            .concat(generateTaskPathApacheCamelExpression('if_', 'If: ', ['simple']));

        // call parent
        super(
            name,
            'condition',
            path,
            taskConditionNodeDefaultColor,
            defaultOptions,
            defaultBlacklist
        );

        if (!displayOnly) {
            this.addPort(new DiagramPortModel(false, 'true', false));
        }

        this.description = 'Task nodes execute automated actions depending on their category. They have a path which holds all information for the specific mode parser.';
    }

    deSerialize(object) {
        super.deSerialize(object);
    }

    serialize() {
        return _.merge(super.serialize(), {});
    }
}
