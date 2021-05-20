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
    Action,
    CursorCSS,
    cursorFeedbackAction,
    EdgeRouterRegistry,
    findParentByFeature,
    GLSP_TYPES,
    IActionDispatcher,
    IFeedbackActionDispatcher,
    IMovementRestrictor,
    isBoundsAwareMoveable,
    ISnapper,
    isSelected,
    MouseListener,
    SModelElement
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { BaseGLSPTool } from '@eclipse-glsp/client/lib/features/tools/base-glsp-tool';
import { inject, injectable, optional } from 'inversify';
import { ILogger, SModelRoot, TYPES } from 'sprotty';

import { SSmartActionHandle } from './model';
import { HideSmartActionToolFeedbackAction, ShowSmartActionToolFeedbackAction } from './smart-action-tool-feedback';

@injectable()
export class SmartActionTool extends BaseGLSPTool {
    static ID = 'ivy.smart-action-tool';

    @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
    @inject(EdgeRouterRegistry) @optional() readonly edgeRouterRegistry?: EdgeRouterRegistry;
    @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;
    @inject(GLSP_TYPES.IMovementRestrictor) @optional() readonly movementRestrictor?: IMovementRestrictor;
    protected smartActionListener: MouseListener & SelectionListener;

    get id(): string {
        return SmartActionTool.ID;
    }

    enable(): void {
        // install change bounds listener for client-side resize updates and server-side updates
        this.smartActionListener = this.createSmartActionListener();
        this.mouseTool.register(this.smartActionListener);
        this.selectionService.register(this.smartActionListener);
    }

    protected createSmartActionListener(): MouseListener & SelectionListener {
        return new SmartActionListener(this);
    }

    disable(): void {
        this.mouseTool.deregister(this.smartActionListener);
        this.selectionService.deregister(this.smartActionListener);
        this.deregisterFeedback([new HideSmartActionToolFeedbackAction], this.smartActionListener);
    }
}

@injectable()
export class SmartActionListener extends MouseListener implements SelectionListener {

    @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
    @inject(TYPES.ILogger) protected logger: ILogger;

    protected activeSmartElement?: SModelElement;
    protected activeSmartActionHandle?: SSmartActionHandle;

    constructor(protected tool: SmartActionTool) {
        super();
    }

    mouseDown(target: SModelElement, event: MouseEvent): Action[] {
        super.mouseDown(target, event);
        if (event.button !== 0) {
            return [];
        }
        // check if we have a resize handle (only single-selection)
        if (this.activeSmartElement && target instanceof SSmartActionHandle) {
            this.activeSmartActionHandle = target;
        } else {
            this.setActiveSmartActionElement(target);
        }
        return [];
    }

    mouseUp(target: SModelElement, event: MouseEvent): Action[] {
        super.mouseUp(target, event);
        if (this.activeSmartElement && target instanceof SSmartActionHandle && this.activeSmartActionHandle) {
            return this.activeSmartActionHandle.mouseUp(this.activeSmartElement);
        }
        return [];
    }

    selectionChanged(root: SModelRoot, selectedElements: string[]): void {
        if (this.activeSmartElement) {
            if (selectedElements.includes(this.activeSmartElement.id)) {
                // our active element is still selected, nothing to do
                return;
            }

            // try to find some other selected element and mark that active
            for (const elementId of selectedElements.reverse()) {
                const element = root.index.getById(elementId);
                if (element && this.setActiveSmartActionElement(element)) {
                    return;
                }
            }
            this.reset();
        }
    }

    protected setActiveSmartActionElement(target: SModelElement): boolean {
        // check if we have a selected, moveable element (multi-selection allowed)
        const moveableElement = findParentByFeature(target, isBoundsAwareMoveable);
        if (isSelected(moveableElement)) {
            // only allow one element to have the element resize handles
            this.activeSmartElement = moveableElement;
            this.tool.dispatchFeedback([new ShowSmartActionToolFeedbackAction(this.activeSmartElement.id)], this);
            return true;
        }
        return false;
    }

    protected reset(): void {
        if (this.activeSmartElement) {
            this.tool.dispatchFeedback([new HideSmartActionToolFeedbackAction()], this);
        }
        this.tool.dispatchActions([cursorFeedbackAction(CursorCSS.DEFAULT)]);
        this.resetPosition();
    }

    protected resetPosition(): void {
        this.activeSmartActionHandle = undefined;
    }
}
