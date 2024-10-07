import { CommandExecutionContext, GModelRoot, SetModelCommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfSetModelCommand extends SetModelCommand {
  protected counter = 0;

  execute(context: CommandExecutionContext): GModelRoot {
    const counter = ++this.counter;
    console.time(`execute SetModelCommand (sc) ${counter}`);
    console.time(`sc-createOldRoot (${counter})`);
    this.oldRoot = context.modelFactory.createRoot(context.root);
    console.timeEnd(`sc-createOldRoot (${counter})`);
    console.time(`sc-createNewRoot (${counter})`);
    this.newRoot = context.modelFactory.createRoot(this.action.newRoot);
    console.timeEnd(`sc-createNewRoot (${counter})`);
    console.timeEnd(`execute SetModelCommand (sc) ${counter}`);

    return this.newRoot;
  }
}
