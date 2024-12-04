import type { Bounds, Dimension } from '@eclipse-glsp/client';

const DEFAULT_SHIFT_Y = 16;

export const calculateBarShift = (bar: Bounds, diagram: Dimension, distanceToWindow = 16): { left: number; top: number } => {
  let shiftX = bar.width / 2;
  const minShiftX = bar.x + bar.width + distanceToWindow - shiftX;
  if (minShiftX > diagram.width) {
    shiftX += minShiftX - diagram.width;
  }
  const maxShiftX = bar.x - distanceToWindow;
  if (shiftX > maxShiftX) {
    shiftX = maxShiftX;
  }

  let shiftY = DEFAULT_SHIFT_Y;
  const minShiftY = bar.y + bar.height + shiftY - distanceToWindow + 52;
  if (minShiftY > diagram.height) {
    shiftY -= minShiftY - diagram.height;
  }
  return { left: -shiftX, top: shiftY };
};

type ShiftY = Pick<Bounds, 'height' | 'y'>;

export const calculateMenuShift = (menu: ShiftY, bar: ShiftY): { top: number } | undefined => {
  if (menu.y !== bar.height + DEFAULT_SHIFT_Y) {
    const shiftY = -bar.height - menu.height + bar.y;
    return { top: shiftY };
  }
  return;
};
