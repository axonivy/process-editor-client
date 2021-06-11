/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    GLSPClientContribution,
    registerCopyPasteContextMenu,
    registerDiagramLayoutCommands,
    registerDiagramManager,
    registerMarkerNavigationCommands
} from '@eclipse-glsp/theia-integration/lib/browser';
import { ContainerModule, interfaces } from 'inversify';
import { DiagramConfiguration } from 'sprotty-theia';

import { registerBreakpointContextMenu } from './diagram/breakpoint-menu';
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
    registerBreakpointContextMenu(bind);
});
