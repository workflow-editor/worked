import * as RJD from 'varakh-react-diagrams';
import {TaskSetNodeModel} from './TaskSetNodeModel';

export class TaskSetNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskSetNodeModel');
    }

    getInstance() {
        return new TaskSetNodeModel();
    }
}
