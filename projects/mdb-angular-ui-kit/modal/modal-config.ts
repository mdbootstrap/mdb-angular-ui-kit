import { ViewContainerRef } from '@angular/core';

/* eslint-disable @typescript-eslint/no-inferrable-types */
export class MdbModalConfig<D = any> {
  animation?: boolean = true;
  backdrop?: boolean = true;
  ignoreBackdropClick?: boolean = false;
  keyboard?: boolean = true;
  modalClass?: string = '';
  containerClass?: string = '';
  viewContainerRef?: ViewContainerRef;
  data?: D | null = null;
}
