import * as RJD from 'varakh-react-diagrams';
import {TaskGetNodeModel} from './TaskGetNodeModel';

export class TaskGetNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskGetNodeModel');
    }

    getInstance() {
        return new TaskGetNodeModel();
    }
}
