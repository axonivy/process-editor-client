/* eslint-disable import/no-unresolved */
import {
    Action,
    GLSP_TYPES,
    IActionDispatcher,
    IActionHandler,
    IFeedbackActionDispatcher,
    TYPES
} from '@eclipse-glsp/client';
import URI from '@theia/core/lib/common/uri';
import { BreakpointManager } from '@theia/debug/lib/browser/breakpoint/breakpoint-manager';
import { SourceBreakpoint } from '@theia/debug/lib/browser/breakpoint/breakpoint-marker';
import { inject, injectable } from 'inversify';

// import * as vscode from 'vscode';

export class AddBreakpointAction implements Action {
    static readonly KIND = 'addBreakpoint';
    kind = AddBreakpointAction.KIND;

    constructor(public readonly sourceUri: Promise<string | undefined>, public readonly elementsID: string) { }
}

@injectable()
export class BreakpointActionHandler implements IActionHandler {

    @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
    @inject(BreakpointManager) protected readonly breakpointManager: BreakpointManager;

    handle(action: Action): Action | void {
        console.log('action');
        if (isAddBreakpointAction(action)) {
            this.addBreakpoint(action.sourceUri, action.elementsID);
        }
    }

    async addBreakpoint(sourceUri: Promise<string | undefined>, elementId: string): Promise<void> {
        const source: string = await sourceUri ?? '';
        // const uri = vscode.Uri.parse(source);
        // const range = new vscode.Range(1, 0, 1, 0);
        // const location = new vscode.Location(uri, range);
        // const bp = new vscode.SourceBreakpoint(location, true);
        console.log(source);
        const bp2 = SourceBreakpoint.create(new URI(source), { line: 0 });
        console.log(bp2);
        this.breakpointManager.addBreakpoint(bp2);
        // vscode.debug.addBreakpoints([bp]);
    }

}

export function isAddBreakpointAction(action: Action): action is AddBreakpointAction {
    return action !== undefined && (action.kind === AddBreakpointAction.KIND)
        && (action as AddBreakpointAction).elementsID !== undefined;
}
