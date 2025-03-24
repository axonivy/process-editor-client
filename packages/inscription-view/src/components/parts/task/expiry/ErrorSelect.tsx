import { useTranslation } from 'react-i18next';
import type { Consumer } from '../../../../types/lambda';
import ExceptionSelect from '../../common/exception-handler/ExceptionSelect';
import { PathFieldset } from '../../common/path/PathFieldset';

const ErrorSelect = (props: { value: string; onChange: Consumer<string> }) => {
  const { t } = useTranslation();
  return (
    <PathFieldset label={t('label.error')} path='error'>
      <ExceptionSelect {...props} staticExceptions={[]} />
    </PathFieldset>
  );
};

export default ErrorSelect;
