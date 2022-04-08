import { DelKeyDeleteTool, EdgeCreationTool, EdgeEditTool, GLSP_TYPES, MouseDeleteTool } from '@eclipse-glsp/client';
import { configureMarqueeTool } from '@eclipse-glsp/client/lib/features/tools/di.config';

import { TriggerEdgeCreationAction, TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { ContainerModule } from 'inversify';
import { configureActionHandler } from 'sprotty';
import { IvyChangeBoundsTool } from './change-bounds-tool';
import { IvyMovementRestrictor } from './movement-restrictor';
import { IvyNodeCreationTool } from './node-creation-tool';

const ivyToolsModule = new ContainerModule((bind, _unbind, isBound) => {
  // Register default tools
  bind(GLSP_TYPES.IDefaultTool).to(IvyChangeBoundsTool);
  bind(GLSP_TYPES.IDefaultTool).to(EdgeEditTool);
  bind(GLSP_TYPES.IDefaultTool).to(DelKeyDeleteTool);

  // Register  tools
  bind(GLSP_TYPES.ITool).to(MouseDeleteTool);
  bind(IvyNodeCreationTool).toSelf().inSingletonScope();
  bind(EdgeCreationTool).toSelf().inSingletonScope();
  bind(GLSP_TYPES.ITool).toService(EdgeCreationTool);
  bind(GLSP_TYPES.ITool).toService(IvyNodeCreationTool);
  bind(GLSP_TYPES.IMovementRestrictor).to(IvyMovementRestrictor);

  configureMarqueeTool({ bind, isBound });
  configureActionHandler({ bind, isBound }, TriggerNodeCreationAction.KIND, IvyNodeCreationTool);
  configureActionHandler({ bind, isBound }, TriggerEdgeCreationAction.KIND, EdgeCreationTool);
});

export default ivyToolsModule;
