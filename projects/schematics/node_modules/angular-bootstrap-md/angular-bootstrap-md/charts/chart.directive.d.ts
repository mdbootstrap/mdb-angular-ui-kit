import { OnDestroy, OnInit, OnChanges, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { Colors } from './colors.service';
export declare class BaseChartDirective implements OnDestroy, OnChanges, OnInit, Colors {
    static defaultColors: Array<number[]>;
    data: number[] | any[];
    datasets: any[];
    labels: Array<any>;
    options: any;
    chartType: string;
    colors: Array<any>;
    legend: boolean;
    chartClick: EventEmitter<any>;
    chartHover: EventEmitter<any>;
    ctx: any;
    chart: any;
    cvs: any;
    initFlag: boolean;
    element: ElementRef;
    isBrowser: any;
    constructor(element: ElementRef, platformId: string);
    ngOnInit(): any;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): any;
    getChartBuilder(ctx: any): any;
    private updateChartData(newDataValues);
    private getDatasets();
    private refresh();
}
