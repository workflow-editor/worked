import _ from 'lodash';
import {TASK_PATH_TYPE_TEXT, TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {TaskNodeModel} from "../../TaskNodeModel";
import {TASK_PATH_TYPE_CHECKBOX, TASK_PATH_TYPE_NUMBER} from "../../TaskPath";
import {generateTaskPathDSL} from "../../TaskPathDefinitions";

const defaultOptions = {};
defaultOptions[MODE_DSL] = {
    permitNameChange: true,
    permitInPortAdd: true,
    permitOutPortAdd: true,
    permitInPortRemove: true,
    permitOutPortRemove: true,
    permitInPortLabelChange: true,
    permitOutPortLabelChange: true,
    permitCategoryChange: false,
    permitPathChange: true,
    inPortsMaxAmount: null,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: true
};
defaultOptions[MODE_APACHE] = {
    permitNameChange: true,
    permitInPortAdd: true,
    permitOutPortAdd: true,
    permitInPortRemove: true,
    permitOutPortRemove: true,
    permitInPortLabelChange: false,
    permitOutPortLabelChange: false,
    permitCategoryChange: false,
    permitPathChange: true,
    inPortsMaxAmount: 1,
    outPortsMaxAmount: null,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];

export const taskMultiplexNodeDefaultColor = 'rgb(102,102,255)';
export const taskMultiplexNodeDefaultName = 'Task : multiplex';

export class TaskMultiplexNodeModel extends TaskNodeModel {
    constructor(name = taskMultiplexNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = [
            new TaskPath('strategyRef', 'strategyRef', TASK_PATH_TYPE_TEXT, 'Refers to an AggregationStrategy to be used to assemble the replies from the multicasts, into a single outgoing message from the Multicast. By default Camel will use the last reply as the outgoing message. From Camel 2.12 onwards you can also use a POJO as the AggregationStrategy, see the Aggregate page for more details. If an exception is thrown from the aggregate method in the AggregationStrategy, then by default, that exception is not handled by the error handler. The error handler can be enabled to react if enabling the shareUnitOfWork option.'),
            new TaskPath('strategyMethodName', 'strategyMethodName', TASK_PATH_TYPE_TEXT, 'Camel 2.12: This option can be used to explicit declare the method name to use, when using POJOs as the AggregationStrategy. See the Aggregate page for more details.'),
            new TaskPath('strategyMethodAllowNull', 'strategyMethodAllowNull', TASK_PATH_TYPE_CHECKBOX, 'Camel 2.12: If this option is false then the aggregate method is not used if there was no data to enrich. If this option is true then null values is used as the oldExchange (when no data to enrich), when using POJOs as the AggregationStrategy. See the Aggregate page for more details.', false),
            new TaskPath('parallelProcessing', 'parallelProcessing', TASK_PATH_TYPE_CHECKBOX, 'If enabled then sending messages to the multicasts occurs concurrently. Note the caller thread will still wait until all messages has been fully processed, before it continues. Its only the sending and processing the replies from the multicasts which happens concurrently.', false),
            new TaskPath('parallelAggregate', 'parallelAggregate', TASK_PATH_TYPE_CHECKBOX, 'Camel 2.14: If enabled then the aggregate method on AggregationStrategy can be called concurrently. Notice that this would require the implementation of AggregationStrategy to be implemented as thread-safe. By default this is false meaning that Camel synchronizes the call to the aggregate method. Though in some use-cases this can be used to archive higher performance when the AggregationStrategy is implemented as thread-safe.', false),
            new TaskPath('executorServiceRef', 'executorServiceRef', TASK_PATH_TYPE_TEXT, 'Refers to a custom Thread Pool to be used for parallel processing. Notice if you set this option, then parallel processing is automatic implied, and you do not have to enable that option as well.'),
            new TaskPath('stopOnException', 'stopOnException', TASK_PATH_TYPE_CHECKBOX, 'Camel 2.2: Whether or not to stop continue processing immediately when an exception occurred. If disable, then Camel will send the message to all multicasts regardless if one of them failed. You can deal with exceptions in the AggregationStrategy class where you have full control how to handle that.', false),
            new TaskPath('streaming', 'streaming', TASK_PATH_TYPE_CHECKBOX, 'If enabled then Camel will process replies out-of-order, eg in the order they come back. If disabled, Camel will process replies in the same order as multicasted.', false),
            new TaskPath('timeout', 'timeout', TASK_PATH_TYPE_NUMBER, 'Camel 2.5: Sets a total timeout specified in millis. If the Multicast hasn\'t been able to send and process all replies within the given timeframe, then the timeout triggers and the Multicast breaks out and continues. Notice if you provide a TimeoutAwareAggregationStrategy then the timeout method is invoked before breaking out. If the timeout is reached with running tasks still remaining, certain tasks for which it is difficult for Camel to shut down in a graceful manner may continue to run. So use this option with a bit of care. We may be able to improve this functionality in future Camel releases.', 0),
            new TaskPath('onPrepareRef', 'onPrepareRef', TASK_PATH_TYPE_TEXT, 'Camel 2.8: Refers to a custom Processor to prepare the copy of the Exchange each multicast will receive. This allows you to do any custom logic, such as deep-cloning the message payload if that\'s needed etc.'),
            new TaskPath('shareUnitOfWork', 'shareUnitOfWork', TASK_PATH_TYPE_CHECKBOX, 'Camel 2.8: Whether the unit of work should be shared. See the same option on Splitter for more details.', false),
        ];

        super(
            name,
            'multiplex',
            path,
            taskMultiplexNodeDefaultColor,
            defaultOptions,
            defaultBlacklist
        );

        this.description = 'Task nodes execute automated actions depending on their category. They have a path which holds all information for the specific mode parser.';
    }

    deSerialize(object) {
        super.deSerialize(object);
    }

    serialize() {
        return _.merge(super.serialize(), {});
    }
}
