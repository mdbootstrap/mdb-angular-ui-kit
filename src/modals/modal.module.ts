import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';

import { ModalBackdropComponent } from './modalBackdrop.component';
import { ModalDirective } from './modal.directive';
import { ModalContainerComponent } from './modalContainer.component';
import { MDBModalService } from './modal.service';
import { CommonModule } from '@angular/common';
import { MDBCommonModule } from '../utils/mdb-common.module';

@NgModule({
  declarations: [ModalBackdropComponent, ModalDirective, ModalContainerComponent],
  imports: [CommonModule, MDBCommonModule],
  exports: [ModalBackdropComponent, ModalDirective],
  entryComponents: [ModalBackdropComponent, ModalContainerComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ModalModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule,
      providers: [MDBModalService]
    };
  }
}
