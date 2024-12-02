import type { ScriptInput } from '../../page-objects/inscription/code-editor';
import type { Part } from '../../page-objects/inscription/part';
import type { RadioGroup } from '../../page-objects/inscription/radio-group';
import { NewPartTest, PartObject } from './part-tester';

class DbCache extends PartObject {
  cache: RadioGroup;
  scope: RadioGroup;
  groupName: ScriptInput;
  groupLifetime: RadioGroup;
  groupLifetimeText: ScriptInput;
  entryName: ScriptInput;
  entryLifetime: RadioGroup;
  entryLifetimeText: ScriptInput;

  constructor(part: Part) {
    super(part);
    const groupSection = part.section('Group');
    const entrySection = part.section('Entry');
    this.cache = part.radioGroup();
    this.scope = part.section('Scope').radioGroup();
    this.groupName = groupSection.scriptInput('Name');
    this.groupLifetime = groupSection.radioGroup();
    this.groupLifetimeText = groupSection.scriptInput('Lifetime');

    this.entryName = entrySection.scriptInput('Name');
    this.entryLifetime = entrySection.radioGroup();
    this.entryLifetimeText = entrySection.scriptInput('Lifetime');
  }

  async fill() {
    await this.cache.choose('Cache');
    await this.scope.choose('Session');
    await this.groupName.fill('asdf');
    await this.groupLifetime.choose('Duration');
    await this.groupLifetimeText.fill('123');

    await this.entryName.fill('jkl');
    await this.entryLifetime.choose('Duration');
    await this.entryLifetimeText.fill('456');
  }

  async assertFill() {
    await this.cache.expectSelected('Cache');
    await this.scope.expectSelected('Session');
    await this.groupName.expectValue('asdf');
    await this.groupLifetime.expectSelected('Duration');
    await this.groupLifetimeText.expectValue('123');

    await this.entryName.expectValue('jkl');
    await this.entryLifetime.expectSelected('Duration');
    await this.entryLifetimeText.expectValue('456');
  }

  async clear() {
    await this.cache.choose('Do not cache');
  }

  async assertClear() {
    await this.cache.expectSelected('Do not cache');
  }
}

export const DataCacheTest = new NewPartTest('Cache', (part: Part) => new DbCache(part));
