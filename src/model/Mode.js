export const MODE_DSL = 'dsl';
export const MODE_APACHE = 'apachecamel';
export const MODE_WSBPEL2 = 'wsbpel2';

/**
 * Switch MODE depending on currently used component
 * @param mode
 * @param model
 * @param component
 */
export function switchMode(mode, model, component) {

    if (mode === MODE_DSL || MODE_APACHE) {
        component.setState(Object.assign(model, {mode: mode}));
        component.props.updateModel(model);
        component.props.updateMode(mode);

        if (mode !== model.mode) {
            component.props.updateNotification({message: 'Switched to mode ' + mode})
        }
    } else {
        component.props.updateNotification({message: 'Cannot find mode ' + mode})
    }
}