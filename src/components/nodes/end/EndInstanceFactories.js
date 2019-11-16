import * as RJD from 'varakh-react-diagrams';
import {EndNodeModel} from './EndNodeModel';

export class EndNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('EndNodeModel');
    }

    getInstance() {
        return new EndNodeModel();
    }
}
