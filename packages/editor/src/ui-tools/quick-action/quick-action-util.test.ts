import { expect, test } from 'vitest';
import { calculateBarShift, calculateMenuShift } from './quick-action-util';

test('calculateBarShift', () => {
  const bar = { height: 38, width: 300, y: 263, x: 208 };
  const diagram = { height: 500, width: 1000 };
  const defaultShift = { left: -bar.width / 2, top: 16 };
  // bar inside of diagram -> shift half of width / shift 16 from above
  expect(calculateBarShift(bar, diagram)).toEqual(defaultShift);
  expect(calculateBarShift(bar, diagram, 8)).toEqual(defaultShift);
  expect(calculateBarShift(bar, diagram, 32)).toEqual(defaultShift);
  // bar overlaps left edge of diagram -> shift to right
  expect(calculateBarShift({ ...bar, x: 100 }, diagram)).toEqual({ ...defaultShift, left: -84 });
  expect(calculateBarShift({ ...bar, x: 100 }, diagram, 8)).toEqual({ ...defaultShift, left: -92 });
  expect(calculateBarShift({ ...bar, x: 100 }, diagram, 32)).toEqual({ ...defaultShift, left: -68 });
  // bar overlaps right edge of diagram -> shift to left
  expect(calculateBarShift({ ...bar, x: 900 }, diagram)).toEqual({ ...defaultShift, left: -216 });
  expect(calculateBarShift({ ...bar, x: 900 }, diagram, 8)).toEqual({ ...defaultShift, left: -208 });
  expect(calculateBarShift({ ...bar, x: 900 }, diagram, 32)).toEqual({ ...defaultShift, left: -232 });
  // bar overlaps bottom edge of diagram -> shift to top
  expect(calculateBarShift({ ...bar, y: 490 }, diagram)).toEqual({ ...defaultShift, top: -12 });
  expect(calculateBarShift({ ...bar, y: 490 }, diagram, 8)).toEqual({ ...defaultShift, top: -20 });
  expect(calculateBarShift({ ...bar, y: 490 }, diagram, 32)).toEqual({ ...defaultShift, top: 4 });
  // bar overlaps left and right edge of diagram -> shift to right
  expect(calculateBarShift({ ...bar, x: 100, width: 900 }, diagram)).toEqual({ ...defaultShift, left: -84 });
  expect(calculateBarShift({ ...bar, x: 100, width: 900 }, diagram, 8)).toEqual({ ...defaultShift, left: -92 });
  expect(calculateBarShift({ ...bar, x: 100, width: 900 }, diagram, 32)).toEqual({ ...defaultShift, left: -68 });
  // bar overlaps left and bottom edge of diagram -> shift to top and right
  expect(calculateBarShift({ ...bar, x: 100, y: 490 }, diagram)).toEqual({ left: -84, top: -12 });
  expect(calculateBarShift({ ...bar, x: 100, y: 490 }, diagram, 8)).toEqual({ left: -92, top: -20 });
  expect(calculateBarShift({ ...bar, x: 100, y: 490 }, diagram, 32)).toEqual({ left: -68, top: 4 });
  // bar overlaps right and bottom edge of diagram -> shift to top and left
  expect(calculateBarShift({ ...bar, x: 900, y: 490 }, diagram)).toEqual({ left: -216, top: -12 });
  expect(calculateBarShift({ ...bar, x: 900, y: 490 }, diagram, 8)).toEqual({ left: -208, top: -20 });
  expect(calculateBarShift({ ...bar, x: 900, y: 490 }, diagram, 32)).toEqual({ left: -232, top: 4 });
});

test('calculateMenuShift', () => {
  // bar is above menu (16 + 38 = 54)
  expect(calculateMenuShift({ height: 100, y: 54 }, { height: 38, y: 16 })).toBeUndefined();
  // bar is not above menu (16 + 38 != 50) -> 16 - 38 - 100 = -122
  expect(calculateMenuShift({ height: 100, y: 50 }, { height: 38, y: 16 })).toEqual({ top: -122 });
});
