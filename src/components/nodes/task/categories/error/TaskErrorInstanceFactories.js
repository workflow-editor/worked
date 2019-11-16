import * as RJD from 'varakh-react-diagrams';
import {TaskErrorNodeModel} from './TaskErrorNodeModel';

export class TaskErrorNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskErrorNodeModel');
    }

    getInstance() {
        return new TaskErrorNodeModel();
    }
}
