import { NavbarService } from './navbar.service';
import { AfterContentInit, Component, ContentChildren, ElementRef, QueryList, EventEmitter, Output } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
  selector: 'navlinks',
  template: `
        <ng-content></ng-content>
    `,
})
export class NavlinksComponent implements AfterViewInit, AfterContentInit {
  @ContentChildren(RouterLinkWithHref, { read: ElementRef, descendants: true })
  links: QueryList<ElementRef>;

  @Output() linkClick = new EventEmitter<any>();
  constructor( private _navbarService: NavbarService) { }

  ngAfterContentInit() {
    const that = this;



    setTimeout(function () {
      that.links.forEach(function (element) {
        element.nativeElement.onclick = function () {
          that._navbarService.setNavbarLinkClicks();
        };
      });

    }, 0);
  }
  ngAfterViewInit() {

  }
}
