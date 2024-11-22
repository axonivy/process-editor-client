import { Deferred } from './promises-util';

import type * as monacoLanguageClient from 'monaco-languageclient';
export type MonacoLanguageClient = typeof monacoLanguageClient;

import type * as monacoEditorWorkers from 'monaco-editor-workers';
export type MonacoEditorWorkers = typeof monacoEditorWorkers;

import type * as monacoEditorApi from 'monaco-editor';
import { ConsoleTimer, logIf } from './console-util';
export type MonacoEditorApi = typeof monacoEditorApi;

export type WorkerConstructor = (new (...args: any) => Worker) | (new (...args: any) => Promise<Worker>);

// from monaco-editor-workers
export interface MonacoWorkerConfig {
  workerPath?: string;
  basePath?: string;
  useModuleWorker?: boolean;

  // extension
  workerType?: 'typescript' | 'javascript' | 'html' | 'handlebars' | 'razor' | 'css' | 'scss' | 'less' | 'json' | 'editor';
  workerConstructor?: WorkerConstructor;
  skip?: boolean;
  debug?: boolean;
}

export interface MonacoLanguageClientConfig extends monacoLanguageClient.InitializeServiceConfig {
  initializationDelay?: number;
  initializationMaxTries?: number;

  skip?: boolean;
  debug?: boolean;
}

export namespace MonacoUtil {
  let monacoLanguageClientPromise: Promise<MonacoLanguageClient>;
  export async function monacoLanguageClient(): Promise<MonacoLanguageClient> {
    if (!monacoLanguageClientPromise) {
      monacoLanguageClientPromise = import('monaco-languageclient');
    }
    return monacoLanguageClientPromise;
  }

  let monacoEditorWorkersPromise: Promise<MonacoEditorWorkers>;
  export async function monacoEditorWorkers(): Promise<MonacoEditorWorkers> {
    if (!monacoEditorWorkersPromise) {
      monacoEditorWorkersPromise = import('monaco-editor-workers');
    }
    return monacoEditorWorkersPromise;
  }

  let monacoEditorApiPromise: Promise<MonacoEditorApi>;
  export async function monacoEditorApi(): Promise<MonacoEditorApi> {
    if (!monacoEditorApiPromise) {
      monacoEditorApiPromise = import('monaco-editor');
    }
    return monacoEditorApiPromise;
  }

  /**
   * Imports all services and initializes the VS Code extension API for the language client.
   * If complete, the vscodeApiInitialised will be set on the MonacoEnvironment.
   * You can query this flag through the 'monacoInitialized' function.
   */
  export async function configureLanguageClient(config?: MonacoLanguageClientConfig): Promise<void> {
    if (config?.skip) {
      logIf(config.debug, 'Skip Monaco Language Client Configuration.');
      return;
    }
    const timer = new ConsoleTimer(config?.debug, 'Configure Language Client');
    timer.start();
    timer.step('Start initializing Services and VS Code Extension API...');
    const languageClient = await monacoLanguageClient();
    await languageClient.initServices(config);
    timer.step('Waiting for VS Code API to be initialized...');
    await monacoInitialized(config?.initializationDelay, config?.initializationMaxTries);
    timer.end();
  }

  /**
   * Ensures that we have the necessary MonacoEnvironment.getWorker function available.
   */
  export async function configureWorkers(config?: MonacoWorkerConfig): Promise<void> {
    if (config?.skip) {
      logIf(config.debug, 'Skip Monaco Worker Configuration.');
      return;
    }
    const timer = new ConsoleTimer(config?.debug, 'Configure Monaco Workers').start();

    // default behavior for MonacoEnvironment.getWorker
    timer.step('Start configuring MonacoEnvironment.getWorker...');
    const monacoEditorWorker = await monacoEditorWorkers();
    monacoEditorWorker.buildWorkerDefinition(
      config?.workerPath ?? '../../../node_modules/monaco-editor-workers/dist/workers',
      config?.basePath ?? import.meta.url,
      config?.useModuleWorker ?? false
    );
    const defaultGetWorker = self.MonacoEnvironment?.getWorker;

    // overridden behavior for MonacoEnvironment.getWorker if an explicit worker constructor is given
    if (config?.workerConstructor) {
      timer.step('Override MonacoEnvironment.getWorker with given WorkerConstructor...');
      const WorkerConstructor = config.workerConstructor;

      self.MonacoEnvironment = {
        ...self.MonacoEnvironment,
        async getWorker(id, label) {
          try {
            timer.log('[MonacoEnvironment] Create Worker...');
            const worker = await new WorkerConstructor(id, label);
            timer.log('[MonacoEnvironment] Success.');
            return worker;
          } catch (error) {
            console.error(error);
            timer.log('[MonacoEnvironment] Default to fallback worker...');
            if (defaultGetWorker) {
              const worker = await defaultGetWorker(id, config.workerType ?? label);
              timer.log('[MonacoEnvironment] Success.');
              return worker;
            }
            throw error;
          }
        }
      };
    }
    timer.end();
  }

  export async function configureEnvironment(config?: {
    worker?: MonacoWorkerConfig;
    languageClient?: MonacoLanguageClientConfig;
    debug?: boolean;
  }): Promise<void> {
    await Promise.all([
      MonacoUtil.configureWorkers({ ...config?.worker, debug: config?.worker?.debug ?? config?.debug }),
      MonacoUtil.configureLanguageClient({ ...config?.languageClient, debug: config?.languageClient?.debug ?? config?.debug })
    ]);
  }

  export async function monacoInitialized(delay: number = 100, maxTries: number = 30): Promise<void> {
    const deferred = new Deferred<void>();
    let tries = 0;
    const initializationCheck = async () => {
      try {
        tries += 1;
        if ((await monacoLanguageClient()).wasVscodeApiInitialized()) {
          deferred.resolve();
        } else if (tries < maxTries) {
          setTimeout(initializationCheck, delay);
        } else {
          deferred.reject(new Error('Monaco initialization timed out.'));
        }
      } catch (error) {
        deferred.reject(error);
      }
    };
    initializationCheck();
    return deferred.promise;
  }
}
