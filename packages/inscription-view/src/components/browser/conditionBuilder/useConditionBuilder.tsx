import { IvyIcons } from '@axonivy/ui-icons';
import type { UseBrowserImplReturnValue } from '../useBrowser';
import type { BrowserValue } from '../Browser';
import { useEffect, useState } from 'react';
import { generateConditionString, logicalOperatorOptions, typeOptions } from './conditionBuilderData';
import { ConditionBuilder, ConditionBuilderProvider } from '@axonivy/ui-components';
import InputWithBrowser from '../../widgets/input/InputWithBrowser';

export const CONDITION_BUILDER_ID = 'condition' as const;

export const useConditionBuilder = (): UseBrowserImplReturnValue => {
  const [value, setValue] = useState<BrowserValue>({ cursorValue: '' });
  return {
    id: CONDITION_BUILDER_ID,
    name: 'Condition',
    content: <ConditionBrowser value={value.cursorValue} onChange={setValue} />,
    accept: () => value,
    icon: IvyIcons.Process
  };
};

type ConditionBrowserProps = {
  value: string;
  onChange: (value: BrowserValue) => void;
};

const ConditionBrowser = ({ value, onChange }: ConditionBrowserProps) => {
  const [condition, setCondition] = useState('');
  useEffect(() => {
    onChange({ cursorValue: condition });
  }, [condition, onChange]);
  return (
    <>
      <ConditionBuilderProvider
        generateConditionString={generateConditionString}
        logicalOperatorOptions={logicalOperatorOptions}
        typeOptions={typeOptions}
        argumentInput={(value, onChange) => <InputWithBrowser value={value} onChange={onChange} browsers={['attr']} style={{ flex: 1 }} />}
      >
        <ConditionBuilder onChange={setCondition} />
      </ConditionBuilderProvider>
      <pre className='browser-helptext'>
        <b>Generated Condition</b>
        <code>{value}</code>
      </pre>
    </>
  );
};
