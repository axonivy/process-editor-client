import { GLSPWebView } from '@eclipse-glsp/vscode-integration';

export class IvyWebView extends GLSPWebView {

  get editorUri(): string {
    return this.diagramIdentifier.uri;
  }
}
