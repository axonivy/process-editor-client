import {
  GLSPClientContribution,
  registerCopyPasteContextMenu,
  registerDiagramLayoutCommands,
  registerDiagramManager,
  registerMarkerNavigationCommands
} from '@eclipse-glsp/theia-integration/lib/browser';
import { ContainerModule, interfaces } from 'inversify';
import { DiagramConfiguration } from 'sprotty-theia';

import { IvyDiagramConfiguration } from './diagram/diagram-configuration';
import { IvyDiagramManager } from './diagram/diagram-manager';
import { IvyGLSPDiagramClient } from './diagram/glsp-diagram-client';
import { registerJumpIntoContextMenu } from './diagram/jump-into-menu';
import { registerWrapToSubContextMenu } from './diagram/wrap-to-sub-menu';
import { IvyGLSPClientContribution } from './language/glsp-client-contribution';

export default new ContainerModule((bind: interfaces.Bind) => {
  bind(IvyGLSPClientContribution).toSelf().inSingletonScope();
  bind(GLSPClientContribution).toService(IvyGLSPClientContribution);
  bind(DiagramConfiguration).to(IvyDiagramConfiguration).inSingletonScope();
  bind(IvyGLSPDiagramClient).toSelf().inSingletonScope();
  registerDiagramManager(bind, IvyDiagramManager);

  // Optional default commands and menus
  registerDiagramLayoutCommands(bind);
  registerCopyPasteContextMenu(bind);
  registerMarkerNavigationCommands(bind);
  registerJumpIntoContextMenu(bind);
  registerWrapToSubContextMenu(bind);
});
