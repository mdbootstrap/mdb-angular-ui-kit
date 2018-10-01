import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-css-main',
  templateUrl: './css-main.component.html',
  styleUrls: ['./css-main.component.scss']
})
export class CssMainComponent implements DoCheck {
  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Hover effects', description: 'On this page you will find examples of hovering components', link: '/css/hover' },
    { id: 2, name: 'Masks', description: 'On this page you will find examples of masks', link: '/css/masks' },
    { id: 3, name: 'Shadows', description: 'On this page you will find examples of shadows on elements', link: '/css/shadows' }
  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }

}
