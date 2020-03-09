import { NgModule, ModuleWithProviders } from '@angular/core';
import { CollapseComponent } from './collapse.component';

@NgModule({
  declarations: [CollapseComponent],
  exports: [CollapseComponent],
})
export class CollapseModule {
  public static forRoot(): ModuleWithProviders<CollapseModule> {
    return { ngModule: CollapseModule, providers: [] };
  }
}
