import * as RJD from "varakh-react-diagrams";

export class DiagramPortModel extends RJD.DefaultPortModel {
    constructor(isInput, name, deletable = true, multipleConnections = false) {
        super(isInput, name, name);
        this.deletable = deletable;
        this.multipleConnections = multipleConnections;
    }

    deSerialize(object) {
        super.deSerialize(object);
        this.deletable = (object.deletable ? object.deletable : true);
        this.multipleConnections = (object.multipleConnections ? object.multipleConnections : false);
    }

    serialize() {
        return {
            ...super.serialize(),
            deletable: this.deletable,
            multipleConnections: this.multipleConnections,
        };
    }
}