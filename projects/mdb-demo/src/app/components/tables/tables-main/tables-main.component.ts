import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tables-main',
  templateUrl: './tables-main.component.html',
  styleUrls: ['./tables-main.component.scss']
})
export class TablesMainComponent implements DoCheck {

  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Basic Examples', description: 'On this page you will find examples of Angular Tables', link: '/tables/basic' },
    { id: 2, name: 'Additional Examples', description: 'On this page you will find examples of Angular Additional Tables', link: '/tables/styles' },
    { id: 3, name: 'Editable', description: 'On this page you will find examples of Angular Editable Tables', link: '/tables/editable' },
    { id: 4, name: 'Pagination', description: 'On this page you will find examples of Angular Pagination Tables', link: '/tables/pagination' },
    { id: 5, name: 'Responsive', description: 'On this page you will find examples of Angular Responsive Tables', link: '/tables/responsive' },
    { id: 6, name: 'Search', description: 'On this page you will find examples of Angular Search Tables', link: '/tables/search' },
    { id: 7, name: 'Sort', description: 'On this page you will find examples of Angular Sort Tables', link: '/tables/sort' },

  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }

}
