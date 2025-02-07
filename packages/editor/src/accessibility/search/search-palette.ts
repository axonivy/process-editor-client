import { GModelRoot, SearchAutocompletePalette } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvySearchAutocompletePalette extends SearchAutocompletePalette {
  public override show(root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    this.activeElement = document.activeElement;
    if (!this.containerElement) {
      if (!this.initialize()) return;
    }
    this.onBeforeShow(this.containerElement, root, ...contextElementIds);
    this.setContainerVisible(true);
    this.root = root;
    this.autocompleteWidget.open(root);
  }
}
