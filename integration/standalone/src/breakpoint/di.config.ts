import { ContainerModule } from 'inversify';
import { configureActionHandler } from 'sprotty';
import { StandaloneShowBreakpointAction, StandaloneShowBreakpointActionHandler } from './action-handler';

const ivyStandaloneBreakpointModule = new ContainerModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, StandaloneShowBreakpointAction.KIND, StandaloneShowBreakpointActionHandler);
});

export default ivyStandaloneBreakpointModule;
