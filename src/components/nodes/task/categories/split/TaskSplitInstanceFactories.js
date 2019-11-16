import * as RJD from 'varakh-react-diagrams';
import {TaskSplitNodeModel} from './TaskSplitNodeModel';

export class TaskSplitNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskSplitNodeModel');
    }

    getInstance() {
        return new TaskSplitNodeModel();
    }
}
