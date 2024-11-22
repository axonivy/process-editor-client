import { useEffect, useState } from 'react';
import { useFocusWithin } from 'react-aria';

export const useOnFocus = (initialValue: string, onChange: (change: string) => void) => {
  const [isFocusWithin, setFocusWithin] = useState(false);
  const [focusValue, setFocusValue] = useState(initialValue);
  useEffect(() => {
    setFocusValue(initialValue);
  }, [initialValue]);
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange: setFocusWithin, onBlurWithin: () => onChange(focusValue) });
  return { isFocusWithin, focusWithinProps, focusValue: { value: focusValue, onChange: setFocusValue } };
};
