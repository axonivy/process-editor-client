/********************************************************************************
 * Copyright (c) 2019-2020 EclipseSource and others.
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
import { inject, injectable } from 'inversify';
import { Command, CommandExecutionContext, SelectCommand as SprottySelectCommand, SModelRoot, TYPES } from 'sprotty';

export class SelectSmartFeedbackAction {
    constructor(
        public readonly selectedElementsIDs: string[] = [],
        public readonly deselectedElementsIDs: string[] = [],
        public readonly kind: string = SelectSmartFeedbackCommand.KIND) {
    }
}

@injectable()
export class SelectSmartFeedbackCommand extends Command {
    static readonly KIND = 'elementSelectedSmartFeedback';
    private sprottySelectCommand: SprottySelectCommand;

    constructor(@inject(TYPES.Action) public action: SelectSmartFeedbackAction) {
        super();
        this.sprottySelectCommand = new SprottySelectCommand(action);
    }

    execute(context: CommandExecutionContext): SModelRoot {
        return this.sprottySelectCommand.execute(context);
    }

    undo(context: CommandExecutionContext): SModelRoot {
        return this.sprottySelectCommand.undo(context);
    }

    redo(context: CommandExecutionContext): SModelRoot {
        return this.sprottySelectCommand.redo(context);
    }
}
