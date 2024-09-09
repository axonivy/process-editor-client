import { DiagramLoader, FeatureModule, GLSPActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { PerfDiagramLoader } from './perf-diagram-loader';
import { PerfActionDispatcher } from './perf-action-dispatcher';
import { PerfModelViewer } from './perf-viewer';

export function createPerformanceModule(enabled?: boolean): FeatureModule {
  return new FeatureModule(
    (bind, unbind, isBound, rebind) => {
      if (!enabled) {
        return;
      }
      rebind(DiagramLoader).to(PerfDiagramLoader).inSingletonScope();
      rebind(GLSPActionDispatcher).to(PerfActionDispatcher).inSingletonScope();
      rebind(TYPES.ModelViewer).to(PerfModelViewer).inSingletonScope();
    },
    { featureId: Symbol('performance') }
  );
}
