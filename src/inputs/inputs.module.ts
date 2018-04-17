import { MdbInputDirective } from './mdb-input.directive';
import { NgModule, ModuleWithProviders  } from '@angular/core';
import { EqualValidatorDirective } from './equal-validator.directive';

@NgModule({
  declarations: [MdbInputDirective, EqualValidatorDirective],
  exports: [MdbInputDirective, EqualValidatorDirective]
})

export class InputsModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: InputsModule, providers: []};
  }
}
