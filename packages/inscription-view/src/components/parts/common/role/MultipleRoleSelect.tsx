import { useRoles } from '../responsible/useRoles';
import type { BrowserValue } from '../../../browser/Browser';
import { Flex } from '@axonivy/ui-components';
import { useBrowser } from '../../../browser/useBrowser';
import { usePath } from '../../../../context/usePath';
import Browser from '../../../browser/Browser';
import Tags from '../../../widgets/tag/Tags';

type MultipleRoleSelectProps = {
  value: string[];
  onChange: (change: string[]) => void;
  showTaskRoles?: boolean;
};

const MultipleRoleSelect = ({ value, onChange, showTaskRoles }: MultipleRoleSelectProps) => {
  const { roles: roleItems } = useRoles(showTaskRoles);
  const browser = useBrowser();
  const path = usePath();
  const selectedRoles = value.length > 0 ? value : ['Everybody'];

  return (
    <Flex direction='row' alignItems='center' gap={1} className='role-select'>
      <Tags tags={selectedRoles} availableTags={roleItems.map(r => r.label)} customValues={false} onChange={change => onChange(change)} />
      <Browser
        {...browser}
        types={['role']}
        location={path}
        accept={(change: BrowserValue) => onChange([...value, change.cursorValue])}
        roleOptions={{ showTaskRoles }}
      />
    </Flex>
  );
};

export default MultipleRoleSelect;
