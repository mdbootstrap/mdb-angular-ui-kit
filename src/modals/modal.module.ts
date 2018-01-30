import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';

import { ModalBackdropComponent } from './modalBackdrop.component';
import { ModalDirective } from './modal.directive';
import { PositioningService } from '../utils/positioning';
import { ComponentLoaderFactory } from '../utils/component-loader';
import { ModalContainerComponent } from './modalContainer.component';
import { MDBModalService } from './modal.service';

@NgModule({
  declarations: [ModalBackdropComponent, ModalDirective, ModalContainerComponent],
  exports: [ModalBackdropComponent, ModalDirective],
  entryComponents: [ModalBackdropComponent, ModalContainerComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ModalModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ModalModule, providers: [MDBModalService, ComponentLoaderFactory, PositioningService]};
  }
}
