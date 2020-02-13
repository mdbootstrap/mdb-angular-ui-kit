import { MdbIconComponent } from './icon.component';
import { NgModule } from '@angular/core';
import { FabDirective } from './directives/fab.directive';
import { FarDirective } from './directives/far.directive';
import { FasDirective } from './directives/fas.directive';
import { FalDirective } from './directives/fal.directive';
import { CommonModule } from '@angular/common';
import { FadDirective } from './directives/fad.directive';

@NgModule({
  declarations: [
    MdbIconComponent,
    FabDirective,
    FarDirective,
    FasDirective,
    FalDirective,
    FadDirective,
  ],
  imports: [CommonModule],
  exports: [MdbIconComponent, FabDirective, FarDirective, FasDirective, FalDirective, FadDirective],
})
export class IconsModule {}
