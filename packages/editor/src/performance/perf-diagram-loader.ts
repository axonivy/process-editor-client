import { DiagramLoader, DiagramLoadingOptions, IDiagramStartup, ResolvedDiagramLoadingOptions } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfDiagramLoader extends DiagramLoader {
  protected override async invokeStartupHook(hook: keyof Omit<IDiagramStartup, 'rank'>): Promise<void> {
    console.time('invokeStartupHook-' + hook);
    await super.invokeStartupHook(hook);
    console.timeEnd('invokeStartupHook-' + hook);
  }

  protected override async initialize(options: ResolvedDiagramLoadingOptions): Promise<void> {
    console.time('DiagramLoader.initialize');
    await super.initialize(options);
    console.timeEnd('DiagramLoader.initialize');
  }

  protected override async requestModel(options: ResolvedDiagramLoadingOptions): Promise<void> {
    console.time('DiagramLoader.requestModel');
    await super.requestModel(options);
    console.timeEnd('DiagramLoader.requestModel');
  }

  override async load(options: DiagramLoadingOptions = {}): Promise<void> {
    console.time('DiagramLoader.load');
    await super.load(options);
    console.timeEnd('DiagramLoader.load');
  }
}
