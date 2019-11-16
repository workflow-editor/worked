import * as RJD from 'varakh-react-diagrams';
import _ from 'lodash';
import {MODE_APACHE, MODE_WSBPEL2, MODE_DSL} from "./Mode";

export const MODEL_OPTIONS = {};
MODEL_OPTIONS[MODE_DSL] = {
    nodes: [
        {type: 'start', model: 'StartNodeModel', category: null, max: 1, min: 1},
        {type: 'end', model: 'EndNodeModel', category: null, max: 1, min: 1},
    ],
    forbiddenCopy: [{type: 'start', category: null}, {type: 'end', category: null}]
};
MODEL_OPTIONS[MODE_APACHE] = {
    nodes: [
        {type: 'start', model: 'StartNodeModel', category: null, max: 1, min: 1,},
        {type: 'end', model: 'EndNodeModel', category: null, max: 1, min: 1},
    ],
    forbiddenCopy: [{type: 'start', category: null}, {type: 'end', category: null}]
};
MODEL_OPTIONS[MODE_WSBPEL2] = {
    nodes: [
        {type: 'start', model: 'StartNodeModel', category: null, max: 1, min: 1},
        {type: 'end', model: 'EndNodeModel', category: null, max: 1, min: 1},
    ],
    forbiddenCopy: [{type: 'start', category: null}, {type: 'end', category: null}]
};

export class DiagramModel extends RJD.DiagramModel {

    constructor(name = 'Untitled', mode = MODE_APACHE, remoteId = null) {
        super();
        this.name = name;
        this.remoteId = remoteId;
        this.mode = mode;
    }

    deSerializeDiagram(object, diagramEngine) {
        super.deSerializeDiagram(object, diagramEngine);
        this.name = object.name;
        this.remoteId = object.remoteId;
        this.mode = object.mode;
    }

    serializeDiagram() {
        return {
            ...this.serialize(),
            name: this.name,
            remoteId: this.remoteId,
            mode: this.mode,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            zoom: this.zoom,
            links: _.map(this.links, link => link.serialize()),
            nodes: _.map(this.nodes, link => link.serialize())
        };
    }
}