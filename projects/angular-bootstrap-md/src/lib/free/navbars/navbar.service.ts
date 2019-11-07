import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class NavbarService {
  private navbarLinkClicks = new Subject<any>();

  getNavbarLinkClicks(): Observable<any> {
    return this.navbarLinkClicks.asObservable();
  }

  setNavbarLinkClicks() {
    this.navbarLinkClicks.next();
  }
}
