import * as RJD from 'varakh-react-diagrams';
import {TaskOutputNodeWidgetFactory} from './TaskOutputNodeWidget';

export class TaskOutputWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskOutputNodeWidgetFactory({node});
    }
}
