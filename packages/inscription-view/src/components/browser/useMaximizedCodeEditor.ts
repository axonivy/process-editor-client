import { useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';
import type { FieldsetControl } from '../widgets/fieldset/fieldset-control';
import { useTranslation } from 'react-i18next';

const useMaximizedCodeEditor = () => {
  const { t } = useTranslation();
  const [isMaximizedCodeEditorOpen, setIsMaximizedCodeEditorOpen] = useState(false);

  const maximizeCode: FieldsetControl = {
    label: t('browser.code.button'),
    icon: IvyIcons.ArrowsMaximize,
    action: () => {
      setIsMaximizedCodeEditorOpen(true);
    }
  };

  return { maximizeState: { isMaximizedCodeEditorOpen, setIsMaximizedCodeEditorOpen }, maximizeCode };
};

export default useMaximizedCodeEditor;
