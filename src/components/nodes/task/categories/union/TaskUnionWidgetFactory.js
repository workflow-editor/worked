import * as RJD from 'varakh-react-diagrams';
import {TaskUnionNodeWidgetFactory} from './TaskUnionNodeWidget';

export class TaskUnionWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskUnionNodeWidgetFactory({node});
    }
}
