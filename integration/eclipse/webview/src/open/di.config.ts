import { ContainerModule } from 'inversify';
import { configureActionHandler, OpenAction, OpenMouseListener, TYPES } from 'sprotty';

import { OpenInscriptionActionHandler } from './open-handler';

const ivyOpenModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(TYPES.MouseListener).to(OpenMouseListener);
  configureActionHandler({ bind, isBound }, OpenAction.KIND, OpenInscriptionActionHandler);
});

export default ivyOpenModule;
