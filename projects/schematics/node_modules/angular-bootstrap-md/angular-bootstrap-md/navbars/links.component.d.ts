import { NavbarService } from './navbar.service';
import { AfterContentInit, ElementRef, QueryList, EventEmitter } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
export declare class LinksComponent implements AfterViewInit, AfterContentInit {
    private _navbarService;
    links: QueryList<ElementRef>;
    linkClick: EventEmitter<any>;
    constructor(_navbarService: NavbarService);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
}
