import React from 'react';
import {DropTarget} from 'react-dnd';
import {CustomDiagramWidget} from "./CustomDiagramWidget";
import {startNodeDefaultName, StartNodeModel} from "./nodes/start/StartNodeModel";
import {endNodeDefaultName, EndNodeModel} from "./nodes/end/EndNodeModel";
import {withAlert} from 'react-alert'
import {blockNodeDefaultName, BlockNodeModel} from "./nodes/block/BlockNodeModel";
import {DiagramModel} from "../model/DiagramModel";
import {diagramEngine} from "../helpers/DiagramEngineHelper";
import {checkDroppedNode, checkBlacklisted} from "../helpers/DiagramModelHelper";
import {taskScriptNodeDefaultName, TaskScriptNodeModel} from "./nodes/task/categories/script/TaskScriptNodeModel";
import {taskChoiceNodeDefaultName, TaskChoiceNodeModel} from "./nodes/task/categories/choice/TaskChoiceNodeModel";
import {taskServiceNodeDefaultName, TaskServiceNodeModel} from "./nodes/task/categories/service/TaskServiceNodeModel";
import {
    taskConditionNodeDefaultName,
    TaskConditionNodeModel
} from "./nodes/task/categories/condition/TaskConditionNodeModel";
import {taskOutputNodeDefaultName, TaskOutputNodeModel} from "./nodes/task/categories/output/TaskOutputNodeModel";
import {taskConvertNodeDefaultName, TaskConvertNodeModel} from "./nodes/task/categories/convert/TaskConvertNodeModel";
import {taskFilterNodeDefaultName, TaskFilterNodeModel} from "./nodes/task/categories/filter/TaskFilterNodeModel";
import {taskUnionNodeDefaultName, TaskUnionNodeModel} from "./nodes/task/categories/union/TaskUnionNodeModel";
import {taskGetNodeDefaultName, TaskGetNodeModel} from "./nodes/task/categories/get/TaskGetNodeModel";
import {taskSetNodeDefaultName, TaskSetNodeModel} from "./nodes/task/categories/set/TaskSetNodeModel";
import {
    taskMultiplexNodeDefaultName,
    TaskMultiplexNodeModel
} from "./nodes/task/categories/multiplex/TaskMultiplexNodeModel";
import {taskSplitNodeDefaultName, TaskSplitNodeModel} from "./nodes/task/categories/split/TaskSplitNodeModel";
import {taskDelayNodeDefaultName, TaskDelayNodeModel} from "./nodes/task/categories/delay/TaskDelayNodeModel";
import {taskErrorNodeDefaultName, TaskErrorNodeModel} from "./nodes/task/categories/error/TaskErrorNodeModel";

let diagramModel = new DiagramModel();

