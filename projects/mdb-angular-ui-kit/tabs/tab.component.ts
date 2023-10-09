import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MDB_TAB_CONTENT } from './tab-content.directive';
import { MDB_TAB_TITLE } from './tab-title.directive';

const SHOW_TRANSITION_DELAY = 150; // Time of transition taken from styles
const TRANSITION_PADDING = 5; // Value from standard added via executeAfterTransition function

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

  @Input()
  get fade(): boolean {
    return this._fade;
  }
  set fade(value: boolean) {
    this._fade = coerceBooleanProperty(value);
  }
  private _fade = true;

  @Input() title: string;

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

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = coerceBooleanProperty(value);
    this.activeStateChange$.next(value);
  }

  private _active = false;

  get show(): boolean {
    return this._show;
  }

  set show(value: boolean) {
    // We use setTimeout to apply delay for setting show class to reproduce standard library where
    // show class is applied after a delay to newly activated item via usage of _queueCallback and
    // executeAfterTransition functions which introduce delay equal to transition time taken from
    // element styles
    setTimeout(() => {
      this._show = coerceBooleanProperty(value);
    }, SHOW_TRANSITION_DELAY + TRANSITION_PADDING);
  }

  private _show = true;

  constructor(private _vcr: ViewContainerRef) {}

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
