import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../types';
import { AttachCommentProvider } from './actions';

const ivyNodeModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(AttachCommentProvider);
});

export default ivyNodeModule;
