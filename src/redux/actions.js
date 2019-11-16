export const onNodeSelected = node => ({type: 'node-selected', node});
export const updateModel = (model, props = {}) => ({type: 'update-model', model, props});
export const updateWorkflows = workflows => ({type: 'update-workflows', workflows});
export const updateNotification = notification => ({type: 'update-notification', notification});
export const updateMode = (mode) => ({type: 'update-mode', mode});
export const undo = () => ({type: 'undo'});
export const redo = () => ({type: 'redo'});