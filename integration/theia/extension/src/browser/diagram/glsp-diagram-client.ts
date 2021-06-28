import { GLSPDiagramClient } from '@eclipse-glsp/theia-integration/lib/browser';
import { EditorManager } from '@theia/editor/lib/browser';
import { inject, injectable } from 'inversify';

import { IvyGLSPClientContribution } from '../language/glsp-client-contribution';

@injectable()
export class IvyGLSPDiagramClient extends GLSPDiagramClient {
  constructor(@inject(IvyGLSPClientContribution) glspCLientContribution: IvyGLSPClientContribution,
    @inject(EditorManager) editorManager: EditorManager) {
    super(glspCLientContribution, editorManager);
  }
}
