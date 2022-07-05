import {
  AbstractUIExtension,
  Action,
  CreateNodeOperation,
  EditorContextService,
  getAbsoluteBounds,
  IActionDispatcher,
  isNotUndefined,
  PaletteItem,
  SConnectableElement,
  SModelElement,
  SModelRoot,
  TriggerNodeCreationAction,
  TYPES
} from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';
import { ItemPickerMenu } from '../../tool-bar/item-picker-menu';
import { ToolBar } from '../../tool-bar/tool-bar';
import { IVY_TYPES } from '../../types';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';

@injectable()
export class CreateNodeUi extends AbstractUIExtension {
  static readonly ID = 'createNodeUi';
  static readonly KNOWN_CATEGORIES = ['event-group', 'gateway-group', 'activity-group', 'bpmn-activity-group'];

  protected elementPickerMenu?: ItemPickerMenu;

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(IVY_TYPES.ToolBar) protected toolBar: ToolBar;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;

  id(): string {
    return CreateNodeUi.ID;
  }

  containerClass(): string {
    return 'create-node-container';
  }

  protected initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRoot>, ...contextElementIds: string[]): void {
    const paletteItems = this.toolBar.getElementPaletteItems();
    if (paletteItems === undefined || this.editorContext.selectedElements.length === 0) {
      return;
    }
    const element = this.editorContext.selectedElements[0];
    this.elementPickerMenu?.removeMenuBody();
    this.elementPickerMenu = this.createElementPickerMenu(paletteItems, containerElement, element);
    const absoluteBounds = getAbsoluteBounds(element);
    containerElement.style.left = `${absoluteBounds.x + absoluteBounds.width + 10 + 3 * 32}px`;
    containerElement.style.top = `${absoluteBounds.y}px`;
    if (contextElementIds.length > 0) {
      this.elementPickerMenu.showGroup(contextElementIds[0]);
    }
    this.elementPickerMenu.showMenu();
  }

  private createElementPickerMenu(
    paletteItems: PaletteItem[],
    containerElement: HTMLElement,
    element: Readonly<SModelElement>
  ): ItemPickerMenu {
    const filteredPaletteItems = paletteItems.filter(item => CreateNodeUi.KNOWN_CATEGORIES.includes(item.id));
    const actions = (paletteItem: PaletteItem): Action[] =>
      paletteItem.actions.map(action => this.convertToCreateNodeOperation(action, element.id)).filter(isNotUndefined);
    const hideItemsContaining = ['Start', 'Note'];
    if (element instanceof SConnectableElement && Array.from(element.outgoingEdges).length > 0) {
      hideItemsContaining.push('End');
    }
    const menu = new ItemPickerMenu(
      filteredPaletteItems,
      'create-node-palette-body',
      actions,
      this.onClickElementPickerToolButton,
      this.clearToolOnEscape,
      undefined,
      hideItemsContaining
    );
    menu.createMenuBody(containerElement);
    return menu;
  }

  onClickElementPickerToolButton = (button: HTMLElement, actions: Action[]): void => {
    this.actionDispatcher.dispatchAll(actions);
    button.focus();
  };

  clearToolOnEscape = (event: KeyboardEvent): void => {
    if (matchesKeystroke(event, 'Escape')) {
      this.hide();
    }
  };

  private convertToCreateNodeOperation(action: Action, previousElementId: string): CreateNodeOperation | undefined {
    if (TriggerNodeCreationAction.is(action)) {
      return CreateNodeOperation.create(action.elementTypeId, { args: { previousElementId: previousElementId } });
    }
    return undefined;
  }
}
