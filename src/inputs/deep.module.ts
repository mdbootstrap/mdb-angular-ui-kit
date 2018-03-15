import { DeepDirective } from './deep.directive';
import { NgModule, ModuleWithProviders  } from '@angular/core';

@NgModule({
  declarations: [DeepDirective],
  exports: [DeepDirective]
})

export class DeepModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: DeepModule, providers: []};
  }
}
