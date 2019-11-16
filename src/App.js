import React, {Component} from 'react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {ActionCreators as UndoActionCreators} from 'redux-undo';
import {connect} from 'react-redux';
import * as actions from './redux/actions'
import DropTarget from './components/Diagram';
import {NodesPanel} from './components/NodesPanel';
import {Controls} from './components/Controls';
import Info from "./components/Info";
import About from "./components/About";
import {RepositoryPanel} from "./components/RepositoryPanel";

class App extends Component {
    render() {
        const {
            selectedNode,
            onNodeSelected,
            model,
            updateModel,
            workflows,
            updateWorkflows,
            notification,
            updateNotification,
            onUndo,
            onRedo,
            canUndo,
            canRedo,
            mode,
            updateMode,
        } = this.props;

        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <div className='parent-container'>
                    <RepositoryPanel
                        workflows={workflows}
                        updateWorkflows={updateWorkflows}
                        updateNotification={updateNotification}
                        model={model}
                        updateModel={updateModel}
                        updateMode={updateMode}
                    />
                    <NodesPanel
                        mode={mode}
                    />
                    <DropTarget
                        model={model}
                        updateModel={updateModel}
                        onNodeSelected={onNodeSelected}
                        notification={notification}
                        updateNotification={updateNotification}
                    />
                    <Controls
                        model={model}
                        updateMode={updateMode}
                        updateModel={updateModel}
                        workflows={workflows}
                        mode={mode}
                        updateWorkflows={updateWorkflows}
                        selectedNode={selectedNode}
                        updateNotification={updateNotification}
                        onUndo={onUndo}
                        onRedo={onRedo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                    />
                    <Info/>
                    <About/>
                </div>
            </DragDropContextProvider>
        );
    }
}

const mapStateToProps = state => ({
    mode: state.history.present.mode,
    notification: state.history.present.notification,
    workflows: state.history.present.workflows,
    model: state.history.present.model,
    selectedNode: state.history.present.selectedNode,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0
});

const mapDispatchToProps = dispatch => ({
    onNodeSelected: node => dispatch(actions.onNodeSelected(node)),
    updateWorkflows: workflows => dispatch(actions.updateWorkflows(workflows)),
    updateModel: (model, props) => dispatch(actions.updateModel(model, props)),
    updateMode: (mode) => dispatch(actions.updateMode(mode)),
    updateNotification: notification => dispatch(actions.updateNotification(notification)),
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo())
});

export default App = connect(mapStateToProps, mapDispatchToProps)(App);
