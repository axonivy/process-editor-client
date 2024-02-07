import { GModelFactory, IVNodePostprocessor, ModelRenderer, ModelRendererFactory, TYPES, ViewRegistry } from '@eclipse-glsp/client';
import { createTestDiagramContainer } from '../utils/test-utils';

export const setupViewTestContainer = (modelFactory: any): [ModelRenderer, GModelFactory, any, ViewRegistry] => {
  const container = createTestDiagramContainer();
  const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
  const context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
  const graphFactory = container.get<GModelFactory>(TYPES.IModelFactory);
  const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
  const graph = modelFactory(graphFactory);
  return [context, graphFactory, graph, viewRegistry];
};
