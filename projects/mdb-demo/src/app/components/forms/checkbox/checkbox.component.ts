import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements OnInit {
  public checkboxModel: any = { left: true, middle: false, right: false };
  constructor() { }

  ngOnInit() {
  }

}
