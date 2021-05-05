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
import { Operation } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Action, IActionDispatcher, IActionHandler, OpenAction, TYPES } from 'sprotty';

export function isInvokeOpenAction(action: Action): action is OpenAction {
    return action.kind === OpenAction.KIND;
}

@injectable()
export class OpenInscriptionActionHandler implements IActionHandler {
    @inject(TYPES.IActionDispatcher) protected dispatcher: IActionDispatcher;
    handle(action: Action): void {
        if (isInvokeOpenAction(action)) {
            this.handleOpen(action.elementId);
        }
    }

    handleOpen(elementId: string): void {
        this.dispatcher.dispatch(new OpenInscriptionOperation(elementId));
    }
}

export class OpenInscriptionOperation implements Operation {
    static readonly KIND = 'openInscription';
    constructor(readonly elementIds: string, public readonly kind: string = OpenInscriptionOperation.KIND) { }
}
