import { type UseBrowserReturnValue } from './useBrowser';
import { IvyIcons } from '@axonivy/ui-icons';
import { MaximizedCodeEditor, type MaximizedCodeEditorProps } from './maximizedCodeEditor/MaximizedCodeEditor';
import BrowserBody from './BrowserBody';
import type { Tab } from '../widgets/tab/Tab';
import { Dialog } from '@axonivy/ui-components';

type MaximaziedCodeEditorBrowserProps = UseBrowserReturnValue & MaximizedCodeEditorProps;

export const MaximizedCodeEditorBrowser = ({
  open,
  onOpenChange,
  browsers,
  editorValue,
  applyEditor,
  location,
  selectionRange,
  macro,
  type
}: MaximaziedCodeEditorBrowserProps) => {
  const tabs: Tab[] = [
    {
      content: (
        <MaximizedCodeEditor
          applyEditor={applyEditor}
          browsers={browsers}
          editorValue={editorValue}
          location={location}
          selectionRange={selectionRange}
          open={open}
          keyActions={{
            escape: () => {
              onOpenChange(false);
            }
          }}
          type={type}
          macro={macro}
        />
      ),
      id: 'maxCode',
      name: 'Code',
      icon: IvyIcons.StartProgram
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <BrowserBody activeTab='maxCode' tabs={tabs} />
    </Dialog>
  );
};
