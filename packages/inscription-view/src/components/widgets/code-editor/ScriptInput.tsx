import './ScriptInput.css';
import { Input } from '../input';
import type { CodeEditorInputProps } from './SingleLineCodeEditor';
import SingleLineCodeEditor from './SingleLineCodeEditor';
import { useMonacoEditor } from './useCodeEditor';
import { Browser, useBrowser } from '../../../components/browser';
import { usePath } from '../../../context';
import { useOnFocus } from '../../../components/browser/useOnFocus';
import { useField } from '@axonivy/ui-components';

const ScriptInput = ({
  value,
  onChange,
  type,
  editorOptions,
  keyActions,
  modifyAction,
  browsers,
  placeholder,
  ...props
}: CodeEditorInputProps & { type: string }) => {
  const { isFocusWithin, focusWithinProps, focusValue } = useOnFocus(value, onChange);
  const browser = useBrowser();
  const { setEditor, modifyEditor } = useMonacoEditor({ modifyAction: modifyAction });
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
            context={{ type, location: path }}
            onMountFuncs={[setEditor]}
            editorOptions={editorOptions}
            keyActions={keyActions}
          />
          <Browser {...browser} types={browsers} accept={modifyEditor} location={path} />
        </>
      ) : (
        <Input value={value} onChange={onChange} placeholder={placeholder} {...inputProps} {...props} />
      )}
    </div>
  );
};

export default ScriptInput;
