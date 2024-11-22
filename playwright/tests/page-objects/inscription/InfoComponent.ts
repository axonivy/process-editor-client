import type { MacroEditor } from './CodeEditor';
import type { Section } from './Section';
import type { Part } from './Part';

export class InfoComponent {
  detailSection: Section;
  name: MacroEditor;
  description: MacroEditor;
  category: MacroEditor;

  constructor(readonly part: Part) {
    this.detailSection = part.section('Details');
    this.name = this.detailSection.macroInput('Name');
    this.description = this.part.macroArea('Description');
    this.category = this.part.macroInput('Category');
  }

  async fill(name = 'info name') {
    await this.detailSection.open();
    await this.name.fill(name);
    await this.description.fill('info desc');
    await this.category.fill('info cat');
  }

  async expectFill(name = 'info name') {
    await this.name.expectValue(name);
    await this.description.expectValue('info desc');
    await this.category.expectValue('info cat');
  }

  async clear() {
    await this.name.clear();
    await this.description.clear();
    await this.category.clear();
  }

  async expectEmpty() {
    await this.detailSection.expectIsClosed();
  }
}
