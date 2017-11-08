import { NgModule, ModuleWithProviders  } from '@angular/core';
import { RippleDirective } from './ripple-effect.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [RippleDirective],
  imports: [CommonModule],
  exports: [RippleDirective]
})

export class RippleModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: RippleModule, providers: []};
  }
}
