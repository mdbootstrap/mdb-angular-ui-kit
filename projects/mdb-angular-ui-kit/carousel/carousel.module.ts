import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbCarouselComponent } from './carousel.component';
import { MdbCarouselItemComponent } from './carousel-item.component';

@NgModule({
  declarations: [MdbCarouselComponent, MdbCarouselItemComponent],
  exports: [MdbCarouselComponent, MdbCarouselItemComponent],
  imports: [CommonModule],
})
export class MdbCarouselModule {}
