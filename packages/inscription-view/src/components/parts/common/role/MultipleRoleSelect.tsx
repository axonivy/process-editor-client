import './MultipleRoleSelect.css';
import { useRoles } from './useRoles';
import type { BrowserValue } from '../../../browser/Browser';
import { Flex } from '@axonivy/ui-components';
import { useBrowser } from '../../../browser/useBrowser';
import { usePath } from '../../../../context/usePath';
import Browser from '../../../browser/Browser';
import Tags from '../../../widgets/tag/Tags';

type MultipleRoleSelectProps = {
  value: string[];
  defaultRoles: string[];
  onChange: (change: string[]) => void;
  showTaskRoles?: boolean;
};

const MultipleRoleSelect = ({ value, defaultRoles, onChange, showTaskRoles }: MultipleRoleSelectProps) => {
  const { roles: roleItems } = useRoles(showTaskRoles);
  const browser = useBrowser();
  const path = usePath();
  const selectedRoles = value.length > 0 ? value : defaultRoles;

  return (
    <Flex direction='row' alignItems='center' gap={1} className='role-select'>
      <Tags tags={selectedRoles} availableTags={roleItems} customValues={false} onChange={change => onChange(change)} allowSpaces={true} />
      <Browser
        {...browser}
        types={['role']}
        location={path}
        accept={(change: BrowserValue) => {
          if (change.cursorValue) {
            const uniqueValues = [...new Set([...value, change.cursorValue])];
            onChange(uniqueValues);
          }
        }}
        roleOptions={{ showTaskRoles }}
      />
    </Flex>
  );
};

export default MultipleRoleSelect;
