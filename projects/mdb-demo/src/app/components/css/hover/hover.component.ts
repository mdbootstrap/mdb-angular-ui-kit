import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hover',
  templateUrl: './hover.component.html',
  styleUrls: ['./hover.component.scss']
})
export class HoverComponent implements OnInit {
  zoom = false;
  constructor() { }

  ngOnInit() {
  }

}
