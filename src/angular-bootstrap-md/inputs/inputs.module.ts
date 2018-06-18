import { MdbInputDirective } from './mdb-input.directive';
import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA} from '@angular/core';
import { EqualValidatorDirective } from './equal-validator.directive';

@NgModule({
  declarations: [MdbInputDirective, EqualValidatorDirective],
  exports: [MdbInputDirective, EqualValidatorDirective],
  schemas: [NO_ERRORS_SCHEMA],
})

export class InputsModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: InputsModule, providers: [] };
  }
}
