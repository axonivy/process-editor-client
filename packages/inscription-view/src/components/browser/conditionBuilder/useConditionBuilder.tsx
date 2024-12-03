import { IvyIcons } from '@axonivy/ui-icons';
import type { UseBrowserImplReturnValue } from '../useBrowser';
import type { BrowserValue } from '../Browser';
import { useState } from 'react';
import { generateConditionString, logicalOperatorOptions, typeOptions } from './conditionBuilderData';
import { ConditionBuilder, ConditionBuilderProvider } from '@axonivy/ui-components';
import InputWithBrowser from '../../widgets/input/InputWithBrowser';

export const CONDITION_BUILDER_ID = 'condition' as const;

export const useConditionBuilder = (): UseBrowserImplReturnValue => {
  const [condition, setCondition] = useState<BrowserValue>({ cursorValue: '' });

  return {
    id: CONDITION_BUILDER_ID,
    name: 'Condition',
    content: (
      <>
        <ConditionBuilderProvider
          generateConditionString={generateConditionString}
          logicalOperatorOptions={logicalOperatorOptions}
          typeOptions={typeOptions}
          argumentInput={(value, onChange) => (
            <InputWithBrowser value={value} onChange={onChange} browsers={['attr']} style={{ flex: 1 }} />
          )}
        >
          <ConditionBuilder onChange={e => setCondition({ cursorValue: e })} />
        </ConditionBuilderProvider>
        <pre className='browser-helptext'>
          <b>Generated Condition</b>
          <code>{condition.cursorValue}</code>
        </pre>
      </>
    ),
    accept: () => condition,
    icon: IvyIcons.Process
  };
};
