import { Action } from '@eclipse-glsp/client';
import { BreakpointAction, isBreakpointAction } from '@ivyteam/process-editor/lib/breakpoint/breakpoint';
import { ShowBreakpointAction } from '@ivyteam/process-editor/lib/breakpoint/show-breakpoint-action-handler';
import { injectable } from 'inversify';
import * as vscode from 'vscode';

import { ExtensionActionHandler } from '../../../packages/vscode-integration/lib';
import { IvyWebView } from '../ivy-webview';

@injectable()
export class BreakpointActionHandler implements ExtensionActionHandler {

    readonly kinds: string[] = [BreakpointAction.KIND];

    constructor(private readonly webview: IvyWebView) { }

    private breakpoints: Map<string, vscode.Breakpoint> = new Map();

    async handleAction(action: Action): Promise<boolean> {
        if (isBreakpointAction(action)) {
            const elementId = action.elementId;
            if (this.breakpoints.has(elementId)) {
                this.removeBreakpoint(elementId);
            } else {
                this.addBreakpoint(elementId);
            }
            this.webview.dispatch(new ShowBreakpointAction(Array.from(this.breakpoints.keys())));
        }
        return true;
    }

    private removeBreakpoint(elementId: string): void {
        vscode.window.showInformationMessage(`remove breakpoint for element: ${elementId}`);
        const bp = this.breakpoints.get(elementId);
        if (bp) {
            vscode.debug.removeBreakpoints([bp]);
        }
        this.breakpoints.delete(elementId);
    }

    private addBreakpoint(elementId: string): void {
        vscode.window.showInformationMessage(`add breakpoint for element: ${elementId}`);
        const bp = this.toBreakpoint(elementId);
        vscode.debug.addBreakpoints([bp]);
        this.breakpoints.set(elementId, bp);
    }

    private toBreakpoint(elementId: string): vscode.Breakpoint {
        const line = Number(elementId.split('-f')[1]);
        const uri = vscode.Uri.parse(this.webview.editorUri);
        const position = new vscode.Position(line - 1, 0);
        const location = new vscode.Location(uri, position);
        return new vscode.SourceBreakpoint(location, true);
    }

}
