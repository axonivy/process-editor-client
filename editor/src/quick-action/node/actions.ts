import { Operation, SModelElement, connectableFeature, isConnectable, SEdge, SetUIExtensionVisibilityAction } from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';
import { ToolBar } from '../../tool-bar/tool-bar';
import { IVY_TYPES } from '../../types';
import { ActivityTypes } from '../../diagram/view-types';

import { CategoryQuickActionProvider, QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action';
import { resolvePaletteIcon } from '../../diagram/icon/icons';
import { CreateNodeUi } from './create-node-ui';
import { KeyCode } from 'sprotty/lib/utils/keyboard';

export interface AttachCommentOperation extends Operation {
  kind: typeof AttachCommentOperation.KIND;
  elementId: string;
}

export namespace AttachCommentOperation {
  export const KIND = 'attachComment';

  export function create(options: { elementId: string }): AttachCommentOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

@injectable()
export class AttachCommentProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element.hasFeature(connectableFeature) && element.type !== ActivityTypes.COMMENT) {
      return new AttachCommentQuickAction(element.id);
    }
    return undefined;
  }
}

class AttachCommentQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-regular fa-message',
    public readonly title = 'Attach Comment',
    public readonly location = QuickActionLocation.Right,
    public readonly sorting = 'Y',
    public readonly action = AttachCommentOperation.create({ elementId: elementId })
  ) {}
}

@injectable()
export class CreateElementQuickActionProvider implements CategoryQuickActionProvider {
  @inject(IVY_TYPES.ToolBar) protected toolBar: ToolBar;

  private quickActions: QuickAction[];

  categoryQuickActions(element: SModelElement): QuickAction[] {
    if (!isConnectable(element) || !element.canConnect(new SEdge(), 'source') || element.type === ActivityTypes.COMMENT) {
      return [];
    }
    if (this.quickActions === undefined || this.quickActions.length === 0) {
      this.quickActions = this.loadCategoryQuickActions();
      this.quickActions.push(new OpenCreateNodeQuickAction());
    }
    return this.quickActions;
  }

  private loadCategoryQuickActions(): QuickAction[] {
    return (
      this.toolBar
        .getElementPaletteItems()
        ?.filter(item => CreateNodeUi.KNOWN_CATEGORIES.includes(item.id))
        .map(
          item =>
            ({
              icon: resolvePaletteIcon(item.icon!).res,
              title: `${item.label} (A)`,
              location: QuickActionLocation.Right,
              sorting: item.sortString,
              action: SetUIExtensionVisibilityAction.create({ extensionId: CreateNodeUi.ID, visible: true, contextElementsId: [item.id] }),
              readonlySupport: false,
              letQuickActionsOpen: true
            } as QuickAction)
        ) ?? []
    );
  }
}

class OpenCreateNodeQuickAction implements QuickAction {
  constructor(
    public readonly icon = 'fa-regular fa-square',
    public readonly title = 'Create Node',
    public readonly location = QuickActionLocation.Hidden,
    public readonly sorting = 'Z',
    public readonly action = SetUIExtensionVisibilityAction.create({ extensionId: CreateNodeUi.ID, visible: true }),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = false,
    public readonly shortcut: KeyCode = 'KeyA'
  ) {}
}
