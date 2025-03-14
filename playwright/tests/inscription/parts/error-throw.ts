import type { ScriptArea, ScriptInput } from '../../page-objects/inscription/code-editor';
import type { Combobox } from '../../page-objects/inscription/combobox';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import { NewPartTest, PartObject } from './part-tester';

class ErrorThrow extends PartObject {
  errorSection: Section;
  error: Combobox;
  cause: ScriptInput;
  codeSection: Section;
  code: ScriptArea;

  constructor(part: Part) {
    super(part);
    this.errorSection = part.section('Error');
    this.error = this.errorSection.combobox('Error Code to throw');
    this.cause = this.errorSection.scriptInput('Error Cause');
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
  }

  async fill() {
    await this.errorSection.open();
    await this.error.choose('test:error');
    await this.cause.fill('cause');
    await this.codeSection.open();
    await this.code.fill('code');
  }

  async assertFill() {
    await this.error.expectValue('test:error');
    await this.cause.expectValue('cause');
    await this.code.expectValue('code');
  }

  async clear() {
    await this.error.fill('undefined');
    await this.cause.clear();
  }

  async assertClear() {
    await this.errorSection.open();
    await this.error.expectValue('undefined');
    await this.cause.expectEmpty();
    await this.codeSection.expectIsOpen();
    await this.code.clear();
  }
}

export const ErrorThrowTest = new NewPartTest('Error', (part: Part) => new ErrorThrow(part));
