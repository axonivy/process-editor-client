import './inscription-ui.css';

import { ContainerModule } from 'inversify';
import { InscriptionUi } from './inscription-ui';
import { TYPES, configureActionHandler } from '@eclipse-glsp/client';
import { SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { OpenAction } from 'sprotty-protocol';
import { OpenInscriptionKeyListener, OpenInscriptionMouseListener } from './open-inscription-listener';
import { InscriptionButtonProvider } from './tool-bar';
import { IVY_TYPES } from '@axonivy/process-editor';
import { EnableInscriptionAction, ToggleInscriptionAction } from './action';

const ivyInscriptionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(InscriptionUi).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(InscriptionUi);
  configureActionHandler({ bind, isBound }, EnableInscriptionAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, ToggleInscriptionAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, OpenAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, SwitchThemeAction.KIND, InscriptionUi);
  bind(TYPES.KeyListener).to(OpenInscriptionKeyListener);
  bind(TYPES.MouseListener).to(OpenInscriptionMouseListener);
  bind(IVY_TYPES.ToolBarButtonProvider).to(InscriptionButtonProvider);
});

export default ivyInscriptionModule;
