import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useMailData(): ConfigDataContext<MailData> & {
  update: DataUpdater<MailData>;
  updateHeader: DataUpdater<MailData['headers']>;
  resetHeaders: () => void;
  updateMessage: DataUpdater<MailData['message']>;
  resetMessage: () => void;
  resetError: () => void;
  resetAttachments: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<MailData> = (field, value) =>
    setConfig(
      produce((draft: MailData) => {
        draft[field] = value;
      })
    );

  const updateHeader: DataUpdater<MailData['headers']> = (field, value) =>
    setConfig(
      produce(draft => {
        draft.headers[field] = value;
      })
    );

  const resetHeaders = () =>
    setConfig(
      produce(draft => {
        draft.headers = config.initConfig.headers;
      })
    );

  const updateMessage: DataUpdater<MailData['message']> = (field, value) =>
    setConfig(
      produce(draft => {
        draft.message[field] = value;
      })
    );

  const resetMessage = () =>
    setConfig(
      produce(draft => {
        draft.message = config.initConfig.message;
      })
    );

  const resetAttachments = () =>
    setConfig(
      produce(draft => {
        draft.attachments = config.initConfig.attachments;
      })
    );

  const resetError = () =>
    setConfig(
      produce(draft => {
        draft.exceptionHandler = config.initConfig.exceptionHandler;
        draft.failIfMissingAttachments = config.initConfig.failIfMissingAttachments;
      })
    );

  return {
    ...config,
    update,
    updateHeader,
    resetHeaders,
    updateMessage,
    resetMessage,
    resetError,
    resetAttachments
  };
}
