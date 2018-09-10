
import { Component, OnInit, HostBinding, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { state, style, trigger, transition, animate } from '@angular/animations';

@Component({
  selector: '[mdbCollapse]',
  exportAs: 'bs-collapse',
  template: '<ng-content></ng-content>',
  animations: [
    trigger('expandBody', [
      state('collapsed', style({height: '0px', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('500ms ease')),
    ])
  ],
})
export class CollapseComponent implements OnInit {
  @Input() isCollapsed = false;

  @Output() showBsCollapse: EventEmitter<any> = new EventEmitter();
  @Output() shownBsCollapse: EventEmitter<any> = new EventEmitter();
  @Output() hideBsCollapse: EventEmitter<any> = new EventEmitter();
  @Output() hiddenBsCollapse: EventEmitter<any> = new EventEmitter();
  @Output() collapsed: EventEmitter<any> = new EventEmitter();
  @Output() expanded: EventEmitter<any> = new EventEmitter();

  constructor() { }

  @HostBinding('@expandBody') expandAnimationState: string;
  @HostBinding('style.overflow')
  overflow = 'hidden';

  @HostListener('@expandBody.done', ['$event'])
  onExpandBodyDone(event: any) {
    if (event.toState === 'expanded') {
      this.shownBsCollapse.emit(this);
      this.expanded.emit(this);
    } else {
      this.hiddenBsCollapse.emit(this);
      this.collapsed.emit(this);
    }
  }

  toggle() {
    this.isCollapsed ? this.open() : this.hide();
  }

  open() {
    this.expandAnimationState = 'expanded';
    this.isCollapsed = false;

    this.showBsCollapse.emit(this);
  }

  hide() {
    this.expandAnimationState = 'collapsed';
    this.isCollapsed = true;

    this.hideBsCollapse.emit(this);
  }

  initializeCollapseState() {
    this.isCollapsed ? this.hide() : this.open();
  }

  ngOnInit() {
    this.initializeCollapseState();
  }

}

