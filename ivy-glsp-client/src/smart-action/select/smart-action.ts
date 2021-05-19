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
import {
    CursorCSS,
    cursorFeedbackAction,
    findParentByFeature,
    GLSP_TYPES,
    IActionDispatcher,
    IFeedbackActionDispatcher,
    isBoundsAwareMoveable,
    isSelected,
    SModelElement
} from '@eclipse-glsp/client';
import { SelectionListener } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable } from 'inversify';
import { ILogger, SModelRoot, TYPES } from 'sprotty';

import { SSmartActionHandle } from './model';
import { HideSmartActionToolFeedbackAction, ShowSmartActionToolFeedbackAction } from './smart-action-tool-feedback';

@injectable()
export class SmartActionService implements SelectionListener {
    // private root: Readonly<SModelRoot>;
    // private selectedElementIDs: Set<string> = new Set();

    @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
    @inject(TYPES.ILogger) protected logger: ILogger;

    protected activeSmartElement?: SModelElement;
    protected activeSmartActionHandle?: SSmartActionHandle;

    // constructor(@multiInject(GLSP_TYPES.SelectionListener) @optional() protected selectionListeners: SelectionListener[] = []) { }

    selectionChanged(root: SModelRoot, selectedElements: string[]): void {
        if (this.activeSmartElement) {
            if (selectedElements.includes(this.activeSmartElement.id)) {
                // our active element is still selected, nothing to do
                return;
            }
            this.reset();
        }

        // try to find some other selected element and mark that active
        for (const elementId of selectedElements.reverse()) {
            const element = root.index.getById(elementId);
            if (element && this.setActiveSmartActionElement(element)) {
                return;
            }
        }
        // }
    }

    protected setActiveSmartActionElement(target: SModelElement): boolean {
        // check if we have a selected, moveable element (multi-selection allowed)
        const moveableElement = findParentByFeature(target, isBoundsAwareMoveable);
        if (isSelected(moveableElement)) {
            // only allow one element to have the element resize handles
            this.activeSmartElement = moveableElement;
            this.feedbackDispatcher.registerFeedback(this, [new ShowSmartActionToolFeedbackAction(this.activeSmartElement.id)]);
            return true;
        }
        return false;
    }

    protected reset(): void {
        if (this.activeSmartElement) {
            this.feedbackDispatcher.registerFeedback(this, [new HideSmartActionToolFeedbackAction()]);

        }
        this.actionDispatcher.dispatchAll([cursorFeedbackAction(CursorCSS.DEFAULT)]);
        this.resetPosition();
    }

    protected resetPosition(): void {
        this.activeSmartActionHandle = undefined;
        // this.lastDragPosition = undefined;
        // this.positionDelta = { x: 0, y: 0 };
    }
}
