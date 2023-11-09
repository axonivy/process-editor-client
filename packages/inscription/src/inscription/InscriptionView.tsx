import { App } from '@axonivy/inscription-editor';
import React, { useEffect, useState } from 'react';
import { useMove } from 'react-aria';
import { inscriptionWidthStorage } from './inscription-width-storage';

const JSX = { createElement: React.createElement };

interface InscriptionViewProps {
  app: string;
  pmv: string;
  pid: string;
}

const InscriptionView = ({ app, pmv, pid }: InscriptionViewProps) => {
  const [element, setElement] = useState(pid);
  useEffect(() => {
    setElement(pid);
  }, [pid]);

  const [width, setWidth] = useState(inscriptionWidthStorage().getWidth());
  const [resizeActive, setResizeActive] = useState(false);
  const { moveProps } = useMove({
    onMoveStart() {
      setResizeActive(true);
    },
    onMove(e) {
      setWidth(oldWidth => {
        const newWidth = inscriptionWidthStorage().fixWidth(oldWidth - e.deltaX);
        inscriptionWidthStorage().setWidth(newWidth);
        return newWidth;
      });
    },
    onMoveEnd() {
      setResizeActive(false);
    }
  });
  return (
    <div style={{ width: width }}>
      <div className={`inscription-resizer${resizeActive ? ' active' : ''}`} {...moveProps} />
      <App app={app} pmv={pmv} pid={element} />
    </div>
  );
};

export default InscriptionView;
