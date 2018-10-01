import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-r-f-n',
  templateUrl: './r-f-n.component.html',
  styleUrls: ['./r-f-n.component.scss']
})
export class RFNComponent implements OnInit, OnDestroy {

  constructor(private sharedService: SharedService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    const nav = this.document.querySelector('app-nav');
    const footer = this.document.querySelector('app-footer');

    if (this.sharedService.navHideNavAndFooter()) {
      this.renderer.setStyle(nav, 'display', 'none');
      this.renderer.setStyle(footer, 'display', 'none');
    }
  }

  ngOnDestroy() {
    const nav = this.document.querySelector('app-nav');
    const footer = this.document.querySelector('app-footer');
    this.renderer.removeStyle(nav, 'display');
    this.renderer.removeStyle(footer, 'display');
  }

}
