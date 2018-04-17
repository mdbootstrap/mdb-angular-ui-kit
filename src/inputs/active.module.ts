import { NgModule, ModuleWithProviders  } from '@angular/core';
import { ActiveDirective } from './active.class';
import { InputValidateDirective } from './input-validate.directive';

@NgModule({
  declarations: [ActiveDirective, InputValidateDirective],
  exports: [ActiveDirective, InputValidateDirective]
})

export class ActiveModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ActiveModule, providers: []};
  }
}
