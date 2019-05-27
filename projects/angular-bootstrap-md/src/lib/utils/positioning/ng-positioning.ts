/**
 * @copyright Valor Software
 * @copyright Federico Zivolo and contributors
 */
import { Renderer2 } from '@angular/core';

import { getReferenceOffsets, setAllStyles } from './utils/index';

import { arrow, flip, preventOverflow, shift, initData } from './modifiers/index';
import { Data, Offsets, Options } from './models/index';


export class Positioning {
  position(hostElement: HTMLElement, targetElement: HTMLElement): Offsets {
    return this.offset(hostElement, targetElement);
  }

  offset(hostElement: HTMLElement, targetElement: HTMLElement): Offsets {
    return getReferenceOffsets(targetElement, hostElement);
  }

  positionElements(
    hostElement: HTMLElement,
    targetElement: HTMLElement,
    position: string,
    _appendToBody?: boolean,
    options?: any
  ): Data {
    const chainOfModifiers = [flip, shift, preventOverflow, arrow];

    return chainOfModifiers.reduce(
      (modifiedData, modifier) => modifier(modifiedData),
      initData(targetElement, hostElement, position, options)
    );
  }
}

const positionService = new Positioning();

export function positionElements(
  hostElement: HTMLElement,
  targetElement: HTMLElement,
  placement: string,
  appendToBody?: boolean,
  options?: Options,
  renderer?: Renderer2
): void {

  const data = positionService.positionElements(
    hostElement,
    targetElement,
    placement,
    appendToBody,
    options
  );

  setAllStyles(data, renderer);
}
