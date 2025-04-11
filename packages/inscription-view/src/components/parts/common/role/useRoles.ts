import { useEffect, useState } from 'react';
import { EMPTY_ROLE, type RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import type { SelectItem } from '../../../widgets/select/Select';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';

export const useRoles = (showTaskRoles = false) => {
  const [roles, setRoles] = useState<SelectItem[]>([]);
  const [rolesAsTree, setRolesAsTree] = useState<RoleMeta[]>([]);
  const { context, elementContext } = useEditorContext();
  const roleTree = useMeta('meta/workflow/roleTree', context, EMPTY_ROLE).data;
  const taskRoles = useMeta('meta/workflow/taskRoles', elementContext, []).data;

  useEffect(() => {
    const flatRoles: SelectItem[] = [];
    const treeRoles: RoleMeta[] = [];
    const addFlatRoles = (role: RoleMeta) => {
      flatRoles.push({ label: role.id, value: role.id });
      role.children.forEach(addFlatRoles);
    };
    if (showTaskRoles) {
      taskRoles.forEach(role => {
        treeRoles.push(role);
        addFlatRoles(role);
      });
    }
    treeRoles.push(roleTree);
    setRolesAsTree(treeRoles);
    addFlatRoles(roleTree);
    setRoles(flatRoles);
  }, [roleTree, setRolesAsTree, showTaskRoles, taskRoles]);

  return { rolesAsTree, roles, taskRoles };
};
