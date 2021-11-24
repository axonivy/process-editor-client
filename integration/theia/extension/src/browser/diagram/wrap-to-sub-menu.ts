import { GLSPCommandHandler, TheiaSprottyContextMenu } from '@eclipse-glsp/theia-integration';
import { WrapToSubOperation } from '@ivyteam/process-editor';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

export function registerWrapToSubContextMenu(bind: interfaces.Bind): void {
  bind(CommandContribution).to(WrapToSubContribution);
  bind(MenuContribution).to(WrapToSubMenuContribution);
}

export namespace WrapToSubCommands {
  export const WRAP = 'ivy-wrap-to-sub';
}

@injectable()
export class WrapToSubContribution implements CommandContribution {
  @inject(ApplicationShell) protected readonly shell: ApplicationShell;
  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(
      { id: WrapToSubCommands.WRAP, label: 'Wrap' },
      new GLSPCommandHandler(this.shell, {
        actions: context => [new WrapToSubOperation(context.selectedElements.map(e => e.id))],
        isEnabled: context => context.selectedElements.length > 0
      })
    );
  }
}

@injectable()
export class WrapToSubMenuContribution implements MenuContribution {
  static readonly JUMP = TheiaSprottyContextMenu.CONTEXT_MENU.concat('wrap');
  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(WrapToSubMenuContribution.JUMP, {
      commandId: WrapToSubCommands.WRAP,
      order: '0'
    });
  }
}
