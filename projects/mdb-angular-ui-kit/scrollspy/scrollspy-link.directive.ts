import {
  Directive,
  OnInit,
  Input,
  HostListener,
  HostBinding,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbScrollspyLink]',
})
export class MdbScrollspyLinkDirective implements OnInit {
  @Input()
  get scrollIntoView(): boolean {
    return this._scrollIntoView;
  }
  set scrollIntoView(value: boolean) {
    this._scrollIntoView = value;
  }
  private _scrollIntoView = true;

  get section(): HTMLElement {
    return this._section;
  }
  set section(value: HTMLElement) {
    if (value) {
      this._section = value;
    }
  }
  private _section: HTMLElement;
  private _id: string;

  constructor(private cdRef: ChangeDetectorRef, @Inject(DOCUMENT) private document: any) {}

  @Input('mdbScrollspyLink')
  get id(): string {
    return this._id;
  }
  set id(newId: string) {
    if (newId) {
      this._id = newId;
    }
  }

  @HostBinding('class.scrollspy-link')
  scrollspyLink = true;

  @HostBinding('class.active')
  active = false;

  @HostListener('click', [])
  onClick(): void {
    if (this.section && this.scrollIntoView === true) {
      this.section.scrollIntoView();
    }
  }

  detectChanges(): void {
    this.cdRef.detectChanges();
  }

  assignSectionToId(): void {
    this.section = this.document.documentElement.querySelector(`#${this.id}`);
  }

  ngOnInit(): void {
    this.assignSectionToId();
  }
}
