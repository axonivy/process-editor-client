import { DirectLabelEditTool, EditLabelKeyListener, EditLabelMouseListener, KeyListener, MouseListener } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyDirectLabelEditTool extends DirectLabelEditTool {
  static readonly ID = 'glsp.direct-label-edit-tool';

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
    this.toDisposeOnDisable.push(this.keyTool.registerListener(this.createEditLabelKeyListener()));
  }
}
