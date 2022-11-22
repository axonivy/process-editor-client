import { configureServerActions } from '@eclipse-glsp/client';
import { GLSPDiagramLanguage, GLSPDiagramManager } from '@eclipse-glsp/theia-integration';
import { injectable, inject } from '@theia/core/shared/inversify';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { DiagramWidget, DiagramWidgetOptions } from 'sprotty-theia';
import { IvyGLSPDiagramWidget } from './ivy-diagram-widget';

@injectable()
export class IvyGLSPDiagramManager extends GLSPDiagramManager {
  private _diagramType: string;
  private _label: string;
  private _fileExtensions: string[] = [];

  @inject(ThemeService) theiaThemeService: ThemeService;

  public doConfigure(diagramLanguage: GLSPDiagramLanguage): void {
    this._fileExtensions = diagramLanguage.fileExtensions;
    this._diagramType = diagramLanguage.diagramType;
    this._label = diagramLanguage.label;
    this.initialize();
  }

  get fileExtensions(): string[] {
    return this._fileExtensions;
  }

  get diagramType(): string {
    return this._diagramType;
  }

  get label(): string {
    return this._label;
  }

  protected override async initialize(): Promise<void> {
    if (this._diagramType) {
      return super.initialize();
    }
  }

  override async createWidget(options?: any): Promise<DiagramWidget> {
    if (DiagramWidgetOptions.is(options)) {
      const clientId = this.createClientId();
      const widgetId = this.createWidgetId(options);
      const config = this.getDiagramConfiguration(options);
      const diContainer = config.createContainer(clientId);
      const initializeResult = await this.diagramConnector.initializeResult;
      await configureServerActions(initializeResult, this.diagramType, diContainer);
      const widget = new IvyGLSPDiagramWidget(
        options,
        widgetId,
        diContainer,
        this.editorPreferences,
        this.storage,
        this.theiaSelectionService,
        this.diagramConnector,
        this.theiaThemeService
      );
      widget.listenToFocusState(this.shell);
      return widget;
    }
    throw Error('DiagramWidgetFactory needs DiagramWidgetOptions but got ' + JSON.stringify(options));
  }
}
