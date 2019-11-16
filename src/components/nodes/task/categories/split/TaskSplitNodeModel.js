import _ from 'lodash';
import {TASK_PATH_TYPE_TEXT, TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {TaskNodeModel} from "../../TaskNodeModel";
import {
    TASK_PATH_TYPE_CHECKBOX, TASK_PATH_TYPE_LIST,
    TASK_PATH_TYPE_NUMBER
} from "../../TaskPath";
import {generateTaskPathApacheCamelExpression, generateTaskPathDSL} from "../../TaskPathDefinitions";

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
    outPortsMaxAmount: 1,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];

export const taskSplitNodeDefaultColor = 'rgb(153,153,255)';
export const taskSplitNodeDefaultName = 'Task : split';

export class TaskSplitNodeModel extends TaskNodeModel {
    constructor(name = taskSplitNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = generateTaskPathApacheCamelExpression('type_', 'Type: ', ['simple', 'method'])
            .concat([
            new TaskPath('uris', 'uris', TASK_PATH_TYPE_LIST, 'Set all target uris'),
            new TaskPath('parallelProcessing', 'parallelProcessing', TASK_PATH_TYPE_CHECKBOX, 'If enabled then processing each splitted messages occurs concurrently. Note the caller thread will still wait until all messages has been fully processed, before it continues. Its only processing the sub messages from the splitter which happens concurrently.', false),
            new TaskPath('strategyRef', 'strategyRef', TASK_PATH_TYPE_TEXT, 'Sets a reference to the AggregationStrategy to be used to assemble the replies from the splitted messages, into a single outgoing message from the Splitter. By default Camel will use the original incoming message to the splitter (leave it unchanged). You can also use a POJO as the AggregationStrategy'),
            new TaskPath('strategyMethodName', 'strategyMethodName', TASK_PATH_TYPE_TEXT, 'This option can be used to explicit declare the method name to use, when using POJOs as the AggregationStrategy.'),
            new TaskPath('strategyMethodAllowNull', 'strategyMethodAllowNull', TASK_PATH_TYPE_CHECKBOX, 'If this option is false then the aggregate method is not used if there was no data to enrich. If this option is true then null values is used as the oldExchange (when no data to enrich), when using POJOs as the AggregationStrategy', false),
            new TaskPath('executorServiceRef', 'executorServiceRef', TASK_PATH_TYPE_TEXT, 'Refers to a custom Thread Pool to be used for parallel processing. Notice if you set this option, then parallel processing is automatic implied, and you do not have to enable that option as well.'),
            new TaskPath('streaming', 'streaming', TASK_PATH_TYPE_CHECKBOX, 'When in streaming mode, then the splitter splits the original message on-demand, and each splitted message is processed one by one. This reduces memory usage as the splitter do not split all the messages first, but then we do not know the total size, and therefore the link org.apache.camel.ExchangeSPLIT_SIZE is empty. In non-streaming mode (default) the splitter will split each message first, to know the total size, and then process each message one by one. This requires to keep all the splitted messages in memory and therefore requires more memory. The total size is provided in the link org.apache.camel.ExchangeSPLIT_SIZE header. The streaming mode also affects the aggregation behavior. If enabled then Camel will process replies out-of-order, eg in the order they come back. If disabled, Camel will process replies in the same order as the messages was splitted.', false),
            new TaskPath('stopOnException', 'stopOnException', TASK_PATH_TYPE_CHECKBOX, 'Will now stop further processing if an exception or failure occurred during processing of an org.apache.camel.Exchange and the caused exception will be thrown. Will also stop if processing the exchange failed (has a fault message) or an exception was thrown and handled by the error handler (such as using onException). In all situations the splitter will stop further processing. This is the same behavior as in pipeline, which is used by the routing engine. The default behavior is to not stop but continue processing till the end', false),
            new TaskPath('timeout', 'timeout', TASK_PATH_TYPE_NUMBER, 'Sets a total timeout specified in millis, when using parallel processing. If the Splitter hasn’t been able to split and process all the sub messages within the given timeframe, then the timeout triggers and the Splitter breaks out and continues. Notice if you provide a TimeoutAwareAggregationStrategy then the timeout method is invoked before breaking out. If the timeout is reached with running tasks still remaining, certain tasks for which it is difficult for Camel to shut down in a graceful manner may continue to run. So use this option with a bit of care.', 0),
            new TaskPath('onPrepareRef', 'onPrepareRef', TASK_PATH_TYPE_TEXT, 'Uses the Processor when preparing the org.apache.camel.Exchange to be send. This can be used to deep-clone messages that should be send, or any custom logic needed before the exchange is send.'),
            new TaskPath('shareUnitOfWork', 'shareUnitOfWork', TASK_PATH_TYPE_CHECKBOX, 'Shares the org.apache.camel.spi.UnitOfWork with the parent and each of the sub messages. Splitter will by default not share unit of work between the parent exchange and each splitted exchange. This means each splitted exchange has its own individual unit of work.', false),
            new TaskPath('parallelAggregate', 'parallelAggregate', TASK_PATH_TYPE_CHECKBOX, 'If enabled then the aggregate method on AggregationStrategy can be called concurrently. Notice that this would require the implementation of AggregationStrategy to be implemented as thread-safe. By default this is false meaning that Camel synchronizes the call to the aggregate method. Though in some use-cases this can be used to archive higher performance when the AggregationStrategy is implemented as thread-safe.', false),
            new TaskPath('stopOnAggregateException', 'stopOnAggregateException', TASK_PATH_TYPE_CHECKBOX, 'If enabled, unwind exceptions occurring at aggregation time to the error handler when parallelProcessing is used. Currently, aggregation time exceptions do not stop the route processing when parallelProcessing is used. Enabling this option allows to work around this behavior. The default value is false for the sake of backward compatibility.', false),
        ]);

        super(
            name,
            'split',
            path,
            taskSplitNodeDefaultColor,
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
