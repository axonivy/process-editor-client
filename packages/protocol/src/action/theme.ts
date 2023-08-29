import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export interface SwitchThemeAction extends Action {
  kind: typeof SwitchThemeAction.KIND;
  theme: string;
}

export namespace SwitchThemeAction {
  export const KIND = 'switchTheme';

  export function is(object: any): object is SwitchThemeAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'theme');
  }

  export function create(options: { theme: string }): SwitchThemeAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
