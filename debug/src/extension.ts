import * as vscode from 'vscode';

import { IvyDebugAdapterServerDescriptorFactory } from './debug-adapter-factory';

export function activate(context: vscode.ExtensionContext): void {

    console.log('Congratulations, your extension "debug" is now active!');

    const factory = new IvyDebugAdapterServerDescriptorFactory();

    context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('process', factory));
    if ('dispose' in factory) {
        context.subscriptions.push(factory);
    }
}

export function deactivate() {
    // do nothing
}
