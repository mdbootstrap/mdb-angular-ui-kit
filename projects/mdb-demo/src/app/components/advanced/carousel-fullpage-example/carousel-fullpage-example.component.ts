import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, RendererStyleFlags2} from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-carousel-fullpage-example',
  templateUrl: './carousel-fullpage-example.component.html',
  styleUrls: ['./carousel-fullpage-example.component.scss']
})
export class CarouselFullpageExampleComponent implements OnInit, OnDestroy, AfterViewInit {

  containerFluid: any = null;
  isBrowser: boolean;
  constructor(
    private el: ElementRef,
    private r: Renderer2,
    @Inject(PLATFORM_ID) platformId: string) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const html = this.el.nativeElement.offsetParent.parentElement;
      const body = this.el.nativeElement.offsetParent;
      const nav = body.firstElementChild.children[0];
      const footer = body.firstElementChild.children[3];
      this.r.setStyle(body, 'height', '100%');
      this.r.addClass(html, 'full-page');
      this.r.setStyle(nav, 'display', 'none');
      this.r.setStyle(footer, 'display', 'none');

      this.containerFluid = document.querySelector('.container-fluid');
      this.r.setStyle(this.containerFluid, 'padding-left', '0', RendererStyleFlags2.Important);
      this.r.setStyle(this.containerFluid, 'padding-right', '0', RendererStyleFlags2.Important);
    }

  }

  ngOnDestroy() {
    if (this.isBrowser) {
      const html = this.el.nativeElement.offsetParent.parentElement;
      const body = this.el.nativeElement.offsetParent;
      const nav = body.firstElementChild.children[0];
      const footer = body.firstElementChild.children[3];
      this.r.removeStyle(body, 'height');
      this.r.removeClass(html, 'full-page');
      this.r.removeStyle(nav, 'display');
      this.r.removeStyle(footer, 'display');
      this.r.setStyle(this.containerFluid, 'padding-left', '15px', RendererStyleFlags2.Important);
      this.r.setStyle(this.containerFluid, 'padding-right', '15px', RendererStyleFlags2.Important);
    }
  }


}
