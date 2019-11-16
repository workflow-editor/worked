import undoable, {includeAction} from 'redux-undo';
import {DiagramModel} from "../model/DiagramModel";
import {MODE_APACHE} from "../model/Mode";

const getInitialState = () => ({
    selectedNode: null,
    model: new DiagramModel(),
    workflows: null,
    notification: null,
    mode: MODE_APACHE
});

export const reducerFn = (state = getInitialState(), action) => {
    switch (action.type) {
        case 'node-selected':
            return {
                ...state,
                selectedNode: action.node
            };
        case 'update-workflows':
            return {
                ...state,
                workflows: action.workflows
            };
        case 'update-mode':
            return {
                ...state,
                mode: action.mode,
            };
        case 'update-notification':
            return {
                ...state,
                notification: action.notification,
            };
        case 'update-model':
            return {
                ...state,
                model: action.model,
                ...action.props
            };
        default:
            return state;
    }
};

export const reducer = undoable(reducerFn, {
    filter: includeAction(['update-model'])
});
