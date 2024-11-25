import { Composite } from './Composite';
import { InfoComponent } from './InfoComponent';
import { ResponsibleComponent, ResponsibleSection } from './ResponsibleComponent';
import { Section } from './Section';

export abstract class Part extends Composite {
  section(label: string) {
    return new Section(this.page, this.locator, label);
  }

  infoComponent() {
    return new InfoComponent(this);
  }

  responsibleComponent() {
    return new ResponsibleComponent(this);
  }

  responsibleSection() {
    return new ResponsibleSection(this);
  }
}
