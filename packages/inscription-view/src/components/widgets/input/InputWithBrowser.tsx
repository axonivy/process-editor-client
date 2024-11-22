import type { BrowserType } from '../../../components/browser';
import { Browser, useBrowser } from '../../../components/browser';
import { usePath } from '../../../context';
import Input, { type InputProps } from './Input';
import type { BrowserValue } from '../../browser/Browser';
import type { CmsTypeFilter } from '../../browser/cms/CmsBrowser';
import { InputGroup } from '@axonivy/ui-components';

type InputWithBrowserProps = InputProps & {
  browsers: BrowserType[];
  typeFilter: CmsTypeFilter;
};

const InputWithBrowser = ({ onChange, browsers, typeFilter, ...props }: InputWithBrowserProps) => {
  const browser = useBrowser();
  const path = usePath();

  return (
    <InputGroup>
      <Input onChange={onChange} {...props} />
      <Browser
        {...browser}
        types={browsers}
        cmsOptions={{ noApiCall: true, typeFilter: typeFilter }}
        accept={(change: BrowserValue) => onChange(change.cursorValue)}
        location={path}
      />
    </InputGroup>
  );
};

export default InputWithBrowser;
