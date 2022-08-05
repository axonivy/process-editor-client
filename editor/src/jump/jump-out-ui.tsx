/** @jsx html */
import {
  AbstractUIExtension,
  Action,
  CommandExecutionContext,
  CommandReturn,
  EditorContextService,
  FeedbackCommand,
  IActionDispatcher,
  IFeedbackActionDispatcher,
  SetUIExtensionVisibilityAction,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, postConstruct } from 'inversify';
import { createElement, createIcon } from '../utils/ui-utils';
import { JumpAction } from './action';
import { init, h, VNode, propsModule, classModule, eventListenersModule } from 'snabbdom';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  html,
  IViewArgs,
  RenderingContext,
  ViewportRootElement
} from 'sprotty';

const patch = init([propsModule, classModule, eventListenersModule]);

@injectable()
export class JumpOutUi extends AbstractUIExtension {
  static readonly ID = 'jumpOutUi';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(TYPES.IFeedbackActionDispatcher) protected readonly feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;

  public id(): string {
    return JumpOutUi.ID;
  }

  public containerClass(): string {
    return 'jump-out-container';
  }

  @postConstruct()
  postConstruct(): void {
    this.feedbackDispatcher.registerFeedback(this, [JumpOutFeedbackAction.create()]);
  }

  protected initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRoot>, ...contextElementIds: string[]): void {
    // containerElement.innerHTML = '';
    // const button = createElement('div', ['jump-out-btn']);
    // button.title = 'Jump out (J)';
    // button.appendChild(createIcon(['fa-solid', 'fa-turn-up']));
    // button.onclick = _ev => this.actionDispatcher.dispatch(JumpAction.create({ elementId: '' }));
    // containerElement.appendChild(button);
    const rootNode: VNode = h(
      `div#sprotty_${this.id()}.${this.containerClass()}`,
      h('div.jump-out-btn', {
        props: { title: 'Jump out (J)' },
        on: { click: (_ev: MouseEvent) => this.actionDispatcher.dispatch(JumpAction.create({ elementId: '' })) }
      })
    );
    // const htmljsxNode: VNode = (
    //   <div id={'sprotty_' + this.id()} class={{ 'jump-out-container': true }}>
    //     <div
    //       class={{ 'jump-out-btn': true }}
    //       on={{ click: (_ev: MouseEvent) => this.actionDispatcher.dispatch(JumpAction.create({ elementId: '' })) }}
    //     ></div>
    //   </div>
    // );
    // const rootNode: VNode = h('div.jump-out-btn', {
    //   props: { title: 'Jump out (J)', onclick: (_ev: MouseEvent) => this.actionDispatcher.dispatch(JumpAction.create({ elementId: '' })) }
    // });
    patch(containerElement, rootNode);
  }
}

export interface JumpOutFeedbackAction extends Action {
  kind: typeof JumpOutFeedbackCommand.KIND;
  elementId?: string;
}

export namespace JumpOutFeedbackAction {
  export function create(elementId?: string): JumpOutFeedbackAction {
    return {
      kind: JumpOutFeedbackCommand.KIND,
      elementId
    };
  }
}

@injectable()
export class JumpOutFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'toolPaletteFeedback';
  @inject(TYPES.Action) protected action: JumpOutFeedbackAction;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;

  execute(context: CommandExecutionContext): CommandReturn {
    this.actionDispatcher.dispatch(
      SetUIExtensionVisibilityAction.create({ extensionId: JumpOutUi.ID, visible: this.showJumpOutBtn(context.root) })
    );
    return context.root;
  }

  showJumpOutBtn(root: SModelRoot): boolean {
    return root.id.includes('-');
  }
}
