import { NavbarService } from './navbar.service';
import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LinksComponent } from './links.component';

@Component({
  selector: 'mdb-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbars-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements AfterViewInit, OnInit, AfterContentChecked {
  @Input() iconBackground: string | string[];
  @Input() SideClass: string;
  @Input() containerInside = true;
  @Input() collapseId = 'navbarCollapse';
  @Input() scrollSensitivity = 120;
  @Input() scrollableNavbar = false;

  subscription: Subscription;
  navbarLinkClicks: any;
  shown = false;

  public doubleNav: boolean;
  public height: number;
  public duration = 350; // ms

  public collapse = true;
  public showClass = false;
  public collapsing = false;

  private _itemsLength = 0;

  ariaExpanded = false;

  @ViewChild('navbar', { static: true }) el: ElementRef;
  @ViewChild('mobile', { static: false }) mobile: ElementRef;
  @ViewChild('nav', { static: true }) navbar: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;
  @ViewChild('toggler', { static: false }) toggler: ElementRef;
  @ContentChild(LinksComponent, { static: false }) links: LinksComponent;

  constructor(public renderer: Renderer2, private _navbarService: NavbarService) {
    // tslint:disable-next-line:max-line-length
    this.subscription = this._navbarService.getNavbarLinkClicks().subscribe(navbarLinkClicks => {
      this.closeNavbarOnClick(navbarLinkClicks);
    });
  }

  closeNavbarOnClick(navbarLinkClicks: any) {
    this.navbarLinkClicks = navbarLinkClicks;
    if (this.showClass) {
      this.hide();
    }
  }

  addTogglerIconClasses() {
    if (this.iconBackground) {
      if (Array.isArray(this.iconBackground)) {
        this.iconBackground.forEach(iconClass => {
          this.renderer.addClass(this.toggler.nativeElement, iconClass);
        });
      } else {
        this.renderer.addClass(this.toggler.nativeElement, this.iconBackground);
      }
    }
  }

  ngOnInit() {
    const isDoubleNav = this.SideClass.split(' ');
    if (isDoubleNav.indexOf('double-nav') !== -1) {
      this.doubleNav = true;
    } else {
      this.doubleNav = false;
    }
  }

  ngAfterViewInit() {
    if (!this.containerInside) {
      const childrens = Array.from(this.container.nativeElement.children);
      childrens.forEach(child => {
        this.renderer.appendChild(this.navbar.nativeElement, child);
        this.container.nativeElement.remove();
      });
    }
    if (this.el.nativeElement.children.length === 0) {
      this.el.nativeElement.remove();
    }
    this.addTogglerIconClasses();
    if (this.scrollableNavbar) {
      this.renderer.addClass(this.el.nativeElement, 'collapsed-navbar-scroll');
    }
  }

  toggle() {
    if (!this.collapsing) {
      if (this.shown) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  show() {
    this.shown = true;
    this.collapse = false;
    this.collapsing = true;
    this.ariaExpanded = true;

    setTimeout(() => {
      this.height = this.el.nativeElement.scrollHeight;
      this.renderer.setStyle(this.el.nativeElement, 'height', this.height + 'px');
    }, 0);

    setTimeout(() => {
      this.collapsing = false;
      this.collapse = true;
      this.showClass = true;
    }, this.duration);
  }

  hide() {
    if (this.shown) {
      this.shown = false;
      this.collapse = false;
      this.showClass = false;
      this.collapsing = true;
      this.ariaExpanded = false;
      setTimeout(() => {
        this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
      }, 0);

      setTimeout(() => {
        this.collapsing = false;
        this.collapse = true;
      }, this.duration);
    }
  }

  get displayStyle() {
    if (!this.containerInside) {
      return 'flex';
    } else {
      return '';
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    let breakpoit = 0;

    if (this.SideClass.includes('navbar-expand-xl')) {
      breakpoit = 1200;
    } else if (this.SideClass.includes('navbar-expand-lg')) {
      breakpoit = 992;
    } else if (this.SideClass.includes('navbar-expand-md')) {
      breakpoit = 768;
    } else if (this.SideClass.includes('navbar-expand-sm')) {
      breakpoit = 576;
    } else {
      breakpoit = event.target.innerWidth + 1;
    }

    if (event.target.innerWidth < breakpoit) {
      if (!this.shown) {
        this.collapse = false;
        this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        setTimeout(() => {
          this.height = this.el.nativeElement.scrollHeight;
          this.collapse = true;
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '');
        }, 4);
      }
    } else {
      this.collapsing = false;
      this.shown = false;
      this.showClass = false;
      this.collapse = true;
      this.ariaExpanded = false;
      this.renderer.setStyle(this.el.nativeElement, 'height', '');
    }
  }

  @HostListener('document:scroll') onScroll() {
    if (this.navbar.nativeElement.classList.contains('scrolling-navbar')) {
      if (window.pageYOffset > this.scrollSensitivity) {
        this.renderer.addClass(this.navbar.nativeElement, 'top-nav-collapse');
      } else {
        this.renderer.removeClass(this.navbar.nativeElement, 'top-nav-collapse');
      }
    }
  }

  ngAfterContentChecked() {
    if (this.el.nativeElement.firstElementChild) {
      if (
        this._itemsLength !==
        this.el.nativeElement.firstElementChild.firstElementChild.children.length
      ) {
        this.height = this.el.nativeElement.firstElementChild.firstElementChild.clientHeight;
        this.renderer.setStyle(this.el.nativeElement, 'height', this.height + 'px');
      }

      this._itemsLength = this.el.nativeElement.firstElementChild.firstElementChild.children.length;
    }
  }
}
