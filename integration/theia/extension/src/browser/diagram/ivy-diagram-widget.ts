import {
  EnableToolPaletteAction,
  RequestModelAction,
  RequestTypeHintsAction,
  SetEditModeAction,
  GLSPActionDispatcher
} from '@eclipse-glsp/client';
import { GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { EnableViewportAction } from '@ivyteam/process-editor';

export class IvyGLSPDiagramWidget extends GLSPDiagramWidget {
  protected dispatchInitialActions(): void {
    this.actionDispatcher.dispatch(RequestModelAction.create({ options: this.requestModelOptions }));
    if (this.actionDispatcher instanceof GLSPActionDispatcher) {
      this.actionDispatcher.onceModelInitialized().then(() => {
        this.actionDispatcher.dispatch(EnableViewportAction.create());
        this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
      });
    }
    this.actionDispatcher.dispatch(RequestTypeHintsAction.create());
    this.actionDispatcher.dispatch(SetEditModeAction.create(this.options.editMode));
  }
}
