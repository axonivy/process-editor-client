import { IVY_TYPES } from '@ivyteam/process-editor';
import { ContainerModule } from 'inversify';
import { configureActionHandler, OpenAction, TYPES } from 'sprotty';

import { OpenInscriptionActionHandler, OpenInscriptionKeyListener } from './open-inscription-handler';
import { InscribeQuickActionProvider } from './quick-action';

const ivyOpenInscriptionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(TYPES.KeyListener).to(OpenInscriptionKeyListener);
  configureActionHandler({ bind, isBound }, OpenAction.KIND, OpenInscriptionActionHandler);
  bind(IVY_TYPES.QuickActionProvider).to(InscribeQuickActionProvider);
});

export default ivyOpenInscriptionModule;
