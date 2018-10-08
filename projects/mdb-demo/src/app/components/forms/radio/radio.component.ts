import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadioComponent implements OnInit {
  public radioModel: string = 'Left';
  constructor() { }

  ngOnInit() {
  }

}
