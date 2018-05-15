import { OnInit } from '@angular/core';
import { PopoverConfig } from './popover.config';
export declare class PopoverContainerComponent implements OnInit {
    placement: string;
    title: string;
    show: string;
    role: string;
    class: any;
    readonly isBs3: boolean;
    constructor(config: PopoverConfig);
    ngOnInit(): void;
}
