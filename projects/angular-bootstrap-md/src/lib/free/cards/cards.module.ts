import { MdbCardFooterComponent } from './mdb-card-footer.component';
import { MdbCardTitleComponent } from './mdb-card-title.component';
import { MdbCardTextComponent } from './mdb-card-text.component';
import { MdbCardBodyComponent } from './mdb-card-body.component';
import { MdbCardComponent } from './mdb-card.component';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MdbCardImageComponent } from './mdb-card-image.component';
import { MdbCardHeaderComponent } from './mdb-card-header.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MdbCardComponent,
    MdbCardBodyComponent,
    MdbCardImageComponent,
    MdbCardTextComponent,
    MdbCardTitleComponent,
    MdbCardFooterComponent,
    MdbCardHeaderComponent,
  ],
  exports: [
    MdbCardComponent,
    MdbCardBodyComponent,
    MdbCardImageComponent,
    MdbCardTextComponent,
    MdbCardTitleComponent,
    MdbCardFooterComponent,
    MdbCardHeaderComponent,
  ],
})
export class CardsModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: CardsModule, providers: [] };
  }
}
