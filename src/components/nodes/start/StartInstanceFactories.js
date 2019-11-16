import * as RJD from 'varakh-react-diagrams';
import {StartNodeModel} from './StartNodeModel';

export class StartNodeFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('StartNodeModel');
    }

    getInstance() {
        return new StartNodeModel();
    }
}
