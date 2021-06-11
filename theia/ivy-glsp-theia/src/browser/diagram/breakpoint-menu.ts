import { GLSPCommandHandler, TheiaSprottyContextMenu } from '@eclipse-glsp/theia-integration/lib/browser';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable, interfaces } from 'inversify';

import { AddBreakpointAction } from '../breakpoint/breakpoint-action-handler';

export function registerBreakpointContextMenu(bind: interfaces.Bind): void {
    bind(CommandContribution).to(BreakpointsContribution);
    bind(MenuContribution).to(BreakpointMenuContribution);
}

export namespace BreakpointsCommands {
    export const TOGGLE_BP = 'ivy-toggle-breakpoint';
}

@injectable()
export class BreakpointsContribution implements CommandContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;
    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand({ id: BreakpointsCommands.TOGGLE_BP, label: 'Add/Remove Breakpoint' },
            new GLSPCommandHandler(this.shell, {
                actions: context => [new AddBreakpointAction(context.getSourceUri(), context.selectedElements[0].id)],
                isEnabled: context => context.selectedElements.length > 0
            })
        );
    }
}

@injectable()
export class BreakpointMenuContribution implements MenuContribution {
    static readonly BP = TheiaSprottyContextMenu.CONTEXT_MENU.concat('breakpoint');
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(BreakpointMenuContribution.BP, {
            commandId: BreakpointsCommands.TOGGLE_BP,
            order: '0'
        });
    }
}
