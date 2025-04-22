import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { ElementData, ValidationResult, PermissionsData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { usePermissionsPart } from './PermissionsPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = usePermissionsPart();
  return <>{part.content}</>;
};

describe('PermissionsPart', () => {
  function renderPart(data?: PermissionsData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Permissions');
  });

  test('full data', async () => {
    renderPart({
      permissions: {
        view: { allowed: false }
      }
    });
    expect(screen.getByLabelText('Allow all workflow users to view the process on the Engine')).not.toBeChecked();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<PermissionsData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => usePermissionsPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      permissions: {
        view: { allowed: false }
      }
    });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: {
        permissions: {
          view: { allowed: false }
        }
      }
    };
    const view = customRenderHook(() => usePermissionsPart(), {
      wrapperProps: { data, setData: newData => (data = newData) }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.permissions?.view?.allowed).toBeTruthy();
  });
});
