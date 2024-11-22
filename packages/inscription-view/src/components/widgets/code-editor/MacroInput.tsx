import './ScriptInput.css';
import type { CodeEditorInputProps } from './SingleLineCodeEditor';
import SingleLineCodeEditor from './SingleLineCodeEditor';
import { useMonacoEditor } from './useCodeEditor';
import { Browser, useBrowser } from '../../../components/browser';
import { usePath } from '../../../context';
import { useOnFocus } from '../../../components/browser/useOnFocus';
import { useField, InputBadge } from '@axonivy/ui-components';
import { badgePropsExpression } from '../../../utils/badgeproperties';

type MacroInputProps = Omit<CodeEditorInputProps, 'context'>;

const MacroInput = ({ value, onChange, browsers, ...props }: MacroInputProps) => {
  const { isFocusWithin, focusWithinProps, focusValue } = useOnFocus(value, onChange);
  const browser = useBrowser();
  const { setEditor, modifyEditor } = useMonacoEditor({ modifyAction: value => `<%=${value}%>` });
  const path = usePath();
  const { inputProps } = useField();

  return (
    // tabIndex is needed for safari to catch the focus when click on browser button
    <div className='script-input' {...focusWithinProps} tabIndex={1}>
      {isFocusWithin || browser.open ? (
        <>
          <SingleLineCodeEditor
            {...focusValue}
            {...inputProps}
            {...props}
            context={{ location: path }}
            macro={true}
            onMountFuncs={[setEditor]}
          />
          <Browser {...browser} types={browsers} accept={modifyEditor} location={path} />
        </>
      ) : (
        <InputBadge badgeProps={badgePropsExpression} value={value} {...inputProps} {...props} />
      )}
    </div>
  );
};

export default MacroInput;
