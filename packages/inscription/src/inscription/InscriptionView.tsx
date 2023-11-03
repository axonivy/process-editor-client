import { App } from '@axonivy/inscription-editor';
import React, { useEffect, useState } from 'react';
import { useMove } from 'react-aria';

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

  const [width, setWidth] = useState(window.innerWidth / 3);
  const [resizeActive, setResizeActive] = useState(false);
  const { moveProps } = useMove({
    onMoveStart() {
      setResizeActive(true);
    },
    onMove(e) {
      setWidth(x => {
        const newWidth = x - e.deltaX;
        if (newWidth < window.innerWidth / 2 && newWidth > 200) {
          return newWidth;
        }
        return x;
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
