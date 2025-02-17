import { GLSPDiagramServer, ServerMessageAction } from '@eclipse-glsp/client';
import Toastify from 'toastify-js';

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
    if (action.severity === 'WARNING' && action.timeout) {
      this.toast = undefined; // will be hidden by timeout
    }
    return false;
  }
}
