const DEFAULT_RIPPLE_COLOR = [0, 0, 0];

export function durationToMsNumber(time: string): number {
  return Number(time.replace('ms', '').replace('s', '000'));
}

export function colorToRGB(color: any): number[] {
  // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
  function hexToRgb(color: any): any {
    const HEX_COLOR_LENGTH = 7;
    const IS_SHORT_HEX = color.length < HEX_COLOR_LENGTH;
    if (IS_SHORT_HEX) {
      color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    return [
      parseInt(color.substr(1, 2), 16),
      parseInt(color.substr(3, 2), 16),
      parseInt(color.substr(5, 2), 16),
    ];
  }

  // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
  function namedColorsToRgba(color: any): any {
    const tempElem = document.body.appendChild(document.createElement('fictum'));
    const flag = 'rgb(1, 2, 3)';
    tempElem.style.color = flag;
    if (tempElem.style.color !== flag) {
      return DEFAULT_RIPPLE_COLOR;
    }
    tempElem.style.color = color;
    if (tempElem.style.color === flag || tempElem.style.color === '') {
      return DEFAULT_RIPPLE_COLOR;
    } // color parse failed
    color = getComputedStyle(tempElem).color;
    document.body.removeChild(tempElem);
    return color;
  }

  // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
  function rgbaToRgb(color: any): any {
    color = color.match(/[.\d]+/g).map((a) => +Number(a));
    color.length = 3;
    return color;
  }

  if (color.toLowerCase() === 'transparent') {
    return DEFAULT_RIPPLE_COLOR;
  }
  if (color[0] === '#') {
    return hexToRgb(color);
  }
  if (color.indexOf('rgb') === -1) {
    color = namedColorsToRgba(color);
  }
  if (color.indexOf('rgb') === 0) {
    return rgbaToRgb(color);
  }

  return DEFAULT_RIPPLE_COLOR;
}

export function getDiameter({
  offsetX,
  offsetY,
  height,
  width,
}: {
  [key: string]: number;
}): number {
  const top = offsetY <= height / 2;
  const left = offsetX <= width / 2;
  const pythagorean = (sideA: number, sideB: number) => Math.sqrt(sideA ** 2 + sideB ** 2);

  const positionCenter = offsetY === height / 2 && offsetX === width / 2;
  // mouse position on the quadrants of the coordinate system
  const quadrant = {
    first: top === true && left === false,
    second: top === true && left === true,
    third: top === false && left === true,
    fourth: top === false && left === false,
  };

  const getCorner = {
    topLeft: pythagorean(offsetX, offsetY),
    topRight: pythagorean(width - offsetX, offsetY),
    bottomLeft: pythagorean(offsetX, height - offsetY),
    bottomRight: pythagorean(width - offsetX, height - offsetY),
  };

  let diameter = 0;

  if (positionCenter || quadrant.fourth) {
    diameter = getCorner.topLeft;
  } else if (quadrant.third) {
    diameter = getCorner.topRight;
  } else if (quadrant.second) {
    diameter = getCorner.bottomRight;
  } else if (quadrant.first) {
    diameter = getCorner.bottomLeft;
  }

  return diameter * 2;
}
