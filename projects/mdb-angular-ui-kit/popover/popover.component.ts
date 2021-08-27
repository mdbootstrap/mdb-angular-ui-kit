import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { trigger, style, animate, transition, state, AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mdb-popover',
  templateUrl: 'popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('150ms linear')),
      transition(':enter', animate('150ms linear')),
    ]),
  ],
})
export class MdbPopoverComponent implements OnInit {
  @Input() title: string;
  @Input() content: string;
  @Input() template: boolean;
  @Input() animation: boolean;

  readonly _hidden: Subject<void> = new Subject();

  animationState = 'hidden';

  constructor(private _cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  markForCheck(): void {
    this._cdRef.markForCheck();
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (event.toState === 'hidden') {
      this._hidden.next();
    }
  }
}
