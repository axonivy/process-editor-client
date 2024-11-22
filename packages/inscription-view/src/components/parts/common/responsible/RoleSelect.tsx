import { useMemo } from 'react';
import type { SelectItem } from '../../../widgets';
import { Select } from '../../../widgets';
import { useRoles } from './useRoles';
import { Browser, useBrowser } from '../../../browser';
import { usePath } from '../../../../context';
import type { BrowserValue } from '../../../browser/Browser';
import { Flex } from '@axonivy/ui-components';

const DEFAULT_ROLE: SelectItem = { label: 'Everybody', value: 'Everybody' } as const;

type RoleSelectProps = {
  value?: string;
  onChange: (change: string) => void;
  showTaskRoles?: boolean;
};

const RoleSelect = ({ value, onChange, showTaskRoles }: RoleSelectProps) => {
  const { roles: roleItems } = useRoles(showTaskRoles);
  const browser = useBrowser();
  const path = usePath();
  const selectedRole = useMemo<SelectItem | undefined>(() => {
    if (value) {
      return roleItems.find(e => e.value === value) ?? { label: value, value };
    }
    return DEFAULT_ROLE;
  }, [value, roleItems]);

  return (
    <Flex direction='row' alignItems='center' gap={1} className='role-select'>
      <Select items={roleItems} value={selectedRole} onChange={item => onChange(item.value)} />
      <Browser
        {...browser}
        types={['role']}
        location={path}
        accept={(change: BrowserValue) => onChange(change.cursorValue)}
        roleOptions={{ showTaskRoles }}
      />
    </Flex>
  );
};

export default RoleSelect;
