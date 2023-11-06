import {
  AbstractUIExtension,
  Action,
  EditorContextService,
  GArgument,
  IActionDispatcher,
  IActionHandler,
  SModelRoot,
  SetUIExtensionVisibilityAction,
  TYPES
} from '@eclipse-glsp/client';
import { OpenAction } from 'sprotty-protocol';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, optional, postConstruct } from 'inversify';
import { Root, createRoot } from 'react-dom/client';
import React from 'react';
import InscriptionView from './InscriptionView';
import { ClientContextProvider, MonacoEditorUtil, ThemeContextProvider, initQueryClient } from '@axonivy/inscription-editor';
import * as reactMonaco from 'monaco-editor/esm/vs/editor/editor.api';
import { InscriptionClient } from '@axonivy/inscription-protocol';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InscriptionClientJsonRpc, IvyScriptLanguage, MonacoUtil } from '@axonivy/inscription-core';
import { SwitchThemeActionHandler } from '@axonivy/process-editor';
import { EnableInscriptionAction, SwitchThemeAction, ToggleInscriptionAction } from '@axonivy/process-editor-protocol';

const JSX = { createElement: React.createElement };

@injectable()
export class InscriptionUi extends AbstractUIExtension implements IActionHandler, SelectionListener {
  static readonly ID = 'inscriptionUi';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @inject(SwitchThemeActionHandler) @optional() protected switchThemeHandler?: SwitchThemeActionHandler;

  private action?: EnableInscriptionAction;
  private app: string;
  private pmv: string;
  private webSocketAddress: string;
  private root: Root;
  private inscriptionClient?: Promise<InscriptionClient>;
  private queryClient: QueryClient;

  public id(): string {
    return InscriptionUi.ID;
  }

  public containerClass(): string {
    return 'inscription-ui-container';
  }

  @postConstruct()
  postConstruct(): void {
    this.selectionService.register(this);
  }

  protected initialize() {
    const baseDiv = document.getElementById('inscription');
    if (!baseDiv) {
      this.logger.warn(this, `Could not obtain inscription base container for initializing UI extension ${this.id}`, this);
      return false;
    }
    this.containerElement = this.getOrCreateContainer(baseDiv.id);
    this.initializeContents(this.containerElement);
    if (baseDiv) {
      baseDiv.insertBefore(this.containerElement, baseDiv.firstChild);
    }
    return true;
  }

  protected initializeContents(containerElement: HTMLElement) {
    this.initConnection();
    this.changeUiVisiblitiy();
    IvyScriptLanguage.startWebSocketClient(this.webSocketAddress + 'ivy-script-lsp');
    this.queryClient = initQueryClient();
    this.inscriptionClient = this.startInscriptionClient();

    this.root = createRoot(containerElement);
    this.updateInscriptionUi();
  }

  private updateInscriptionUi() {
    let element = this.selectionService.getSelectedElementIDs()[0];
    if (!element) {
      element = this.editorContext.modelRoot.id;
    }
    this.inscriptionClient?.then(client => {
      this.root.render(
        <React.StrictMode>
          <ThemeContextProvider theme={this.switchThemeHandler?.theme() ?? 'light'}>
            <ClientContextProvider client={client}>
              <QueryClientProvider client={this.queryClient}>
                <InscriptionView app={this.app} pmv={this.pmv} pid={element} />
              </QueryClientProvider>
            </ClientContextProvider>
          </ThemeContextProvider>
        </React.StrictMode>
      );
    });
  }

  async startInscriptionClient() {
    const client = await InscriptionClientJsonRpc.startWebSocketClient(this.webSocketAddress + 'ivy-inscription-lsp');
    await client.initialize();
    return client;
  }

  handle(action: Action) {
    if (EnableInscriptionAction.is(action)) {
      this.action = action;
      return SetUIExtensionVisibilityAction.create({ extensionId: InscriptionUi.ID, visible: true });
    }
    if (ToggleInscriptionAction.is(action)) {
      this.changeUiVisiblitiy();
    }
    if (Action.is(action) && action.kind === OpenAction.KIND) {
      this.changeUiVisiblitiy(true);
    }
    if (SwitchThemeAction.is(action)) {
      this.updateInscriptionUi();
      MonacoUtil.monacoInitialized().then(() => {
        reactMonaco.editor.defineTheme(MonacoEditorUtil.DEFAULT_THEME_NAME, MonacoEditorUtil.themeData(action.theme));
      });
    }
    return;
  }

  private initConnection() {
    const model = this.editorContext.modelRoot;
    this.app = this.action?.app ?? GArgument.getString(model, 'app') ?? 'designer';
    this.pmv = this.action?.pmv ?? GArgument.getString(model, 'pmv') ?? '';
    this.webSocketAddress = this.action?.server ?? GArgument.getString(model, 'webSocket') ?? 'ws://localhost:8081/';
  }

  private changeUiVisiblitiy(force?: boolean) {
    const currentState = this.containerElement.classList.contains('hidden');
    if (force || currentState) {
      this.containerElement.classList.remove('hidden');
    } else {
      this.containerElement.classList.add('hidden');
    }
    window.dispatchEvent(new CustomEvent('resize'));
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
    this.updateInscriptionUi();
  }
}
