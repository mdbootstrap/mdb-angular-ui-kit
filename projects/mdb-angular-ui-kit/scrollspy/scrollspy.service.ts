import { Injectable, QueryList } from '@angular/core';
import { MdbScrollspyLinkDirective } from './scrollspy-link.directive';
import { Subject, Observable } from 'rxjs';

export interface MdbScrollspy {
  id: string;
  links: QueryList<MdbScrollspyLinkDirective>;
}

@Injectable()
export class MdbScrollspyService {
  scrollSpys: MdbScrollspy[] = [];

  private activeSubject = new Subject<MdbScrollspyLinkDirective>();
  active$: Observable<any> = this.activeSubject;

  addScrollspy(scrollSpy: MdbScrollspy): void {
    this.scrollSpys.push(scrollSpy);
  }

  removeScrollspy(scrollSpyId: string): void {
    const scrollSpyIndex = this.scrollSpys.findIndex((spy) => {
      return spy.id === scrollSpyId;
    });
    this.scrollSpys.splice(scrollSpyIndex, 1);
  }

  updateActiveState(scrollSpyId: string, activeLinkId: string): void {
    const scrollSpy = this.scrollSpys.find((spy) => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    const activeLink = scrollSpy.links.find((link) => {
      return link.id === activeLinkId;
    });

    this.setActiveLink(activeLink);
  }

  removeActiveState(scrollSpyId: string, activeLinkId: string): void {
    const scrollSpy = this.scrollSpys.find((spy) => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    const activeLink = scrollSpy.links.find((link) => {
      return link.id === activeLinkId;
    });

    if (!activeLink) {
      return;
    }

    activeLink.active = false;
    activeLink.detectChanges();
  }

  setActiveLink(activeLink: MdbScrollspyLinkDirective | any): void {
    if (activeLink) {
      activeLink.active = true;
      activeLink.detectChanges();
      this.activeSubject.next(activeLink);
    }
  }

  removeActiveLinks(scrollSpyId: string): void {
    const scrollSpy: MdbScrollspy | undefined = this.scrollSpys.find((spy) => {
      return spy.id === scrollSpyId;
    });

    if (!scrollSpy) {
      return;
    }

    scrollSpy.links.forEach((link) => {
      link.active = false;
      link.detectChanges();
    });
  }
}
