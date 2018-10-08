import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-components-main',
  templateUrl: './components-main.component.html',
  styleUrls: ['./components-main.component.scss']
})
export class ComponentsMainComponent implements DoCheck {

  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Buttons', description: 'On this page you will find examples of Angular buttons', link: '/components/buttons' },
    { id: 2, name: 'Cards', description: 'On this page you will find examples of cards', link: '/components/cards' },
    { id: 3, name: 'Dropdowns', description: 'On this page you will find examples of Angular Dropdowns', link: '/components/dropdowns' },
    { id: 4, name: 'List Group', description: 'On this page you will find examples of List Group', link: '/components/list-group' },
    { id: 5, name: 'Panels', description: 'On this page you will find examples of Panels', link: '/components/panels' },
    { id: 6, name: 'Pagination', description: 'On this page you will find examples of Angular Pagination', link: '/components/pagination' },
    { id: 7, name: 'Pagination - Basic', description: 'On this page you will find basic example of Angular Pagination', link: '/components/pagination-basic' },
    { id: 8, name: 'Pagination - Advanced', description: 'On this page you will find advanced example of Angular Pagination with table', link: '/components/pagination-advanced' },
    { id: 9, name: 'Pagination - API', description: 'On this page you will find examples of Angular Pagination with table and API', link: '/components/pagination-api' },
    { id: 10, name: 'Tags, Badges, Labels', description: 'On this page you will find examples of Tags, Badges and Labels', link: '/components/tags' }
  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }

}
