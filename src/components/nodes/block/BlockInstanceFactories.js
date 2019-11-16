import * as RJD from 'varakh-react-diagrams';
import {BlockNodeModel} from './BlockNodeModel';

export class BlockNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('BlockNodeModel');
    }

    getInstance() {
        return new BlockNodeModel();
    }
}
