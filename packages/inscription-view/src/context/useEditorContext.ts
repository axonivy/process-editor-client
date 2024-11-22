import type { InscriptionContext, InscriptionElementContext, InscriptionType, PID } from '@axonivy/process-editor-inscription-protocol';
import { createContext, useContext } from 'react';

export type EditorContext = {
  context: InscriptionContext;
  elementContext: InscriptionElementContext;
  editorRef: React.MutableRefObject<HTMLElement | null>;
  type: InscriptionType;
  navigateTo: (pid: PID) => void;
};

export const DEFAULT_EDITOR_CONTEXT: EditorContext = {
  context: { app: '', pmv: '' },
  elementContext: { app: '', pmv: '', pid: '' },
  editorRef: { current: null },
  type: {
    id: 'Script',
    label: 'Unknown Inscription Editor',
    shortLabel: 'Unknown',
    description: 'This is an Inscription Editor for an unknown element type',
    iconId: 'unknown',
    helpUrl: 'unknown'
  },
  navigateTo: () => {}
};

export const EditorContextInstance = createContext<EditorContext>(DEFAULT_EDITOR_CONTEXT);
export const useEditorContext = (): EditorContext => useContext(EditorContextInstance);
