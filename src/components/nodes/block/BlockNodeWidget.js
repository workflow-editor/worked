import React from 'react';
import * as RJD from 'varakh-react-diagrams';
import {blockNodeDefaultColor, BlockNodeModel} from './BlockNodeModel';
import ReactTooltip from 'react-tooltip'

export class BlockNodeWidget extends React.Component {
    static defaultProps = {
        node: null,
        color: blockNodeDefaultColor
    };

    onRemove() {
        const {node, diagramEngine} = this.props;
        node.remove();
        diagramEngine.forceUpdate();
    }

    getInPorts() {
        const {node, displayOnly} = this.props;
        let blockNode = node;

        if (displayOnly) {
            blockNode = new BlockNodeModel(node.name);
        }

        return blockNode.getInPorts ? blockNode.getInPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`in-port-${i}`}/>
        )) : [];
    }

    getOutPorts() {
        const {node, displayOnly} = this.props;
        let blockNode = node;

        if (displayOnly) {
            blockNode = new BlockNodeModel(node.name);
        }

        return blockNode.getOutPorts ? blockNode.getOutPorts().map((port, i) => (
            <RJD.DefaultPortLabel model={port} key={`out-port-${i}`}/>
        )) : [];
    }

    render() {
        const {node, color} = this.props;
        const {name, requiresUpdate, requiresDelete} = node;
        const style = {};

        if (color) {
            style.background = color;
        }

        return (
            <div className='basic-node' style={style}>
                <div className='title'>
                    <div className='name'>
                        {name}
                        {requiresUpdate && <i data-tip="Repository has a newer version. Drag the new one into the diagram!" className="fa fa-exclamation-triangle orange"/>}
                        {requiresDelete && <i data-tip="Repository has no workflow saved. You should delete this too!" className="fa fa-exclamation-triangle red"/>}
                    </div>
                    <ReactTooltip place="top" type="dark" effect="float"/>
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

export const BlockNodeWidgetFactory = React.createFactory(BlockNodeWidget);
