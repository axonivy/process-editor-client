import { EnableInscriptionAction } from '@axonivy/process-editor-inscription';
import { EnableViewportAction, SwitchThemeAction, ThemeMode, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import {
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  IDiagramStartup,
  NavigationTarget,
  SelectAction,
  TYPES
} from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import { IvyDiagramOptions } from './di.config';

import { MonacoUtil } from '@axonivy/inscription-core';
import { MonacoEditorUtil } from '@axonivy/inscription-editor';
import './index.css';

@injectable()
export class StandaloneDiagramStartup implements IDiagramStartup {
  @inject(GLSPActionDispatcher)
  protected actionDispatcher: GLSPActionDispatcher;

  @inject(TYPES.IDiagramOptions)
  protected options: IvyDiagramOptions;

  async preRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
    this.actionDispatcher.dispatch(EnableViewportAction.create());
    this.actionDispatcher.dispatch(SwitchThemeAction.create({ theme: this.options.theme }));
  }

  async postRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(UpdatePaletteItems.create());
  }

  async postModelInitialization(): Promise<void> {
    await this.initMonaco(this.options.theme);
    this.actionDispatcher.dispatch(
      EnableInscriptionAction.create({
        connection: { server: this.options.inscriptionContext.server },
        inscriptionContext: this.options.inscriptionContext
      })
    );
    if (this.options.select) {
      const elementIds = this.options.select.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
      this.actionDispatcher.dispatch(SelectAction.create({ selectedElementsIDs: elementIds }));
    }
  }

  async initMonaco(theme: ThemeMode): Promise<void> {
    const monaco = await import('monaco-editor/esm/vs/editor/editor.api');
    const editorWorker = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
    await MonacoUtil.initStandalone(editorWorker.default);
    await MonacoEditorUtil.configureInstance(monaco, theme);
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup).to(StandaloneDiagramStartup).inSingletonScope();
});
