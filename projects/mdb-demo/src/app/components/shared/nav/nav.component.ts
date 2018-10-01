import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  previousUrl: string;
  constructor(private location: Location) {
  }


  back() {
    this.location.back();
  }


}
