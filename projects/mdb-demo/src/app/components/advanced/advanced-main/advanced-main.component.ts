import {Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advanced-main',
  templateUrl: './advanced-main.component.html',
  styleUrls: ['./advanced-main.component.scss']
})
export class AdvancedMainComponent implements DoCheck {

  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Carousel', description: 'On this page you will find examples of Angular Carousel', link: '/advanced/carousel' },
    { id: 2, name: 'Fullpage Carousel', description: 'On this page you will find example of Angular Fullpage Carousel', link: '/advanced/carousel-fullpage' },
    { id: 3, name: 'Collapse', description: 'On this page you will find examples of Angular Collapse & Accordion', link: '/advanced/collapse' },
    { id: 4, name: 'Charts', description: 'On this page you will find examples of Angular Charts', link: '/advanced/charts' },
    { id: 5, name: 'Popover', description: 'On this page you will find examples of Angular Popover', link: '/advanced/popover' },
    { id: 6, name: 'Tooltip', description: 'On this page you will find examples of Angular Tooltips', link: '/advanced/tooltip' }

  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }

}
