import React from "react";
import DragSource from './DragWrapper';
import {StartNodeWidget} from "./nodes/start/StartNodeWidget";
import {EndNodeWidget} from "./nodes/end/EndNodeWidget";
import {BlockNodeWidget} from "./nodes/block/BlockNodeWidget";
import {TaskScriptNodeWidget} from "./nodes/task/categories/script/TaskScriptNodeWidget";
import {TaskChoiceNodeWidget} from "./nodes/task/categories/choice/TaskChoiceNodeWidget";
import {TaskServiceNodeWidget} from "./nodes/task/categories/service/TaskServiceNodeWidget";
import {TaskConditionNodeWidget} from "./nodes/task/categories/condition/TaskConditionNodeWidget";
import {TaskOutputNodeWidget} from "./nodes/task/categories/output/TaskOutputNodeWidget";
import {TaskConvertNodeWidget} from "./nodes/task/categories/convert/TaskConvertNodeWidget";
import {TaskFilterNodeWidget} from "./nodes/task/categories/filter/TaskFilterNodeWidget";
import {TaskUnionNodeWidget} from "./nodes/task/categories/union/TaskUnionNodeWidget";
import {TaskGetNodeWidget} from "./nodes/task/categories/get/TaskGetNodeWidget";
import {TaskSetNodeWidget} from "./nodes/task/categories/set/TaskSetNodeWidget";
import {TaskMultiplexNodeWidget} from "./nodes/task/categories/multiplex/TaskMultiplexNodeWidget";
import {TaskSplitNodeWidget} from "./nodes/task/categories/split/TaskSplitNodeWidget";
import {TaskDelayNodeWidget} from "./nodes/task/categories/delay/TaskDelayNodeWidget";
import {TaskErrorNodeWidget} from "./nodes/task/categories/error/TaskErrorNodeWidget";
import {taskChoiceNodeDefaultName} from "./nodes/task/categories/choice/TaskChoiceNodeModel";
import {taskConditionNodeDefaultName} from "./nodes/task/categories/condition/TaskConditionNodeModel";
import {taskConvertNodeDefaultName} from "./nodes/task/categories/convert/TaskConvertNodeModel";
import {taskDelayNodeDefaultName} from "./nodes/task/categories/delay/TaskDelayNodeModel";
import {taskErrorNodeDefaultName} from "./nodes/task/categories/error/TaskErrorNodeModel";
import {taskFilterNodeDefaultName} from "./nodes/task/categories/filter/TaskFilterNodeModel";
import {taskGetNodeDefaultName} from "./nodes/task/categories/get/TaskGetNodeModel";
import {taskMultiplexNodeDefaultName} from "./nodes/task/categories/multiplex/TaskMultiplexNodeModel";
import {taskOutputNodeDefaultName} from "./nodes/task/categories/output/TaskOutputNodeModel";
import {taskScriptNodeDefaultName} from "./nodes/task/categories/script/TaskScriptNodeModel";
import {taskServiceNodeDefaultName} from "./nodes/task/categories/service/TaskServiceNodeModel";
import {taskSetNodeDefaultName} from "./nodes/task/categories/set/TaskSetNodeModel";
import {taskSplitNodeDefaultName} from "./nodes/task/categories/split/TaskSplitNodeModel";
import {taskUnionNodeDefaultName} from "./nodes/task/categories/union/TaskUnionNodeModel";
import {endNodeDefaultName} from "./nodes/end/EndNodeModel";
import {startNodeDefaultName} from "./nodes/start/StartNodeModel";

class NodePanelWidget extends React.Component {
    renderNode() {
        const {type, name, remoteId, block, updated} = this.props;

        if (type === 'start') {
            return <StartNodeWidget node={{name: startNodeDefaultName}} displayOnly/>;
        }
        if (type === 'end') {
            return <EndNodeWidget node={{name: endNodeDefaultName}} displayOnly/>;
        }
        if (type === 'block') {
            return <BlockNodeWidget node={{name: name ? name : 'Block', remoteId: remoteId ? remoteId : null, block: block ? block : null, updated: updated}} displayOnly/>;
        }
        if (type === 'taskError') {
            return <TaskErrorNodeWidget node={{name: taskErrorNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskService') {
            return <TaskServiceNodeWidget node={{name: taskServiceNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskScript') {
            return <TaskScriptNodeWidget node={{name: taskScriptNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskChoice') {
            return <TaskChoiceNodeWidget node={{name: taskChoiceNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskCondition') {
            return <TaskConditionNodeWidget node={{name: taskConditionNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskOutput') {
            return <TaskOutputNodeWidget node={{name: taskOutputNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskConvert') {
            return <TaskConvertNodeWidget node={{name: taskConvertNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskFilter') {
            return <TaskFilterNodeWidget node={{name: taskFilterNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskUnion') {
            return <TaskUnionNodeWidget node={{name: taskUnionNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskGet') {
            return <TaskGetNodeWidget node={{name: taskGetNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskSet') {
            return <TaskSetNodeWidget node={{name: taskSetNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskMultiplex') {
            return <TaskMultiplexNodeWidget node={{name: taskMultiplexNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskSplit') {
            return <TaskSplitNodeWidget node={{name: taskSplitNodeDefaultName}} displayOnly/>;
        }
        if (type === 'taskDelay') {
            return <TaskDelayNodeWidget node={{name: taskDelayNodeDefaultName}} displayOnly/>;
        }

        console.warn('Unknown node type');
        return null;
    }

    render() {
        const {type, operator, name, remoteId, block, updated, category, color, path} = this.props;

        return (
            <DragSource type={type} operator={operator} name={name} remoteId={remoteId} block={block} updated={updated} category={category} color={color} path={path} style={{display: 'inline-block'}}>
                {this.renderNode()}
            </DragSource>
        );
    }
}

export default NodePanelWidget;