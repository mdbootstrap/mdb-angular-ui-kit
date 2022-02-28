import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MdbModalContainerComponent } from './modal-container.component';
import { MdbModalService } from './modal.service';

@NgModule({
  imports: [OverlayModule, PortalModule],
  exports: [MdbModalContainerComponent],
  declarations: [MdbModalContainerComponent],
  providers: [MdbModalService],
})
export class MdbModalModule {}
