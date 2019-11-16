import _ from 'lodash';
import {TASK_PATH_TYPE_TEXT, TaskPath} from "./../../TaskPath";
import {MODE_APACHE, MODE_DSL} from "../../../../../model/Mode";
import {TaskNodeModel} from "../../TaskNodeModel";
import {
    TASK_PATH_TYPE_CHECKBOX, TASK_PATH_TYPE_NUMBER} from "../../TaskPath";
import {
    generateTaskPathApacheCamelExpression, generateTaskPathApacheCamelURI,
    generateTaskPathDSL
} from "../../TaskPathDefinitions";

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
    inPortsMaxAmount: null,
    outPortsMaxAmount: 1,
    inPortMultipleConnections: false,
    outPortMultipleConnections: false
};

const defaultBlacklist = {};
defaultBlacklist[MODE_DSL] = [];
defaultBlacklist[MODE_APACHE] = [];

export const taskUnionNodeDefaultColor = 'rgb(255,0,127)';
export const taskUnionNodeDefaultName = 'Task : union';

export class TaskUnionNodeModel extends TaskNodeModel {
    constructor(name = taskUnionNodeDefaultName, displayOnly = true) {

        let path = {};
        path[MODE_DSL] = generateTaskPathDSL();
        path[MODE_APACHE] = generateTaskPathApacheCamelExpression('correlationExpression_', ' correlationExpression: ', ['simple', 'header', 'constant'])
            .concat(generateTaskPathApacheCamelURI()).concat([
                new TaskPath('completionPredicate', 'completionPredicate', TASK_PATH_TYPE_TEXT, 'A Predicate to indicate when an aggregated exchange is complete. If this is not specified and the AggregationStrategy object implements Predicate, the aggregationStrategy object will be used as the completionPredicate.'),
                new TaskPath('completionTimeout', 'completionTimeout', TASK_PATH_TYPE_NUMBER, 'Time in millis that an aggregated exchange should be inactive before its complete (timeout). This option can be set as either a fixed value or using an Expression which allows you to evaluate a timeout dynamically - will use Long as result. If both are set Camel will fallback to use the fixed value if the Expression result was null or 0. You cannot use this option together with completionInterval, only one of the two can be used. By default the timeout checker runs every second, you can use the completionTimeoutCheckerInterval option to configure how frequently to run the checker. The timeout is an approximation and there is no guarantee that the a timeout is triggered exactly after the timeout value. It is not recommended to use very low timeout values or checker intervals.', 0),
                new TaskPath('completionSize', 'completionSize', TASK_PATH_TYPE_NUMBER, 'Number of messages aggregated before the aggregation is complete. This option can be set as either a fixed value or using an Expression which allows you to evaluate a size dynamically - will use Integer as result. If both are set Camel will fallback to use the fixed value if the Expression result was null or 0.', 0),
                new TaskPath('optimisticLockRetryPolicy', 'optimisticLockRetryPolicy', TASK_PATH_TYPE_TEXT, 'Allows to configure retry settings when using optimistic locking.'),
                new TaskPath('parallelProcessing', 'parallelProcessing', TASK_PATH_TYPE_CHECKBOX, 'When aggregated are completed they are being send out of the aggregator. This option indicates whether or not Camel should use a thread pool with multiple threads for concurrency. If no custom thread pool has been specified then Camel creates a default pool with 10 concurrent threads.', false),
                new TaskPath('optimisticLocking', 'optimisticLocking', TASK_PATH_TYPE_CHECKBOX, 'Turns on using optimistic locking, which requires the aggregationRepository being used, is supporting this by implementing org.apache.camel.spi.OptimisticLockingAggregationRepository.', false),
                new TaskPath('executorServiceRef', 'executorServiceRef', TASK_PATH_TYPE_TEXT, 'If using parallelProcessing you can specify a custom thread pool to be used. In fact also if you are not using parallelProcessing this custom thread pool is used to send out aggregated exchanges as well.'),
                new TaskPath('timeoutCheckerExecutorServiceRef', 'timeoutCheckerExecutor ServiceRef', TASK_PATH_TYPE_TEXT, 'If using either of the completionTimeout, completionTimeoutExpression, or completionInterval options a background thread is created to check for the completion for every aggregator. Set this option to provide a custom thread pool to be used rather than creating a new thread for every aggregator.'),
                new TaskPath('aggregationRepositoryRef', 'aggregationRepositoryRef', TASK_PATH_TYPE_TEXT, 'Sets the custom aggregate repository to use Will by default use org.apache.camel.processor.aggregate.MemoryAggregationRepository'),
                new TaskPath('strategyRef', 'strategyRef', TASK_PATH_TYPE_TEXT, 'A reference to lookup the AggregationStrategy in the Registry. Configuring an AggregationStrategy is required, and is used to merge the incoming Exchange with the existing already merged exchanges. At first call the oldExchange parameter is null. On subsequent invocations the oldExchange contains the merged exchanges and newExchange is of course the new incoming Exchange.'),
                new TaskPath('strategyMethodName', 'strategyMethodName', TASK_PATH_TYPE_TEXT, 'This option can be used to explicit declare the method name to use, when using POJOs as the AggregationStrategy.'),
                new TaskPath('strategyMethodAllowNull', 'strategyMethodAllowNull', TASK_PATH_TYPE_CHECKBOX, 'If this option is false then the aggregate method is not used for the very first aggregation. If this option is true then null values is used as the oldExchange (at the very first aggregation), when using POJOs as the AggregationStrategy.', false),
                new TaskPath('completionInterval', 'completionInterval', TASK_PATH_TYPE_NUMBER, 'A repeating period in millis by which the aggregator will complete all current aggregated exchanges. Camel has a background task which is triggered every period. You cannot use this option together with completionTimeout, only one of them can be used.', 0),
                new TaskPath('completionTimeoutCheckerInterval', 'completionTimeoutChecker Interval', TASK_PATH_TYPE_NUMBER, 'Interval in millis that is used by the background task that checks for timeouts (org.apache.camel.TimeoutMap). By default the timeout checker runs every second. The timeout is an approximation and there is no guarantee that the a timeout is triggered exactly after the timeout value. It is not recommended to use very low timeout values or checker intervals.', 1000),
                new TaskPath('completionFromBatchConsumer', 'completionFromBatchConsumer', TASK_PATH_TYPE_CHECKBOX, 'Enables the batch completion mode where we aggregate from a org.apache.camel.BatchConsumer and aggregate the total number of exchanges the org.apache.camel.BatchConsumer has reported as total by checking the exchange property link org.apache.camel.ExchangeBATCH_COMPLETE when its complete.', false),
                new TaskPath('groupExchanges', 'groupExchanges', TASK_PATH_TYPE_CHECKBOX, 'Deprecated Enables grouped exchanges, so the aggregator will group all aggregated exchanges into a single combined Exchange holding all the aggregated exchanges in a java.util.List.', false),
                new TaskPath('eagerCheckCompletion', 'eagerCheckCompletion', TASK_PATH_TYPE_CHECKBOX, 'Use eager completion checking which means that the completionPredicate will use the incoming Exchange. As opposed to without eager completion checking the completionPredicate will use the aggregated Exchange.', false),
                new TaskPath('ignoreInvalidCorrelationKeys', 'ignoreInvalidCorrelation Keys', TASK_PATH_TYPE_CHECKBOX, 'If a correlation key cannot be successfully evaluated it will be ignored by logging a DEBUG and then just ignore the incoming Exchange.', false),
                new TaskPath('closeCorrelationKeyOnCompletion', 'closeCorrelationKeyOn Completion', TASK_PATH_TYPE_TEXT, 'Closes a correlation key when its complete. Any late received exchanges which has a correlation key that has been closed, it will be defined and a ClosedCorrelationKeyException is thrown.'),
                new TaskPath('discardOnCompletionTimeout', 'discardOnCompletionTimeout', TASK_PATH_TYPE_CHECKBOX, 'Discards the aggregated message on completion timeout. This means on timeout the aggregated message is dropped and not sent out of the aggregator.', false),
                new TaskPath('forceCompletionOnStop', 'forceCompletionOnStop', TASK_PATH_TYPE_CHECKBOX, 'Indicates to complete all current aggregated exchanges when the context is stopped', false),
                new TaskPath('completeAllOnStop', 'completeAllOnStop', TASK_PATH_TYPE_CHECKBOX, 'Indicates to wait to complete all current and partial (pending) aggregated exchanges when the context is stopped. This also means that we will wait for all pending exchanges which are stored in the aggregation repository to complete so the repository is empty before we can stop. You may want to enable this when using the memory based aggregation repository that is memory based only, and do not store data on disk. When this option is enabled, then the aggregator is waiting to complete all those exchanges before its stopped, when stopping CamelContext or the route using it.', false),
                new TaskPath('aggregateControllerRef', 'aggregateControllerRef', TASK_PATH_TYPE_TEXT, 'To use a org.apache.camel.processor.aggregate.AggregateController to allow external sources to control this aggregator.'),
            ]);

        super(
            name,
            'union',
            path,
            taskUnionNodeDefaultColor,
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
