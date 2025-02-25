import {
  defaultModule,
  graphModule,
  type IVNodePostprocessor,
  ModelRenderer,
  type ModelRendererFactory,
  moveModule,
  routingModule,
  selectModule,
  SModelFactory,
  TYPES,
  ViewRegistry
} from '@eclipse-glsp/client';
import { Container } from 'inversify';
import { JSDOM } from 'jsdom';
import ivyDiagramModule from '../diagram/di.config';

global.ResizeObserver = class ResizeObserver {
  [x: string]: any;
  constructor(cb: any) {
    this.cb = cb;
  }
  observe(): void {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve(): null {
    return null;
  }
  disconnect(): null {
    return null;
  }
};

export function setupGlobal(): void {
  const { window } = new JSDOM();
  global.document = window.document;
  global.window = global.document.defaultView!;
}

export const setupViewTestContainer = (modelFactory: any): [ModelRenderer, SModelFactory, any, ViewRegistry] => {
  const container = new Container();
  container.load(defaultModule, selectModule, moveModule, graphModule, routingModule, ivyDiagramModule);
  const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
  const context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
  const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
  const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
  const graph = modelFactory(graphFactory);
  return [context, graphFactory, graph, viewRegistry];
};
