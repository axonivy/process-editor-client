import { ContainerModule } from 'inversify';
import { CustomIconQuickActionProvider } from './quick-action';
import { IVY_TYPES } from '../types';

const ivyOpenDecoratorBrowserModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(CustomIconQuickActionProvider);
});

export default ivyOpenDecoratorBrowserModule;
