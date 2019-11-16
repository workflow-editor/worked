import React from 'react';
import NodePanelWidget from "./NodePanelWidget";
import ReactTooltip from 'react-tooltip';

export class NodesPanel extends React.Component {
    render() {
        return (
            <div className='nodes-panel'>
                <h5 data-tip="Available nodes: drag into canvas to use">Nodes</h5>

                <div className='node-wrapper'>
                    <NodePanelWidget type='start'/>
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='end'/>
                </div>

                {/* tasks */}
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskError'/>
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskService' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskScript' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskChoice' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskCondition' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskOutput' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskConvert' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskFilter' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskUnion' />
                </div>
                {/*<div className='node-wrapper'>
                    <NodePanelWidget type='taskGet' />
                </div>*/}
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskSet' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskMultiplex' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskSplit' />
                </div>
                <div className='node-wrapper'>
                    <NodePanelWidget type='taskDelay' />
                </div>
                <ReactTooltip place="top" type="dark" effect="float"/>
            </div>
        );
    }
}
