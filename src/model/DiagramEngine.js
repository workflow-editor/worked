import * as RJD from 'varakh-react-diagrams';
import {DiagramModel} from "./DiagramModel";

export class DiagramEngine extends RJD.DiagramEngine {
    constructor() {
        super();
        this.diagramModel = new DiagramModel();
    }
}