import type { Part } from '../../page-objects/inscription/part';
import type { Row } from '../../page-objects/inscription/table';
import { NewPartTest, PartObject } from './part-tester';

class Condition extends PartObject {
  row0: Row;
  row1: Row;

  constructor(part: Part) {
    super(part);
    const table = part.table(['label', 'expression']);
    this.row0 = table.row(0);
    this.row1 = table.row(1);
  }

  async fill() {
    await this.row0.fill(['"bla"']);
    await this.row1.fill(['false']);
    await this.row0.dragTo(this.row1);
  }

  async assertFill() {
    await this.row0.expectValues(['false']);
    await this.row1.expectValues(['"bla"']);
  }

  async clear() {
    await this.row1.fill(['']);
    await this.row1.dragTo(this.row0);
  }

  async assertClear() {
    await this.row0.expectValues(['']);
    await this.row1.expectValues(['false']);
  }
}

export const ConditionTest = new NewPartTest('Condition', (part: Part) => new Condition(part));
