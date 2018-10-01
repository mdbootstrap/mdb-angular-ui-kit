import { Component } from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent {

  private sorted = false;

  personArray: Object[] = [
    { id: 1, name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800' },
    { id: 2, name: 'Garrett Winters', position: 'Accountant', office: 'Tokyo', age: 63, startDate: '2011/07/25', salary: '$170,750' },
    { id: 3, name: 'Herrod Chandler', position: 'Sales Assistant', office: 'San Francisco', age: 59, startDate: '2012/08/06', salary: '$103,600' },
    { id: 4, name: 'Sonya Frost', position: 'Software Engineer', office: 'Edinburgh', age: 23, startDate: '2008/12/19', salary: '$90,560' },
    { id: 5, name: 'Jena Gaines', position: 'Office Manager', office: 'London', age: 30, startDate: '2011/04/25', salary: '$320,800' },
    { id: 6, name: 'Haley Kennedy', position: 'Senior Marketing Designer', office: 'Edinburgh', age: 61, startDate: '2012/12/18', salary: '$313,500' },
    { id: 7, name: 'Tatyana Fitzpatrick', position: 'Regional Director', office: 'London', age: 66, startDate: '2010/03/17', salary: '$198,500' },
    { id: 8, name: 'Michael Silva', position: 'Marketing Designer', office: 'London', age: 61, startDate: '2012/11/27', salary: '$320,800' },
    { id: 9, name: 'Doris Wilder', position: 'Sales Assistant', office: 'Sidney', age: 23, startDate: '2010/09/20', salary: '$85,600' },
    { id: 10, name: 'Angelica Ramos', position: 'Chief Executive Officer (CEO)', office: 'London', age: 47, startDate: '2009/10/09', salary: '$1,200,000' },
  ];

  sortBy(by: string | any): void {

    this.personArray.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    this.sorted = !this.sorted;
  }

}
