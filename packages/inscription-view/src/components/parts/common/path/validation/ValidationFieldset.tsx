import type { FieldsetProps } from '../../../../widgets/fieldset/Fieldset';
import Fieldset from '../../../../widgets/fieldset/Fieldset';
import { useValidation } from '../../../../../context';

export const ValidationFieldset = ({ children, ...props }: FieldsetProps) => {
  const validation = useValidation();
  return (
    <Fieldset {...props} validation={validation} className='ui-fieldset-validation'>
      {children}
    </Fieldset>
  );
};
