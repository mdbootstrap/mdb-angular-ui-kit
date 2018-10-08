import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-events',
  templateUrl: './modal-events.component.html',
  styleUrls: ['./modal-events.component.scss']
})
export class ModalEventsComponent {

  onShow(event: any) {
    console.log(event);
  }

  onShown(event: any) {
    console.log(event);
  }

  onHide(event: any) {
    console.log(event);
  }

  onHidden(event: any) {
    console.log(event);
  }

}
