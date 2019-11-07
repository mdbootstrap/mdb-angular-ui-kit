import { Color } from './color.interface';

export interface Colors extends Color {
  data?: number[];
  label?: string;
}
