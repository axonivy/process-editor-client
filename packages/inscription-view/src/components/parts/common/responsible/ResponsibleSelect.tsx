import './ResponsibleSelect.css';
import { useMemo } from 'react';
import type { WfResponsible, WfResponsibleType, WfTask } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import type { DataUpdater } from '../../../../types/lambda';
import RoleSelect from './RoleSelect';
import { Field, Flex } from '@axonivy/ui-components';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import type { SelectItem } from '../../../widgets/select/Select';
import Select from '../../../widgets/select/Select';
import { useTranslation } from 'react-i18next';

export type ResponsibleUpdater = DataUpdater<WfTask['responsible']>;

type ResponsibleProps = { responsible?: WfResponsible; updateResponsible: ResponsibleUpdater };
type ActivatorProps = ResponsibleProps & { selectedType?: WfResponsibleType };

const ResponsibleActivator = ({ selectedType, ...props }: ActivatorProps) => {
  switch (selectedType) {
    case 'ROLE':
      return (
        <RoleSelect
          value={props.responsible?.activator}
          onChange={change => props.updateResponsible('activator', change)}
          showTaskRoles={true}
        />
      );
    case 'ROLE_FROM_ATTRIBUTE':
    case 'USER_FROM_ATTRIBUTE':
      return (
        <ScriptInput
          value={props.responsible?.activator ?? ''}
          onChange={change => props.updateResponsible('activator', change)}
          type={IVY_SCRIPT_TYPES.STRING}
          browsers={['attr', 'func', 'type']}
        />
      );
    case 'MEMBERS_FROM_ATTRIBUTE':
      return (
        <ScriptInput
          value={props.responsible?.activator ?? ''}
          onChange={change => props.updateResponsible('activator', change)}
          type={IVY_SCRIPT_TYPES.STRING_LIST}
          browsers={['attr', 'func', 'type']}
        />
      );
    case 'DELETE_TASK':
    default:
      return <></>;
  }
};

const useResponsibleItems = (optionFilter?: WfResponsibleType[]) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const items: Array<SelectItem<WfResponsibleType>> = [
      { label: t('responsible.role'), value: 'ROLE' },
      { label: t('responsible.roleFromAttr'), value: 'ROLE_FROM_ATTRIBUTE' },
      { label: t('responsible.userFromAttr'), value: 'USER_FROM_ATTRIBUTE' },
      { label: t('responsible.memberFromAttr'), value: 'MEMBERS_FROM_ATTRIBUTE' },
      { label: t('responsible.delete'), value: 'DELETE_TASK' }
    ];
    return items.filter(responsible => !(optionFilter && optionFilter.includes(responsible.value)));
  }, [optionFilter, t]);
};

export type ResponsibleSelectProps = ResponsibleProps & {
  optionFilter?: WfResponsibleType[];
};

const ResponsibleSelect = ({ responsible, updateResponsible, optionFilter }: ResponsibleSelectProps) => {
  const items = useResponsibleItems(optionFilter);
  const selectedType = useMemo(() => {
    const defaultResp = items.find(r => r.value === 'ROLE') ?? items[0];
    return items.find(r => r.value === responsible?.type) ?? defaultResp;
  }, [responsible?.type, items]);

  return (
    <Flex direction='row' gap={2} className='responsible-select'>
      <Select items={items} value={selectedType} onChange={item => updateResponsible('type', item.value as WfResponsibleType)} />
      <Field>
        <ResponsibleActivator
          responsible={responsible}
          updateResponsible={updateResponsible}
          selectedType={selectedType?.value as WfResponsibleType}
        />
      </Field>
    </Flex>
  );
};

export default ResponsibleSelect;
