import React from 'react';
import * as RJD from 'varakh-react-diagrams';
import {taskMultiplexNodeDefaultColor, TaskMultiplexNodeModel} from './TaskMultiplexNodeModel';

export class TaskMultiplexNodeWidget extends React.Component {
    static defaultProps = {
        node: null,
        color: taskMultiplexNodeDefaultColor
    };

    onRemove() {
        const {node, diagramEngine} = this.props;
        node.remove();
        diagramEngine.forceUpdate();
    }

    getInPorts() {
        const {node, displayOnly} = this.props;
        let taskNode = node;

        if (displayOnly) {
            taskNode = new TaskMultiplexNodeModel(node.name);
        }

        return taskNode.getInPorts ? taskNode.getInPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`in-port-${i}`}/>
        )) : [];
    }

    getOutPorts() {
        const {node, displayOnly} = this.props;
        let taskNode = node;

        if (displayOnly) {
            taskNode = new TaskMultiplexNodeModel(node.name, displayOnly);
        }

        return taskNode.getOutPorts ? taskNode.getOutPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`out-port-${i}`}/>
        )) : [];
    }

    render() {
        const {node, color: displayColor} = this.props;
        const {name, color} = node;
        const style = {};

        if (color || displayColor) {
            style.background = color || displayColor;
        }

        return (
            <div className='basic-node' style={style}>
                <div className='title'>
                    <div className='name'>
                        {name}
                    </div>
                </div>
                <div className='ports'>
                    <div className='in'>
                        {this.getInPorts()}

                    </div>
                    <div className='out'>
                        {this.getOutPorts()}
                    </div>
                </div>
            </div>
        );
    }
}

export const TaskMultiplexNodeWidgetFactory = React.createFactory(TaskMultiplexNodeWidget);
