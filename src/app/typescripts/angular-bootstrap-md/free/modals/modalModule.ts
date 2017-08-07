import { NgModule, ModuleWithProviders } from '@angular/core';

import { ModalBackdropComponent } from './modalBackdropComponent';
import { ModalDirective } from './modalDirective';
import { PositioningService } from '../utils/positioning';
import { ComponentLoaderFactory } from '../utils/component-loader';
import { ModalContainerComponent } from './modalContainerComponent';
import { BsModalService } from './modalService';

@NgModule({
  declarations: [ModalBackdropComponent, ModalDirective, ModalContainerComponent],
  exports: [ModalBackdropComponent, ModalDirective],
  entryComponents: [ModalBackdropComponent, ModalContainerComponent]
})
export class ModalModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ModalModule, providers: [BsModalService, ComponentLoaderFactory, PositioningService]};
  }
}