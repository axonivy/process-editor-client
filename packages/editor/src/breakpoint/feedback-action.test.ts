/* eslint-disable no-unused-expressions */
import {
  ActionDispatcher,
  Bounds,
  CommandExecutionContext,
  configureCommand,
  createFeatureSet,
  defaultModule,
  FeedbackActionDispatcher,
  InitializeCanvasBoundsAction,
  SChildElement,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { describe, test, expect, beforeEach } from 'vitest';
import { Container, injectable } from 'inversify';

import { BreakpointFeedbackAction, BreakpointFeedbackCommand } from './feedback-action';
import { breakpointFeature, SBreakpointHandle } from './model';

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
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, BreakpointFeedbackCommandMock);
  return container;
}

describe('BreakpointFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
    root = new SModelRoot();
  });

  test('SBreakpointHandle will not be added to a unbreakable element', async () => {
    const node = new SChildElement();
    node.id = 'notbreakable';
    root.add(node);

    const invalidBreakpoint = { elementId: 'notbreakable', condition: '', disabled: false };
    await actionDispatcher.dispatch(BreakpointFeedbackAction.create({ breakpoints: [invalidBreakpoint] }));
    expect(node.children).to.be.empty;
  });

  test('SBreakpointHandle will be added/removed to/from a breakable element', async () => {
    const node = new SChildElement();
    node.id = 'foo';
    node.features = createFeatureSet([breakpointFeature]);
    root.add(node);

    const elementBreakpoint = { elementId: 'foo', condition: '', disabled: false };
    await actionDispatcher.dispatch(BreakpointFeedbackAction.create({ breakpoints: [elementBreakpoint] }));
    expect(node.children).to.have.lengthOf(1);
    assertBreakpoint(node.children[0], '', false, false);
    expect(node.children[0]).to.be.an.instanceOf(SBreakpointHandle);

    await actionDispatcher.dispatch(BreakpointFeedbackAction.create({ breakpoints: [], oldBreakpoints: [elementBreakpoint] }));
    expect(node.children).to.be.empty;
  });

  test('SBreakpointHandle will get correct infos', async () => {
    const node = new SChildElement();
    node.id = 'foo';
    node.features = createFeatureSet([breakpointFeature]);
    root.add(node);

    const elementBreakpoint = { elementId: 'foo', condition: 'test condition', disabled: true };
    await actionDispatcher.dispatch(
      BreakpointFeedbackAction.create({ breakpoints: [elementBreakpoint], oldBreakpoints: [], globalDisabled: true })
    );
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
