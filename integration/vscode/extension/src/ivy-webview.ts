import { GLSPWebView } from '../../packages/vscode-integration/lib';

export class IvyWebView extends GLSPWebView {

    get editorUri(): string {
        return this.diagramIdentifier.uri;
    }
}
