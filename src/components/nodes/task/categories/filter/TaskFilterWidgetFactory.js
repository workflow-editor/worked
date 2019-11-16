import * as RJD from 'varakh-react-diagrams';
import {TaskFilterNodeWidgetFactory} from './TaskFilterNodeWidget';

export class TaskFilterWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskFilterNodeWidgetFactory({node});
    }
}
