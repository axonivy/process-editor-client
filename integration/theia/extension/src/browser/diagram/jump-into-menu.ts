import { DiagramKeybindingContext, GLSPCommandHandler, TheiaSprottyContextMenu } from '@eclipse-glsp/theia-integration';
import { JumpAction, jumpFeature } from '@ivyteam/process-editor';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell, KeybindingContribution, KeybindingRegistry } from '@theia/core/lib/browser';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

export function registerJumpIntoContextMenu(bind: interfaces.Bind): void {
  bind(CommandContribution).to(JumpIntoCommandContribution);
  bind(MenuContribution).to(JumpIntoMenuContribution);
  bind(KeybindingContribution).to(JumpIntoKeybindingContribution);
}

export namespace JumpIntoNavigationCommands {
  export const JUMP_INTO = 'ivy-jump-into';
  export const JUMP_OUT = 'ivy-jump-out';
}

@injectable()
export class JumpIntoCommandContribution implements CommandContribution {
  @inject(ApplicationShell) protected readonly shell: ApplicationShell;
  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(
      { id: JumpIntoNavigationCommands.JUMP_INTO, label: 'Jump into' },
      new GLSPCommandHandler(this.shell, {
        actions: context => [JumpAction.create({ elementId: context.selectedElements[0].id })],
        isEnabled: context => context.selectedElements[0]?.hasFeature(jumpFeature)
      })
    );
    commands.registerCommand(
      { id: JumpIntoNavigationCommands.JUMP_OUT, label: 'Jump out' },
      new GLSPCommandHandler(this.shell, {
        actions: context => [JumpAction.create({ elementId: '' })],
        isEnabled: context => context.modelRoot.id.includes('-')
      })
    );
  }
}

@injectable()
export class JumpIntoMenuContribution implements MenuContribution {
  static readonly JUMP = TheiaSprottyContextMenu.CONTEXT_MENU.concat('jump');
  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(JumpIntoMenuContribution.JUMP, {
      commandId: JumpIntoNavigationCommands.JUMP_INTO,
      order: '0'
    });
    menus.registerMenuAction(JumpIntoMenuContribution.JUMP, {
      commandId: JumpIntoNavigationCommands.JUMP_OUT,
      order: '1'
    });
  }
}

@injectable()
export class JumpIntoKeybindingContribution implements KeybindingContribution {
  @inject(DiagramKeybindingContext) protected readonly diagramKeybindingContext: DiagramKeybindingContext;

  registerKeybindings(keybindings: KeybindingRegistry): void {
    keybindings.registerKeybinding({
      command: JumpIntoNavigationCommands.JUMP_INTO,
      context: this.diagramKeybindingContext.id,
      keybinding: 'j'
    });
    keybindings.registerKeybinding({
      command: JumpIntoNavigationCommands.JUMP_OUT,
      context: this.diagramKeybindingContext.id,
      keybinding: 'shift+j'
    });
  }
}
