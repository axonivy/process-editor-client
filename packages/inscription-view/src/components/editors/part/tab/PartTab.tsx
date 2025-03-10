import './PartTab.css';
import { Tabs as TabsRoot, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
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

export const TabList = ({ tabs }: TabsProps) => (
  <TabsList className='part-tabs-list'>
    <style>
      {`
        @container tabs-list (width <= ${tabs.length * 6}rem ) {
          .part-tabs-trigger .tab-label {
            display: none;
          }
          .part-tabs-trigger[data-state='active'] {
            min-width: 6rem;
          }
          .part-tabs-trigger[data-state='active'] .tab-label {
            display: inline;
          }
        }

        @container tabs-list (width <= ${tabs.length * 4}rem) {
        .part-tabs-trigger {
            padding: var(--size-3) 0 var(--size-3) 0;
          }
        .part-tabs-trigger[data-state='active'] {
            min-width: 2rem;
          }
          .part-tabs-trigger[data-state='active'] .tab-label {
            display: none;
          }
        }
      `}
    </style>
    {tabs.map((tab, index) => (
      <TabTrigger key={`${index}-${tab.name}`} tab={tab} tabIcon={tab.icon} />
    ))}
  </TabsList>
);

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

export const TabTrigger = ({ tab, tabIcon }: { tab: Tab; tabIcon?: IvyIcons }) => {
  const state = tab.messages?.find(message => message.severity === 'ERROR')
    ? 'error'
    : tab.messages?.find(message => message.severity === 'WARNING')
    ? 'warning'
    : undefined;

  return (
    <TabsTrigger className='part-tabs-trigger' data-message={state} value={tab.id}>
      <State state={tab.state} />
      {tabIcon && <IvyIcon icon={tabIcon} />}
      <div className='tab-label'>{tab.name}</div>
      <Control reset={tab.reset} name={tab.name} className='reset-tab' />
    </TabsTrigger>
  );
};
