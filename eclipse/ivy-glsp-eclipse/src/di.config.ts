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
import '../css/diagram.css';

import { createIvyDiagramContainer } from '@ivy-glsp/ivy-glsp-client';
import {
    eclipseCopyPasteModule,
    eclipseDeleteModule,
    EclipseGLSPDiagramServer,
    ivyOpenModule,
    keepAliveModule
} from '@ivy-glsp/ivy-glsp-ide';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from 'sprotty';

export default function createContainer(widgetId: string): Container {
    const container = createIvyDiagramContainer(widgetId);
    container.bind(TYPES.ModelSource).to(EclipseGLSPDiagramServer).inSingletonScope();
    container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

    container.load(keepAliveModule);
    container.load(eclipseCopyPasteModule);
    container.load(eclipseDeleteModule);
    container.load(ivyOpenModule);

    return container;
}

