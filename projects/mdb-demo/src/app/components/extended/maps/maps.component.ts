import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  public map: any = { lat: 51.678418, lng: 7.809007 };
  constructor() { }

  ngOnInit() {
  }

}
