import * as RJD from 'varakh-react-diagrams';
import {TaskDelayNodeWidgetFactory} from './TaskDelayNodeWidget';

export class TaskDelayWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskDelayNodeWidgetFactory({node});
    }
}
