import { Component, ElementRef , ViewChild, Input,  Renderer, AfterViewInit, HostListener } from '@angular/core';

@Component ({
  selector: 'mdb-navbar',
  template: `
  <nav class="{{SideClass}}" #nav>
  <ng-content></ng-content>
  <div [ngClass]="{'container': containerInside}" [ngStyle]="{'display': displayStyle}" #container>
    <ng-content select="logo"></ng-content>
    <button class="navbar-toggler" type="button" 
    (click)="toggle($event)" mdbRippleRadius
    *ngIf="this.el.nativeElement.children.length !== 0">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div #navbar [style.height]="height" class="navbar-collapse collapse" 
    [ngClass]="{'collapse': collapse, 'show': showClass, 'collapsing': collapsing}">
      <ng-content select="links" ></ng-content>
    </div>
  </div>
</nav>

  `
})

export class NavbarComponent implements AfterViewInit {
  @Input() SideClass: string;
  @Input() containerInside = true;
  shown = false;

  public height: number;
  public duration = 350; // ms

  public collapse = false;
  public showClass = false;
  public collapsing = false;

  @ViewChild('navbar') el: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  @ViewChild('nav') navbar: ElementRef;
  @ViewChild('container') container: ElementRef;

  constructor(public renderer: Renderer) {}

  ngAfterViewInit() {
    /* bugfix - bez tego sypie ExpressionChangedAfterItHasBeenCheckedError -
    https://github.com/angular/angular/issues/6005#issuecomment-165951692 */
    setTimeout(() => {
      this.height = this.el.nativeElement.scrollHeight;
      this.collapse = true;

      if (!this.containerInside) {
        const childrens = Array.from(this.container.nativeElement.children);
        childrens.forEach(child => {
          this.navbar.nativeElement.append(child);

          this.container.nativeElement.remove();
        });

      }

      if (this.el.nativeElement.children.length === 0) {
        this.el.nativeElement.remove();
      }
    });
  }

  toggle(event: any) {
    event.preventDefault();
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
    setTimeout(() => {
      this.renderer.setElementStyle(this.el.nativeElement, 'height',  this.height + 'px');
    }, 10);


    setTimeout(() => {
      this.collapsing = false;
      this.collapse = true;
      this.showClass = true;
    }, this.duration);
  }

  hide() {
    this.shown = false;
    this.collapse = false;
    this.showClass = false;
    this.collapsing = true;
    setTimeout(() => {
      this.renderer.setElementStyle(this.el.nativeElement, 'height',  '0px');
    }, 10);


    setTimeout(() => {
      this.collapsing = false;
      this.collapse = true;
    }, this.duration);
  }

  get displayStyle() {
    // if(!this.containerInside) {
      //  return 'flex';
      // } else {
        return '';
        // }
      }

      @HostListener('window:resize', ['$event']) onResize(event: any) {
        let breakpoit = 0;

        if ( this.SideClass.includes('navbar-expand-xl') ) {
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

        // console.log(breakpoit);

        if (event.target.innerWidth < breakpoit) {
          if (!this.shown) {
            this.collapse = false;
            this.renderer.setElementStyle(this.el.nativeElement, 'height',  '0px');
            this.renderer.setElementStyle(this.el.nativeElement, 'opacity',  '0');
            setTimeout(() => {
              this.height = this.el.nativeElement.scrollHeight;
              this.collapse = true;
              this.renderer.setElementStyle(this.el.nativeElement, 'opacity',  '');
            }, 4);
          }
        } else {
          this.collapsing = false;
          this.shown = false;
          this.showClass = false;
          this.collapse = true;
          this.renderer.setElementStyle(this.el.nativeElement, 'height',  '');
        }
      }

      @HostListener('document:scroll', ['$event']) onScroll() {
        if (this.navbar.nativeElement.classList.contains('scrolling-navbar')) {
          if (window.pageYOffset > 120) {
            this.renderer.setElementClass(this.navbar.nativeElement, 'top-nav-collapse', true);
          } else {
            this.renderer.setElementClass(this.navbar.nativeElement, 'top-nav-collapse', false);
          }
        }
      }
    }
