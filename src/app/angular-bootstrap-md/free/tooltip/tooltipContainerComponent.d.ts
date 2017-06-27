import { AfterViewInit } from '@angular/core';
import { TooltipConfig } from './tooltipConfig';
export declare class TooltipContainerComponent implements AfterViewInit {
    classMap: any;
    placement: string;
    popupClass: string;
    animation: boolean;
    readonly isBs3: boolean;
    constructor(config: TooltipConfig);
    ngAfterViewInit(): void;
}
