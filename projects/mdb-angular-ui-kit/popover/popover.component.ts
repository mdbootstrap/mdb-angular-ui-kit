import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
  booleanAttribute,
} from '@angular/core';
import { trigger, style, animate, transition, state, AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
@Component({
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
  standalone: false,
})
export class MdbPopoverComponent {
  @Input({ transform: booleanAttribute }) animation: boolean;
  @Input() content: string | TemplateRef<any>;
  @Input() context: any;
  @Input() title: string;

  get isContentTemplate(): boolean {
    return this.content instanceof TemplateRef;
  }

  readonly _hidden: Subject<void> = new Subject();

  animationState = 'hidden';

  constructor(private _cdRef: ChangeDetectorRef) {}

  markForCheck(): void {
    this._cdRef.markForCheck();
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (event.toState === 'hidden') {
      this._hidden.next();
    }
  }
}
