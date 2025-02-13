import {
  AccessibleKeyShortcutTool,
  ElementNavigatorKeyListener,
  ElementNavigatorTool,
  EnableToolsAction,
  GModelElement,
  SearchAutocompletePaletteTool,
  ShowToastMessageAction
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyElementNavigatorTool extends ElementNavigatorTool {
  protected elementNavigatorKeyListener: ElementNavigatorKeyListener = new IvyElementNavigatorKeyListener(this);
}

enum NavigationMode {
  DEFAULT = 'default',
  POSITION = 'position'
}

class IvyElementNavigatorKeyListener extends ElementNavigatorKeyListener {
  protected triggerDefaultNavigationOnEvent(event: KeyboardEvent, element: GModelElement): boolean {
    if (this.matchesActivateDefaultNavigation(event)) {
      if (this.mode !== NavigationMode.DEFAULT) {
        this.clean();

        this.tool.actionDispatcher.dispatchAll([
          EnableToolsAction.create([ElementNavigatorTool.ID, SearchAutocompletePaletteTool.ID, AccessibleKeyShortcutTool.ID]),
          ShowToastMessageAction.create({
            id: Symbol.for(ElementNavigatorKeyListener.name),
            message:
              "Navigation On: Use arrow keys to select preceding (←) or succeding (→) elements. Use the up (↑) and down (↓) arrows to navigate paths. Press 'ESC' to exit."
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

  protected triggerPositionNavigationOnEvent(event: KeyboardEvent, element: GModelElement): boolean {
    if (this.matchesActivatePositionNavigation(event)) {
      if (this.mode !== NavigationMode.POSITION) {
        this.clean();
        this.tool.actionDispatcher.dispatchAll([
          EnableToolsAction.create([ElementNavigatorTool.ID, SearchAutocompletePaletteTool.ID, AccessibleKeyShortcutTool.ID]),
          ShowToastMessageAction.create({
            id: Symbol.for(ElementNavigatorKeyListener.name),
            message:
              "Position based Navigation On: Navigate nearest elements using arrow keys: (↑) for above, (↓) for below, (←) for previous, (→) for next element. Press 'ESC' to exit."
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
}
