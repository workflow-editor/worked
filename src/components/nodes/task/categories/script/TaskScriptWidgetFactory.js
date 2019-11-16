import * as RJD from 'varakh-react-diagrams';
import {TaskScriptNodeWidgetFactory} from './TaskScriptNodeWidget';

export class TaskScriptWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('task');
    }

    generateReactWidget(diagramEngine, node) {
        return TaskScriptNodeWidgetFactory({node});
    }
}
