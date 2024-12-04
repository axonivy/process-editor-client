import { expect } from 'chai';
import { calculateBarShift, calculateMenuShift } from '../../src/ui-tools/quick-action/quick-action-util';

it('calculateBarShift', () => {
  const bar = { height: 38, width: 300, y: 263, x: 208 };
  const diagram = { height: 500, width: 1000 };
  const defaultShift = { left: -bar.width / 2, top: 16 };
  // bar inside of diagram -> shift half of width / shift 16 from above
  expect(calculateBarShift(bar, diagram)).to.be.deep.equal(defaultShift);
  expect(calculateBarShift(bar, diagram, 8)).to.be.deep.equal(defaultShift);
  expect(calculateBarShift(bar, diagram, 32)).to.be.deep.equal(defaultShift);
  // bar overlaps left edge of diagram -> shift to right
  expect(calculateBarShift({ ...bar, x: 100 }, diagram)).to.be.deep.equal({ ...defaultShift, left: -84 });
  expect(calculateBarShift({ ...bar, x: 100 }, diagram, 8)).to.be.deep.equal({ ...defaultShift, left: -92 });
  expect(calculateBarShift({ ...bar, x: 100 }, diagram, 32)).to.be.deep.equal({ ...defaultShift, left: -68 });
  // bar overlaps right edge of diagram -> shift to left
  expect(calculateBarShift({ ...bar, x: 900 }, diagram)).to.be.deep.equal({ ...defaultShift, left: -216 });
  expect(calculateBarShift({ ...bar, x: 900 }, diagram, 8)).to.be.deep.equal({ ...defaultShift, left: -208 });
  expect(calculateBarShift({ ...bar, x: 900 }, diagram, 32)).to.be.deep.equal({ ...defaultShift, left: -232 });
  // bar overlaps bottom edge of diagram -> shift to top
  expect(calculateBarShift({ ...bar, y: 490 }, diagram)).to.be.deep.equal({ ...defaultShift, top: -64 });
  expect(calculateBarShift({ ...bar, y: 490 }, diagram, 8)).to.be.deep.equal({ ...defaultShift, top: -72 });
  expect(calculateBarShift({ ...bar, y: 490 }, diagram, 32)).to.be.deep.equal({ ...defaultShift, top: -48 });
  // bar overlaps left and right edge of diagram -> shift to right
  expect(calculateBarShift({ ...bar, x: 100, width: 900 }, diagram)).to.be.deep.equal({ ...defaultShift, left: -84 });
  expect(calculateBarShift({ ...bar, x: 100, width: 900 }, diagram, 8)).to.be.deep.equal({ ...defaultShift, left: -92 });
  expect(calculateBarShift({ ...bar, x: 100, width: 900 }, diagram, 32)).to.be.deep.equal({ ...defaultShift, left: -68 });
  // bar overlaps left and bottom edge of diagram -> shift to top and right
  expect(calculateBarShift({ ...bar, x: 100, y: 490 }, diagram)).to.be.deep.equal({ left: -84, top: -64 });
  expect(calculateBarShift({ ...bar, x: 100, y: 490 }, diagram, 8)).to.be.deep.equal({ left: -92, top: -72 });
  expect(calculateBarShift({ ...bar, x: 100, y: 490 }, diagram, 32)).to.be.deep.equal({ left: -68, top: -48 });
  // bar overlaps right and bottom edge of diagram -> shift to top and left
  expect(calculateBarShift({ ...bar, x: 900, y: 490 }, diagram)).to.be.deep.equal({ left: -216, top: -64 });
  expect(calculateBarShift({ ...bar, x: 900, y: 490 }, diagram, 8)).to.be.deep.equal({ left: -208, top: -72 });
  expect(calculateBarShift({ ...bar, x: 900, y: 490 }, diagram, 32)).to.be.deep.equal({ left: -232, top: -48 });
});

it('calculateMenuShift', () => {
  // bar is above menu (16 + 38 = 54)
  expect(calculateMenuShift({ height: 100, y: 54 }, { height: 38, y: 16 })).to.be.undefined;
  // bar is not above menu (16 + 38 != 50) -> 16 - 38 - 100 = -122
  expect(calculateMenuShift({ height: 100, y: 50 }, { height: 38, y: 16 })).to.be.deep.equal({ top: -122 });
});
