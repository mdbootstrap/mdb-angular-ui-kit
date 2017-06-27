import { NgModule, ModuleWithProviders } from '@angular/core';

import { CollapseDirective } from './collapseDirective';

@NgModule({
  declarations: [CollapseDirective],
  exports: [CollapseDirective]
})
export class CollapseModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: CollapseModule, providers: []};
  }
}