const nodesTarget = {
    drop(props, monitor, component) {
        const {x: pageX, y: pageY} = monitor.getSourceClientOffset();
        const {left = 0, top = 0} = diagramEngine.canvas.getBoundingClientRect();
        const {offsetX, offsetY} = diagramEngine.diagramModel;
        const x = pageX - left - offsetX;
        const y = pageY - top - offsetY;
        const item = monitor.getItem();

        // check drop validation
        let model = diagramModel.serializeDiagram();
        if (!checkDroppedNode(model, item.type)) {
            props.updateNotification({message: 'Mode forbids dropping more nodes of type ' + item.type});
            return;
        }

        let node;

        if (item.type === 'start') {
            node = new StartNodeModel(startNodeDefaultName);
        }
        if (item.type === 'end') {
            node = new EndNodeModel(endNodeDefaultName);
        }
        if (item.type === 'block') {
            node = new BlockNodeModel(item.name ? item.name : blockNodeDefaultName, item.remoteId, item.block, item.updated);
        }
        if (item.type === 'taskError') {
            node = new TaskErrorNodeModel(taskErrorNodeDefaultName, false);
        }
        if (item.type === 'taskService') {
            node = new TaskServiceNodeModel(taskServiceNodeDefaultName, false);
        }
        if (item.type === 'taskScript') {
            node = new TaskScriptNodeModel(taskScriptNodeDefaultName, false);
        }
        if (item.type === 'taskChoice') {
            node = new TaskChoiceNodeModel(taskChoiceNodeDefaultName, false);
        }
        if (item.type === 'taskCondition') {
            node = new TaskConditionNodeModel(taskConditionNodeDefaultName, false);
        }
        if (item.type === 'taskOutput') {
            node = new TaskOutputNodeModel(taskOutputNodeDefaultName, false);
        }
        if (item.type === 'taskConvert') {
            node = new TaskConvertNodeModel(taskConvertNodeDefaultName, false);
        }
        if (item.type === 'taskFilter') {
            node = new TaskFilterNodeModel(taskFilterNodeDefaultName, false);
        }
        if (item.type === 'taskUnion') {
            node = new TaskUnionNodeModel(taskUnionNodeDefaultName, false);
        }
        if (item.type === 'taskGet') {
            node = new TaskGetNodeModel(taskGetNodeDefaultName, false);
        }
        if (item.type === 'taskSet') {
            node = new TaskSetNodeModel(taskSetNodeDefaultName, false);
        }
        if (item.type === 'taskMultiplex') {
            node = new TaskMultiplexNodeModel(taskMultiplexNodeDefaultName, false);
        }
        if (item.type === 'taskSplit') {
            node = new TaskSplitNodeModel(taskSplitNodeDefaultName, false);
        }
        if (item.type === 'taskDelay') {
            node = new TaskDelayNodeModel(taskDelayNodeDefaultName, false);
        }

        node.x = x;
        node.y = y;
        diagramModel.addNode(node);
        props.updateModel(diagramModel.serializeDiagram());
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export class Diagram extends React.Component {
    componentDidMount() {
        const {model} = this.props;

        if (model) {
            this.setModel(model);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setModel(nextProps.model);

        if (nextProps.notification) {
            this.props.alert.show(nextProps.notification.message, nextProps.notification.options);
            this.props.updateNotification(null);
        }
    }

    setModel(model) {
        diagramModel = new DiagramModel();

        if (model) {
            diagramModel.deSerializeDiagram(model, diagramEngine);
        }

        diagramEngine.setDiagramModel(diagramModel);
    }

    onChange(model, action) {
        console.log('diagram.onChange()', action);

        if (['link-connected'].indexOf(action.type) !== -1) {

            if (action.linkModel.sourcePort.in === action.linkModel.targetPort.in) {
                this.props.updateNotification({message: 'You can only connect outputs to inputs'});
                return;
            }

            console.log(action.portModel.multipleConnections);

            // use inPortMultipleConnections
            if (!action.linkModel.targetPort.multipleConnections && !action.linkModel.sourcePort.parentNode.options[model.mode].inPortMultipleConnections && (Object.keys(action.linkModel.targetPort.links).length >= 2  && action.linkModel.targetPort.in)) {
                this.props.updateNotification({message: 'Mode forbids concurrent inputs'});
                return;
            }

            // use outPortMultipleConnections
            if (!action.linkModel.sourcePort.multipleConnections && !action.linkModel.sourcePort.parentNode.options[model.mode].outPortMultipleConnections && (Object.keys(action.linkModel.sourcePort.links).length >= 2 && action.linkModel.targetPort.in)) {
                this.props.updateNotification({message: 'Mode forbids concurrent outputs'});
                return;
            }

            // use connection blacklist
            if (checkBlacklisted(model.mode, action.linkModel.sourcePort.parentNode, action.linkModel.targetPort.parentNode)) {
                this.props.updateNotification({message: 'Mode forbids connecting these nodes'});
                return;
            }
        }

        // Ignore some events
        if (['items-copied'].indexOf(action.type) !== -1) {
            return;
        }

        // Item deleted
        if (['items-deleted'].indexOf(action.type) !== -1) {
            if (this.props.onNodeSelected) {
                return this.props.updateModel(model, {selectedNode: null});
            }
        }

        // Check for single selected items
        if (['node-selected', 'node-moved'].indexOf(action.type) !== -1) {
            return this.props.updateModel(model, {selectedNode: action.model});
        }

        // Check for canvas events
        const deselectEvts = ['canvas-click', 'canvas-drag', 'items-selected', 'items-drag-selected', 'items-moved'];
        if (deselectEvts.indexOf(action.type) !== -1) {
            return this.props.updateModel(model, {selectedNode: null});
        }

        // Check if this is a deselection and a single node exists
        const isDeselect = ['node-deselected', 'link-deselected'].indexOf(action.type) !== -1;
        if (isDeselect && action.items.length < 1 && action.model.nodeType) {
            return this.props.updateModel(model, {selectedNode: action.model});
        }

        this.props.updateModel(model);
    }

    render() {
        const {connectDropTarget, updateNotification} = this.props;

        // Render the canvas
        return connectDropTarget(
            <div className='diagram-drop-container'>
                <CustomDiagramWidget updateNotification={updateNotification} diagramEngine={diagramEngine} onChange={this.onChange.bind(this)}/>
            </div>
        );
    }
}

// Export the wrapped component
export default withAlert(DropTarget('node-source', nodesTarget, collect)(Diagram))