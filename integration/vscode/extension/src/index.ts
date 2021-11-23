import 'reflect-metadata';

import * as vscode from 'vscode';

import { activate as extensionActivate } from './ivy-extension';

export function activate(context: vscode.ExtensionContext): Promise<void> {
  return extensionActivate(context);
}
