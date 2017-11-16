import { ChangeDetectionStrategy, Input, Component, HostBinding, OnInit } from '@angular/core';
import { PopoverConfig } from './popover.config';
import { isBs3 } from '../utils/ng2-bootstrap-config';

@Component({
 selector: 'mdb-popover-container',
 changeDetection: ChangeDetectionStrategy.OnPush,
 template: `
 <h3 class="popover-header" *ngIf="title">{{title}}</h3>
 <div class="popover-body">
 <ng-content></ng-content>
 </div>`
})
export class PopoverContainerComponent implements OnInit {

@Input() public placement: string;
 @Input() public title: string;

@HostBinding('class.show') show = '!isBs3';
 @HostBinding('attr.role') role = 'tooltip';
 @HostBinding('class') class;



public get isBs3(): boolean {
 return isBs3();
 }

public constructor(config: PopoverConfig) {
 Object.assign(this, config);
 }

ngOnInit() {
 this.class = 'popover-fadeIn popover in popover-' + this.placement + ' ' + this.placement + ' bs-popover-' + this.placement;
 }
}