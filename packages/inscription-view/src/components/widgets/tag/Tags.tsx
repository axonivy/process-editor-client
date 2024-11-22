import './Tags.css';
import { memo, useEffect, useRef, useState } from 'react';
import { useEditorContext, useMeta } from '../../../context';
import IvyIcon from '../IvyIcon';
import { IvyIcons } from '@axonivy/ui-icons';
import { useReadonly } from '@axonivy/ui-components';
import { useCombobox } from 'downshift';
import { useKeyboard } from 'react-aria';

const Tags = (props: { tags: string[]; onChange: (tags: string[]) => void }) => {
  const { elementContext } = useEditorContext();

  const { data } = useMeta('meta/workflow/tags', elementContext, []);
  const [dropDownTags, setDropDownTags] = useState<string[]>([]);
  const [addValue, setAddValue] = useState('Add');

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
    setAddValue('Add');
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
        setDropDownTags(data.filter(tag => !props.tags.includes(tag)).filter(item => filter(item, change.inputValue)));
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
    setDropDownTags(data.filter(tag => !props.tags.includes(tag)));
  }, [data, props.tags]);

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
        <div {...getToggleButtonProps()}>
          <button
            className={`tag ${isOpen || (!isOpen && addValue !== 'Add') ? 'tag-remove-button' : 'tag-add'}`}
            aria-label='Add new tag'
            disabled={readonly}
          >
            <IvyIcon icon={IvyIcons.Close} />
            <input
              disabled={readonly}
              className='new-tag-input'
              {...getInputProps({
                onFocus: () => {
                  openMenu();
                  setAddValue('');
                },
                ref: inputRef,
                value: addValue,
                'aria-label': 'New Tag'
              })}
              style={{ width: inputValue.length * 8 > 28 ? inputValue.length * 8 : 28 }}
            />
          </button>
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
        {props.tags.map((tag, index) => (
          <div key={`${tag}-${index}`} className='added-tag' role='gridcell'>
            <button
              className='tag-remove'
              onClick={() => {
                removeTag(tag);
              }}
              aria-label={`Remove Tag ${tag}`}
              {...keyboardProps}
              disabled={readonly}
            >
              <IvyIcon icon={IvyIcons.Close} />
            </button>
            <span>{tag}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(Tags);
