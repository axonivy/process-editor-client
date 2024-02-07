import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';
import { StandaloneShowBreakpointAction, StandaloneShowBreakpointActionHandler } from './action-handler';

const ivyStandaloneBreakpointModule = new FeatureModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, StandaloneShowBreakpointAction.KIND, StandaloneShowBreakpointActionHandler);
});

export default ivyStandaloneBreakpointModule;
