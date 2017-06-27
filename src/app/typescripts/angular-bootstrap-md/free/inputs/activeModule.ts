import { NgModule, ModuleWithProviders  } from "@angular/core";
import { ActiveDirective } from './activeClass';
import { EqualValidator } from './equalValidatorDirective';

@NgModule({
    declarations: [ActiveDirective, EqualValidator],
    exports: [ActiveDirective, EqualValidator]
})

export class activeModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: activeModule, providers: []};
  }
}