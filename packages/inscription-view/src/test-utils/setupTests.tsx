/* eslint-disable @typescript-eslint/no-explicit-any */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { useField } from '@axonivy/ui-components';
import { afterEach, vi } from 'vitest';
import { cloneObject } from './object-utils';

afterEach(() => cleanup());

//@ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

global.ResizeObserver = class ResizeObserver {
  [x: string]: any;
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
};

global.structuredClone = cloneObject;

const CodeEditorMock = ({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) => {
  const { inputProps } = useField();
  return <input data-testid='code-editor' {...inputProps} id={id} value={value} onChange={e => onChange(e.target.value)} />;
};

vi.mock('../components/widgets/code-editor', () => ({
  __esModule: true,
  ScriptArea: CodeEditorMock,
  ScriptInput: CodeEditorMock,
  MacroArea: CodeEditorMock,
  MacroInput: CodeEditorMock,
  SingleLineCodeEditor: CodeEditorMock,
  MaximizedCodeEditorBrowser: CodeEditorMock
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
