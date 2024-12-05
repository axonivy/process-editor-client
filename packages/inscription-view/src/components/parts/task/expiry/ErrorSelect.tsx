import type { Consumer } from '../../../../types/lambda';
import ExceptionSelect from '../../common/exception-handler/ExceptionSelect';
import { PathFieldset } from '../../common/path/PathFieldset';

const ErrorSelect = (props: { value: string; onChange: Consumer<string> }) => {
  return (
    <PathFieldset label='Error' path='error'>
      <ExceptionSelect {...props} staticExceptions={[]} />
    </PathFieldset>
  );
};

export default ErrorSelect;
