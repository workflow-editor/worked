import * as RJD from 'varakh-react-diagrams';
import {TaskConditionNodeWidgetFactory} from './TaskConditionNodeWidget';

export class TaskConditionWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskConditionNodeWidgetFactory({node});
    }
}
