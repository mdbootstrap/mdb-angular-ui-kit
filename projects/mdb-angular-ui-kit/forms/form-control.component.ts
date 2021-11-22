import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  ViewChild,
  ContentChild,
  ElementRef,
  AfterContentInit,
  Renderer2,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { MdbAbstractFormControl } from './form-control';
import { MdbLabelDirective } from './label.directive';
import { ContentObserver } from '@angular/cdk/observers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mdb-form-control',
  templateUrl: './form-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbFormControlComponent implements AfterContentInit, OnDestroy {
  @ViewChild('notchLeading', { static: true }) _notchLeading: ElementRef;
  @ViewChild('notchMiddle', { static: true }) _notchMiddle: ElementRef;
  @ContentChild(MdbAbstractFormControl, { static: true }) _formControl: MdbAbstractFormControl<any>;
  @ContentChild(MdbLabelDirective, { static: true, read: ElementRef }) _label: ElementRef;

  @HostBinding('class.form-outline') outline = true;

  get input(): HTMLInputElement {
    return this._formControl.input;
  }

  constructor(
    private _renderer: Renderer2,
    private _contentObserver: ContentObserver,
    private _elementRef: ElementRef,
    private _ngZone: NgZone
  ) {}

  readonly _destroy$: Subject<void> = new Subject<void>();

  private _notchLeadingLength = 9;
  private _labelMarginLeft = 0;
  private _labelGapPadding = 8;
  private _labelScale = 0.8;
  private _recalculateGapWhenVisible = false;

  ngAfterContentInit(): void {
    if (this._label) {
      this._updateBorderGap();
    } else {
      this._renderer.addClass(this.input, 'placeholder-active');
    }
    this._updateLabelActiveState();

    if (this._label) {
      this._contentObserver
        .observe(this._label.nativeElement)
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._updateBorderGap();
        });
    }

    this._formControl.stateChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._updateLabelActiveState();
      if (this._label) {
        this._updateBorderGap();
      }
    });

    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.pipe(takeUntil(this._destroy$)).subscribe(() => {
        if (this._label && this._recalculateGapWhenVisible) {
          this._updateBorderGap();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private _getLabelWidth(): number {
    return this._label.nativeElement.clientWidth * this._labelScale + this._labelGapPadding;
  }

  private _updateBorderGap(): void {
    // Element is in DOM but is not visible, we need to recalculate the gap when element
    // is displayed. This problem may occur in components such as tabs where content of
    // inactive tabs has display:none styles

    if (this._isHidden()) {
      this._recalculateGapWhenVisible = true;
      return;
    }

    const notchLeadingWidth = `${this._labelMarginLeft + this._notchLeadingLength}px`;
    const notchMiddleWidth = `${this._getLabelWidth()}px`;

    this._notchLeading.nativeElement.style.width = notchLeadingWidth;
    this._notchMiddle.nativeElement.style.width = notchMiddleWidth;
    this._label.nativeElement.style.marginLeft = `${this._labelMarginLeft}px`;

    this._recalculateGapWhenVisible = false;
  }

  private _updateLabelActiveState(): void {
    if (this._isLabelActive()) {
      this._renderer.addClass(this.input, 'active');
    } else {
      this._renderer.removeClass(this.input, 'active');
    }
  }

  private _isLabelActive(): boolean {
    return this._formControl && this._formControl.labelActive;
  }

  private _isHidden(): boolean {
    const el = this._elementRef.nativeElement;

    return !el.offsetHeight && !el.offsetWidth;
  }
}
