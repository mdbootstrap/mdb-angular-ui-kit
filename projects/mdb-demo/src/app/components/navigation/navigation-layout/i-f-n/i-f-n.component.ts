import { Component, OnInit, Renderer2, Inject, RendererStyleFlags2, OnDestroy } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-i-f-n',
  templateUrl: './i-f-n.component.html',
  styleUrls: ['./i-f-n.component.scss']
})
export class IFNComponent implements OnInit, OnDestroy {

  constructor(private sharedService: SharedService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    const nav = this.document.querySelector('app-nav');
    const footer = this.document.querySelector('app-footer');
    const containerFluid = this.document.querySelector('.container-fluid');

    if (this.sharedService.navHideNavAndFooter()) {
      this.renderer.setStyle(nav, 'display', 'none');
      this.renderer.setStyle(footer, 'display', 'none');
      this.renderer.setStyle(containerFluid, 'padding-left', '0', RendererStyleFlags2.Important);
      this.renderer.setStyle(containerFluid, 'padding-right', '0', RendererStyleFlags2.Important);
    }
  }

  ngOnDestroy() {
    const nav = this.document.querySelector('app-nav');
    const containerFluid = this.document.querySelector('.container-fluid');
    const footer = this.document.querySelector('app-footer');
    this.renderer.removeStyle(nav, 'display');
    this.renderer.removeStyle(footer, 'display');
    this.renderer.setStyle(containerFluid, 'padding-left', '15px', RendererStyleFlags2.Important);
    this.renderer.setStyle(containerFluid, 'padding-right', '15px', RendererStyleFlags2.Important);
  }

}
