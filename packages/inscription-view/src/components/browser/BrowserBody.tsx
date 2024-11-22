import './BrowserBody.css';
import { DialogClose, DialogContent, DialogPortal, DialogTitle } from '@radix-ui/react-dialog';
import { TabList, TabRoot, type Tab, TabContent } from '../widgets';
import { useEditorContext } from '../../context';
import { Button, Flex } from '@axonivy/ui-components';

interface ReusableBrowserDialogProps {
  open: boolean;
  tabs: Tab[];
  activeTab: string;
  onTabsChange?: (change: string) => void;
  onApply?: () => void;
  disableApply?: boolean;
}

const BrowserBody = ({ open, tabs, activeTab, onTabsChange, onApply, disableApply }: ReusableBrowserDialogProps) => {
  const { editorRef } = useEditorContext();

  return (
    <DialogPortal container={editorRef.current}>
      <DialogContent className={`browser-dialog ${!open ? 'browser-content-exit' : ''}`}>
        <div className='browser-content'>
          <TabRoot tabs={tabs} value={activeTab} onChange={onTabsChange}>
            <DialogTitle className='browser-title'>
              <TabList tabs={tabs} />
            </DialogTitle>

            <TabContent tabs={tabs} />
          </TabRoot>
          <Flex alignItems='center' justifyContent='flex-end' gap={1}>
            <DialogClose asChild>
              <Button aria-label='Cancel' size='large'>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button aria-label='Apply' onClick={onApply} size='large' variant='primary' disabled={disableApply}>
                Apply
              </Button>
            </DialogClose>
          </Flex>
        </div>
      </DialogContent>
    </DialogPortal>
  );
};

export default BrowserBody;
