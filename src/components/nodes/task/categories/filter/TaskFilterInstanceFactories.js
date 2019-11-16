import * as RJD from 'varakh-react-diagrams';
import {TaskFilterNodeModel} from './TaskFilterNodeModel';

export class TaskFilterNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskFilterNodeModel');
    }

    getInstance() {
        return new TaskFilterNodeModel();
    }
}
