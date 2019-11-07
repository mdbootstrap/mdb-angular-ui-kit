import { Component, ElementRef, OnInit, Renderer2, HostBinding } from '@angular/core';

import { ClassName } from './modal.options';
import { isBs3 } from '../utils/ng2-bootstrap-config';
import { Utils } from '../utils/utils.class';

export class ModalBackdropOptions {
  public animate = true;

  public constructor(options: ModalBackdropOptions) {
    Object.assign(this, options);
  }
}

/** This component will be added as background layout for modals if enabled */
@Component({
  selector: 'mdb-modal-backdrop',
  template: ``,
})
export class ModalBackdropComponent implements OnInit {
  @HostBinding('class.modal-backdrop') public classNameBackDrop = true;

  public get isAnimated(): boolean {
    return this._isAnimated;
  }

  public set isAnimated(value: boolean) {
    this._isAnimated = value;
  }

  public get isShown(): boolean {
    return this._isShown;
  }

  public set isShown(value: boolean) {
    this._isShown = value;
    if (value) {
      this.renderer.addClass(this.element.nativeElement, `${ClassName.IN}`);

      if (!isBs3()) {
        this.renderer.addClass(this.element.nativeElement, `${ClassName.SHOW}`);
      }
    } else {
      this.renderer.removeClass(this.element.nativeElement, `${ClassName.IN}`);

      if (!isBs3()) {
        this.renderer.removeClass(this.element.nativeElement, `${ClassName.SHOW}`);
      }
    }
  }

  protected _isAnimated: boolean;
  protected _isShown = false;

  public constructor(public element: ElementRef, public renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.isAnimated) {
      this.renderer.addClass(this.element.nativeElement, `${ClassName.FADE}`);
      Utils.reflow(this.element.nativeElement);
    } else {
      this.renderer.addClass(this.element.nativeElement, `${ClassName.FADE}`);
      Utils.reflow(this.element.nativeElement);
    }
    this.isShown = true;
  }
}
