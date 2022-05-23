import { EditModeListener } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { AbstractUIExtension } from 'sprotty';

@injectable()
export class StandaloneToolBar extends AbstractUIExtension implements EditModeListener {
  static readonly ID = 'ivy-tool-bar';

  id(): string {
    return StandaloneToolBar.ID;
  }
  containerClass(): string {
    return StandaloneToolBar.ID;
  }

  editModeChanged(newValue: string, oldvalue: string): void {
    return;
  }

  protected initializeContents(containerElement: HTMLElement): void {
    return;
  }
}
