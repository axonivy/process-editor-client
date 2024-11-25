import type { Locator, Page } from '@playwright/test';
import { MacroEditor, ScriptArea, ScriptInput } from './CodeEditor';
import { Select } from './Select';
import type { ColumnType } from './Table';
import { Table } from './Table';
import { Checkbox } from './Checkbox';
import { TextArea } from './TextArea';
import { Tags } from './Tags';
import { Combobox } from './Combobox';
import { RadioGroup } from './RadioGroup';

export abstract class Composite {
  readonly page: Page;
  protected readonly locator: Locator;

  constructor(page: Page, locator: Locator) {
    this.page = page;
    this.locator = locator;
  }

  textArea(options: { label?: string; nth?: number }) {
    return new TextArea(this.locator, options);
  }

  checkbox(label: string) {
    return new Checkbox(this.locator, label);
  }

  radioGroup() {
    return new RadioGroup(this.locator);
  }

  select(options: { label?: string; nth?: number }) {
    return new Select(this.page, this.locator, options);
  }

  combobox(label?: string) {
    return new Combobox(this.page, this.locator, { label });
  }

  macroInput(label?: string) {
    return new MacroEditor(this.page, this.locator, label);
  }

  macroArea(label?: string) {
    return new MacroEditor(this.page, this.locator, label);
  }

  scriptInput(label?: string) {
    return new ScriptInput(this.page, this.locator, label);
  }

  scriptArea() {
    return new ScriptArea(this.page, this.locator);
  }

  table(columns: ColumnType[]) {
    return new Table(this.page, this.locator, columns);
  }

  tags() {
    return new Tags(this.page, this.locator);
  }

  currentLocator() {
    return this.locator;
  }
}
