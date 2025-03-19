import './BrowserBody.css';
import { DialogClose, DialogContent, DialogPortal, DialogTitle } from '@radix-ui/react-dialog';
import { Button, Flex } from '@axonivy/ui-components';
import { TabContent, TabList, TabRoot, type Tab } from '../widgets/tab/Tab';
import { useEditorContext } from '../../context/useEditorContext';
import { useTranslation } from 'react-i18next';

interface ReusableBrowserDialogProps {
  open: boolean;
  tabs: Tab[];
  activeTab: string;
  onTabsChange?: (change: string) => void;
  onApply?: () => void;
  disableApply?: boolean;
}

const BrowserBody = ({ open, tabs, activeTab, onTabsChange, onApply, disableApply }: ReusableBrowserDialogProps) => {
  const { t } = useTranslation();
  const { editorRef } = useEditorContext();

  return (
    <DialogPortal container={editorRef.current}>
      <DialogContent
        className={`browser-dialog ${!open ? 'browser-content-exit' : ''}`}
        onInteractOutside={e => {
          e.preventDefault();
        }}
      >
        <div className='browser-content'>
          <TabRoot tabs={tabs} value={activeTab} onChange={onTabsChange}>
            <DialogTitle className='browser-title'>
              <TabList tabs={tabs} />
            </DialogTitle>

            <TabContent tabs={tabs} />
          </TabRoot>
          <Flex alignItems='center' justifyContent='flex-end' gap={1}>
            <DialogClose asChild>
              <Button aria-label={t('common:label.cancel')} size='large'>
                {t('common:label.cancel')}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button aria-label={t('common:label.apply')} onClick={onApply} size='large' variant='primary' disabled={disableApply}>
                {t('common:label.apply')}
              </Button>
            </DialogClose>
          </Flex>
        </div>
      </DialogContent>
    </DialogPortal>
  );
};

export default BrowserBody;
