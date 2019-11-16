import React from 'react';
import {diagramEngine} from '../helpers/DiagramEngineHelper';
import Api from "../api/Api";
import {checkRequiredNodes, getPortsAmount} from "../helpers/DiagramModelHelper";
import {checkModel} from "../helpers/DiagramModelSchema";
import {DiagramModel} from "../model/DiagramModel";
import ReactTooltip from 'react-tooltip'
import {TaskNodeModel} from "./nodes/task/TaskNodeModel";
import {DiagramPortModel} from "../model/DiagramPortModel";
import {ParserDSL} from "../helpers/ParserDSL";
import {ParserApacheCamel} from "../helpers/ParserApacheCamel";
import {MODE_APACHE, MODE_WSBPEL2, MODE_DSL, switchMode} from "../model/Mode";
import {
    TASK_PATH_TYPE_CHECKBOX, TASK_PATH_TYPE_LIST, TASK_PATH_TYPE_NUMBER, TASK_PATH_TYPE_SELECT,
    TASK_PATH_TYPE_TEXT
} from "./nodes/task/TaskPath";
import {confirmAlert} from "react-confirm-alert";
import {ParserWSBPEL2} from "../helpers/ParserWSBPEL2";

export class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedNode: this.props.selectedNode, model: this.props.model, workflows: this.props.workflows};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedNode: nextProps.selectedNode,
            model: nextProps.model,
            workflows: nextProps.workflows,
        });
    }

    /**
     * Change name of model
     * @param event formKey
     */
    handleModelNameChange(event) {
        const model = {...this.state.model};
        model.name = event.target.value;

        this.setState(model);
        this.props.updateModel(model);

        console.log("Adjusting model name to %s", model.name);
    }

    /**
     * Change name of a node
     * @param event formKey
     */
    handleNodeNameChange(event) {
        // update
        if (this.state.selectedNode && this.state.model) {

            const {updateModel} = this.props;
            this.setState({name: event.target.value});

            // debug
            this.setState(Object.assign(this.state.selectedNode, {'name': event.target.value}));

            // model
            this.state.model.nodes.forEach((node) => {
                if (node.id === this.state.selectedNode.id) {
                    node.name = event.target.value;

                    console.log("Changing name of node %s to %s", node.id, node.name);
                }
            });

            updateModel({...this.state.model});
        }
    }

    /**
     * Change name of a port
     * @param event formKey
     */
    handlePortNameChange(event) {
        let id = event.target.id;
        let value = event.target.value;

        if (!this.state.selectedNode || !this.state.model || !this.state.selectedNode.ports) {
            return;
        }

        const model = {...this.state.model};
        model.nodes.forEach((node) => {
            if (node.id === this.state.selectedNode.id) {
                for (let portIndex = 0; portIndex < node.ports.length; portIndex++) {
                    if (node.ports[portIndex].id === id) {

                        console.log("Adjusting name of port %s from node %s to %s", node.ports[portIndex].name, node.id, value);

                        node.ports[portIndex].name = value;
                        node.ports[portIndex].label = value;

                        let selectedNode = {...this.state.selectedNode};
                        Object.keys(selectedNode.ports).forEach((port) => {
                            if (selectedNode.ports[port].id === id) {
                                selectedNode.ports[port].name = value;
                                selectedNode.ports[port].label = value;
                            }
                        });

                        this.setState(selectedNode);
                        this.props.updateModel(model);

                        return;
                    }
                }
            }
        });
    }

    /**
     * Add a port on a selected node
     * @param isIn boolean
     */
    handleAddPort(isIn = false) {
        const {updateModel} = this.props;

        if (this.state.selectedNode && this.state.model) {

            // model
            this.state.model.nodes.forEach((node) => {
                if (node.id === this.state.selectedNode.id) {

                    let portIndex = node.ports.length;
                    let portName = (isIn ? 'in' : 'out') + (portIndex);
                    let portDeletable = (isIn ? this.state.selectedNode.options[this.state.model.mode].permitInPortRemove : this.state.selectedNode.options[this.state.model.mode].permitOutPortRemove);

                    let portObj = new DiagramPortModel(isIn, portName, portDeletable, (isIn ? this.state.selectedNode.options.inPortMultipleConnections : this.state.selectedNode.options.outPortMultipleConnections));
                    portObj.setParentNode(node);
                    node.ports[portIndex] = portObj.serialize();

                    let selectedNode = this.state.selectedNode;
                    selectedNode.ports[portName] = portObj;
                    this.setState(selectedNode);

                    console.log("Adding port %s to node %s", portName, node.id);
                }
            });

            updateModel({...this.state.model});
        }
    }

    /**
     * Add an out port
     */
    handleAddOutPort() {
        // check for max
        let amount = getPortsAmount(this.state.selectedNode, false);

        if (this.state.selectedNode.options[this.state.model.mode].outPortsMaxAmount && this.state.selectedNode.options[this.state.model.mode].outPortsMaxAmount > 0 && amount+1 > this.state.selectedNode.options[this.state.model.mode].outPortsMaxAmount) {
            this.props.updateNotification({message: 'Maximum limit of out ports reached'});
            return;
        }

        this.handleAddPort(false);
    }

    /**
     * Add an in port
     */
    handleAddInPort() {
        // check for max
        let amount = getPortsAmount(this.state.selectedNode, true);

        if (this.state.selectedNode.options[this.state.model.mode].inPortsMaxAmount && this.state.selectedNode.options[this.state.model.mode].inPortsMaxAmount > 0 && amount+1 > this.state.selectedNode.options[this.state.model.mode].inPortsMaxAmount) {
            this.props.updateNotification({message: 'Maximum limit of in ports reached'});
            return;
        }

        this.handleAddPort(true);
    }

    /**
     * Remove a port
     * @param id
     * @links used links
     */
    handleRemovePort(id, links) {
        if (!this.state.selectedNode || !this.state.model || !this.state.selectedNode.ports) {
            return;
        }

        const model = {...this.state.model};
        let linkIds = Object.keys(links);

        // remove links from all ports
        model.nodes.forEach((node) => {

            linkIds.forEach((linkId) => {
                for (let portIndex = 0; portIndex < node.ports.length; portIndex++) {

                    let linkIndex = node.ports[portIndex].links.indexOf(linkId);

                    if (linkIndex !== -1) {
                        console.log("Removed link %s at index %s in node %s at port %s", linkId, linkIndex, node.id, node.ports[portIndex].name);
                        node.ports[portIndex].links.splice(linkIndex, 1);
                    }
                }
            });
        });

        // remove links
        linkIds.forEach((linkId) => {
            for (let linkIndex = 0; linkIndex < model.links.length; linkIndex++) {

                if (linkId === model.links[linkIndex].id) {
                    console.log("Removing link %s from model.links at index %s", linkId, linkIndex);
                    model.links.splice(linkIndex, 1);
                }
            }
        });

        // remove port
        model.nodes.forEach((node) => {
            if (node.id === this.state.selectedNode.id) {
                for (let portIndex = 0; portIndex < node.ports.length; portIndex++) {
                    if (node.ports[portIndex].id === id && node.ports[portIndex].deletable) {

                        // remove port
                        console.log("Removing port %s from node %s", node.ports[portIndex].name, node.id);
                        node.ports.splice(portIndex, 1);

                        let selectedNode = {...this.state.selectedNode};
                        Object.keys(selectedNode.ports).forEach((port) => {
                            if (selectedNode.ports[port].id === id) {
                                delete selectedNode.ports[port];
                            }
                        });

                        this.setState(selectedNode);
                        this.props.updateModel(model);

                        return;
                    }
                }
            }
        });
    }

    /**
     * Handle item add for list
     *
     * @param key
     */
    handlePathListAdd(key) {
        // update
        if (this.state.selectedNode && this.state.model && this.state.selectedNode instanceof TaskNodeModel) {

            const {updateModel} = this.props;

            // model
            this.state.model.nodes.forEach((node) => {
                if (node.id === this.state.selectedNode.id) {
                    let currentPath = node.path;

                    // search for path key in current mode
                    currentPath[this.state.model.mode].forEach((component) => {
                        if (component.key === key && component.type === TASK_PATH_TYPE_LIST) {
                            component.value.push('');
                        }
                    });

                    node.path = currentPath;
                    this.setState({path: currentPath});
                    this.setState(Object.assign(this.state.selectedNode, {'path': currentPath}));

                    console.log('Adding list item to path of node %s: Key %s', node.id, key);
                }
            });

            updateModel({...this.state.model});
        }
    }

    /**
     * Handle item remove for list
     *
     * @param key
     * @param index
     */
    handlePathListRemove(key, index) {
        // update
        if (this.state.selectedNode && this.state.model && this.state.selectedNode instanceof TaskNodeModel) {

            const {updateModel} = this.props;

            // model
            this.state.model.nodes.forEach((node) => {
                if (node.id === this.state.selectedNode.id) {
                    let currentPath = node.path;

                    // search for path key in current mode
                    currentPath[this.state.model.mode].forEach((component) => {
                        if (component.key === key && component.type === TASK_PATH_TYPE_LIST) {
                            component.value.splice(index, 1);
                        }
                    });

                    node.path = currentPath;
                    this.setState({path: currentPath});
                    this.setState(Object.assign(this.state.selectedNode, {'path': currentPath}));

                    console.log('Removing list item with index %s from path of node %s: Key %s', index, node.id, key);
                }
            });

            updateModel({...this.state.model});
        }
    }

    /**
     * Handle value change for list item
     *
     * @param event
     * @param key
     * @param index
     */
    handlePathListEdit(event, key, index) {
        // update
        if (this.state.selectedNode && this.state.model && this.state.selectedNode instanceof TaskNodeModel) {

            const {updateModel} = this.props;

            // model
            this.state.model.nodes.forEach((node) => {
                if (node.id === this.state.selectedNode.id) {
                    let currentPath = node.path;

                    // search for path key in current mode
                    currentPath[this.state.model.mode].forEach((component) => {
                        if (component.key === key && component.type === TASK_PATH_TYPE_LIST) {
                            component.value[index] = event.target.value;
                        }
                    });

                    node.path = currentPath;
                    this.setState({path: currentPath});
                    this.setState(Object.assign(this.state.selectedNode, {'path': currentPath}));

                    console.log('Changing list item at index %s to value %s of path of node %s: Key %s', index, event.target.value, node.id, key);
                }
            });

            updateModel({...this.state.model});
        }
    }

    /**
     * Handle value changes for select, text, number
     *
     * @param event
     * @param key
     * @param type component type (select, text, number)
     */
    handlePathChange(event, key, type) {

        // update
        if (this.state.selectedNode && this.state.model && this.state.selectedNode instanceof TaskNodeModel) {

            const {updateModel} = this.props;

            // model
            this.state.model.nodes.forEach((node) => {
                if (node.id === this.state.selectedNode.id) {
                    let currentPath = node.path;

                    // search for path key in current mode
                    currentPath[this.state.model.mode].forEach((component) => {
                       if (component.key === key) {

                           if (type === TASK_PATH_TYPE_CHECKBOX) {
                               component.value = event.target.checked;
                           }
                           else {
                               component.value = event.target.value;
                           }
                       }
                    });

                    node.path = currentPath;
                    this.setState({path: currentPath});
                    this.setState(Object.assign(this.state.selectedNode, {'path': currentPath}));

                    console.log('Changing path of node %s: Key %s | Type %s | Value %s', node.id, key, type, event.target.value);
                }
            });

            updateModel({...this.state.model});
        }
    }

    // Repository (API call)
    saveToRepositoryAsJson() {

        // validate model (has start and endpoint)
        if (!checkRequiredNodes(this.state.model)) {
            this.props.updateNotification({
                message: 'Could not find all required nodes for the current mode',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        const block = diagramEngine.diagramModel.serializeDiagram();

        // use patch if remoteId not null
        const apiUrl = 'workflow';
        let apiData = {
            name: this.state.model.name,
            block: block,
        };

        if (!checkModel(block).valid) {
            this.props.updateNotification({
                message: 'Could not validate model',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        // edit
        if (this.state.model.remoteId) {
            apiData = {...apiData, id: this.state.model.remoteId};

            Api.patch(apiUrl, apiData)
                .then((e) => {
                    for (let workflowIndex = 0; workflowIndex < this.state.workflows.length; workflowIndex++) {
                        if (this.state.workflows[workflowIndex].id === this.state.model.remoteId) {

                            let workflows = this.state.workflows;

                            workflows[workflowIndex] = Object.assign(this.state.workflows[workflowIndex], {
                                remoteId: e.id,
                                name: e.block.name,
                                block: e.block,
                                updated_at: e.updated_at
                            });

                            this.props.updateModel(Object.assign(this.state.model, {
                                remoteId: e.id,
                                name: e.block.name,
                                block: e.block,
                                updated: e.updated_at
                            }));
                            this.props.updateWorkflows(workflows);
                            this.props.updateNotification({message: "Updated"});

                            console.log('Updated workflow %s (%s) to repository', e.block.name, e.id);
                            break;
                        }
                    }
                })
                .catch((e) => {
                    console.error(e);

                    this.props.updateNotification(Api.getErrorNotification(e));
                });
        }
        // create
        else {
            // use patch if remoteId not null
            const apiUrl = 'workflow';

            if (!checkModel(block).valid) {
                this.props.updateNotification({
                    message: 'Could not validate model',
                    options: {
                        type: 'error'
                    }
                });
                return;
            }

            Api.post(apiUrl, apiData)
                .then((e) => {
                    this.state.workflows.unshift(e);

                    this.setState(Object.assign(this.state.model, {
                        remoteId: e.id,
                        name: e.block.name,
                        block: e.block,
                        updated: e.updated_at
                    }));
                    this.props.updateModel(this.state.model);
                    this.props.updateWorkflows(this.state.workflows);
                    this.props.updateNotification({message: "Saved"});

                    console.log('Saved workflow %s (%s) to repository', e.block.name, e.id);
                })
                .catch((e) => {
                    console.error(e);

                    this.props.updateNotification(Api.getErrorNotification(e));
                });
        }
    }

    // JSON
    saveJson() {
        let fileDownload = require('js-file-download');
        let date = new Date().getTime();
        let fileName = this.state.model.name + "_" + date + '_worked.json';
        fileDownload(JSON.stringify(diagramEngine.diagramModel.serializeDiagram()), fileName);

        this.props.updateNotification({message: "Downloaded as JSON"});
    }

    // DSL
    saveDSL() {
        const model = diagramEngine.diagramModel;
        const block = model.serializeDiagram();

        // validate model (has start and endpoint)
        if (!checkRequiredNodes(this.state.model)) {
            this.props.updateNotification({
                message: 'Could not find all required nodes for the current mode',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        if (!checkModel(block).valid) {
            this.props.updateNotification({
                message: 'Could not validate model',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        // parse
        let dslParser = new ParserDSL(model);
        let out;

        try {
            out = dslParser.parse(dslParser.model);
        } catch (error) {
            console.log('Parsing failed', error);

            this.props.updateNotification({
                message: 'Parsing failed: ' + error.message,
                options: {
                    type: 'error'
                }
            });
            return;
        }

        console.log('DSL is:\n\n%s', out);

        let fileDownload = require('js-file-download');
        let date = new Date().getTime();
        let fileName = this.state.model.name + "_" + date + '_worked.dsl';
        fileDownload(out, fileName);

        this.props.updateNotification({message: "Downloaded as DSL"});
    }

    // Apache Camel
    saveApache() {
        const model = diagramEngine.diagramModel;
        const block = model.serializeDiagram();

        // validate model (has start and endpoint)
        if (!checkRequiredNodes(this.state.model)) {
            this.props.updateNotification({
                message: 'Could not find all required nodes for the current mode',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        if (!checkModel(block).valid) {
            this.props.updateNotification({
                message: 'Could not validate model',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        // parse
        let apacheParser = new ParserApacheCamel(model);
        let out;

        try {
            out = apacheParser.parse(apacheParser.model);
        } catch (error) {
            console.log('Parsing failed', error);

            this.props.updateNotification({
                message: 'Parsing failed: ' + error.message,
                options: {
                    type: 'error'
                }
            });
            return;
        }

        console.log('ApacheCamel is:\n\n%s', out);

        let fileDownload = require('js-file-download');
        let date = new Date().getTime();
        let fileName = this.state.model.name + "_" + date + '_worked.xml';
        fileDownload(out, fileName);

        this.props.updateNotification({message: "Downloaded as ApacheCamel Routes"});
    }

    // WSBPEL2
    saveWSBPEL2() {
        const model = diagramEngine.diagramModel;
        const block = model.serializeDiagram();

        // validate model (has start and endpoint)
        if (!checkRequiredNodes(this.state.model)) {
            this.props.updateNotification({
                message: 'Could not find all required nodes for the current mode',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        if (!checkModel(block).valid) {
            this.props.updateNotification({
                message: 'Could not validate model',
                options: {
                    type: 'error'
                }
            });
            return;
        }

        // parse
        let wsBPELParser = new ParserWSBPEL2(model);
        let out;

        out += 'Not implemented yet';
        try {
            out = wsBPELParser.parse(wsBPELParser.model);
        } catch (error) {
            console.log('Parsing failed', error);

            this.props.updateNotification({
                message: 'Parsing failed: ' + error.message,
                options: {
                    type: 'error'
                }
            });
            return;
        }

        console.log('WSBPEL2.0 is:\n\n%s', out);

        let fileDownload = require('js-file-download');
        let date = new Date().getTime();
        let fileName = this.state.model.name + "_" + date + '_worked_wsbpel2.xml';
        fileDownload(out, fileName);

        this.props.updateNotification({message: "Downloaded as WSBPEL2.0"});
    }

    showTextDialog(headline, text) {
        confirmAlert({
            title: headline,
            childrenElement: () => <div>{text}</div>,
            confirmLabel: 'OK',
            onConfirm: () => {},
            onCancel: () => {},
        })
    };

    // File imported
    handleFileOpened(event) {

        let file = event.target.files[0];
        let type = /json.*/;

        if (file.type.match(type)) {
            let reader = new FileReader();
            reader.onload = () => {
                let content = reader.result;

                try {
                    let remoteModel = JSON.parse(content);

                    let checkResult = checkModel(remoteModel);

                    if (checkResult.valid) {
                        let model = new DiagramModel();
                        model.deSerializeDiagram(remoteModel, diagramEngine);
                        let serializedModel = model.serializeDiagram();

                        //this.setState({model: model});
                        //this.props.updateModel(serializedModel);
                        switchMode(model.mode, serializedModel, this);

                    } else {
                        this.props.updateNotification({
                            message: 'Invalid! Cannot import',
                            options: {
                                type: 'error'
                            }
                        });

                        console.log("Model does not obey schema, aborted import", checkResult);
                    }
                } catch (e) {
                    this.props.updateNotification({
                        message: 'File could not be processed: ' + e.message,
                        options: {
                            type: 'error'
                        }
                    });
                }
            };

            reader.readAsText(file, 'UTF-8');
            console.log("Uploaded file", file);
        } else {
            this.props.updateNotification({
                message: 'File is not a json file',
                options: {
                    type: 'error'
                }
            });
        }
    }



    render() {
        const {onUndo, onRedo, canUndo, canRedo} = this.props;

        let portList = null;

        if (this.state.selectedNode && this.state.selectedNode.ports) {
            portList = [];

            Object.keys(this.state.selectedNode.ports).forEach((port) => {
                portList.push(
                    {
                        'id': this.state.selectedNode.ports[port].id,
                        'name': this.state.selectedNode.ports[port].name,
                        'links': this.state.selectedNode.ports[port].links,
                        'type': this.state.selectedNode.ports[port].in ? 'In' : 'Out',
                        'in': this.state.selectedNode.ports[port].in,
                        'deletable': this.state.selectedNode.ports[port].deletable,
                    }
                );
            });

            /*portList.sort((a, b) => {
                return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
            });*/
        }

        return (
            <div className='controls-panel'>
                {this.state.model &&
                <div>
                    <div className='controls-buttons'>
                        <div className='controls-group'>
                            <h5>Mode</h5>
                            <div className='mode'>
                                <button onClick={() => this.showTextDialog('Modes', 'A mode determines available attributes of a task category. The WSBPEL2.0 mode\'s implementation has been started to demonstrate how to extend the editor.')} className="orange"><i className="fa fa-info"/></button>
                                <button onClick={() => {switchMode(MODE_APACHE, this.state.model, this)}} disabled={this.state.model.mode === MODE_APACHE}>Apache Camel</button>
                                <button onClick={() => {switchMode(MODE_DSL, this.state.model, this)}} disabled={this.state.model.mode === MODE_DSL}>DSL</button>
                                <button onClick={() => {switchMode(MODE_WSBPEL2, this.state.model, this)}} disabled={this.state.model.mode === MODE_WSBPEL2}>WSBPEL2.0</button>
                                <ReactTooltip id='global' place="top" type="dark" effect="float" class="tooltip" />
                            </div>
                        </div>
                    </div>

                    <div className='controls-buttons'>
                        <div className='controls-group'>
                            <h5 data-tip="Revert or forward all user interactions">Steps</h5>
                            <button onClick={onUndo} disabled={!canUndo}>Undo</button>
                            <button onClick={onRedo} disabled={!canRedo}>Redo</button>
                            <ReactTooltip id='global' place="top" type="dark" effect="float" class="tooltip" />
                        </div>
                    </div>

                    <div className='controls-buttons'>
                        <div className='controls-group'>
                            <h5 data-tip="Change name of the workflow. This name will be shown in the repository panel if saved.">Name</h5>
                            <input type="text" name="block" value={this.state.model.name}
                                   onChange={(e) => this.handleModelNameChange(e)}/>
                            <button className='button' onClick={() => this.saveToRepositoryAsJson()}>Save to
                                repository
                            </button>
                            <ReactTooltip id='global' place="top" type="dark" effect="float" class="tooltip" />
                        </div>
                    </div>
                    <div className='controls-buttons'>
                        <div className='controls-group'>
                            <h5>File</h5>
                            <button onClick={() => this.saveDSL()} disabled={this.state.model.mode !== MODE_DSL}>to DSL</button>
                            <button onClick={() => this.saveApache()} disabled={this.state.model.mode !== MODE_APACHE}>to ApacheCamel</button>
                            <button onClick={() => this.saveWSBPEL2()} disabled={this.state.model.mode !== MODE_WSBPEL2}>to WSBPEL2.0</button>
                            <button onClick={() => this.saveJson()}>to JSON</button>
                            <div>
                                <label htmlFor="file_select" className='file-upload'>from JSON</label>
                                <input id="file_select" type="file" accept="application/json"
                                       onChange={(event) => this.handleFileOpened(event)}
                                       onClick={(event) => {
                                           event.target.value = null
                                       }}
                                />
                            </div>
                        </div>
                    </div>
                </div>}

                {/* node name */}
                {this.state.selectedNode &&
                <div className='controls-buttons'>
                    <div className='controls-group'>
                        <h5 data-tip="Adjust name" data-for="global">Node</h5>
                        <ReactTooltip id='global' place="top" type="dark" effect="float" class="tooltip" />

                        {this.state.selectedNode && this.state.selectedNode.description &&
                        <button
                            onClick={() => this.showTextDialog(this.state.selectedNode.name, this.state.selectedNode.description)}
                            className="orange"><i className="fa fa-info"/></button>
                        }

                        <input type="text" name="name" value={this.state.selectedNode.name}
                               onChange={(event) => this.handleNodeNameChange(event)}
                               readOnly={!this.state.selectedNode.options[this.state.model.mode].permitNameChange}/>
                    </div>
                </div>}

                {/* ports */}
                {this.state.selectedNode &&
                <div className='controls-buttons'>
                    <div className='controls-group'>
                        <h5 data-tip="Define in and out ports. Ports can only be connected from out to in.">Ports</h5>
                        <ReactTooltip place="top" type="dark" effect="float"/>
                        {this.state.selectedNode.options[this.state.model.mode].permitInPortAdd &&
                        <button onClick={() => this.handleAddInPort()}>Add in port</button>}
                        {this.state.selectedNode.options[this.state.model.mode].permitOutPortAdd &&
                        <button onClick={() => this.handleAddOutPort()}>Add out port</button>}
                    </div>

                    {/* ports */}
                    {portList &&
                    <div className='ports'>
                        {portList.length > 0 &&
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {portList.map(item =>
                                <tr key={item.id}>
                                    <td>
                                        {<input type="text" id={item.id} value={item.name}
                                                onChange={(event) => this.handlePortNameChange(event)} readOnly={!(
                                            (item.in && this.state.selectedNode.options[this.state.model.mode].permitInPortLabelChange) ||
                                            (!item.in && this.state.selectedNode.options[this.state.model.mode].permitOutPortLabelChange)
                                        )}/>
                                        }
                                    </td>
                                    <td>
                                        <input type="text" value={item.type} readOnly={true}/>
                                    </td>
                                    <td>
                                        {<button disabled={!(
                                            (!item.in && this.state.selectedNode.options[this.state.model.mode].permitOutPortRemove && item.deletable) ||
                                            (item.in && this.state.selectedNode.options[this.state.model.mode].permitInPortRemove && item.deletable)
                                        )}
                                                 onClick={() => this.handleRemovePort(item.id, item.links)}
                                                 id={item.id}
                                                 name={item.name}>
                                            <i className="fa fa-trash"/>
                                        </button>}
                                    </td>
                                </tr>
                            )}

                            </tbody>
                        </table>}
                    </div>}
                </div>}

                {/* category */}
                {this.state.selectedNode && this.state.selectedNode instanceof TaskNodeModel &&
                <div className='controls-buttons'>
                    <div className='controls-group'>
                        <h5 data-tip="Category of this Task">Category</h5>
                        <ReactTooltip place="top" type="dark" effect="float"/>
                        <input type="text" id={this.state.selectedNode.id} value={this.state.selectedNode.category}
                               readOnly={!this.state.selectedNode.options[this.state.model.mode].permitCategoryChange}/>
                    </div>
                </div>}

                {/* path */}
                {this.state.selectedNode && this.state.selectedNode instanceof TaskNodeModel && this.state.selectedNode.path.hasOwnProperty(this.state.model.mode) &&
                <div className='controls-buttons'>
                        <h5 data-tip="Specify the path" data-for="global">Path</h5>
                        <ReactTooltip id='global' place="top" type="dark" effect="float" class="tooltip" />

                        <div className='path'>
                            {this.state.selectedNode.path[this.state.model.mode].length === 0 &&
                                <span>No path options available.</span>
                            }

                            {this.state.selectedNode.path[this.state.model.mode].length > 0 &&

                            <table>
                                <thead>
                                <tr>
                                    <th>Attribute</th>
                                    <th>Info</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody>

                                {this.state.selectedNode.path[this.state.model.mode].map(component => {

                                    return (

                                    <tr key={component.key}>
                                        <td>
                                            <span>
                                                {component.label}
                                                {component.type === TASK_PATH_TYPE_LIST &&
                                                <button key={component.key + '_add'}
                                                        onClick={() => this.handlePathListAdd(component.key)}><i
                                                    className="fa fa-plus"/></button>
                                                }
                                            </span>
                                        </td>
                                        <td>
                                            {/*<span data-tip={component.hint} data-for="global" className="orange"><i className="fa fa-info"/></span>*/}
                                            <button onClick={() => this.showTextDialog(component.label, component.hint)} className="orange"><i className="fa fa-info"/></button>
                                        </td>

                                        {component.type === TASK_PATH_TYPE_TEXT &&
                                        <td><input type="text" key={component.key} value={component.value} onChange={(event) => this.handlePathChange(event, component.key, component.type)} /></td>}

                                        {component.type === TASK_PATH_TYPE_NUMBER &&
                                        <td><input type="number" key={component.key} value={component.value} onChange={(event) => this.handlePathChange(event, component.key, component.type)} /></td>}

                                        {component.type === TASK_PATH_TYPE_CHECKBOX &&
                                        <td><input type="checkbox" key={component.key} checked={component.value} onChange={(event) => this.handlePathChange(event, component.key, component.type)} /></td>}

                                        {component.type === TASK_PATH_TYPE_SELECT &&
                                        <td><select id={component.key} key={component.id} value={component.value} onChange={(event) => this.handlePathChange(event, component.key, component.type)} >
                                                {component.options.map(option => {
                                                    return (<option id={option} key={option}>{option}</option>);
                                                })}
                                            </select></td>}

                                        {component.type === TASK_PATH_TYPE_LIST &&
                                            <td>
                                                {component.value.length === 0 && 'No items found.'}
                                                {component.value.length > 0 && component.value.map((listItem, index) => {
                                                    return (
                                                    <div key={component.key + '_' + index + '_' + '_listitem'} className='controls-group'>
                                                        <input type="text" key={component.key + '_' + index + '_' + '_item'} value={listItem} onChange={(event) => this.handlePathListEdit(event, component.key, index)} />
                                                        <button key={component.key + '_' + index + '_' + '_remove'} onClick={() => this.handlePathListRemove(component.key, index)}><i className="fa fa-minus"/></button>
                                                    </div>
                                                    );
                                                })}
                                            </td>}
                                    </tr>)
                            })}
                                </tbody>
                            </table>}
                        </div>
                </div>}

                {/* debug */}
                {process.env.NODE_ENV !== 'production' && this.state.selectedNode &&
                <div>
                    <h5>Debug Node</h5>
                    <pre>{JSON.stringify(this.state.selectedNode.serialize(), null, 2)}</pre>
                </div>}

                {process.env.NODE_ENV !== 'production' && this.state.model &&
                <div>
                    <h5>Debug Model</h5>
                    <pre>{JSON.stringify(diagramEngine.diagramModel.serializeDiagram(), null, 2)}</pre>
                </div>}
            </div>
        );
    }
}