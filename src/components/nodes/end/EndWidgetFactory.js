import * as RJD from 'varakh-react-diagrams';
import {EndNodeWidgetFactory} from './EndNodeWidget';

export class EndWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('end');
    }

    generateReactWidget(diagramEngine, node) {
        return EndNodeWidgetFactory({node});
    }
}
