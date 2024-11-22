import type { ReactNode } from 'react';
import './App.css';
import { Flex } from '@axonivy/ui-components';

const AppStateView = ({ children }: { children: ReactNode }) => (
  <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
    {children}
  </Flex>
);

export default AppStateView;
