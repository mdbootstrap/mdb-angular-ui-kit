import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

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
