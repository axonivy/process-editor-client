/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
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
import { configureCommand, configureView, GLSP_TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { SSmartActionHandle } from './model';
import { SmartActionService } from './smart-action';
import { SelectSmartFeedbackCommand } from './smart-action-feedback-action';
import { SSmartActionHandleView } from './view';

const ivySmartActionModule = new ContainerModule((bind, _unbind, isBound) => {
    bind(GLSP_TYPES.SelectionListener).to(SmartActionService);
    configureCommand({ bind, isBound }, SelectSmartFeedbackCommand);
    configureView({ bind, isBound }, SSmartActionHandle.TYPE, SSmartActionHandleView);
});

export default ivySmartActionModule;
