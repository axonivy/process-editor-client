import { FeatureModule } from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { CustomIconQuickActionProvider } from './quick-action';

const ivyOpenDecoratorBrowserModule = new FeatureModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(CustomIconQuickActionProvider);
});

export default ivyOpenDecoratorBrowserModule;
