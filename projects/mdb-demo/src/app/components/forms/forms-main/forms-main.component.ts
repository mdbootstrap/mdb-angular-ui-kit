import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forms-main',
  templateUrl: './forms-main.component.html',
  styleUrls: ['./forms-main.component.scss']
})
export class FormsMainComponent implements DoCheck {

  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Checkbox', description: 'On this page you will find examples of Angular Checkbox', link: '/forms/checkbox' },
    { id: 2, name: 'Forms', description: 'On this page you will find examples of Angular Forms', link: '/forms/forms' },
    { id: 3, name: 'Inputs', description: 'On this page you will find examples of Angular Inputs', link: '/forms/inputs' },
    { id: 4, name: 'Input groups', description: 'On this page you will find examples of Angular Input Groups', link: '/forms/input-group' },
    { id: 5, name: 'Input validation', description: 'On this page you will find examples of Angular Input Validation', link: '/forms/input-validation' },
    { id: 6, name: 'Radio', description: 'On this page you will find examples of Angular Radio', link: '/forms/radio' },
    { id: 7, name: 'Search', description: 'On this page you will find examples of Angular Search', link: '/forms/search' },
    { id: 8, name: 'Textarea', description: 'On this page you will find examples of Angular Textarea', link: '/forms/textarea' },
  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }

}
