import { memo } from 'react';
import { PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import AppStateView from '../../AppStateView';

const NoEditor = (props: { type?: string }) => (
  <AppStateView>
    {props.type ? (
      <PanelMessage icon={IvyIcons.Help} message={`No editor found for type: ${props.type}`} />
    ) : (
      <PanelMessage icon={IvyIcons.DragDrop} message='Select a process element' />
    )}
  </AppStateView>
);

export default memo(NoEditor);
