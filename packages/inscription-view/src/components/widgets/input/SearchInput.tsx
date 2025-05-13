import { useEffect, useRef, type ComponentProps } from 'react';
import { SearchInput as Search } from '@axonivy/ui-components';

const SearchInput = (props: ComponentProps<typeof Search>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleAnimationEnd = () => {
      inputRef.current?.focus();
      document.querySelector('.browser-dialog')?.removeEventListener('animationend', handleAnimationEnd);
    };

    const dialogElement = document.querySelector('.browser-dialog');
    if (dialogElement) {
      dialogElement.addEventListener('animationend', handleAnimationEnd);
    }

    return () => {
      document.querySelector('.browser-dialog')?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return <Search {...props} ref={inputRef} />;
};

export default SearchInput;
