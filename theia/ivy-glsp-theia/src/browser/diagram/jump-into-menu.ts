import { GLSPCommandHandler, TheiaSprottyContextMenu } from '@eclipse-glsp/theia-integration/lib/browser';
import { JumpOperation } from '@ivy-glsp/ivy-glsp-client/lib/embedded/jump-operation';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable, interfaces } from 'inversify';

export function registerJumpIntoContextMenu(bind: interfaces.Bind) {
    bind(CommandContribution).to(JumpIntoCommandContribution);
    bind(MenuContribution).to(JumpIntoMenuContribution);
}

export namespace JumpIntoNavigationCommands {
    export const JUMP_INTO = 'ivy-jump-into';
    export const JUMP_OUT = 'ivy-jump-out';
}

@injectable()
export class JumpIntoCommandContribution implements CommandContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;
    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand({ id: JumpIntoNavigationCommands.JUMP_INTO, label: 'Jump into' },
            new GLSPCommandHandler(this.shell, {
                actions: context => [new JumpOperation(context.selectedElements[0].id)],
                isEnabled: context => context.selectedElements.filter(() => true).length === 1
            })
        );
        commands.registerCommand({ id: JumpIntoNavigationCommands.JUMP_OUT, label: 'Jump out' },
            new GLSPCommandHandler(this.shell, {
                actions: context => [new JumpOperation('')],
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
