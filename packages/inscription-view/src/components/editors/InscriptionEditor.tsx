import type { ReactNode } from 'react';
import './InscriptionEditor.css';
import type { ElementType, Severity } from '@axonivy/process-editor-inscription-protocol';
import NoEditor from './NoEditor';
import { activityEditors } from './activity/all-activity-editors';
import { eventEditors } from './event/all-event-editors';
import { gatewayEditors } from './gateway/all-gateway-editors';
import { IvyIcons } from '@axonivy/ui-icons';
import { useGeneralData } from '../parts/name/useGeneralData';
import { otherEditors } from './other-editors';
import { thirdPartyEditors } from './third-party/all-third-party-editors';
import { Button, Flex, Message, SidebarHeader, SidebarMessages, Switch, useHotkeys } from '@axonivy/ui-components';
import { ProcessOutline, type ProcessOutlineProps } from './ProcessOutline';
import { useDataContext } from '../../context/useDataContext';
import { useEditorContext } from '../../context/useEditorContext';
import { useAction } from '../../context/useAction';

export type KnownEditor = { editor: ReactNode; icon?: IvyIcons };

const editors = new Map<ElementType, KnownEditor>([
  ...eventEditors,
  ...gatewayEditors,
  ...activityEditors,
  ...thirdPartyEditors,
  ...otherEditors
]);

const inscriptionEditor = (type?: ElementType): ReactNode => {
  if (type) {
    return editors.get(type)?.editor ?? <NoEditor type={type} />;
  }
  return <NoEditor />;
};

const Header = ({ children }: { children?: ReactNode }) => {
  const { data } = useGeneralData();
  const validations = useDataContext().validations.filter(val => val.path.length === 0);
  const { type } = useEditorContext();
  const helpUrl = type.helpUrl;
  const action = useAction('openPage');
  const title = type.id?.length === 0 ? 'Inscription' : `${type.shortLabel}${data.name?.length > 0 ? ` - ${data.name}` : ''}`;
  const icon = editors.get(type.id)?.icon;
  useHotkeys('F1', () => action(helpUrl));
  return (
    <>
      <SidebarHeader title={title} icon={icon} className='header'>
        {children}
        {helpUrl !== undefined && helpUrl !== '' && (
          <Button icon={IvyIcons.Help} onClick={() => action(helpUrl)} aria-label={`Open Help for ${type.shortLabel}`} />
        )}
      </SidebarHeader>
      {validations.length > 0 && (
        <SidebarMessages className='header-messages'>
          {validations.map((validaiton, index) => (
            <Message key={index} message={validaiton.message} variant={validaiton.severity.toLocaleLowerCase() as Lowercase<Severity>} />
          ))}
        </SidebarMessages>
      )}
    </>
  );
};

export type InscriptionOutlineProps = { outline?: Omit<ProcessOutlineProps, 'onDoubleClick'> };

type InscriptionEditorProps = InscriptionOutlineProps & {
  showOutline: boolean;
  setShowOutline: (show: boolean) => void;
};

export const InscriptionEditor = ({ outline, showOutline, setShowOutline }: InscriptionEditorProps) => {
  const { type } = useEditorContext();
  return (
    <Flex direction='column' className='editor'>
      <Header>{<Switch size='large' icon={{ icon: IvyIcons.List }} checked={showOutline} onCheckedChange={setShowOutline} />}</Header>
      {showOutline ? (
        <ProcessOutline {...outline} onDoubleClick={() => setShowOutline(false)} />
      ) : (
        <Flex direction='column' className='content'>
          {inscriptionEditor(type.id)}
        </Flex>
      )}
    </Flex>
  );
};
