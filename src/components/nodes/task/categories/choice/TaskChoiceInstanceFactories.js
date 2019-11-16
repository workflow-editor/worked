import * as RJD from 'varakh-react-diagrams';
import {TaskChoiceNodeModel} from './TaskChoiceNodeModel';

export class TaskChoiceNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('TaskChoiceNodeModel');
    }

    getInstance() {
        return new TaskChoiceNodeModel();
    }
}
