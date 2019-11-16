// predefined paths
// MODE_DSL
import {TASK_PATH_TYPE_CHECKBOX, TASK_PATH_TYPE_SELECT, TASK_PATH_TYPE_TEXT, TaskPath} from "./TaskPath";

export function generateTaskPathDSL() {
    return [new TaskPath('path', 'Path', TASK_PATH_TYPE_TEXT, 'Set DSL specific path', '')];
}

// MODE_APACHE
export function generateTaskPathApacheCamelURI() {
    return [new TaskPath('uri', 'uri', TASK_PATH_TYPE_TEXT, 'Set an URI for the service call (e.g. mock:result, direct:a, queue:b)'),];
}

export function generateTaskPathApacheCamelExpression(keyPrefix = '', labelPrefix = '', options = []) {
    let paths = [];

    paths.push(new TaskPath(keyPrefix + 'expressionLanguage', labelPrefix + 'Expression Language', TASK_PATH_TYPE_SELECT, 'Select the an expression type language', (options.length > 0 ? options[0] : 'ERROR'), options, 'expressionLanguage'));

    if (options.indexOf('simple') !== -1 || options.indexOf('header') !== -1 || options.indexOf('string') !== -1 || options.indexOf('constant') !== -1 || options.indexOf('xpath') !== -1) {
        paths.push(new TaskPath(keyPrefix + 'expression', labelPrefix + 'Expression', TASK_PATH_TYPE_TEXT, 'Expression to use (e.g. ${body}, \'my constant\')', '', [], 'expression'));
    }

    if (options.indexOf('simple') !== -1) {
        paths.push(new TaskPath(keyPrefix + 'resultType', labelPrefix + 'resultType', TASK_PATH_TYPE_TEXT, '(simple) Sets the class name of the result type', '', [], 'resultType'));
        paths.push(new TaskPath(keyPrefix + 'trim', labelPrefix + 'trim', TASK_PATH_TYPE_CHECKBOX, '(simple) Whether to trim the value to remove leading and trailing whitespaces and line breaks', true, [], 'trim'));
    }

    if (options.indexOf('bean') !== -1 || options.indexOf('method') !== -1) {
        paths.push(new TaskPath(keyPrefix + 'ref', labelPrefix + 'ref', TASK_PATH_TYPE_TEXT, '(method, bean) Sets the class name of the result type', '', [], 'ref'));
        paths.push(new TaskPath(keyPrefix + 'method', labelPrefix + 'method', TASK_PATH_TYPE_TEXT, '(method, bean) Sets the method name', '', [], 'method'));
    }

    return paths;
}