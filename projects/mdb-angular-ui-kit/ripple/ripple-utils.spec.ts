import { colorToRGB, durationToMsNumber, getDiameter } from './ripple-utils';

describe('Ripple utils', () => {
  const DEFAULT_RIPPLE_COLOR = [0, 0, 0];

  it('should convert seconds string to miliseconds in number format', () => {
    expect(durationToMsNumber('5s')).toEqual(5000);
  });

  it('should convert miliseconds string to miliseconds in number format', () => {
    expect(durationToMsNumber('3000ms')).toEqual(3000);
  });

  it('should convert hex color to rgb', () => {
    expect(colorToRGB('#c953d6')).toEqual([201, 83, 214]);
  });

  it('should convert short hex color to rgb', () => {
    expect(colorToRGB('#fff')).toEqual([255, 255, 255]);
  });

  it('should convert rgba color to rgb', () => {
    expect(colorToRGB('rgba(255,0,0,0.5)')).toEqual([255, 0, 0]);
  });

  it('should return default ripple color for transparent color', () => {
    expect(colorToRGB('transparent')).toEqual(DEFAULT_RIPPLE_COLOR);
  });

  it('should return correct diameter for click in the first quadrant', () => {
    const height = 50;
    const width = 100;
    const offsetX = 90;
    const offsetY = 10;

    const pythagorean = (sideA: number, sideB: number) => Math.sqrt(sideA ** 2 + sideB ** 2);

    const getCorner = {
      topLeft: pythagorean(offsetX, offsetY),
      topRight: pythagorean(width - offsetX, offsetY),
      bottomLeft: pythagorean(offsetX, height - offsetY),
      bottomRight: pythagorean(width - offsetX, height - offsetY),
    };

    expect(getDiameter({ offsetX, offsetY, height, width })).toEqual(getCorner.bottomLeft * 2);
  });

  it('should return correct diameter for click in the second quadrant', () => {
    const height = 50;
    const width = 100;
    const offsetX = 15;
    const offsetY = 10;

    const pythagorean = (sideA: number, sideB: number) => Math.sqrt(sideA ** 2 + sideB ** 2);

    const getCorner = {
      topLeft: pythagorean(offsetX, offsetY),
      topRight: pythagorean(width - offsetX, offsetY),
      bottomLeft: pythagorean(offsetX, height - offsetY),
      bottomRight: pythagorean(width - offsetX, height - offsetY),
    };

    expect(getDiameter({ offsetX, offsetY, height, width })).toEqual(getCorner.bottomRight * 2);
  });

  it('should return correct diameter for click in the third quadrant', () => {
    const height = 50;
    const width = 100;
    const offsetX = 15;
    const offsetY = 90;

    const pythagorean = (sideA: number, sideB: number) => Math.sqrt(sideA ** 2 + sideB ** 2);

    const getCorner = {
      topLeft: pythagorean(offsetX, offsetY),
      topRight: pythagorean(width - offsetX, offsetY),
      bottomLeft: pythagorean(offsetX, height - offsetY),
      bottomRight: pythagorean(width - offsetX, height - offsetY),
    };

    expect(getDiameter({ offsetX, offsetY, height, width })).toEqual(getCorner.topRight * 2);
  });

  it('should return correct diameter for click in the fourth quadrant', () => {
    const height = 50;
    const width = 100;
    const offsetX = 90;
    const offsetY = 30;

    const pythagorean = (sideA: number, sideB: number) => Math.sqrt(sideA ** 2 + sideB ** 2);

    const getCorner = {
      topLeft: pythagorean(offsetX, offsetY),
      topRight: pythagorean(width - offsetX, offsetY),
      bottomLeft: pythagorean(offsetX, height - offsetY),
      bottomRight: pythagorean(width - offsetX, height - offsetY),
    };

    expect(getDiameter({ offsetX, offsetY, height, width })).toEqual(getCorner.topLeft * 2);
  });

  it('should return correct diameter for click in the center', () => {
    const height = 50;
    const width = 100;
    const offsetX = 50;
    const offsetY = 25;

    const pythagorean = (sideA: number, sideB: number) => Math.sqrt(sideA ** 2 + sideB ** 2);

    const getCorner = {
      topLeft: pythagorean(offsetX, offsetY),
      topRight: pythagorean(width - offsetX, offsetY),
      bottomLeft: pythagorean(offsetX, height - offsetY),
      bottomRight: pythagorean(width - offsetX, height - offsetY),
    };

    expect(getDiameter({ offsetX, offsetY, height, width })).toEqual(getCorner.topLeft * 2);
  });
});
