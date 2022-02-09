import { DelKeyDeleteTool, EdgeCreationTool, EdgeEditTool, GLSP_TYPES, MouseDeleteTool, NodeCreationTool } from '@eclipse-glsp/client';
import { configureMarqueeTool } from '@eclipse-glsp/client/lib/features/tools/di.config';

import { TriggerEdgeCreationAction, TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { ContainerModule } from 'inversify';
import { configureActionHandler } from 'sprotty';
import { IvyChangeBoundsTool } from './change-bounds-tool';

const ivyToolsModule = new ContainerModule((bind, _unbind, isBound) => {
  // Register default tools
  bind(GLSP_TYPES.IDefaultTool).to(IvyChangeBoundsTool);
  bind(GLSP_TYPES.IDefaultTool).to(EdgeEditTool);
  bind(GLSP_TYPES.IDefaultTool).to(DelKeyDeleteTool);

  // Register  tools
  bind(GLSP_TYPES.ITool).to(MouseDeleteTool);
  bind(NodeCreationTool).toSelf().inSingletonScope();
  bind(EdgeCreationTool).toSelf().inSingletonScope();
  bind(GLSP_TYPES.ITool).toService(EdgeCreationTool);
  bind(GLSP_TYPES.ITool).toService(NodeCreationTool);

  configureMarqueeTool({ bind, isBound });
  configureActionHandler({ bind, isBound }, TriggerNodeCreationAction.KIND, NodeCreationTool);
  configureActionHandler({ bind, isBound }, TriggerEdgeCreationAction.KIND, EdgeCreationTool);
});

export default ivyToolsModule;
