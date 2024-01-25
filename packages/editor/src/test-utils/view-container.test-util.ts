import {
  GModelFactory,
  IVNodePostprocessor,
  ModelRenderer,
  ModelRendererFactory,
  TYPES,
  ViewRegistry,
  initializeDiagramContainer
} from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyDiagramModule from '../diagram/di.config';

export const setupViewTestContainer = (modelFactory: any): [ModelRenderer, GModelFactory, any, ViewRegistry] => {
  const container = initializeDiagramContainer(new Container(), ivyDiagramModule);
  const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
  const context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
  const graphFactory = container.get<GModelFactory>(TYPES.IModelFactory);
  const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
  const graph = modelFactory(graphFactory);
  return [context, graphFactory, graph, viewRegistry];
};
