import * as RJD from 'varakh-react-diagrams';
import {TaskUnionNodeModel} from './TaskUnionNodeModel';

export class TaskUnionNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskUnionNodeModel');
    }

    getInstance() {
        return new TaskUnionNodeModel();
    }
}
