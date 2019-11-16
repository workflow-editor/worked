import React from 'react';
import * as RJD from 'varakh-react-diagrams';
import {startNodeDefaultColor, StartNodeModel} from './StartNodeModel';

export class StartNodeWidget extends React.Component {
    static defaultProps = {
        node: null,
        color: startNodeDefaultColor
    };

    onRemove() {
        const {node, diagramEngine} = this.props;
        node.remove();
        diagramEngine.forceUpdate();
    }

    getOutPorts() {
        const {node, displayOnly} = this.props;
        let startNode = node;

        if (displayOnly) {
            startNode = new StartNodeModel(node.name);
        }

        return startNode.getOutPorts ? startNode.getOutPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`out-port-${i}`}/>
        )) : [];
    }

    render() {
        const {node, color} = this.props;
        const {name} = node;
        const style = {};

        if (color) {
            style.background = color;
        }

        return (
            <div className='basic-node' style={style}>
                <div className='title'>
                    <div className='name'>
                        {name}
                    </div>
                </div>
                <div className='ports'>
                    <div className='out'>
                        {this.getOutPorts()}
                    </div>
                </div>
            </div>
        );
    }
}

export const StartNodeWidgetFactory = React.createFactory(StartNodeWidget);
