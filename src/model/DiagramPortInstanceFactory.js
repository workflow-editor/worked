import * as RJD from "varakh-react-diagrams";
import {DiagramPortModel} from "./DiagramPortModel";

export class DiagramPortInstanceFactory extends RJD.AbstractInstanceFactory {
    constructor() {
        super('DiagramPortModel');
    }

    getInstance() {
        return new DiagramPortModel(true, 'unknown');
    }
}