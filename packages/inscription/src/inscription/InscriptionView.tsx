import { App } from '@axonivy/process-editor-inscription-view';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { useMove } from 'react-aria';
import { inscriptionWidthStorage } from './inscription-width-storage';
import { useHotkeys } from '@axonivy/ui-components';

const InscriptionView = ({ pid, ...props }: ComponentProps<typeof App>) => {
  const [element, setElement] = useState(pid);
  useEffect(() => {
    setElement(pid);
  }, [pid]);

  const [width, setWidth] = useState(inscriptionWidthStorage().getWidth());
  const [resizeActive, setResizeActive] = useState(false);
  const updateWidth = (delta: number) => {
    setWidth(oldWidth => {
      const newWidth = inscriptionWidthStorage().fixWidth(oldWidth - delta);
      inscriptionWidthStorage().setWidth(newWidth);
      return newWidth;
    });
  };
  useHotkeys('F3', () => updateWidth(-20), { scopes: ['global'] });
  useHotkeys('F4', () => updateWidth(20), { scopes: ['global'] });
  const { moveProps } = useMove({
    onMoveStart() {
      setResizeActive(true);
    },
    onMove(e) {
      updateWidth(e.deltaX);
      window.dispatchEvent(new CustomEvent('resize'));
    },
    onMoveEnd() {
      setResizeActive(false);
    }
  });
  return (
    <div style={{ width: width }}>
      <div className={`inscription-resizer${resizeActive ? ' active' : ''}`} {...moveProps} />
      <App pid={element} {...props} />
    </div>
  );
};

export default InscriptionView;
