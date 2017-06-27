import "rxjs/add/observable/timer";
import { ChangeDetectorRef, Directive, Host, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";


import { CtrCompleter, CompleterList } from "./completerDirective";
import { CompleterData } from "../services/completerDataService";
import { CompleterItem } from "../components/completerItemComponent";
import { MIN_SEARCH_LENGTH, PAUSE, CLEAR_TIMEOUT, isNil } from "../globals";


export class CtrListContext {
    constructor(
        public results: CompleterItem[],
        public searching: boolean,
        public searchInitialized: boolean,
        public isOpen: boolean
    ) { }
}

@Directive({
    selector: "[ctrList]",
})
export class CtrList implements OnInit, CompleterList {
    @Input() public ctrListMinSearchLength = MIN_SEARCH_LENGTH;
    @Input() public ctrListPause = PAUSE;
    @Input() public ctrListAutoMatch = false;
    @Input() public ctrListAutoHighlight = false;

    private _dataService: CompleterData;
    // private results: CompleterItem[] = [];
    private term: string = null;
    // private searching = false;
    private searchTimer: Subscription = null;
    private clearTimer: Subscription = null;
    private ctx = new CtrListContext([], false, false, false);
    private _initialValue: any = null;

    constructor(
        @Host() private completer: CtrCompleter,
        private templateRef: TemplateRef<CtrListContext>,
        private viewContainer: ViewContainerRef,
        private cd: ChangeDetectorRef) { }

    public ngOnInit() {
        this.completer.registerList(this);
        this.viewContainer.createEmbeddedView(
            this.templateRef,
            new CtrListContext([], false, false, false)
        );
    }

    @Input("ctrList")
    public set dataService(newService: CompleterData) {
        this._dataService = newService;
        if (this._dataService) {
            this._dataService
                .catch(err => this.handleError(err))
                .subscribe(results => {
                    this.ctx.searchInitialized = true;
                    this.ctx.searching = false;
                    this.ctx.results = results;
                    if (this.ctrListAutoMatch && results.length === 1 && results[0].title && !isNil(this.term) &&
                        results[0].title.toLocaleLowerCase() === this.term.toLocaleLowerCase()) {
                        // Do automatch
                        this.completer.onSelected(results[0]);
                    }
                    if (this._initialValue) {
                        this.initialValue = this._initialValue;
                        this._initialValue = null;
                    }
                    if (this.ctrListAutoHighlight) {
                        this.completer.autoHighlightIndex = this.getBestMatchIndex();
                    }
                    this.refreshTemplate();
                });
        }
    }

    @Input("ctrListInitialValue")
    public set initialValue(value: any) {
        if (this._dataService && typeof this._dataService.convertToItem === "function") {
            setTimeout(() => {
                const initialItem = this._dataService.convertToItem(value);
                if (initialItem) {
                    this.completer.onSelected(initialItem, false);
                }
            });
        } else if (!this._dataService) {
            this._initialValue = value;
        }
    }

    public search(term: string) {
        if (!isNil(term) && term.length >= this.ctrListMinSearchLength && this.term !== term) {
            if (this.searchTimer) {
                this.searchTimer.unsubscribe();
                this.searchTimer = null;
            }
            if (!this.ctx.searching) {
                this.ctx.results = [];
                this.ctx.searching = true;
                this.ctx.searchInitialized = true;
                this.refreshTemplate();
            }
            if (this.clearTimer) {
                this.clearTimer.unsubscribe();
            }
            this.searchTimer = Observable.timer(this.ctrListPause).subscribe(() => {
                this.searchTimerComplete(term);
            });
        } else if (!isNil(term) && term.length < this.ctrListMinSearchLength) {
            this.clear();
        }
    }

    public clear() {
        if (this.searchTimer) {
            this.searchTimer.unsubscribe();
        }
        this.clearTimer = Observable.timer(CLEAR_TIMEOUT).subscribe(() => {
            this._clear();
        });
    }

    public open() {
        if (!this.ctx.searchInitialized) {
            this.search("");
        }
        this.refreshTemplate();
    }

    public isOpen(open: boolean) {
        this.ctx.isOpen = open;
    }

    private _clear() {
        if (this.searchTimer) {
            this.searchTimer.unsubscribe();
            this.searchTimer = null;
        }
        if (this.dataService) {
            this.dataService.cancel();
        }

        this.viewContainer.clear();
    }

    private searchTimerComplete(term: string) {
        // Begin the search
        if (isNil(term) || term.length < this.ctrListMinSearchLength) {
            this.ctx.searching = false;
            return;
        }
        this.term = term;
        this._dataService.search(term);
    }

    private handleError(error: any) {
        this.ctx.searching = false;
        let errMsg: string = "search error";
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : "Server error";
        }

        if (console && console.error) {
            console.error(errMsg); // log to console
        }
        this.refreshTemplate();

        return Observable.throw(errMsg);
    }

    private refreshTemplate() {
        // Recreate the template
        this.viewContainer.clear();
        if (this.ctx.results && this.ctx.isOpen) {
            this.viewContainer.createEmbeddedView(
                this.templateRef,
                this.ctx
            );
        }
        this.cd.markForCheck();
    }

    private getBestMatchIndex() {
        if (!this.ctx.results) {
            return null;
        }

        // First try to find the exact term
        let bestMatch = this.ctx.results.findIndex(item => item.title.toLowerCase() === this.term.toLocaleLowerCase());
        // If not try to find the first item that starts with the term
        if (bestMatch < 0) {
            bestMatch = this.ctx.results.findIndex(item => item.title.toLowerCase().startsWith(this.term.toLocaleLowerCase()));
        }
        // If not try to find the first item that includes the term
        if (bestMatch < 0) {
            bestMatch = this.ctx.results.findIndex(item => item.title.toLowerCase().includes(this.term.toLocaleLowerCase()));
        }

        return bestMatch < 0 ? null : bestMatch;
    }

}