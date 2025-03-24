import {
  AccessibleKeyShortcutTool,
  ElementNavigatorKeyListener,
  ElementNavigatorTool,
  EnableDefaultToolsAction,
  EnableToolsAction,
  GModelElement,
  SearchAutocompletePaletteTool,
  SetAccessibleKeyShortcutAction,
  ShowToastMessageAction
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';

@injectable()
export class IvyElementNavigatorTool extends ElementNavigatorTool {
  protected elementNavigatorKeyListener: ElementNavigatorKeyListener = new IvyElementNavigatorKeyListener(this);
}

enum NavigationMode {
  DEFAULT = 'default',
  POSITION = 'position',
  NONE = 'none'
}

class IvyElementNavigatorKeyListener extends ElementNavigatorKeyListener {
  override registerShortcutKey(): void {
    this.tool.actionDispatcher.dispatchOnceModelInitialized(
      SetAccessibleKeyShortcutAction.create({
        token: this.token,
        keys: [
          { shortcuts: ['N'], description: t('a11y.hotkeyDesc.navigationActivate'), group: t('a11y.hotkeyGroup.navigation'), position: 0 },
          {
            shortcuts: ['ALT', 'N'],
            description: t('a11y.hotkeyDesc.navigationActivatePosition'),
            group: t('a11y.hotkeyGroup.navigation'),
            position: 1
          },
          {
            shortcuts: ['← ↑ → ↓'],
            description: t('a11y.hotkeyDesc.navigation'),
            group: t('a11y.hotkeyGroup.navigation'),
            position: 2
          }
        ]
      })
    );
  }

  protected resetOnEscape(event: KeyboardEvent, element: GModelElement): void {
    if (this.mode !== NavigationMode.NONE && this.matchesDeactivateNavigationMode(event)) {
      this.navigator?.clean?.(element.root);
      this.clean();

      if (this.mode === NavigationMode.POSITION) {
        this.tool.actionDispatcher.dispatchAll([
          EnableDefaultToolsAction.create(),
          ShowToastMessageAction.createWithTimeout({
            id: Symbol.for(ElementNavigatorKeyListener.name),
            message: t('a11y.navigation.offPosition')
          })
        ]);
      } else if (this.mode === NavigationMode.DEFAULT) {
        this.tool.actionDispatcher.dispatchAll([
          EnableDefaultToolsAction.create(),
          ShowToastMessageAction.createWithTimeout({
            id: Symbol.for(ElementNavigatorKeyListener.name),
            message: t('a11y.navigation.off')
          })
        ]);
      }

      this.mode = NavigationMode.NONE;
    }
  }

  protected override triggerDefaultNavigationOnEvent(event: KeyboardEvent, element: GModelElement): boolean {
    if (this.matchesActivateDefaultNavigation(event)) {
      if (this.mode !== NavigationMode.DEFAULT) {
        this.clean();

        this.tool.actionDispatcher.dispatchAll([
          EnableToolsAction.create([ElementNavigatorTool.ID, SearchAutocompletePaletteTool.ID, AccessibleKeyShortcutTool.ID]),
          ShowToastMessageAction.create({
            id: Symbol.for(ElementNavigatorKeyListener.name),
            message: t('a11y.navigation.on')
          })
        ]);
        this.navigator = this.tool.localElementNavigator;
        this.mode = NavigationMode.DEFAULT;
      } else {
        this.resetDefaultNavigationOnEvent(event, element);
      }
      return true;
    }
    return false;
  }

  protected resetDefaultNavigationOnEvent(event: KeyboardEvent, element: GModelElement): void {
    if (this.mode === NavigationMode.DEFAULT && this.matchesActivateDefaultNavigation(event)) {
      this.navigator?.clean?.(element.root);
      this.clean();
      this.mode = NavigationMode.NONE;
      this.tool.actionDispatcher.dispatchAll([
        EnableDefaultToolsAction.create(),
        ShowToastMessageAction.createWithTimeout({
          id: Symbol.for(ElementNavigatorKeyListener.name),
          message: t('a11y.navigation.off')
        })
      ]);
    }
  }

  protected override triggerPositionNavigationOnEvent(event: KeyboardEvent, element: GModelElement): boolean {
    if (this.matchesActivatePositionNavigation(event)) {
      if (this.mode !== NavigationMode.POSITION) {
        this.clean();
        this.tool.actionDispatcher.dispatchAll([
          EnableToolsAction.create([ElementNavigatorTool.ID, SearchAutocompletePaletteTool.ID, AccessibleKeyShortcutTool.ID]),
          ShowToastMessageAction.create({
            id: Symbol.for(ElementNavigatorKeyListener.name),
            message: t('a11y.navigation.onPosition')
          })
        ]);
        this.navigator = this.tool.elementNavigator;
        this.mode = NavigationMode.POSITION;
      } else {
        this.resetPositionNavigationOnEvent(event, element);
      }
      return true;
    }
    return false;
  }

  protected resetPositionNavigationOnEvent(event: KeyboardEvent, element: GModelElement): void {
    if (this.mode === NavigationMode.POSITION && this.matchesActivatePositionNavigation(event)) {
      this.navigator?.clean?.(element.root);
      this.clean();
      this.mode = NavigationMode.NONE;
      this.tool.actionDispatcher.dispatchAll([
        EnableDefaultToolsAction.create(),
        ShowToastMessageAction.createWithTimeout({
          id: Symbol.for(ElementNavigatorKeyListener.name),
          message: t('a11y.navigation.offPosition')
        })
      ]);
    }
  }
}
