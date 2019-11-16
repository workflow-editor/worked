import * as RJD from 'varakh-react-diagrams';
import {TaskSetNodeWidgetFactory} from './TaskSetNodeWidget';

export class TaskSetWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskSetNodeWidgetFactory({node});
    }
}
