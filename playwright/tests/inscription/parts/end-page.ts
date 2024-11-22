import type { Part } from '../../page-objects/inscription/Part';
import { NewPartTest, PartObject } from './part-tester';
import type { TextArea } from '../../page-objects/inscription/TextArea';
import type { Section } from '../../page-objects/inscription/Section';

class EndPage extends PartObject {
  section: Section;
  endPage: TextArea;

  constructor(part: Part, readonly warningIfEmpty = false) {
    super(part);
    this.section = part.section('End Page');
    this.endPage = this.section.textArea({});
  }

  async fill() {
    await this.section.open();
    await this.endPage.fill('page.xhtml');
  }

  async assertFill() {
    await this.endPage.expectValue('page.xhtml');
  }

  async clear() {
    await this.endPage.clear();
  }

  async assertClear() {
    if (this.warningIfEmpty) {
      await this.section.expectIsOpen();
      await this.endPage.expectEmpty();
    } else {
      await this.section.expectIsClosed();
    }
  }
}

export const EndPageTest = new NewPartTest('End Page', (part: Part) => new EndPage(part));
export const EndPageTestEmptyWarning = new NewPartTest('End Page', (part: Part) => new EndPage(part, true));
