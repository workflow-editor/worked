import React from 'react';
import NodePanelWidget from "./NodePanelWidget";
import Api from "../api/Api";
import {DiagramModel} from "../model/DiagramModel";
import {diagramEngine} from "../helpers/DiagramEngineHelper";
import ReactTooltip from 'react-tooltip'
import {checkModel} from "../helpers/DiagramModelSchema";
import {switchMode} from "../model/Mode";
import { confirmAlert } from 'react-confirm-alert';

export class RepositoryPanel extends React.Component {
    constructor(props) {
        super(props);
        const apiUrl = 'workflow';

        this.state = {workflows: this.props.workflows, model: this.props.model};

        Api.get(apiUrl)
            .then((workflows) => {
                if (workflows) {
                    console.log('Fetched %s workflows from repository', workflows.length);

                    // parse JSON string to object
                    workflows.forEach((workflow) => {
                        let remoteModel = workflow.block;

                        if (checkModel(remoteModel).valid) {
                            workflow.block = remoteModel;
                        } else {
                            console.log('Model of workflow %s is invalid against the current schema', workflow.id);
                        }
                    });

                    this.setState({workflows: workflows});
                    this.props.updateWorkflows(workflows);
                }
            })
            .catch((e) => {
                console.error(e);

                this.props.updateNotification({
                    message: 'Couldn\'t fetch from repository',
                    options: {
                    type: 'error'
                }});
            })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            workflows: nextProps.workflows,
            model: nextProps.model,
        });
    }

    /**
     * Show a dialog for deleting a workflow
     * @param id
     * @param name
     */
    showWorkflowDeleteConfirmation(id, name) {
        confirmAlert({
            title: 'Are you sure?',
            childrenElement: () => <div>Confirming will delete the workflow '{name}' (ID {id}).</div>,
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: () => this.handleWorkflowDelete(id),
            onCancel: () => {},
        })
    }

    /**
     * Remove a workflow remotely
     * @param id database id
     */
    handleWorkflowDelete(id) {

        const apiUrl = 'workflow/'+id;

        Api.delete(apiUrl)
            .then(() => {
                for (let workflowIndex = 0; workflowIndex < this.state.workflows.length; workflowIndex++) {
                    if (id && this.state.workflows[workflowIndex].id === id) {
                        this.state.workflows.splice(workflowIndex, 1);
                    }
                }

                // delete from current model if used (so this will be a new model)
                if (this.state.model && this.state.model.remoteId && this.state.model.remoteId === id) {
                    let newModel = new DiagramModel();
                    this.setState(newModel);
                    this.props.updateModel(newModel);
                }

                this.props.updateWorkflows(this.state.workflows);
                this.props.updateNotification({message: 'Deleted'});
                console.log("Deleted workflow %s", id);
            })
            .catch((e) => {
                console.error(e);

                this.props.updateNotification(Api.getErrorNotification(e));
            });
    }

    /**
     * Move/open a workflow in Diagram
     * @param id database id
     */
    handleWorkflowView(id) {
        for (let workflowIndex = 0; workflowIndex < this.state.workflows.length; workflowIndex++) {
            if (this.state.workflows[workflowIndex].id === id) {

                let remoteModel = this.state.workflows[workflowIndex].block;
                let remoteId = id;

                let model = new DiagramModel(remoteModel.name, remoteId);
                model.deSerializeDiagram(remoteModel, diagramEngine);
                model.name = remoteModel.name;
                model.remoteId = remoteId;
                model.updated = this.state.workflows[workflowIndex].updated_at;

                Object.keys(model.nodes).map((nodeIndex) => {

                    if (model.nodes[nodeIndex].nodeType === 'block') {
                        let foundInRepo = false;

                        this.state.workflows.forEach((workflow) => {
                            if (workflow.id === model.nodes[nodeIndex].remoteId) {

                                foundInRepo = true;

                                let remoteUpdated = workflow.updated_at;
                                let nodeUpdated = model.nodes[nodeIndex].updated;

                                if (remoteUpdated > nodeUpdated) {
                                    model.nodes[nodeIndex].requiresUpdate = true;

                                    console.log('Workflow\'s updated %s is greater than node\'s updated %s', remoteUpdated, nodeUpdated);
                                }
                            }
                        });

                        if (!foundInRepo) {
                            model.nodes[nodeIndex].requiresDelete = true;

                            console.log('Cannot find remote id %s', model.nodes[nodeIndex].remoteId)
                        }
                    }

                    return true;
                });


                let serializedModel = model.serializeDiagram();
                //this.setState({model: model});
                //this.props.updateModel(serializedModel);
                switchMode(model.mode, serializedModel, this);
                break;
            }
        }
    }

    handleNewWorkflow() {
        this.props.updateModel(new DiagramModel());
    }

    sortWorkflows(order = 'updated_at') {

        if (!this.state.workflows) return;

        let sorted;

        if (order === 'updated_at') {
            sorted = this.state.workflows.sort(function(a,b) {return (a.updated_at > b.updated_at) ? 1 : ((b.updated_at > a.updated_at) ? -1 : 0);} );
        } else if(order === 'id') {
            sorted = this.state.workflows.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
        } else if(order === 'name') {
            sorted = this.state.workflows.sort(function(a,b) {return (a.block.name > b.block.name) ? 1 : ((b.block.name > a.block.name) ? -1 : 0);} );
        } else {
            sorted = this.state.workflows;
        }

        this.setState({workflows: sorted});
    }

    render() {
        let workflowList = null;
        if (this.state.workflows) {

            workflowList = [];

            this.state.workflows.forEach(item => {
                workflowList.push(item);
            });
        }

        return (
            <div className='repository-panel'>

                <div className='center'>
                    <img src={"/logo.png"} width="100" alt='logo'/>
                </div>

                <div className='center'>
                    <h5 data-tip="Centralized repository for workflows: drag a node into the canvas to use it">Repository</h5>
                </div>

                <div className='center'>
                    <button data-tip="Create a new workflow (canvas will be cleared)"
                        onClick={() => this.handleNewWorkflow()}><i className="fa fa-plus"/> New workflow
                    </button>
                </div>

                <div className='group'>
                    <button onClick={() => this.sortWorkflows('name')}>Name</button>
                    <button onClick={() => this.sortWorkflows('id')}>ID</button>
                    <button onClick={() => this.sortWorkflows('updated_at')}>Updated</button>
                </div>

                {workflowList && workflowList.map(item =>
                    <div className='group' key={item.id}>
                        <div data-for='blockInfo' data-tip={'Fullname: ' + item.block.name + '<br /><br /> ID: ' + item.id + ' <br /><br />Last updated: ' + new Date(item.updated_at) + '<br /><br />Created: ' + new Date(item.created_at)} className='node-wrapper'>
                            <NodePanelWidget type='block' key={item.id} remoteId={item.id} name={item.block.name} block={item.block} updated={item.updated_at} />
                        </div>
                        <ReactTooltip html={true} id="blockInfo" place="top" type="dark" effect="float" class="tooltip" />
                        <button id="blockInfo" data-tip="Delete from repository"
                            onClick={() => this.showWorkflowDeleteConfirmation(item.id, item.block.name)}><i className="fa fa-trash"/>
                        </button>
                        <button id="blockInfo" data-tip="Open in canvas"
                            onClick={() => this.handleWorkflowView(item.id)}><i className="fa fa-eye"/>
                        </button>
                        <ReactTooltip html={true} id="blockInfo" place="top" type="dark" effect="float" class="tooltip" />
                    </div>)}
                <ReactTooltip place="top" type="dark" effect="float"/>
            </div>
        );
    }
}