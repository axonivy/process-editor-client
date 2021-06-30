import {
  GLSPDiagramManager,
  GLSPNotificationManager,
  GLSPTheiaSprottyConnector
} from '@eclipse-glsp/theia-integration/lib/browser';
import { MessageService } from '@theia/core';
import { WidgetManager } from '@theia/core/lib/browser';
import { EditorManager } from '@theia/editor/lib/browser';
import { inject, injectable } from 'inversify';
import { TheiaFileSaver } from 'sprotty-theia';

import { IvyProcessLanguage } from '../../common/ivy-process-language';
import { IvyGLSPDiagramClient } from './glsp-diagram-client';

@injectable()
export class IvyDiagramManager extends GLSPDiagramManager {
  readonly diagramType = IvyProcessLanguage.DiagramType;
  readonly iconClass = 'fa fa-project-diagram';
  readonly label = IvyProcessLanguage.Label + ' Editor';

  private _diagramConnector: GLSPTheiaSprottyConnector;

  constructor(@inject(IvyGLSPDiagramClient) diagramClient: IvyGLSPDiagramClient,
    @inject(TheiaFileSaver) fileSaver: TheiaFileSaver,
    @inject(WidgetManager) widgetManager: WidgetManager,
    @inject(EditorManager) editorManager: EditorManager,
    @inject(MessageService) messageService: MessageService,
    @inject(GLSPNotificationManager) notificationManager: GLSPNotificationManager) {
    super();
    this._diagramConnector = new GLSPTheiaSprottyConnector({
      diagramClient, fileSaver, editorManager, widgetManager, diagramManager: this,
      messageService, notificationManager
    });
  }

  get fileExtensions(): string[] {
    return [IvyProcessLanguage.FileExtension];
  }
  get diagramConnector(): GLSPTheiaSprottyConnector {
    return this._diagramConnector;
  }
}
