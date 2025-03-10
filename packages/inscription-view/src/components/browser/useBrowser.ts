import { useEffect, useState } from 'react';
import type { IvyIcons } from '@axonivy/ui-icons';
import type { ATTRIBUTE_BROWSER_ID } from './attribute/AttributeBrowser';
import type { CMS_BROWSER_ID } from './cms/CmsBrowser';
import type { FUNCTION_BROWSER_ID } from './function/FunctionBrowser';
import type { TYPE_BROWSER_ID } from './type/TypeBrowser';
import type { TABLE_COL_BROWSER_ID } from './tableCol/TableColBrowser';
import type { ROLE_BROWSER } from './role/RoleBrowser';
import type { CONDITION_BUILDER_ID } from './conditionBuilder/useConditionBuilder';
import type { Tab } from '../widgets/tab/Tab';

export type BrowserType =
  | typeof ATTRIBUTE_BROWSER_ID
  | typeof CMS_BROWSER_ID
  | typeof FUNCTION_BROWSER_ID
  | typeof TYPE_BROWSER_ID
  | typeof TABLE_COL_BROWSER_ID
  | typeof ROLE_BROWSER
  | typeof CONDITION_BUILDER_ID;

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

export const useBrowser = (): UseBrowserReturnValue & { wasOpen: boolean } => {
  const [open, setOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);
  useEffect(() => {
    if (open && !wasOpen) {
      setWasOpen(true);
    }
  }, [open, wasOpen]);
  return { open, onOpenChange: setOpen, wasOpen };
};
