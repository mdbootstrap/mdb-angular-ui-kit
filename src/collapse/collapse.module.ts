import { NgModule, ModuleWithProviders } from '@angular/core';
import { CollapseDirective } from './collapse.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CollapseDirective],
  imports: [CommonModule],
  exports: [CollapseDirective]
})
export class CollapseModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: CollapseModule, providers: []};
  }
}
