import _ from 'lodash';
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {DiagramPortModel} from "../../../../../model/DiagramPortModel";
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
    permitOutPortRemove: false,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: false,
    permitCategoryChange: false,
    permitPathChange: true,
    inPortsMaxAmount: 1,
    outPortsMaxAmount: 2,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [
    {
        category: 'choice',
        input: [
            {type: 'task', category: 'condition'},
            {type: 'task', category: 'choice'},
        ]
    }
];
defaultBlacklist[MODE_APACHE] = [
    {
        category: 'choice',
        input: [
            {type: 'task', category: 'condition'},
            {type: 'task', category: 'choice'},
        ],
    }
];

export const taskChoiceNodeDefaultColor = 'rgb(255,165,100)';
export const taskChoiceNodeDefaultName = 'Task : choice';

export class TaskChoiceNodeModel extends TaskNodeModel {
    constructor(name = taskChoiceNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = [];

        // call parent
        super(
            name,
            'choice',
            path,
            taskChoiceNodeDefaultColor,
            defaultOptions,
            defaultBlacklist
        );

        if (!displayOnly) {
            this.addPort(new DiagramPortModel(false, 'conditions', false, true));
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
