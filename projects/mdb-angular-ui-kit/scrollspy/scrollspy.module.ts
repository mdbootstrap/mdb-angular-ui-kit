import { NgModule } from '@angular/core';

import { MdbScrollspyDirective } from './scrollspy.directive';
import { MdbScrollspyLinkDirective } from './scrollspy-link.directive';
import { MdbScrollspyElementDirective } from './scrollspy-element.directive';
import { MdbScrollspyService } from './scrollspy.service';
import { MdbScrollspyWindowDirective } from './scrollspy-window.directive';

@NgModule({
  declarations: [
    MdbScrollspyDirective,
    MdbScrollspyLinkDirective,
    MdbScrollspyElementDirective,
    MdbScrollspyWindowDirective,
  ],
  exports: [
    MdbScrollspyDirective,
    MdbScrollspyLinkDirective,
    MdbScrollspyElementDirective,
    MdbScrollspyWindowDirective,
  ],
  providers: [MdbScrollspyService],
})
export class MdbScrollspyModule {}
