import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { CarouselComponent } from './carouselComponent';
import { SlideComponent } from './slideComponent';
import { CarouselConfig } from './carouselConfig';

@NgModule({
  imports: [CommonModule],
  declarations: [SlideComponent, CarouselComponent],
  exports: [SlideComponent, CarouselComponent],
  providers: [CarouselConfig]
})
export class CarouselModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: CarouselModule, providers: []};
  }
}