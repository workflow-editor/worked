import * as RJD from 'varakh-react-diagrams';
import {TaskConditionNodeModel} from './TaskConditionNodeModel';

export class TaskConditionNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskConditionNodeModel');
    }

    getInstance() {
        return new TaskConditionNodeModel();
    }
}
