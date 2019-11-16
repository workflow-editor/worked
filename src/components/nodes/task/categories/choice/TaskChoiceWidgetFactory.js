import * as RJD from 'varakh-react-diagrams';
import {TaskChoiceNodeWidgetFactory} from './TaskChoiceNodeWidget';

export class TaskChoiceWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskChoiceNodeWidgetFactory({node});
    }
}
