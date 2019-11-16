import * as RJD from 'varakh-react-diagrams';
import {TaskScriptNodeModel} from './TaskScriptNodeModel';

export class TaskScriptNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskScriptNodeModel');
    }

    getInstance() {
        return new TaskScriptNodeModel();
    }
}
