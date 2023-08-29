import { GLSPDiagramServer, ServerMessageAction } from '@eclipse-glsp/client';
import * as Toastify from 'toastify-js';

export class IvyGLSPDiagramServer extends GLSPDiagramServer {
  private toast: any | undefined;

  protected handleServerMessageAction(action: ServerMessageAction): boolean {
    this.toast?.hideToast();
    if (action.severity !== 'NONE') {
      this.toast = Toastify({
        text: action.message,
        close: true,
        gravity: 'bottom',
        position: 'left',
        className: `severity-${action.severity}`,
        duration: action.timeout
      });
      this.toast.showToast();
    }
    return false;
  }
}
