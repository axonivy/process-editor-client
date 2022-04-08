import { DirectLabelEditTool } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { EditLabelKeyListener, EditLabelMouseListener, KeyListener, MouseListener } from 'sprotty';

@injectable()
export class IvyDirectLabelEditTool extends DirectLabelEditTool {
  static readonly ID = 'glsp.direct-label-edit-tool';

  protected editLabelKeyListener: KeyListener;

  get id(): string {
    return DirectLabelEditTool.ID;
  }

  protected createEditLabelMouseListener(): MouseListener {
    return new EditLabelMouseListener();
  }

  protected createEditLabelKeyListener(): KeyListener {
    return new EditLabelKeyListener();
  }

  enable(): void {
    this.editLabelKeyListener = this.createEditLabelKeyListener();
    this.keyTool.register(this.editLabelKeyListener);
  }

  disable(): void {
    this.keyTool.deregister(this.editLabelKeyListener);
  }
}
