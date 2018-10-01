import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-extended-main',
  templateUrl: './extended-main.component.html',
  styleUrls: ['./extended-main.component.scss']
})
export class ExtendedMainComponent implements DoCheck {

  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Maps', description: 'On this page you will find basic examples of Angular Maps', link: '/extended/maps' },

  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }


}
