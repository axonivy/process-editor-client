import {
    Action,
    EdgeRouterRegistry,
    GLSP_TYPES,
    IActionDispatcher,
    IFeedbackActionDispatcher,
    IMovementRestrictor,
    ISnapper,
    MouseListener,
    SModelElement
} from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { BaseGLSPTool } from '@eclipse-glsp/client/lib/features/tools/base-glsp-tool';
import { inject, injectable, optional } from 'inversify';
import { ILogger, TYPES } from 'sprotty';

import { JumpOperation } from './jump';
import { HideJumpOutToolFeedbackAction, ShowJumpOutToolFeedbackAction } from './jump-out-tool-feedback';
import { SJumpOutHandle } from './model';

@injectable()
export class JumpOutTool extends BaseGLSPTool {
    static ID = 'ivy.jump-out-tool';

    @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
    @inject(EdgeRouterRegistry) @optional() readonly edgeRouterRegistry?: EdgeRouterRegistry;
    @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;
    @inject(GLSP_TYPES.IMovementRestrictor) @optional() readonly movementRestrictor?: IMovementRestrictor;
    protected jumpOutListener: MouseListener;

    get id(): string {
        return JumpOutTool.ID;
    }

    enable(): void {
        // install change bounds listener for client-side resize updates and server-side updates
        this.jumpOutListener = this.createJumpOutListener();
        this.mouseTool.register(this.jumpOutListener);
    }

    protected createJumpOutListener(): MouseListener {
        return new JumpOutListener(this);
    }

    disable(): void {
        this.mouseTool.deregister(this.jumpOutListener);
        this.deregisterFeedback([new HideJumpOutToolFeedbackAction], this.jumpOutListener);
    }
}

@injectable()
export class JumpOutListener extends MouseListener {

    @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
    @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
    @inject(TYPES.ILogger) protected logger: ILogger;

    constructor(protected tool: JumpOutTool) {
        super();
        this.tool.dispatchFeedback([new ShowJumpOutToolFeedbackAction()], this);
    }

    mouseUp(target: SModelElement, event: MouseEvent): Action[] {
        super.mouseUp(target, event);
        if (target instanceof SJumpOutHandle) {
            return [new JumpOperation('')];
        }
        return [];
    }
}
