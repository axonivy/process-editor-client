import type { Part } from '../../page-objects/inscription/Part';
import { NewPartTest, PartObject } from './part-tester';
import type { Checkbox } from '../../page-objects/inscription/Checkbox';
import type { Section } from '../../page-objects/inscription/Section';

class Permissions extends PartObject {
  section: Section;
  viewable: Checkbox;

  constructor(part: Part, readonly defaultIsChecked: boolean) {
    super(part);
    this.section = part.section('Permissions');
    this.viewable = this.section.checkbox('Allow all workflow users to view the process on the Engine');
  }

  async fill() {
    await this.section.open();
    await this.viewable.click();
  }

  async assertFill() {
    if (this.defaultIsChecked) {
      await this.viewable.expectUnchecked();
    } else {
      await this.viewable.expectChecked();
    }
  }

  async clear() {
    await this.viewable.click();
  }

  async assertClear() {
    await this.section.expectIsClosed();
  }
}

export const PermissionsTest = (defaultIsChecked = true) =>
  new NewPartTest('Permissions', (part: Part) => new Permissions(part, defaultIsChecked));
