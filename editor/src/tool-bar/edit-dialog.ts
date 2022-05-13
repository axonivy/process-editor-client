import { PaletteItem } from '@eclipse-glsp/client';

export class EditDialog {
  public static DIALOG_CLOSE = 'close';
  public static DIALOG_CONFIRM = 'confirm';
  public static DIALOG_DELETE = 'delete';
  private dialog: HTMLElement;
  private handleDialogClose: (returnValue: string, formData: FormData, item?: PaletteItem | undefined) => void;
  private item: PaletteItem | undefined;

  constructor(containerElement: HTMLElement) {
    this.dialog = this.createEditDialog(containerElement);
    this.dialog.addEventListener('close', this.dialogClosed);
  }

  dialogClosed = ({ target: dialog }: any): void => {
    const dialogFormData = new FormData(dialog.querySelector('form'));
    this.handleDialogClose(dialog.returnValue, dialogFormData, this.item);
    dialog.querySelector('form')?.reset();
  };

  public showDialog(handleDialogClose: (returnValue: string, formData: FormData, item?: PaletteItem) => void, item?: PaletteItem): void {
    this.handleDialogClose = handleDialogClose;
    this.item = item;
    this.setInputValue('editInputName', item?.label ?? '');
    this.setInputValue('editInputColor', item?.icon ?? '');
    const deleteBtn = this.dialog.querySelector('.edit-color-delete-btn') as HTMLElement;
    if (deleteBtn) {
      deleteBtn.style.display = item ? 'block' : 'none';
    }
    (this.dialog as any).showModal();
  }

  private setInputValue(id: string, value: string): void {
    const input = this.dialog.querySelector(`#${id}`) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  private createEditDialog(containerElement: HTMLElement): HTMLElement {
    const dialog = document.createElement('dialog');
    dialog.classList.add('edit-color-dialog');
    const form = document.createElement('form');
    form.method = 'dialog';
    form.classList.add('edit-color-form');
    form.appendChild(this.createDialogBody());
    form.appendChild(this.createFooter());
    dialog.appendChild(form);
    containerElement.appendChild(dialog);
    return dialog;
  }

  private createDialogBody(): HTMLElement {
    const body = document.createElement('div');
    body.classList.add('edit-color-body');
    body.appendChild(this.createInput('Name'));
    body.appendChild(this.createInput('Color', true));
    return body;
  }

  private createInput(labelText: string, showColorPicker = false): HTMLElement {
    const id = `editInput${labelText}`;
    const div = document.createElement('div');
    div.classList.add('edit-color-input');
    const label = document.createElement('label') as HTMLLabelElement;
    label.htmlFor = id;
    label.textContent = labelText;
    const input = document.createElement('input');
    input.name = labelText;
    input.id = id;
    div.appendChild(label);
    if (showColorPicker) {
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.onchange = e => {
        input.value = (e.target as HTMLInputElement).value;
      };
      div.appendChild(colorPicker);
    }
    div.appendChild(input);
    return div;
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.classList.add('edit-color-footer');
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('edit-color-delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.autofocus = true;
    deleteBtn.type = 'submit';
    deleteBtn.value = EditDialog.DIALOG_DELETE;
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('edit-color-cancel-btn');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.autofocus = true;
    cancelBtn.type = 'button';
    cancelBtn.onclick = e => (this.dialog as any).close(EditDialog.DIALOG_CLOSE);
    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('edit-color-confirm-btn');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.type = 'submit';
    confirmBtn.value = EditDialog.DIALOG_CONFIRM;
    footer.appendChild(deleteBtn);
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    return footer;
  }
}
