import type { InscriptionActionArgs } from '@axonivy/process-editor-inscription-protocol';
import { useClient } from './useClient';
import { useEditorContext } from './useEditorContext';

export function useAction(actionId: InscriptionActionArgs['actionId']) {
  const { elementContext: context } = useEditorContext();
  const client = useClient();

  return (content?: InscriptionActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
