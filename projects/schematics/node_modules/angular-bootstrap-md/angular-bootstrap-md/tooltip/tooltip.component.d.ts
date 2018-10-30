import { AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { TooltipConfig } from './tooltip.service';
export declare class TooltipContainerComponent implements AfterViewInit {
    private r;
    classMap: any;
    placement: string;
    popupClass: string;
    animation: boolean;
    tooltipInner: ElementRef;
    tooltipArrow: ElementRef;
    show: boolean;
    readonly isBs3: boolean;
    constructor(config: TooltipConfig, r: Renderer2);
    ngAfterViewInit(): void;
}
