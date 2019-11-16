import * as RJD from 'varakh-react-diagrams';
import {TaskDelayNodeModel} from './TaskDelayNodeModel';

export class TaskDelayNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskDelayNodeModel');
    }

    getInstance() {
        return new TaskDelayNodeModel();
    }
}
