import './PartTab.css';
import { Tabs as TabsRoot, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { IvyIcons } from '@axonivy/ui-icons';
import type { ValidationMessage } from '../../../widgets/message/Message';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../../widgets/error/ErrorFallback';
import type { PartState } from '../usePart';
import { Control, State } from '../Part';

export type Tab = {
  id: string;
  name: string;
  state: PartState;
  reset: { dirty: boolean; action: () => void };
  messages?: ValidationMessage[];
  icon?: IvyIcons;
  content: ReactNode;
};

export type TabsProps = {
  tabs: Tab[];
  value?: string;
  onChange?: (change: string) => void;
};

export const Tabs = (props: TabsProps) => (
  <TabRoot {...props}>
    <TabList {...props} />
    <TabContent {...props} />
  </TabRoot>
);

export const TabRoot = ({ tabs, value, onChange, children }: TabsProps & { children: ReactNode }) => {
  const defaultTab = tabs.length > 0 ? tabs[0].id : '';
  console.log(defaultTab);
  return (
    <TabsRoot className='part-tabs-root' defaultValue={defaultTab} value={value} onValueChange={onChange}>
      {children}
    </TabsRoot>
  );
};

export const TabList = ({ tabs }: TabsProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [compactView, setCompactView] = useState(false);
  const MAX_TAB_WIDTH = 100;

  useEffect(() => {
    const checkOverflow = () => {
      if (listRef.current) {
        const availableWidth = listRef.current.clientWidth;
        const requiredWidth = tabs.length * MAX_TAB_WIDTH;
        setCompactView(availableWidth < requiredWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tabs.length]);

  return (
    <TabsList className='part-tabs-list' ref={listRef} data-compact={compactView}>
      {tabs.map((tab, index) => (
        <TabTrigger key={`${index}-${tab.name}`} tab={tab} tabIcon={tab.icon} compact={compactView} />
      ))}
    </TabsList>
  );
};

export const TabContent = ({ tabs }: TabsProps) => (
  <>
    {tabs.map((tab, index) => (
      <TabsContent key={`${index}-${tab}`} className='part-tabs-content' value={tab.id}>
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[tab]}>
          <Flex direction='column' gap={3}>
            <Control reset={tab.reset} name={tab.name} className='reset-tab' />
            {tab.content}
          </Flex>
        </ErrorBoundary>
      </TabsContent>
    ))}
  </>
);

export const TabTrigger = ({ tab, tabIcon, compact }: { tab: Tab; tabIcon?: IvyIcons; compact: boolean }) => {
  const state = tab.messages?.find(message => message.severity === 'ERROR')
    ? 'error'
    : tab.messages?.find(message => message.severity === 'WARNING')
    ? 'warning'
    : undefined;

  return (
    <TabsTrigger className='part-tabs-trigger' data-message={state} value={tab.id} data-compact={compact}>
      <State state={tab.state} />
      {tabIcon && <IvyIcon icon={tabIcon} />}
      <div className='tab-label'>{tab.name}</div>
    </TabsTrigger>
  );
};
