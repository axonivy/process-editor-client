import type { DeepPartial } from 'test-utils';
import { customRender, screen, TableUtil, customRenderHook, CollapsableUtil } from 'test-utils';
import type { WfCase, CaseData, ElementData } from '@axonivy/process-editor-inscription-protocol';
import { useCasePart } from './CasePart';
import type { PartStateFlag } from '../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useCasePart();
  return <>{part.content}</>;
};

describe('CasePart', () => {
  function renderPart(data?: CaseData) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(name: string, description: string, category: string) {
    expect(await screen.findByLabelText('Name')).toHaveValue(name);
    expect(await screen.findByLabelText('Description')).toHaveValue(description);
    expect(await screen.findByLabelText('Category')).toHaveValue(category);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Details');
    await CollapsableUtil.assertClosed('Custom Fields');
  });

  test('full data', async () => {
    const caseData: CaseData = {
      case: {
        name: 'name',
        description: 'description',
        category: 'category',
        customFields: [{ name: 'field', type: 'STRING', value: '123' }],
        attachToBusinessCase: true
      }
    };
    renderPart(caseData);
    await assertMainPart('name', 'description', 'category');
    await CollapsableUtil.assertOpen('Custom Fields');
    TableUtil.assertRows(['field 123']);
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<WfCase>) {
    const { result } = customRenderHook(() => useCasePart(), { wrapperProps: { data: data && { config: { case: data } } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { name: 'name' });
    assertState('configured', { description: 'des' });
    assertState('configured', { category: 'category' });
    assertState('configured', { customFields: [{ name: 'asfd', type: 'NUMBER', value: '123' }] });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: {
        case: {
          name: 'name',
          description: 'description',
          category: 'category',
          customFields: [{ name: 'field', type: 'STRING', value: '123' }],
          attachToBusinessCase: true
        }
      }
    };
    const view = customRenderHook(() => useCasePart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { case: { name: 'init' } } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.case?.name).toEqual('init');
    expect(data.config?.case?.description).toEqual('');
    expect(data.config?.case?.category).toEqual('');
    expect(data.config?.case?.customFields).toEqual([]);
  });
});
