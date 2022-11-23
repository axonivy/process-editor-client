import {
  EnableToolPaletteAction,
  RequestModelAction,
  RequestTypeHintsAction,
  SetEditModeAction,
  GLSPActionDispatcher
} from '@eclipse-glsp/client';
import { DiagramWidgetOptions, GLSPDiagramWidget, GLSPWidgetOpenerOptions, TheiaGLSPConnector } from '@eclipse-glsp/theia-integration';
import { EnableViewportAction, SwitchThemeAction } from '@ivyteam/process-editor';
import { StorageService } from '@theia/core/lib/browser';
import { SelectionService } from '@theia/core/lib/common/selection-service';
import { Container } from '@theia/core/shared/inversify';
import { EditorPreferences } from '@theia/editor/lib/browser';
import { ThemeService } from '@theia/core/lib/browser/theming';

export class IvyGLSPDiagramWidget extends GLSPDiagramWidget {
  constructor(
    options: DiagramWidgetOptions & GLSPWidgetOpenerOptions,
    override readonly widgetId: string,
    override readonly diContainer: Container,
    readonly editorPreferences: EditorPreferences,
    readonly storage: StorageService,
    readonly theiaSelectionService: SelectionService,
    override readonly connector: TheiaGLSPConnector,
    readonly theiaThemeService: ThemeService
  ) {
    super(options, widgetId, diContainer, editorPreferences, storage, theiaSelectionService, connector);
  }

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
    this.actionDispatcher.dispatch(SwitchThemeAction.create({ theme: this.theiaThemeService.getCurrentTheme().type }));
  }
}
