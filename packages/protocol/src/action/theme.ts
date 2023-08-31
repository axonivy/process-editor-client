import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export type ThemeMode = 'dark' | 'light';

export interface SwitchThemeAction extends Action {
  kind: typeof SwitchThemeAction.KIND;
  theme: ThemeMode;
}

export namespace SwitchThemeAction {
  export const KIND = 'switchTheme';

  export function is(object: any): object is SwitchThemeAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'theme');
  }

  export function create(options: { theme: ThemeMode }): SwitchThemeAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
