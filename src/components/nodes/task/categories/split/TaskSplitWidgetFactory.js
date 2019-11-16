import * as RJD from 'varakh-react-diagrams';
import {TaskSplitNodeWidgetFactory} from './TaskSplitNodeWidget';

export class TaskSplitWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskSplitNodeWidgetFactory({node});
    }
}
