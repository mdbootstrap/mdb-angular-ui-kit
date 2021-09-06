import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MDB_TAB_CONTENT } from './tab-content.directive';
import { MDB_TAB_TITLE } from './tab-title.directive';

@Component({
  selector: 'mdb-tab',
  templateUrl: './tab.component.html',
})
export class MdbTabComponent implements OnInit {
  @ContentChild(MDB_TAB_CONTENT, { read: TemplateRef, static: true })
  _lazyContent: TemplateRef<any>;

  @ContentChild(MDB_TAB_TITLE, { read: TemplateRef, static: true })
  _titleContent: TemplateRef<any>;

  @ViewChild(TemplateRef, { static: true }) _content: TemplateRef<any>;

  readonly activeStateChange$: Subject<boolean> = new Subject<boolean>();

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input() title: string;

  get active(): boolean {
    return this._active;
  }

  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  get titleContent(): TemplatePortal | null {
    return this._titlePortal;
  }

  get shouldAttach(): boolean {
    return this._lazyContent === undefined;
  }

  private _contentPortal: TemplatePortal | null = null;
  private _titlePortal: TemplatePortal | null = null;

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set active(value: boolean) {
    if (value) {
      this._renderer.addClass(this._elementRef.nativeElement, 'show');
      this._renderer.addClass(this._elementRef.nativeElement, 'active');
    } else {
      this._renderer.removeClass(this._elementRef.nativeElement, 'show');
      this._renderer.removeClass(this._elementRef.nativeElement, 'active');
    }

    this._active = value;
    this.activeStateChange$.next(value);
  }
  private _active = false;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _vcr: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this._createContentPortal();

    if (this._titleContent) {
      this._createTitlePortal();
    }
  }

  private _createContentPortal(): void {
    const content = this._lazyContent || this._content;
    this._contentPortal = new TemplatePortal(content, this._vcr);
  }

  private _createTitlePortal(): void {
    this._titlePortal = new TemplatePortal(this._titleContent, this._vcr);
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
