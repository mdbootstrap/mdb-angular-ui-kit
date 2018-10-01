import { Component, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrls: ['./navigation-main.component.scss']
})
export class NavigationMainComponent implements DoCheck {

  isChildRouteLoaded = false;
  itemsArray = [
    { id: 1, name: 'Footer', description: 'On this page you will find examples of Angular Footers', link: '/navigation/footer' },
    { id: 2, name: 'Hamburger Menu', description: 'On this page you will find examples of Angular Hamburger Navigation', link: '/navigation/hamburger' },
    { id: 3, name: 'Navs', description: 'On this page you will find example of Angular Navs', link: '/navigation/navs' },
    { id: 4, name: 'Navbars', description: 'On this page you will find example of Angular Navbars', link: '/navigation/navbars' }
  ];

  introsArray = [
    { id: 1, name: 'Regular fixed Navbar', description: 'On this page you will find example of Regular fixed Navbar', link: '/navigation/layouts/r-f-n' },
    { id: 2, name: 'Regular non-fixed Navbar', description: 'On this page you will example of Regular non-fixed Navbar', link: '/navigation/layouts/r-n-f-n' },
    { id: 3, name: 'Full Page Intro with non-fixed Navbar', description: 'On this page you will find example of Full Page Intro with non-fixed Navbar', link: '/navigation/layouts/i-n-f-n' },
    { id: 4, name: 'Full Page Intro with fixed Navbar', description: 'On this page you will find example of Full Page Intro with fixed Navbar', link: '/navigation/layouts/i-f-n' },
    { id: 5, name: 'Full Page Intro with fixed, transparent Navbar', description: 'On this page you will find example of Full Page Intro with fixed, transparent Navbar', link: '/navigation/layouts/i-f-t-n' },
    { id: 6, name: 'Full Page Intro with non-fixed, transparent Navbar', description: 'On this page you will find example of Full Page Intro with non-fixed, transparent Navbar', link: '/navigation/layouts/i-n-f-t-n' },
  ];

  constructor(private router: ActivatedRoute) { }


  ngDoCheck() {
    this.router.children.length !== 0 ? this.isChildRouteLoaded = true : this.isChildRouteLoaded = false;
  }

}
