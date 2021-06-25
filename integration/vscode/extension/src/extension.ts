import { GlspDiagramEditorContext } from '@eclipse-glsp/vscode-integration';
import * as vscode from 'vscode';

import { IvyDebugAdapterServerDescriptorFactory } from './debug-adapter-factory';
import { IvyGlspDiagramEditorContext } from './glsp-diagram-editor-context';

let editorContext: GlspDiagramEditorContext;

export function activate(context: vscode.ExtensionContext): void {
  editorContext = new IvyGlspDiagramEditorContext(context);
  const factory = new IvyDebugAdapterServerDescriptorFactory();
  context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('process', factory));
  if ('dispose' in factory) {
    context.subscriptions.push(factory);
  }
}

export function deactivate(): Thenable<void> {
  if (!editorContext) {
    return Promise.resolve(undefined);
  }
  return editorContext.deactivateGLSPClient();
}

