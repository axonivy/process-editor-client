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
import { FeedbackCommand, isNotUndefined } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { Action, CommandExecutionContext, CommandReturn, TYPES } from 'sprotty';

import { addSmartActionHandles, isSmartable, removeSmartActionHandles } from './model';

export class ShowSmartActionToolFeedbackAction implements Action {
    constructor(readonly elementId?: string, public readonly kind: string = ShowSmartActionToolFeedbackCommand.KIND) { }
}

export class HideSmartActionToolFeedbackAction implements Action {
    constructor(public readonly kind: string = HideSmartActionToolFeedbackCommand.KIND) { }
}

@injectable()
export class ShowSmartActionToolFeedbackCommand extends FeedbackCommand {
    static readonly KIND = 'showSmartActionToolFeedback';

    @inject(TYPES.Action) protected action: ShowSmartActionToolFeedbackAction;

    execute(context: CommandExecutionContext): CommandReturn {
        const index = context.root.index;
        index
            .all()
            .filter(isSmartable)
            .forEach(removeSmartActionHandles);

        if (isNotUndefined(this.action.elementId)) {
            const resizeElement = index.getById(this.action.elementId);
            if (isNotUndefined(resizeElement) && isSmartable(resizeElement)) {
                addSmartActionHandles(resizeElement);
            }
        }
        return context.root;
    }
}

@injectable()
export class HideSmartActionToolFeedbackCommand extends FeedbackCommand {
    static readonly KIND = 'hideSmartActionToolFeedback';

    @inject(TYPES.Action) protected action: HideSmartActionToolFeedbackAction;

    execute(context: CommandExecutionContext): CommandReturn {
        const index = context.root.index;
        index
            .all()
            .filter(isSmartable)
            .forEach(removeSmartActionHandles);
        return context.root;
    }
}
