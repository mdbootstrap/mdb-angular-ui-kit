import { ViewContainerRef } from '@angular/core';

// tslint:disable: no-inferrable-types
export class MdbModalConfig<D = any> {
  animation?: boolean = true;
  backdrop?: boolean = true;
  ignoreBackdropClick?: boolean = false;
  keyboard?: boolean = true;
  modalClass?: string = '';
  containerClass?: string = '';
  data?: D | null = null;
  viewContainerRef?: ViewContainerRef;
}
