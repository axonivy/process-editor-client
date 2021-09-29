import { ContainerModule } from 'inversify';
import { configureActionHandler, OpenAction, TYPES } from 'sprotty';

import { OpenInscriptionActionHandler, OpenInscriptionKeyListener } from './open-handler';

const ivyOpenModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(TYPES.KeyListener).to(OpenInscriptionKeyListener);
  configureActionHandler({ bind, isBound }, OpenAction.KIND, OpenInscriptionActionHandler);
});

export default ivyOpenModule;
