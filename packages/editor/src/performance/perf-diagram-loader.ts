import {
  ApplicationIdProvider,
  DiagramLoader,
  DiagramLoadingOptions,
  GLSPClient,
  IDiagramStartup,
  Ranked,
  ResolvedDiagramLoadingOptions
} from '@eclipse-glsp/client';
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
    this.diagramStartups.sort(Ranked.sort);
    await this.invokeStartupHook('preLoadDiagram');
    const resolvedOptions: ResolvedDiagramLoadingOptions = {
      requestModelOptions: {
        sourceUri: this.options.sourceUri ?? '',
        diagramType: this.options.diagramType,
        ...options.requestModelOptions
      },
      initializeParameters: {
        applicationId: ApplicationIdProvider.get(),
        protocolVersion: GLSPClient.protocolVersion,
        ...options.initializeParameters
      },
      enableNotifications: options.enableNotifications ?? true
    };
    await this.actionDispatcher.initialize();
    await this.invokeStartupHook('preInitialize');
    await this.initialize(resolvedOptions);
    await this.invokeStartupHook('preRequestModel');
    await this.requestModel(resolvedOptions);
    await this.invokeStartupHook('postRequestModel');
    this.modelInitializationConstraint.onInitialized(() => this.invokeStartupHook('postModelInitialization'));
  }
}
