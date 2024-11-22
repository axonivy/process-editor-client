import { useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';
import type { FieldsetControl } from '../widgets';

const useMaximizedCodeEditor = () => {
  const [isMaximizedCodeEditorOpen, setIsMaximizedCodeEditorOpen] = useState(false);

  const maximizeCode: FieldsetControl = {
    label: 'Fullsize Code Editor',
    icon: IvyIcons.ArrowsMaximize,
    action: () => {
      setIsMaximizedCodeEditorOpen(true);
    }
  };

  return { maximizeState: { isMaximizedCodeEditorOpen, setIsMaximizedCodeEditorOpen }, maximizeCode };
};

export default useMaximizedCodeEditor;
