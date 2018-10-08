import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-basic',
  templateUrl: './modal-basic.component.html',
  styleUrls: ['./modal-basic.component.scss']
})
export class ModalBasicComponent {
  @ViewChild('content') public contentModal: any;
  @ViewChild('videoPlayer') public player: any;
  public name: string;

  show(value: string) {
    this.name = value;
    this.contentModal.show();
  }

  stopVideoPlayer() {
    this.player.nativeElement.src = this.player.nativeElement.src;
  }


}
