import { useState } from 'react';
import type { Tab } from '../widgets';
import type { IvyIcons } from '@axonivy/ui-icons';
import type { ATTRIBUTE_BROWSER_ID } from './attribute/AttributeBrowser';
import type { CMS_BROWSER_ID } from './cms/CmsBrowser';
import type { FUNCTION_BROWSER_ID } from './function/FunctionBrowser';
import type { TYPE_BROWSER_ID } from './type/TypeBrowser';
import type { TABLE_COL_BROWSER_ID } from './tableCol/TableColBrowser';
import type { ROLE_BROWSER } from './role/RoleBrowser';

export type BrowserType =
  | typeof ATTRIBUTE_BROWSER_ID
  | typeof CMS_BROWSER_ID
  | typeof FUNCTION_BROWSER_ID
  | typeof TYPE_BROWSER_ID
  | typeof TABLE_COL_BROWSER_ID
  | typeof ROLE_BROWSER;

type BrowserValue = { cursorValue: string; firstLineValue?: string };

export type UseBrowserImplReturnValue = Omit<Tab, 'id'> & {
  id: BrowserType;
  accept: () => BrowserValue;
  icon: IvyIcons;
};

export type UseBrowserReturnValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const useBrowser = (): UseBrowserReturnValue => {
  const [open, setOpen] = useState(false);
  return { open, onOpenChange: setOpen };
};
