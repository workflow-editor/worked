import * as RJD from 'varakh-react-diagrams';
import {TaskServiceNodeWidgetFactory} from './TaskServiceNodeWidget';

export class TaskServiceWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskServiceNodeWidgetFactory({node});
    }
}
