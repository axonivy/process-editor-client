import {
  DelKeyDeleteTool,
  EdgeCreationTool,
  EdgeEditTool,
  TYPES,
  MouseDeleteTool,
  configureActionHandler,
  configureView
} from '@eclipse-glsp/client';
import { configureMarqueeTool } from '@eclipse-glsp/client/lib/features/tools/di.config';

import { TriggerEdgeCreationAction, TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { ContainerModule } from 'inversify';
import { IvyChangeBoundsTool } from './change-bounds-tool';
import { IvyMovementRestrictor } from './movement-restrictor';
import { NegativeMarker } from './negative-area/model';
import { SNegativeMarkerView } from './negative-area/view';
import { IvyNodeCreationTool } from './node-creation-tool';

const ivyToolsModule = new ContainerModule((bind, _unbind, isBound) => {
  // Register default tools
  bind(TYPES.IDefaultTool).to(IvyChangeBoundsTool);
  bind(TYPES.IDefaultTool).to(EdgeEditTool);
  bind(TYPES.IDefaultTool).to(DelKeyDeleteTool);

  // Register  tools
  bind(TYPES.ITool).to(MouseDeleteTool);
  bind(IvyNodeCreationTool).toSelf().inSingletonScope();
  bind(EdgeCreationTool).toSelf().inSingletonScope();
  bind(TYPES.ITool).toService(EdgeCreationTool);
  bind(TYPES.ITool).toService(IvyNodeCreationTool);
  bind(TYPES.IMovementRestrictor).to(IvyMovementRestrictor);

  configureMarqueeTool({ bind, isBound });
  configureActionHandler({ bind, isBound }, TriggerNodeCreationAction.KIND, IvyNodeCreationTool);
  configureActionHandler({ bind, isBound }, TriggerEdgeCreationAction.KIND, EdgeCreationTool);

  configureView({ bind, isBound }, NegativeMarker.TYPE, SNegativeMarkerView);
});

export default ivyToolsModule;
