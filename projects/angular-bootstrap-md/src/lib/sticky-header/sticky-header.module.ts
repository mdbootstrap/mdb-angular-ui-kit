import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StickyHeaderDirective} from "./sticky-header.directive";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [StickyHeaderDirective],
  exports: [StickyHeaderDirective],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ]
})
export class StickyHeaderModule {
}
