import { IVY_TYPES, ToolBar } from '@axonivy/process-editor';
import { EnableInscriptionAction } from '@axonivy/process-editor-inscription';
import { EnableViewportAction, ShowGridAction, SwitchThemeAction, ThemeMode, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import { EnableToolPaletteAction, GLSPActionDispatcher, IDiagramStartup, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import { IvyDiagramOptions } from './di.config';

import { MonacoUtil } from '@axonivy/inscription-core';
import { MonacoEditorUtil } from '@axonivy/inscription-editor';
import './index.css';

@injectable()
export class EclipseDiagramStartup implements IDiagramStartup {
  @inject(GLSPActionDispatcher)
  protected actionDispatcher: GLSPActionDispatcher;

  @inject(IVY_TYPES.ToolBar)
  protected toolBar: ToolBar;

  @inject(TYPES.IDiagramOptions)
  protected options: IvyDiagramOptions;

  async preRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
    this.actionDispatcher.dispatch(EnableViewportAction.create());
    this.actionDispatcher.dispatch(SwitchThemeAction.create({ theme: this.options.theme }));
  }

  async postRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(ShowGridAction.create({ show: this.options.showGrid }));
    this.actionDispatcher.dispatch(UpdatePaletteItems.create());
  }

  async postModelInitialization(): Promise<void> {
    await this.initMonaco(this.options.theme);
    this.actionDispatcher.dispatch(EnableInscriptionAction.create({}));
  }

  async initMonaco(theme: ThemeMode): Promise<void> {
    const monaco = await import('monaco-editor/esm/vs/editor/editor.api');
    const editorWorker = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
    await MonacoUtil.initStandalone(editorWorker.default);
    await MonacoEditorUtil.configureInstance(monaco, theme);
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup).to(EclipseDiagramStartup).inSingletonScope();
});
