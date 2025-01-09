import type { RESPONSIBLE_TYPE, ValuesAsUnion } from '@axonivy/process-editor-inscription-protocol';
import { ScriptInput } from './code-editor';
import { Select } from './select';
import type { Section } from './section';
import type { Part } from './part';

export class ResponsibleComponent {
  typeSelect: Select;
  script: ScriptInput;
  select: Select;

  constructor(part: Part | Section) {
    const locator = part.currentLocator().locator('.responsible-select').first();
    this.typeSelect = new Select(part.page, locator, { nth: 0 });
    this.script = new ScriptInput(part.page, locator);
    this.select = new Select(part.page, locator, { nth: 1 });
  }

  async fill(type: ValuesAsUnion<typeof RESPONSIBLE_TYPE>, responsible = '') {
    await this.typeSelect.choose(type);
    switch (type) {
      case 'Role from Attr.':
      case 'User from Attr.':
        await this.script.fill(responsible);
        break;
      case 'Role':
        await this.select.choose(responsible);
        break;
      case 'Nobody & delete':
    }
  }

  async expectFill(type: ValuesAsUnion<typeof RESPONSIBLE_TYPE>, responsible = '') {
    await this.typeSelect.expectValue(type);
    switch (type) {
      case 'Role from Attr.':
      case 'User from Attr.':
        await this.script.expectValue(responsible);
        break;
      case 'Role':
        await this.select.expectValue(responsible);
        break;
      case 'Nobody & delete':
    }
  }

  async clear() {
    await this.typeSelect.choose('Role');
    await this.select.choose('Everybody');
  }

  async expectEmpty() {
    await this.typeSelect.expectValue('Role');
    await this.select.expectValue('Everybody');
  }
}

export class ResponsibleSection extends ResponsibleComponent {
  readonly section: Section;

  constructor(part: Part | Section) {
    super(part);
    this.section = part.section('Responsible');
    this.typeSelect = this.section.select({ nth: 0 });
    this.script = this.section.scriptInput();
    this.select = this.section.select({ nth: 1 });
  }

  override async fill(type: ValuesAsUnion<typeof RESPONSIBLE_TYPE>, responsible?: string) {
    await this.section.open();
    await super.fill(type, responsible);
  }

  override async expectFill(type: ValuesAsUnion<typeof RESPONSIBLE_TYPE>, responsible?: string) {
    await super.expectFill(type, responsible);
  }

  override async clear() {
    await super.clear();
  }

  override async expectEmpty() {
    await this.section.expectIsClosed();
  }
}
