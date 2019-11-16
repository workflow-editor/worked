import * as RJD from 'varakh-react-diagrams';
import {TaskServiceNodeModel} from './TaskServiceNodeModel';

export class TaskServiceNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskServiceNodeModel');
    }

    getInstance() {
        return new TaskServiceNodeModel();
    }
}
