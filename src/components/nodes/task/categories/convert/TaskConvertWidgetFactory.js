import * as RJD from 'varakh-react-diagrams';
import {TaskConvertNodeWidgetFactory} from './TaskConvertNodeWidget';

export class TaskConvertWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskConvertNodeWidgetFactory({node});
    }
}
