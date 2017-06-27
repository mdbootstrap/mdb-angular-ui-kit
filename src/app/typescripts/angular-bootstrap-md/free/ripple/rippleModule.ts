import { NgModule, ModuleWithProviders  } from "@angular/core";
import { RippleDirective } from './ripple-effect.component';

@NgModule({
    declarations: [RippleDirective],
    exports: [RippleDirective]
})

export class rippleModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: rippleModule, providers: []};
  }
}