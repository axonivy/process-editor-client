import { useValidation } from '../../../../../context/useValidation';
import type { FieldsetProps } from '../../../../widgets/fieldset/Fieldset';
import Fieldset from '../../../../widgets/fieldset/Fieldset';

export const ValidationFieldset = ({ children, ...props }: FieldsetProps) => {
  const validation = useValidation();
  return (
    <Fieldset {...props} validation={validation} className='ui-fieldset-validation'>
      {children}
    </Fieldset>
  );
};
