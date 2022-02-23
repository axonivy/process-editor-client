import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../quick-action/quick-action';
import { AttachCommentProvider } from './actions';

const ivyNodeModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(AttachCommentProvider);
});

export default ivyNodeModule;
