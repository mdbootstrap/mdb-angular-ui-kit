import { ViewContainerRef } from '@angular/core';

export class MdbModalConfig<D = any> {
  animation? = true;
  backdrop? = true;
  ignoreBackdropClick? = false;
  keyboard? = true;
  modalClass? = '';
  containerClass? = '';
  viewContainerRef?: ViewContainerRef;
  data?: D | null = null;
  nonInvasive? = false;
  focusElementSelector? = '';
}
