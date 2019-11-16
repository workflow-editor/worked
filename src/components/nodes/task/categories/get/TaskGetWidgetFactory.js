import * as RJD from 'varakh-react-diagrams';
import {TaskGetNodeWidgetFactory} from './TaskGetNodeWidget';

export class TaskGetWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskGetNodeWidgetFactory({node});
    }
}
