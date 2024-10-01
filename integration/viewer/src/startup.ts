import { EnableViewportAction, MoveIntoViewportAction, SetViewportZoomAction, SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { Action, CenterAction, GLSPActionDispatcher, IDiagramStartup, NavigationTarget, SelectAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable, interfaces } from 'inversify';
import { IvyDiagramOptions } from './di.config';
import { isInPreviewMode } from './url-helper';

const ContainerSymbol = Symbol('ContainerSymbol');

@injectable()
export class ViewerDiagramStartup implements IDiagramStartup {
  @inject(GLSPActionDispatcher)
  protected actionDispatcher: GLSPActionDispatcher;

  @inject(TYPES.IDiagramOptions)
  protected options: IvyDiagramOptions;

  @inject(ContainerSymbol)
  protected container: interfaces.Container;

  async postModelInitialization(): Promise<void> {
    this.actionDispatcher.dispatch(SwitchThemeAction.create({ theme: this.options.theme }));
    if (this.isNumeric(this.options.zoom)) {
      this.actionDispatcher.dispatch(SetViewportZoomAction.create({ zoom: +this.options.zoom / 100 }));
      this.showElement((ids: string[]) => CenterAction.create(ids, { animate: false, retainZoom: true }));
    } else {
      this.showElement((ids: string[]) => MoveIntoViewportAction.create({ elementIds: ids, animate: false, retainZoom: true }));
    }
    if (!isInPreviewMode()) {
      this.actionDispatcher.dispatch(EnableViewportAction.create());
    }
  }

  protected showElement(action: (elementIds: string[]) => Action) {
    if (this.options.highlight) {
      this.actionDispatcher.dispatch(action([this.options.highlight]));
    }
    if (this.options.select) {
      const elementIds = this.options.select.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
      this.actionDispatcher.dispatch(SelectAction.create({ selectedElementsIDs: elementIds }));
      this.actionDispatcher.dispatch(action(elementIds));
    }
  }

  protected isNumeric(num: any): boolean {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup)
    .toDynamicValue(ctx => {
      const child = ctx.container.createChild();
      child.bind(ViewerDiagramStartup).toSelf().inSingletonScope();
      child.bind(ContainerSymbol).toConstantValue(ctx.container);
      return child.get(ViewerDiagramStartup);
    })
    .inSingletonScope();
});
