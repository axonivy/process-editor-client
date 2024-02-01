import { IVY_TYPES, ToolBar } from '@axonivy/process-editor';
import { EnableViewportAction, MoveIntoViewportAction, SetViewportZoomAction, SwitchThemeAction } from '@axonivy/process-editor-protocol';
import {
  Action,
  CenterAction,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  IDiagramStartup,
  NavigationTarget,
  RequestTypeHintsAction,
  SelectAction,
  TYPES
} from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import { IvyDiagramOptions } from './di.config';
import { isInPreviewMode, isInViewerMode } from './url-helper';

@injectable()
export class ViewerDiagramStartup implements IDiagramStartup {
  @inject(GLSPActionDispatcher)
  protected actionDispatcher: GLSPActionDispatcher;

  @inject(IVY_TYPES.ToolBar)
  protected toolBar: ToolBar;

  @inject(TYPES.IDiagramOptions)
  protected options: IvyDiagramOptions;

  async postRequestModel(): Promise<void> {
    return this.actionDispatcher.dispatch(RequestTypeHintsAction.create());
  }

  async postModelInitialization(): Promise<void> {
    if (!isInViewerMode() && !isInPreviewMode()) {
      return this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
    }
    if (!isInPreviewMode()) {
      return this.actionDispatcher.dispatch(EnableViewportAction.create());
    }
  }

  protected async dispatchAfterModelInitialized(dispatcher: GLSPActionDispatcher): Promise<void> {
    const actions: Action[] = [];
    if (this.isNumeric(this.options.zoom)) {
      actions.push(SetViewportZoomAction.create({ zoom: +this.options.zoom / 100 }));
      actions.push(...this.showElement((ids: string[]) => CenterAction.create(ids, { animate: false, retainZoom: true })));
    } else {
      actions.push(
        ...this.showElement((ids: string[]) => MoveIntoViewportAction.create({ elementIds: ids, animate: false, retainZoom: true }))
      );
    }
    actions.push(SwitchThemeAction.create({ theme: this.options.theme }));
    return dispatcher.onceModelInitialized().finally(() => dispatcher.dispatchAll(actions));
  }

  protected showElement(action: (elementIds: string[]) => Action): Action[] {
    if (this.options.highlight) {
      return [action([this.options.highlight])];
    }
    if (this.options.selectElementIds) {
      const elementIds = this.options.selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
      return [SelectAction.create({ selectedElementsIDs: elementIds }), action(elementIds)];
    }
    return [];
  }

  protected isNumeric(num: any): boolean {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup).to(ViewerDiagramStartup).inSingletonScope();
});
