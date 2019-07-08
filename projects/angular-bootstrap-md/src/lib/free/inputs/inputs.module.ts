import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA} from '@angular/core';
import { EqualValidatorDirective } from './equal-validator.directive';
import { MdbInputDirective } from './mdb-input.directive';
import { MdbInput } from './input.directive';

@NgModule({
  declarations: [MdbInput, MdbInputDirective, EqualValidatorDirective],
  exports: [MdbInput, MdbInputDirective, EqualValidatorDirective],
  schemas: [NO_ERRORS_SCHEMA],
})

export class InputsModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: InputsModule, providers: [] };
  }
}
