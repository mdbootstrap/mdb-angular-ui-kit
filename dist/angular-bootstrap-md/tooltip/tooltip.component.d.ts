import { AfterViewInit } from '@angular/core';
import { TooltipConfig } from './tooltip.service';
export declare class TooltipContainerComponent implements AfterViewInit {
    classMap: any;
    placement: string;
    popupClass: string;
    animation: boolean;
    show: boolean;
    readonly isBs3: boolean;
    constructor(config: TooltipConfig);
    ngAfterViewInit(): void;
}
