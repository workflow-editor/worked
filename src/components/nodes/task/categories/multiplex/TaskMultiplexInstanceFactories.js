import * as RJD from 'varakh-react-diagrams';
import {TaskMultiplexNodeModel} from './TaskMultiplexNodeModel';

export class TaskMultiplexNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskMultiplexNodeModel');
    }

    getInstance() {
        return new TaskMultiplexNodeModel();
    }
}
