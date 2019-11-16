import * as RJD from 'varakh-react-diagrams';
import {TaskErrorNodeWidgetFactory} from './TaskErrorNodeWidget';

export class TaskErrorWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskErrorNodeWidgetFactory({node});
    }
}
