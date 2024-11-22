import type { Consumer } from '../../../../types/lambda';
import { ExceptionSelect, PathFieldset } from '../../common';

const ErrorSelect = (props: { value: string; onChange: Consumer<string> }) => {
  return (
    <PathFieldset label='Error' path='error'>
      <ExceptionSelect {...props} staticExceptions={[]} />
    </PathFieldset>
  );
};

export default ErrorSelect;
