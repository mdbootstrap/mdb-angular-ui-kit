import {AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

@Directive({selector: '[mdbFixedCaption]'})
export class FixedButtonCaptionDirective implements OnInit, AfterViewInit {
  @Input('mdbFixedCaption') caption: string;
  @Input('collapseButton') collapseButtonActivator: any;
  private paragraphEl: any;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef) {
  }

  ngOnInit() {
    this.createCaptionElement();
  }

  ngAfterViewInit() {
    this.renderer.listen(this.collapseButtonActivator, 'click', () => {
      this.renderer.addClass(this.paragraphEl, 'fixed-button-caption');
      this.renderer.setStyle(this.paragraphEl, 'position', 'absolute');
      this.renderer.setStyle(this.paragraphEl, 'right', `60px`);
      this.renderer.setStyle(this.paragraphEl, 'top', '10px');
      this.renderer.setStyle(this.el.nativeElement, 'overflow', 'visible');
    });
  }

  createCaptionElement() {
    const paragraph = this.renderer.createElement('p');
    const text = this.renderer.createText(this.caption);
    this.renderer.appendChild(paragraph, text);
    this.renderer.appendChild(this.el.nativeElement, paragraph);
    this.paragraphEl = paragraph;
  }
}
