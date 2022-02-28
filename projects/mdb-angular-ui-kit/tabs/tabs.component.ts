import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MdbTabComponent } from './tab.component';

export class MdbTabChange {
  index: number;
  tab: MdbTabComponent;
}

@Component({
  selector: 'mdb-tabs',
  templateUrl: './tabs.component.html',
})
export class MdbTabsComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(MdbTabComponent) tabs: QueryList<MdbTabComponent>;

  readonly _destroy$: Subject<void> = new Subject<void>();

  @Input()
  get fill(): boolean {
    return this._fill;
  }
  set fill(value: boolean) {
    this._fill = coerceBooleanProperty(value);
  }
  private _fill = false;

  @Input()
  get justified(): boolean {
    return this._justified;
  }
  set justified(value: boolean) {
    this._justified = coerceBooleanProperty(value);
  }
  private _justified = false;

  @Input()
  get pills(): boolean {
    return this._pills;
  }
  set pills(value: boolean) {
    this._pills = coerceBooleanProperty(value);
  }
  private _pills = false;

  @HostBinding('class.row')
  @Input()
  get vertical(): boolean {
    return this._vertical;
  }
  set vertical(value: boolean) {
    this._vertical = coerceBooleanProperty(value);
  }
  private _vertical = false;

  @Input() navColumnClass = 'col-3';
  @Input() contentColumnClass = 'col-9';

  get navColClass(): string {
    return this.vertical ? this.navColumnClass : '';
  }

  get contentColClass(): string {
    return this.vertical ? this.contentColumnClass : '';
  }

  private _selectedIndex: number;

  @Output() activeTabChange: EventEmitter<MdbTabChange> = new EventEmitter<MdbTabChange>();

  constructor() {}

  ngAfterContentInit(): void {
    const firstActiveTabIndex = this.tabs.toArray().findIndex((tab) => !tab.disabled);

    this.setActiveTab(firstActiveTabIndex);
    this.tabs.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      const hasActiveTab = this.tabs.find((tab) => tab.active);

      if (!hasActiveTab) {
        const closestTabIndex = this._getClosestTabIndex(this._selectedIndex);

        if (closestTabIndex !== -1) {
          this.setActiveTab(closestTabIndex);
        }
      }
    });
  }

  setActiveTab(index: number): void {
    const activeTab = this.tabs.toArray()[index];

    if (!activeTab || (activeTab && activeTab.disabled)) {
      return;
    }

    this.tabs.forEach((tab) => (tab.active = tab === activeTab));
    this._selectedIndex = index;

    const tabChangeEvent = this._getTabChangeEvent(index, activeTab);
    this.activeTabChange.emit(tabChangeEvent);
  }

  private _getTabChangeEvent(index: number, tab: MdbTabComponent): MdbTabChange {
    const event = new MdbTabChange();
    event.index = index;
    event.tab = tab;

    return event;
  }

  private _getClosestTabIndex(index: number): number {
    const tabs = this.tabs.toArray();
    const tabsLength = tabs.length;
    if (!tabsLength) {
      return -1;
    }

    for (let i = 1; i <= tabsLength; i += 1) {
      const prevIndex = index - i;
      const nextIndex = index + i;
      if (tabs[prevIndex] && !tabs[prevIndex].disabled) {
        return prevIndex;
      }
      if (tabs[nextIndex] && !tabs[nextIndex].disabled) {
        return nextIndex;
      }
    }
    return -1;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  static ngAcceptInputType_fill: BooleanInput;
  static ngAcceptInputType_justified: BooleanInput;
  static ngAcceptInputType_pills: BooleanInput;
  static ngAcceptInputType_vertical: BooleanInput;
}
