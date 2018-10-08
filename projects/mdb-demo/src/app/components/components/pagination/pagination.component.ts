import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  paginationCounter = [1, 2, 3, 4, 5];
  firstActivePage = 1;
  lastActivePage = 5;
  currentActivePage = 1;

  basic = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  blue = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  red = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  teal = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  dark = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  bluegrey = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  amber = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  purple = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  darkgrey = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  small = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  big = {
    firstActivePage: 1,
    lastActivePage: 5,
    currentActivePage: 1
  };

  nextPage(type: any) {
    console.log(type);
    /* this[type].currentActivePage++; */
  }

  prevPage(type: string) {
    console.log(type);
    /* this[type].currentActivePage--; */

  }

  ngOnInit() {
  }

}
