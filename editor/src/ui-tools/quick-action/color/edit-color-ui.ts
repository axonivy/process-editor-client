import { PaletteItem } from '@eclipse-glsp/client';
import { createElement } from '../../../utils/ui-utils';

export class EditColorUi {
  public static DIALOG_CLOSE = 'close';
  public static DIALOG_CONFIRM = 'confirm';
  public static DIALOG_DELETE = 'delete';
  private static NAME_INPUT_ID = 'editInputName';
  private static COLOR_INPUT_ID = 'editInputColor';
  private static COLOR_PICKER_INPUT_ID = 'editInputColorPicker';

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
    this.setInputValue(EditColorUi.NAME_INPUT_ID, item?.label ?? '');
    this.setInputValue(EditColorUi.COLOR_INPUT_ID, item?.icon ?? '');
    this.setInputValue(EditColorUi.COLOR_PICKER_INPUT_ID, item?.icon ?? '');
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

  private getInputElement(id: string): HTMLInputElement | undefined {
    return this.dialog.querySelector(`#${id}`) as HTMLInputElement;
  }

  private createEditDialog(containerElement: HTMLElement): HTMLElement {
    const dialog = createElement('dialog', ['edit-color-dialog']);
    const form = createElement('form', ['edit-color-form']) as HTMLFormElement;
    form.method = 'dialog';
    form.appendChild(this.createDialogBody());
    form.appendChild(this.createFooter());
    dialog.appendChild(form);
    containerElement.appendChild(dialog);
    return dialog;
  }

  private createDialogBody(): HTMLElement {
    const body = createElement('div', ['edit-color-body']);
    body.appendChild(this.createInput(EditColorUi.NAME_INPUT_ID, 'Name'));
    body.appendChild(this.createInput(EditColorUi.COLOR_INPUT_ID, 'Color', true));
    return body;
  }

  private createInput(id: string, labelText: string, showColorPicker = false): HTMLElement {
    const div = createElement('div', ['edit-color-input']);
    const label = createElement('label') as HTMLLabelElement;
    label.htmlFor = id;
    label.textContent = labelText;
    const input = document.createElement('input');
    input.name = labelText;
    input.id = id;
    div.appendChild(label);
    if (showColorPicker) {
      const colorPicker = document.createElement('input');
      colorPicker.id = id + 'Picker';
      colorPicker.type = 'color';
      colorPicker.onchange = e => (input.value = (e.target as HTMLInputElement).value);
      div.appendChild(colorPicker);
      input.onchange = e => (colorPicker.value = (e.target as HTMLInputElement).value);
    }
    div.appendChild(input);
    return div;
  }

  private createFooter(): HTMLElement {
    const footer = createElement('footer', ['edit-color-footer']);
    const deleteBtn = createElement('button', ['edit-color-delete-btn']) as HTMLButtonElement;
    deleteBtn.textContent = 'Delete';
    deleteBtn.autofocus = true;
    deleteBtn.type = 'submit';
    deleteBtn.value = EditColorUi.DIALOG_DELETE;
    const cancelBtn = createElement('button', ['edit-color-cancel-btn']) as HTMLButtonElement;
    cancelBtn.textContent = 'Cancel';
    cancelBtn.autofocus = true;
    cancelBtn.type = 'button';
    cancelBtn.onclick = e => (this.dialog as any).close(EditColorUi.DIALOG_CLOSE);
    const confirmBtn = createElement('button', ['edit-color-confirm-btn']) as HTMLButtonElement;
    confirmBtn.textContent = 'Ok';
    confirmBtn.type = 'button';
    confirmBtn.onclick = e => this.validateInputsAndRun(() => (this.dialog as any).close(EditColorUi.DIALOG_CONFIRM));
    footer.appendChild(deleteBtn);
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    return footer;
  }

  private validateInputsAndRun(callable: () => void): void {
    const validNameInput = this.validateInput(EditColorUi.NAME_INPUT_ID);
    const validColorInput = this.validateInput(EditColorUi.COLOR_INPUT_ID);
    if (validNameInput && validColorInput) {
      callable();
    }
  }

  private validateInput(inputId: string): boolean {
    const input = this.getInputElement(inputId);
    if (input) {
      if (input.value === '') {
        input.classList.add('error');
        return false;
      } else {
        input.classList.remove('error');
      }
    }
    return true;
  }
}
