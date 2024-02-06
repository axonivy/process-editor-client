import { BindingContext, bindOrRebind } from '@eclipse-glsp/client';
import { interfaces } from 'inversify';

export function bindOrRebindAsService<S, T extends S>(
  context: Omit<BindingContext, 'unbind'>,
  serviceIdentifier: interfaces.ServiceIdentifier<S>,
  targetService: interfaces.ServiceIdentifier<T>
): void {
  context.bind(targetService).toSelf().inSingletonScope();
  bindOrRebind(context, serviceIdentifier).toService(targetService);
}
