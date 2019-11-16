// possible input field types
export const TASK_PATH_TYPE_CHECKBOX = 'checkbox';
export const TASK_PATH_TYPE_TEXT = 'text';
export const TASK_PATH_TYPE_NUMBER = 'number';
export const TASK_PATH_TYPE_SELECT = 'select';
export const TASK_PATH_TYPE_LIST = 'list';

/**
 * Represents the 'path' of a Task in DSL
 */
export class TaskPath {

    constructor(key, label, type, hint, value = '', options = [], modeId = null) {
        this.key = key;
        this.label = label;
        this.type = type;

        if (type === TASK_PATH_TYPE_LIST) {
            if (!Array.isArray(value)) {
                this.value = [];
            } else {
                this.value = value;
            }
        } else {
            this.value = value;
        }

        this.hint = hint;
        this.options = options;

        if (!modeId) {
            this.modeId = this.key;
        } else {
            this.modeId = modeId;
        }
    }
}
