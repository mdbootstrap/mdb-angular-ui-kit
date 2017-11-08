import { NgModule, ModuleWithProviders  } from '@angular/core';
import { ActiveDirective } from './active.class';
import { EqualValidatorDirective } from './equal-validator.directive';
import { InputValidateDirective } from './input-validate.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ActiveDirective, EqualValidatorDirective, InputValidateDirective],
  imports: [CommonModule],
  exports: [ActiveDirective, EqualValidatorDirective, InputValidateDirective]
})

export class ActiveModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ActiveModule, providers: []};
  }
}
