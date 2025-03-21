import React, { type PropsWithChildren } from 'react';
import { type ActionTrigger } from './ActionButton';
import './viewport-bar.css';

export type ViewportBarButton = ActionTrigger;

type ViewportBarProps = PropsWithChildren<{
  zoomLevel: string;
}>;

const ViewportBar: React.MemoExoticComponent<React.FC<ViewportBarProps>> = React.memo(({ children, zoomLevel }: ViewportBarProps) => (
  <div className='viewport-bar'>
    <div className='viewport-bar-tools'>
      {children}
      <label>{zoomLevel}</label>
    </div>
  </div>
));

export default ViewportBar;
