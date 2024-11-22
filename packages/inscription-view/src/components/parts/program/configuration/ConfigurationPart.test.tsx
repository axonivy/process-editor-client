import type { DeepPartial } from 'test-utils';
import { render, renderHook, screen } from 'test-utils';
import type { ConfigurationData, ElementData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { useConfigurationPart } from './ConfigurationPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useConfigurationPart();
  return <>{part.content}</>;
};

describe('ConfigurationPart', () => {
  function renderPart(data?: DeepPartial<ConfigurationData>) {
    render(<Part />, {
      wrapperProps: {
        data: data && { config: data },
        meta: {
          widgets: [
            { text: 'Path of directory to scan', multiline: false, widgetType: 'LABEL' },
            { configKey: 'directory', multiline: false, widgetType: 'TEXT' },
            { text: 'Multiline-Text', multiline: true, widgetType: 'LABEL' }
          ]
        }
      }
    });
  }

  test('empty data', async () => {
    render(<Part />);
    expect(screen.getByTitle('No configuration needed')).toBeInTheDocument();
  });

  test('full data', async () => {
    renderPart({
      userConfig: { directory: '/tmp/myDir' }
    });
    await screen.findByText('Path of directory to scan');
    expect(screen.getByDisplayValue('/tmp/myDir')).toBeInTheDocument();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ConfigurationData>, validation?: ValidationResult) {
    const { result } = renderHook(() => useConfigurationPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      userConfig: { directory: '/tmp/myDir' }
    });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: {
        userConfig: { directory: '/tmp/myDir' }
      }
    };
    const view = renderHook(() => useConfigurationPart(), {
      wrapperProps: { data, setData: newData => (data = newData) }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.userConfig).toEqual({});
  });
});
