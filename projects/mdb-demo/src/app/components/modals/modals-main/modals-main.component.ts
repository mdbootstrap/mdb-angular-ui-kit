import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modals-main',
  templateUrl: './modals-main.component.html',
  styleUrls: ['./modals-main.component.scss']
})
export class ModalsMainComponent implements DoCheck {

  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Basic Examples', description: 'On this page you will find basic examples of Angular Modals', link: '/modals/basic' },
    { id: 2, name: 'Advanced Examples', description: 'On this page you will find advanced examples of Angular Modals', link: '/modals/advanced' },
    { id: 3, name: 'Modal Events', description: 'On this page you will find examples of Angular Modal events', link: '/modals/events' },
    { id: 4, name: 'Modal Forms', description: 'On this page you will find examples of Angular Modal forms', link: '/modals/forms' },
    { id: 5, name: 'Modal Styles', description: 'On this page you will find examples of Angular Modals styles', link: '/modals/styles' },
    

  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }

}
