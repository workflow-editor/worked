import React from 'react';
import * as RJD from 'varakh-react-diagrams';
import {endNodeDefaultColor, EndNodeModel} from './EndNodeModel';

export class EndNodeWidget extends React.Component {
    static defaultProps = {
        node: null,
        color: endNodeDefaultColor
    };

    onRemove() {
        const {node, diagramEngine} = this.props;
        node.remove();
        diagramEngine.forceUpdate();
    }

    getInPorts() {
        const {node, displayOnly} = this.props;
        let endNode = node;

        if (displayOnly) {
            endNode = new EndNodeModel(node.name);
        }

        return endNode.getInPorts ? endNode.getInPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`in-port-${i}`}/>
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
                    <div className='in'>
                        {this.getInPorts()}
                    </div>
                </div>
            </div>
        );
    }
}

export const EndNodeWidgetFactory = React.createFactory(EndNodeWidget);
