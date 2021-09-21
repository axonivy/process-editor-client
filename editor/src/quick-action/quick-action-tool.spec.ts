import {
  boundsFeature,
  configureCommand,
  createFeatureSet,
  defaultGLSPModule,
  defaultModule,
  FeedbackActionDispatcher,
  GLSP_TYPES,
  glspMouseToolModule,
  LocalModelSource,
  modelSourceModule,
  moveFeature,
  Point,
  selectFeature,
  SModelElement,
  SModelRoot,
  SNode,
  TYPES
} from '@eclipse-glsp/client';
import {
  SelectFeedbackAction,
  SelectFeedbackCommand
} from '@eclipse-glsp/client/lib/features/select/select-feedback-action';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { expect } from 'chai';
import { Container, injectable } from 'inversify';
import { describe, it } from 'mocha';

import { quickActionFeature } from './model';
import { QuickActionListener, QuickActionTool } from './quick-action-tool';
import { HideQuickActionToolFeedbackAction, ShowQuickActionToolFeedbackAction } from './quick-action-tool-feedback';

function getNode(nodeId: string, model: SModelRoot): SNode {
  return model.index.getById(nodeId) as SNode;
}

function createNode(id: string, type: string, position: Point): SNode {
  const node = new SNode();
  node.id = id;
  node.type = type;
  node.position = position;
  node.selected = true; // Needs to be true for quick action tool and the selection service does not mark the selection on the same model
  node.features = createFeatureSet([selectFeature, boundsFeature, moveFeature, quickActionFeature]);
  return node;
}

function createRoot(children: SNode[]): SModelRoot {
  const root = new SModelRoot();
  root.id = 'root';
  root.type = 'root';
  children.forEach(node => root.add(node));
  return root;
}

@injectable()
class QuickActionListenerMock extends QuickActionListener {
  set activeElement(element: SModelElement) {
    this.activeQuickActionElement = element;
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, glspMouseToolModule, defaultGLSPModule, modelSourceModule);
  container.bind(SelectionService).toSelf().inSingletonScope();
  container.bind(GLSP_TYPES.SelectionService).toService(SelectionService);
  container.bind(GLSP_TYPES.IDefaultTool).to(QuickActionTool);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, SelectFeedbackCommand);
  return container;
}

describe('QuickActionTool', () => {
  let root: SModelRoot;
  let selectionService: SelectionService;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();

    const node0 = createNode('node0', 'node:circle', { x: 100, y: 100 });
    const node1 = createNode('node1', 'node:circle', { x: 200, y: 200 });
    const node2 = createNode('node2', 'node:circle', { x: 300, y: 300 });
    root = createRoot([node2, node1, node0]);

    selectionService = container.get<SelectionService>(GLSP_TYPES.SelectionService);
    const quickActionTool = container.get<QuickActionTool>(GLSP_TYPES.IDefaultTool);
    const quickActionListener = new QuickActionListenerMock(quickActionTool);
    selectionService.register(quickActionListener);
    quickActionListener.activeElement = getNode('node0', root);

    feedbackDispatcher = container.get<FeedbackActionDispatcher>(GLSP_TYPES.IFeedbackActionDispatcher);
  });

  it('Feedback is registred on element selection', () => {
    selectionService.updateSelection(root, ['node1'], []);
    assertShowQuickActionFeedback(['node1']);

    selectionService.updateSelection(root, ['node0'], ['node1']);
    assertShowQuickActionFeedback(['node0']);

    selectionService.updateSelection(root, ['node1'], ['node0']);
    assertShowQuickActionFeedback(['node1']);

    selectionService.updateSelection(root, [], ['node1', 'node0']);
    assertHideQuickActionFeedback();
  });

  it('Multi selection is not covered by quick action tool', () => {
    selectionService.updateSelection(root, ['node1', 'node2'], []);
    assertShowQuickActionFeedback(['node1', 'node2']);

    selectionService.updateSelection(root, [], ['node1', 'node2']);
    assertHideQuickActionFeedback();
  });

  function assertHideQuickActionFeedback(): void {
    const feedbacks = feedbackDispatcher.getRegisteredFeedback();
    expect(feedbacks).to.have.lengthOf(2);

    expect(feedbacks[0]).to.be.instanceOf(SelectFeedbackAction);
    const selectAction = feedbacks[0] as SelectFeedbackAction;
    expect(selectAction.selectedElementsIDs).to.be.deep.equals([]);

    expect(feedbacks[1]).to.be.instanceOf(HideQuickActionToolFeedbackAction);
  }

  function assertShowQuickActionFeedback(element: string[]): void {
    const feedbacks = feedbackDispatcher.getRegisteredFeedback();
    expect(feedbacks).to.have.lengthOf(2);

    expect(feedbacks[0]).to.be.instanceOf(SelectFeedbackAction);
    const selectAction = feedbacks[0] as SelectFeedbackAction;
    // all elements selected
    expect(selectAction.selectedElementsIDs).to.be.deep.equals(element);

    expect(feedbacks[1]).to.be.instanceOf(ShowQuickActionToolFeedbackAction);
    const quickAction = feedbacks[1] as ShowQuickActionToolFeedbackAction;
    // only last element has quick actions
    expect(quickAction.elementId).to.be.equals(element.reverse()[0]);
  }
});
