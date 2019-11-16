import * as RJD from 'varakh-react-diagrams';
import {BlockNodeWidgetFactory} from './BlockNodeWidget';

export class BlockWidgetFactory extends RJD.NodeWidgetFactory {
    constructor() {
        super('block');
    }

    generateReactWidget(diagramEngine, node) {
        return BlockNodeWidgetFactory({node});
    }
}
