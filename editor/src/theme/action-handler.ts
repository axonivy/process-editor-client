import { Action, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { SwitchThemeAction } from './action';

@injectable()
export class SwitchThemeActionHandler implements IActionHandler {
  theme(): string {
    return document.documentElement.dataset.theme ?? SwitchThemeActionHandler.prefsColorScheme();
  }

  handle(action: Action): void | Action | ICommand {
    if (SwitchThemeAction.is(action)) {
      document.documentElement.dataset.theme = action.theme;
    }
  }

  static prefsColorScheme(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
