import { OriginViewportAction } from '@axonivy/process-editor-protocol';
import { Action, CenterAction, FitToScreenAction, GModelElement, KeyListener, matchesKeystroke } from '@eclipse-glsp/client';

export class ViewPortKeyboardListener extends KeyListener {
  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyC', 'ctrlCmd', 'shift')) return [CenterAction.create([])];
    if (matchesKeystroke(event, 'KeyF', 'ctrlCmd', 'shift')) return [FitToScreenAction.create([])];
    if (matchesKeystroke(event, 'KeyO', 'ctrlCmd', 'shift')) return [OriginViewportAction.create()];
    return [];
  }
}
