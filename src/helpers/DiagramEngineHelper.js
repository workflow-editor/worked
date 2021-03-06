import * as RJD from 'varakh-react-diagrams';
import {StartWidgetFactory} from "../components/nodes/start/StartWidgetFactory";
import {StartNodeFactory} from "../components/nodes/start/StartInstanceFactories";
import {EndWidgetFactory} from "../components/nodes/end/EndWidgetFactory";
import {EndNodeFactory} from "../components/nodes/end/EndInstanceFactories";
import {BlockWidgetFactory} from "../components/nodes/block/BlockWidgetFactory";
import {BlockNodeFactory} from "../components/nodes/block/BlockInstanceFactories";
import {DiagramEngine} from "../model/DiagramEngine";
import {DiagramPortInstanceFactory} from "../model/DiagramPortInstanceFactory";
import {TaskScriptWidgetFactory} from "../components/nodes/task/categories/script/TaskScriptWidgetFactory";
import {TaskScriptNodeFactory} from "../components/nodes/task/categories/script/TaskScriptInstanceFactories";
import {TaskChoiceWidgetFactory} from "../components/nodes/task/categories/choice/TaskChoiceWidgetFactory";
import {TaskChoiceNodeFactory} from "../components/nodes/task/categories/choice/TaskChoiceInstanceFactories";
import {TaskServiceWidgetFactory} from "../components/nodes/task/categories/service/TaskServiceWidgetFactory";
import {TaskServiceNodeFactory} from "../components/nodes/task/categories/service/TaskServiceInstanceFactories";
import {TaskConditionNodeFactory} from "../components/nodes/task/categories/condition/TaskConditionInstanceFactories";
import {TaskConditionWidgetFactory} from "../components/nodes/task/categories/condition/TaskConditionWidgetFactory";
import {TaskOutputWidgetFactory} from "../components/nodes/task/categories/output/TaskOutputWidgetFactory";
import {TaskOutputNodeFactory} from "../components/nodes/task/categories/output/TaskOutputInstanceFactories";
import {TaskConvertWidgetFactory} from "../components/nodes/task/categories/convert/TaskConvertWidgetFactory";
import {TaskConvertNodeFactory} from "../components/nodes/task/categories/convert/TaskConvertInstanceFactories";
import {TaskFilterWidgetFactory} from "../components/nodes/task/categories/filter/TaskFilterWidgetFactory";
import {TaskUnionWidgetFactory} from "../components/nodes/task/categories/union/TaskUnionWidgetFactory";
import {TaskGetWidgetFactory} from "../components/nodes/task/categories/get/TaskGetWidgetFactory";
import {TaskSetWidgetFactory} from "../components/nodes/task/categories/set/TaskSetWidgetFactory";
import {TaskSplitWidgetFactory} from "../components/nodes/task/categories/split/TaskSplitWidgetFactory";
import {TaskDelayWidgetFactory} from "../components/nodes/task/categories/delay/TaskDelayWidgetFactory";
import {TaskFilterNodeFactory} from "../components/nodes/task/categories/filter/TaskFilterInstanceFactories";
import {TaskUnionNodeFactory} from "../components/nodes/task/categories/union/TaskUnionInstanceFactories";
import {TaskGetNodeFactory} from "../components/nodes/task/categories/get/TaskGetInstanceFactories";
import {TaskSetNodeFactory} from "../components/nodes/task/categories/set/TaskSetInstanceFactories";
import {TaskMultiplexNodeFactory} from "../components/nodes/task/categories/multiplex/TaskMultiplexInstanceFactories";
import {TaskSplitNodeFactory} from "../components/nodes/task/categories/split/TaskSplitInstanceFactories";
import {TaskDelayNodeFactory} from "../components/nodes/task/categories/delay/TaskDelayInstanceFactories";
import {TaskMultiplexWidgetFactory} from "../components/nodes/task/categories/multiplex/TaskMultiplexWidgetFactory";
import {TaskErrorWidgetFactory} from "../components/nodes/task/categories/error/TaskErrorWidgetFactory";
import {TaskErrorNodeFactory} from "../components/nodes/task/categories/error/TaskErrorInstanceFactories";

// Setup the diagram engine
export const diagramEngine = new DiagramEngine();
diagramEngine.registerLinkFactory(new RJD.DefaultLinkFactory());
diagramEngine.registerNodeFactory(new RJD.DefaultNodeFactory());

diagramEngine.registerNodeFactory(new StartWidgetFactory());
diagramEngine.registerNodeFactory(new EndWidgetFactory());
diagramEngine.registerNodeFactory(new BlockWidgetFactory());
diagramEngine.registerNodeFactory(new TaskErrorWidgetFactory());
diagramEngine.registerNodeFactory(new TaskServiceWidgetFactory());
diagramEngine.registerNodeFactory(new TaskScriptWidgetFactory());
diagramEngine.registerNodeFactory(new TaskConditionWidgetFactory());
diagramEngine.registerNodeFactory(new TaskChoiceWidgetFactory());
diagramEngine.registerNodeFactory(new TaskOutputWidgetFactory());
diagramEngine.registerNodeFactory(new TaskConvertWidgetFactory());
diagramEngine.registerNodeFactory(new TaskFilterWidgetFactory());
diagramEngine.registerNodeFactory(new TaskUnionWidgetFactory());
diagramEngine.registerNodeFactory(new TaskGetWidgetFactory());
diagramEngine.registerNodeFactory(new TaskSetWidgetFactory());
diagramEngine.registerNodeFactory(new TaskMultiplexWidgetFactory());
diagramEngine.registerNodeFactory(new TaskSplitWidgetFactory());
diagramEngine.registerNodeFactory(new TaskDelayWidgetFactory());

// Register instance factories
diagramEngine.registerInstanceFactory(new RJD.DefaultNodeInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.LinkInstanceFactory());
diagramEngine.registerInstanceFactory(new DiagramPortInstanceFactory());

diagramEngine.registerInstanceFactory(new StartNodeFactory());
diagramEngine.registerInstanceFactory(new EndNodeFactory());
diagramEngine.registerInstanceFactory(new BlockNodeFactory());
diagramEngine.registerInstanceFactory(new TaskErrorNodeFactory());
diagramEngine.registerInstanceFactory(new TaskServiceNodeFactory());
diagramEngine.registerInstanceFactory(new TaskScriptNodeFactory());
diagramEngine.registerInstanceFactory(new TaskConditionNodeFactory());
diagramEngine.registerInstanceFactory(new TaskChoiceNodeFactory());
diagramEngine.registerInstanceFactory(new TaskOutputNodeFactory());
diagramEngine.registerInstanceFactory(new TaskConvertNodeFactory());
diagramEngine.registerInstanceFactory(new TaskFilterNodeFactory());
diagramEngine.registerInstanceFactory(new TaskUnionNodeFactory());
diagramEngine.registerInstanceFactory(new TaskGetNodeFactory());
diagramEngine.registerInstanceFactory(new TaskSetNodeFactory());
diagramEngine.registerInstanceFactory(new TaskMultiplexNodeFactory());
diagramEngine.registerInstanceFactory(new TaskSplitNodeFactory());
diagramEngine.registerInstanceFactory(new TaskDelayNodeFactory());
