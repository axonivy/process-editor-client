import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/section';
import type { Table } from '../../page-objects/inscription/table';
import type { ScriptArea } from '../../page-objects/inscription/code-editor';
import type { Combobox } from '../../page-objects/inscription/combobox';

class RestOutput extends PartObject {
  typeSection: Section;
  type: Combobox;
  mappingSection: Section;
  mapping: Table;
  codeSection: Section;
  code: ScriptArea;

  constructor(part: Part) {
    super(part);
    this.typeSection = part.section('Result Type');
    this.type = this.typeSection.combobox('Read body as type (result variable)');
    this.mappingSection = part.section('Mapping');
    this.mapping = this.mappingSection.table(['label', 'expression']);
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
  }

  async fill() {
    await this.typeSection.open();
    await this.type.fill('type');
    await this.mappingSection.open();
    await this.mapping.row(1).column(1).fill('"bla"');
    await this.codeSection.open();
    await this.code.fill('code');
  }

  async assertFill() {
    await this.type.expectValue('type');
    await this.mapping.row(1).column(1).expectValue('"bla"');
    await this.code.expectValue('code');
  }

  async clear() {
    await this.type.fill('');
    await this.mapping.row(1).column(1).clearExpression();
    await this.code.clear();
  }

  async assertClear() {
    await this.typeSection.expectIsClosed();
    await this.mappingSection.expectIsClosed();
    await this.codeSection.expectIsClosed();
  }
}

export const RestOutputTest = new NewPartTest('Output', (part: Part) => new RestOutput(part));
