import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
  ViewChild,
  ContentChild,
  ElementRef,
  AfterViewInit,
  AfterContentInit,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { MdbAbstractFormControl } from './form-control';
import { MdbInputDirective } from './input.directive';
import { MdbLabelDirective } from './label.directive';
import { ContentObserver } from '@angular/cdk/observers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mdb-form-control',
  templateUrl: './form-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbFormControlComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  @ViewChild('notchLeading', { static: true }) _notchLeading: ElementRef;
  @ViewChild('notchMiddle', { static: true }) _notchMiddle: ElementRef;
  @ContentChild(MdbInputDirective, { static: true, read: ElementRef }) _input: ElementRef;
  @ContentChild(MdbAbstractFormControl, { static: true }) _formControl: MdbAbstractFormControl<any>;
  @ContentChild(MdbLabelDirective, { static: true, read: ElementRef }) _label: ElementRef;

  @HostBinding('class.form-outline') outline = true;

  constructor(private _renderer: Renderer2, private _contentObserver: ContentObserver) {}

  readonly _destroy$: Subject<void> = new Subject<void>();

  private _notchLeadingLength = 9;
  private _labelMarginLeft = 0;
  private _labelGapPadding = 8;
  private _labelScale = 0.8;

  ngAfterViewInit(): void {}

  ngAfterContentInit(): void {
    if (this._label) {
      this._updateBorderGap();
    } else {
      this._renderer.addClass(this._input.nativeElement, 'placeholder-active');
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
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private _getLabelWidth(): number {
    return this._label.nativeElement.clientWidth * this._labelScale + this._labelGapPadding;
  }

  private _updateBorderGap(): void {
    const notchLeadingWidth = `${this._labelMarginLeft + this._notchLeadingLength}px`;
    const notchMiddleWidth = `${this._getLabelWidth()}px`;

    this._renderer.setStyle(this._notchLeading.nativeElement, 'width', notchLeadingWidth);
    this._renderer.setStyle(this._notchMiddle.nativeElement, 'width', notchMiddleWidth);
    this._renderer.setStyle(this._label.nativeElement, 'margin-left', `${this._labelMarginLeft}px`);
  }

  private _updateLabelActiveState(): void {
    if (this._isLabelActive()) {
      this._renderer.addClass(this._input.nativeElement, 'active');
    } else {
      this._renderer.removeClass(this._input.nativeElement, 'active');
    }
  }

  private _isLabelActive(): boolean {
    return this._formControl && this._formControl.labelActive;
  }
}
