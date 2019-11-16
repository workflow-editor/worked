import * as RJD from 'varakh-react-diagrams';
import {TaskOutputNodeModel} from './TaskOutputNodeModel';

export class TaskOutputNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskOutputNodeModel');
    }

    getInstance() {
        return new TaskOutputNodeModel();
    }
}
