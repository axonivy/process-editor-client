import './Tags.css';
import { memo, useEffect, useRef, useState } from 'react';
import IvyIcon from '../IvyIcon';
import { IvyIcons } from '@axonivy/ui-icons';
import { useReadonly } from '@axonivy/ui-components';
import { useCombobox } from 'downshift';
import { useKeyboard } from 'react-aria';

import { useTranslation } from 'react-i18next';

const Tags = (props: { tags: string[]; availableTags: string[]; onChange: (tags: string[]) => void; customValues: boolean }) => {
  const { t } = useTranslation();
  const newTag = t('tags.new');

  const [dropDownTags, setDropDownTags] = useState<string[]>([]);
  const [addValue, setAddValue] = useState(newTag);

  const inputRef = useRef<HTMLInputElement>(null);

  const filter = (tag: string, input?: string) => {
    if (!input) {
      return true;
    }
    return tag.toLowerCase().includes(input.toLowerCase());
  };

  const removeTag = (removeTag: string) => {
    const newTags = props.tags.filter(tag => tag !== removeTag);
    props.onChange(newTags);
  };

  const addTag = (tag: string) => {
    if (tag.length > 0 && !props.tags.find(t => t === tag)) {
      const tagWithoutSpaces = tag.replace(/\s/g, '');
      props.onChange([...props.tags, tagWithoutSpaces]);
    }
    closeMenu();
    selectItem('');
    setAddValue(newTag);
    inputRef.current?.blur();
  };

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    inputValue,
    highlightedIndex,
    getItemProps,
    openMenu,
    selectedItem,
    selectItem,
    closeMenu
  } = useCombobox({
    onSelectedItemChange(change) {
      addTag(change.inputValue ?? '');
    },
    stateReducer(state, actionAndChanges) {
      switch (actionAndChanges.type) {
        case useCombobox.stateChangeTypes.InputBlur:
          addTag(actionAndChanges.changes.inputValue ?? '');
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
          selectItem(actionAndChanges.changes.inputValue ?? '');
          break;
      }
      return actionAndChanges.changes;
    },
    onInputValueChange(change) {
      if (change.type !== useCombobox.stateChangeTypes.FunctionSelectItem) {
        setDropDownTags(props.availableTags.filter(tag => !props.tags.includes(tag)).filter(item => filter(item, change.inputValue)));
        setAddValue(change.inputValue ?? '');
      }
    },
    items: dropDownTags,
    itemToString(item) {
      return item ?? '';
    },
    initialSelectedItem: ''
  });

  useEffect(() => {
    setDropDownTags(props.availableTags.filter(tag => !props.tags.includes(tag)));
  }, [props.availableTags, props.tags]);

  const { keyboardProps } = useKeyboard({
    onKeyDown: e => {
      if (e.key === 'Delete' && e.target instanceof HTMLButtonElement) {
        e.target.click();
      }
    }
  });

  const readonly = useReadonly();

  return (
    <>
      <div className='tags'>
        {props.tags.map((tag, index) => (
          <div key={`${tag}-${index}`} className='added-tag' role='gridcell'>
            <span>{tag}</span>
            <button
              className='tag-remove'
              onClick={() => {
                removeTag(tag);
              }}
              aria-label={t('tags.removeTag', { tag })}
              {...keyboardProps}
              disabled={readonly}
            >
              <IvyIcon icon={IvyIcons.Close} />
            </button>
          </div>
        ))}
        <div {...getToggleButtonProps()}>
          {(dropDownTags.length > 0 || props.customValues) && (
            <button
              className={`tag ${isOpen || (!isOpen && addValue !== newTag) ? 'tag-remove-button' : 'tag-add'}`}
              aria-label={t('tags.addNew')}
              disabled={readonly}
            >
              <IvyIcon icon={IvyIcons.Close} />
              <input
                disabled={readonly}
                hidden={!props.customValues}
                className='new-tag-input'
                {...getInputProps()}
                onFocus={() => {
                  openMenu();
                  setAddValue('');
                }}
                ref={inputRef}
                value={addValue}
                aria-label={t('tags.newTag')}
                style={{ width: inputValue.length * 8 > 28 ? inputValue.length * 8 : 28 }}
              />
            </button>
          )}
          <ul {...getMenuProps()} className='combobox-menu'>
            {isOpen &&
              dropDownTags.map((item, index) => (
                <li
                  className={`combobox-menu-entry ${highlightedIndex === index ? 'hover' : ''} ${selectedItem === item ? 'selected' : ''}`}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default memo(Tags);
