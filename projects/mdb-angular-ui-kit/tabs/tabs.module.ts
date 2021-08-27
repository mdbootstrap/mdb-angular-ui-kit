import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbTabComponent } from './tab.component';
import { MdbTabsComponent } from './tabs.component';
import { PortalModule } from '@angular/cdk/portal';
import { MdbTabContentDirective } from './tab-content.directive';
import { MdbTabPortalOutlet } from './tab-outlet.directive';
import { MdbTabTitleDirective } from './tab-title.directive';

@NgModule({
  declarations: [
    MdbTabComponent,
    MdbTabContentDirective,
    MdbTabTitleDirective,
    MdbTabPortalOutlet,
    MdbTabsComponent,
  ],
  imports: [CommonModule, PortalModule],
  exports: [
    MdbTabComponent,
    MdbTabContentDirective,
    MdbTabTitleDirective,
    MdbTabPortalOutlet,
    MdbTabsComponent,
  ],
})
export class MdbTabsModule {}
