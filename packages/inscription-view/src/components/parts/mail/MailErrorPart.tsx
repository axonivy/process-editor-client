import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import Checkbox from '../../widgets/checkbox/Checkbox';
import ExceptionSelect from '../common/exception-handler/ExceptionSelect';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { useMailData } from './useMailData';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS } from '@axonivy/process-editor-inscription-protocol';

export function useMailErrorPart(): PartProps {
  const { config, initConfig, defaultConfig, resetError } = useMailData();
  const compareData = (data: MailData) => [data.exceptionHandler, data.failIfMissingAttachments];
  const exceptionValidations = useValidations(['exceptionHandler']);
  const state = usePartState(compareData(defaultConfig), compareData(config), exceptionValidations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Error', state, reset: { dirty, action: () => resetError() }, content: <MailErrorPart /> };
}

const MailErrorPart = () => {
  const { config, defaultConfig, update } = useMailData();

  return (
    <>
      <ValidationCollapsible
        label='Error'
        defaultOpen={config.failIfMissingAttachments || config.exceptionHandler !== defaultConfig.exceptionHandler}
      >
        <PathContext path='exceptionHandler'>
          <ExceptionSelect
            value={config.exceptionHandler}
            onChange={change => update('exceptionHandler', change)}
            staticExceptions={[IVY_EXCEPTIONS.mail, IVY_EXCEPTIONS.ignoreException]}
          />
        </PathContext>
        <Checkbox
          label='Throw an error if any attachment is missing'
          value={config.failIfMissingAttachments}
          onChange={change => {
            update('failIfMissingAttachments', change);
          }}
        />
      </ValidationCollapsible>
    </>
  );
};
