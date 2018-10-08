import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnInit {
  introPages = ['app', 'contact', 'cta', 'parallax', 'classic', 'video', 'minimalistic'];
  navPages = ['r-f-n', 'r-n-f-n', 'i-f-n', 'i-f-t-n', 'i-n-f-t-n', 'f-s-f-n', 'f-s-n-f-n', 'h-s-f-n', 'h-s-n-f-n'];

  constructor(private router: Router) { }

  ngOnInit() {

  }

  getRoutesArray() {
    return this.router.routerState.snapshot.url.split('/');
  }

  introHideNavAndFooter() {
    this.introPages.forEach((page: any) => {
      if (this.getRoutesArray().some(route => route === page)) {
        return;
      }
      return;
    });
    return true;
  }

  navHideNavAndFooter() {
    this.navPages.forEach((page: any) => {
      if (this.getRoutesArray().some(route => route === page)) {
        return;
      }
      return;
    });
    return true;
  }
}
