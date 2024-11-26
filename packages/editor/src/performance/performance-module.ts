import { DiagramLoader, FeatureModule, GLSPActionDispatcher, ModelViewer, TYPES } from '@eclipse-glsp/client';
import { PerfActionDispatcher } from './perf-action-dispatcher';
import { PerfCommandStack } from './perf-command-stack';
import { PerfDiagramLoader } from './perf-diagram-loader';
import { PerfModelViewer } from './perf-viewer';

export function createPerformanceModule(enabled?: boolean): FeatureModule {
  return new FeatureModule(
    (bind, unbind, isBound, rebind) => {
      if (!enabled) {
        return;
      }
      rebind(DiagramLoader).to(PerfDiagramLoader).inSingletonScope();
      rebind(GLSPActionDispatcher).to(PerfActionDispatcher).inSingletonScope();
      rebind(ModelViewer).to(PerfModelViewer).inSingletonScope();
      rebind(TYPES.ICommandStack).to(PerfCommandStack).inSingletonScope();
    },
    { featureId: Symbol('performance') }
  );
}
