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
import '../../../css/diagram.css';
import 'sprotty-theia/css/theia-sprotty.css';

import { ExternalModelSourceChangedHandler, ExternalNavigateToTargetHandler, TYPES } from '@eclipse-glsp/client';
import { GLSPTheiaDiagramServer } from '@eclipse-glsp/theia-integration/lib/browser';
import {
    connectTheiaContextMenuService,
    TheiaContextMenuServiceFactory
} from '@eclipse-glsp/theia-integration/lib/browser/diagram/glsp-theia-context-menu-service';
import {
    connectTheiaMarkerManager,
    TheiaMarkerManager,
    TheiaMarkerManagerFactory
} from '@eclipse-glsp/theia-integration/lib/browser/diagram/glsp-theia-marker-manager';
import {
    TheiaModelSourceChangedHandler
} from '@eclipse-glsp/theia-integration/lib/browser/theia-model-source-changed-handler';
import { TheiaNavigateToTargetHandler } from '@eclipse-glsp/theia-integration/lib/browser/theia-navigate-to-target-handler';
import { createIvyDiagramContainer } from '@ivy-glsp/ivy-glsp-client';
import { SelectionService } from '@theia/core';
import creatBreakpointContainer from '@theia/debug/lib/browser/debug-frontend-module';
import { Container, inject, injectable } from 'inversify';
import { DiagramConfiguration, TheiaSprottySelectionForwarder } from 'sprotty-theia';
import { TheiaContextMenuService } from 'sprotty-theia/lib/sprotty/theia-sprotty-context-menu-service';

import { IvyProcessLanguage as IvyProcessLanguage } from '../../common/ivy-process-language';
import breakpointModule from '../breakpoint/di.config';

@injectable()
export class IvyDiagramConfiguration implements DiagramConfiguration {

    @inject(SelectionService) protected selectionService: SelectionService;
    @inject(TheiaNavigateToTargetHandler) protected navigateToTargetHandler: TheiaNavigateToTargetHandler;
    @inject(TheiaModelSourceChangedHandler) protected modelSourceChangedHandler: TheiaModelSourceChangedHandler;
    @inject(TheiaContextMenuServiceFactory) protected readonly contextMenuServiceFactory: () => TheiaContextMenuService;
    @inject(TheiaMarkerManagerFactory) protected readonly theiaMarkerManager: () => TheiaMarkerManager;

    diagramType: string = IvyProcessLanguage.DiagramType;

    createContainer(widgetId: string): Container {
        const container = createIvyDiagramContainer(widgetId);
        container.bind(TYPES.ModelSource).to(GLSPTheiaDiagramServer).inSingletonScope();
        // container.bind(TheiaDiagramServer).toService(IvyDiagramConfiguration);
        container.bind(TYPES.IActionHandlerInitializer).to(TheiaSprottySelectionForwarder);
        container.bind(SelectionService).toConstantValue(this.selectionService);
        container.bind(ExternalNavigateToTargetHandler).toConstantValue(this.navigateToTargetHandler);
        container.bind(ExternalModelSourceChangedHandler).toConstantValue(this.modelSourceChangedHandler);
        // container.rebind(CommandPalette).to(TheiaCommandPalette);
        connectTheiaContextMenuService(container, this.contextMenuServiceFactory);
        connectTheiaMarkerManager(container, this.theiaMarkerManager, this.diagramType);
        container.load(creatBreakpointContainer, breakpointModule);
        return container;
    }
}
