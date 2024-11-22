import type { ConfigDataContext } from '../../../../context';
import { useConfigDataContext } from '../../../../context';
import type { EventData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../../types/lambda';

export function useEventData(): ConfigDataContext<EventData> & {
  update: DataUpdater<EventData>;
  updateTimeout: DataUpdater<EventData['timeout']>;
  reset: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<EventData> = (field, value) => {
    setConfig(
      produce((draft: EventData) => {
        draft[field] = value;
      })
    );
  };

  const updateTimeout: DataUpdater<EventData['timeout']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.timeout[field] = value;
      })
    );
  };

  const reset = () =>
    setConfig(
      produce(draft => {
        draft.javaClass = config.initConfig.javaClass;
        draft.eventId = config.initConfig.eventId;
        draft.timeout = config.initConfig.timeout;
      })
    );

  return {
    ...config,
    update,
    updateTimeout,
    reset
  };
}
