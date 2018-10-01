import { Component, ViewChildren, QueryList, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-pagination-basic',
  templateUrl: './pagination-basic.component.html',
  styleUrls: ['./pagination-basic.component.scss']
})
export class PaginationBasicComponent implements AfterViewInit {

  @ViewChildren('pages') pages: QueryList<ElementRef>;

  allPosts: Array<any> = [ ];

  activePage = 1;
  pageCount: Array<any> = [1, 2, 3];
  first = 1;
  last = 4;

  @HostListener('click', ['$event']) onclick(event: any) {
    if (event.target.parentElement.innerText >= 1 || event.target.parentElement.innerText <= 3) {
      (this.activePage as number) = +event.target.parentElement.innerText;
      this.clearActive();
      this.renderer.addClass(event.target.parentElement, 'active');
    }
    this.first = +this.activePage * 4 - 4 + 1;
    this.last = +this.activePage * 4;
  }

  constructor(private renderer: Renderer2) {
    for (let i = 0; i <= 15; i++) {
      this.allPosts.push({id: i, title: 'Post ' + i});
    }
   }

  ngAfterViewInit() {
    this.clearActive();
    this.renderer.addClass(this.pages.first.nativeElement, 'active');
    this.activePage = 1;
    this.first = +this.activePage * 4 - 4 + 1;
    this.last = +this.activePage * 4;
  }

  clearActive() {
    this.pages.forEach(element => {
      this.renderer.removeClass(element.nativeElement, 'active');
    });
  }

  firstPage() {
    this.clearActive();
    const firstPage = this.pages.first.nativeElement;
    (this.activePage as number) = +firstPage.innerText;
    this.clearActive();
    this.renderer.addClass(firstPage, 'active');

    this.first = +this.activePage * 4 - 4 + 1;
    this.last = +this.activePage * 4;
    console.log(this.activePage);
  }

  lastPage() {
    this.clearActive();
    const lastPage = this.pages.last.nativeElement;
    (this.activePage as number) = +lastPage.innerText;
    this.clearActive();
    this.renderer.addClass(lastPage, 'active');

    this.first = +this.activePage * 4 - 4 + 1;
    this.last = +this.activePage * 4;
    console.log(this.activePage);

  }

}
