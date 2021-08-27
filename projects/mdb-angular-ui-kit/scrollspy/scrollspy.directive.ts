import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { MdbScrollspyLinkDirective } from './scrollspy-link.directive';
import { MdbScrollspyService } from './scrollspy.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[mdbScrollspy]',
  template: '<ng-content></ng-content>',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbScrollspyDirective implements OnInit, AfterContentInit, OnDestroy {
  @ContentChildren(MdbScrollspyLinkDirective, { descendants: true })
  links: QueryList<MdbScrollspyLinkDirective>;

  readonly _destroy$: Subject<void> = new Subject<void>();

  @Input('mdbScrollspy')
  get id(): string {
    return this._id;
  }

  set id(newId: string) {
    if (newId) {
      this._id = newId;
    }
  }

  private _id: string;

  @Output() activeLinkChange: EventEmitter<any> = new EventEmitter<any>();

  activeSub: Subscription;

  constructor(private scrollSpyService: MdbScrollspyService) {}

  ngOnInit(): void {
    this.activeSub = this.scrollSpyService.active$
      .pipe(takeUntil(this._destroy$), distinctUntilChanged())
      .subscribe((activeLink) => {
        this.activeLinkChange.emit(activeLink);
      });
  }

  ngAfterContentInit(): void {
    this.scrollSpyService.addScrollspy({ id: this.id, links: this.links });
  }

  ngOnDestroy(): void {
    this.scrollSpyService.removeScrollspy(this.id);
    this._destroy$.next();
    this._destroy$.complete();
  }
}
