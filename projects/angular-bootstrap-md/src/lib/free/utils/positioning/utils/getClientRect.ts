/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 */
import { Offsets } from '../models/index';

export function getClientRect(offsets: any): Offsets {
  return {
    ...offsets,
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  };
}
