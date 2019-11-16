import * as RJD from 'varakh-react-diagrams';
import {TaskMultiplexNodeWidgetFactory} from './TaskMultiplexNodeWidget';

export class TaskMultiplexWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskMultiplexNodeWidgetFactory({node});
    }
}
