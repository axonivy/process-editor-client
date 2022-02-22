import {
  ActionDispatcher,
  CommandExecutionContext,
  configureCommand,
  createFeatureSet,
  defaultModule,
  EMPTY_BOUNDS,
  FeedbackActionDispatcher,
  GLSP_TYPES,
  InitializeCanvasBoundsAction,
  SChildElement,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container, injectable } from 'inversify';

import { BreakpointFeedbackAction, BreakpointFeedbackCommand } from '../../src/breakpoint/feedback-action';
import { breakpointFeature, SBreakpointHandle } from '../../src/breakpoint/model';

let root: SModelRoot;

@injectable()
class BreakpointFeedbackCommandMock extends BreakpointFeedbackCommand {
  execute(context: CommandExecutionContext): SModelRoot {
    context.root = root;
    return super.execute(context);
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, BreakpointFeedbackCommandMock);
  return container;
}

describe('BreakpointFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
    root = new SModelRoot();
  });

  it('SBreakpointHandle will not be added to a unbreakable element', async () => {
    const node = new SChildElement();
    node.id = 'notbreakable';
    root.add(node);

    const invalidBreakpoint = { elementId: 'notbreakable', condition: '', disabled: false };
    await actionDispatcher.dispatch(new BreakpointFeedbackAction([invalidBreakpoint]));
    expect(node.children).to.be.empty;
  });

  it('SBreakpointHandle will be added/removed to/from a breakable element', async () => {
    const node = new SChildElement();
    node.id = 'foo';
    node.features = createFeatureSet([breakpointFeature]);
    root.add(node);

    const elementBreakpoint = { elementId: 'foo', condition: '', disabled: false };
    await actionDispatcher.dispatch(new BreakpointFeedbackAction([elementBreakpoint]));
    expect(node.children).to.have.lengthOf(1);
    assertBreakpoint(node.children[0], '', false, false);
    expect(node.children[0]).to.be.an.instanceOf(SBreakpointHandle);

    await actionDispatcher.dispatch(new BreakpointFeedbackAction([], [elementBreakpoint]));
    expect(node.children).to.be.empty;
  });

  it('SBreakpointHandle will get correct infos', async () => {
    const node = new SChildElement();
    node.id = 'foo';
    node.features = createFeatureSet([breakpointFeature]);
    root.add(node);

    const elementBreakpoint = { elementId: 'foo', condition: 'test condition', disabled: true };
    await actionDispatcher.dispatch(new BreakpointFeedbackAction([elementBreakpoint], [], true));
    expect(node.children).to.have.lengthOf(1);
    assertBreakpoint(node.children[0], 'test condition', true, true);
    expect(node.children[0]).to.be.an.instanceOf(SBreakpointHandle);
  });

  function assertBreakpoint(element: SChildElement, expectedCondition: string, isDisabled: boolean, isGlobalDisabled: boolean): void {
    expect(element).to.be.an.instanceOf(SBreakpointHandle);
    const breakpoint = element as SBreakpointHandle;
    expect(breakpoint.condition).to.be.equals(expectedCondition);
    expect(breakpoint.disabled).to.be.equals(isDisabled);
    expect(breakpoint.globalDisabled).to.be.equals(isGlobalDisabled);
  }
});
