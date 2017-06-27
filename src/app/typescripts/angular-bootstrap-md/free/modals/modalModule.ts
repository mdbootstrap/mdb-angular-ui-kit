import { NgModule, ModuleWithProviders } from '@angular/core';

import { ModalBackdropComponent } from './modalBackdropComponent';
import { ModalDirective } from './modalDirective';
import { PositioningService } from '../utils/positioning';
import { ComponentLoaderFactory } from '../utils/component-loader';

@NgModule({
  declarations: [ModalBackdropComponent, ModalDirective],
  exports: [ModalBackdropComponent, ModalDirective],
  entryComponents: [ModalBackdropComponent]
})
export class ModalModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ModalModule, providers: [ComponentLoaderFactory, PositioningService]};
  }
}