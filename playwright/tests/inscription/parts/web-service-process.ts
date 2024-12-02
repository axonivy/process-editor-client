import type { Part } from '../../page-objects/inscription/part';
import type { RadioGroup } from '../../page-objects/inscription/radio-group';
import type { Section } from '../../page-objects/inscription/section';
import type { TextArea } from '../../page-objects/inscription/text-area';
import { NewPartTest, PartObject } from './part-tester';

class WsProcessPart extends PartObject {
  section: Section;
  authentication: RadioGroup;
  qualifiedName: TextArea;

  constructor(part: Part) {
    super(part);
    this.section = part.section('Process');
    this.authentication = this.section.radioGroup();
    this.qualifiedName = this.section.textArea({ label: 'Qualified name' });
  }

  async fill() {
    await this.section.open();
    await this.authentication.choose('WS Security');
    await this.qualifiedName.fill('test');
  }

  async assertFill() {
    await this.authentication.expectSelected('WS Security');
    await this.qualifiedName.expectValue('test');
  }

  async clear() {
    await this.authentication.choose('None/Container');
    await this.qualifiedName.clear();
  }

  async assertClear() {
    await this.section.expectIsOpen(); //error on input
    await this.qualifiedName.expectEmpty();
    await this.authentication.expectSelected('None/Container');
  }
}

export const WebServiceProcessTest = new NewPartTest('Web Service Process', (part: Part) => new WsProcessPart(part));
