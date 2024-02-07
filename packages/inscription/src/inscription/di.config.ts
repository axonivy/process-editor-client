import './inscription-ui.css';

import { IVY_TYPES } from '@axonivy/process-editor';
import { SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { FeatureModule, TYPES, bindAsService, configureActionHandler } from '@eclipse-glsp/client';
import { OpenAction } from 'sprotty-protocol';
import { EnableInscriptionAction, ToggleInscriptionAction } from './action';
import { InscriptionUi } from './inscription-ui';
import { OpenInscriptionKeyListener, OpenInscriptionMouseListener } from './open-inscription-listener';
import { InscriptionButtonProvider } from './tool-bar';

const ivyInscriptionModule = new FeatureModule((bind, _unbind, isBound) => {
  bindAsService(bind, TYPES.IUIExtension, InscriptionUi);
  configureActionHandler({ bind, isBound }, EnableInscriptionAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, ToggleInscriptionAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, OpenAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, SwitchThemeAction.KIND, InscriptionUi);
  bind(TYPES.KeyListener).to(OpenInscriptionKeyListener);
  bind(TYPES.MouseListener).to(OpenInscriptionMouseListener);
  bind(IVY_TYPES.ToolBarButtonProvider).to(InscriptionButtonProvider);
});

export default ivyInscriptionModule;
