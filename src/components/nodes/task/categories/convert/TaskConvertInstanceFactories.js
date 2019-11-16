import * as RJD from 'varakh-react-diagrams';
import {TaskConvertNodeModel} from './TaskConvertNodeModel';

export class TaskConvertNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskConvertNodeModel');
    }

    getInstance() {
        return new TaskConvertNodeModel();
    }
}
