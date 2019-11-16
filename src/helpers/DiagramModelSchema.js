/**
 * Checks model against schema
 * @param model (serialized DiagramModel)
 * @return {ValidatorResult}
 */
export function checkModel(model) {
    let Validator = require('jsonschema').Validator;
    let v = new Validator();
    let res = v.validate(model, MODEL_SCHEMA);

    if (!res.valid) {
        res.errors.forEach((error) => {
            console.log('Model error: %s', error.toString());
        });
    }

    return res;
}

export const MODEL_SCHEMA = {
    "definitions": {
        "Point": {
            "type": "object",
            "required": ["id", "_class", "selected", "x", "y"],
            "properties": {
                "id": {"type": "string"},
                "_class": {
                    "type": "string",
                    "enum": [
                        "PointModel"
                    ]
                },
                "selected": {"type": "boolean"},
                "x": {"type": "number"},
                "y": {"type": "number"}
            }
        },
        "Link": {
            "type": "object",
            "required": ["id", "_class", "selected", "type", "points", "extras"],
            "properties": {
                "id": {"type": "string"},
                "_class": {
                    "type": "string",
                    "enum": [
                        "LinkModel"
                    ]
                },
                "selected": {"type": "boolean"},
                "type": {
                    "type": "string",
                    "enum": [
                        "default"
                    ]
                },
                "source": {"type": ["null", "string"]},
                "sourcePort": {"type": ["null", "string"]},
                "target": {"type": ["null", "string"]},
                "targetPort": {"type": ["null", "string"]},
                "points": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Point"
                    }
                },
                "extras": {"type": "object"}
            }
        },
        "Port": {
            "type": "object",
            "required": ["id", "_class", "selected", "name", "parentNode", "links", "in", "label"],
            "properties": {
                "id": {"type": "string"},
                "_class": {
                    "type": "string",
                    "enum": [
                        "DiagramPortModel"
                    ]
                },
                "selected": {"type": "boolean"},
                "name": {"type": "string"},
                "parentNode": {"type": "string"},
                "links": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "in": {"type": "boolean"},
                "label": {"type": "string"},
                "deletable": {"type": "boolean"},
                "multipleConnections": {"type": ["boolean", "null"]}

            }
        },
        "Node": {
            "type": "object",
            "required": ["id", "_class", "selected", "type", "x", "y", "extras", "ports", "name", "color"],
            "properties": {
                "id": {"type": "string"},
                "updated": {"type": ["number", "null"]},
                "_class": {
                    "type": "string",
                    "enum": [
                        "StartNodeModel",
                        "EndNodeModel",
                        "BlockNodeModel",
                        "TaskErrorNodeModel",
                        "TaskServiceNodeModel",
                        "TaskScriptNodeModel",
                        "TaskChoiceNodeModel",
                        "TaskConditionNodeModel",
                        "TaskOutputNodeModel",
                        "TaskConvertNodeModel",
                        "TaskFilterNodeModel",
                        "TaskUnionNodeModel",
                        "TaskGetNodeModel",
                        "TaskSetNodeModel",
                        "TaskMultiplexNodeModel",
                        "TaskSplitNodeModel",
                        "TaskDelayNodeModel",
                    ]
                },
                "selected": {"type": "boolean"},
                "type": {
                    "type": "string",
                    "enum": [
                        "start",
                        "end",
                        "block",
                        "task",
                    ]
                },
                "x": {"type": "number"},
                "y": {"type": "number"},
                "extras": {"type": "object"},
                "ports": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Port"
                    }
                },
                "name": {"type": "string"},
                "color": {"type": "string"},
                "category": {"type": "string"},
                "path": {"type": ["object", "null"]},
                "value": {"type": ["string", "null"]},
            }
        },
        "Model": {
            "type": "object",
            "required": ["id", "name", "remoteId", "mode","offsetX", "offsetY", "zoom"],
            "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"},
                "remoteId": {"type": ["null", "integer"]},
                "mode": {"type": "string"},
                "offsetX": {"type": "number"},
                "offsetY": {"type": "number"},
                "zoom": {"type": "number"},
                "block": {"$ref": "#/definitions/Model"},
                "nodes": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Node"
                    }
                },
                "links": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Link"
                    }
                }
            }
        }
    },
    "type": "object",
    "$ref": "#/definitions/Model"
};