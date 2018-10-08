import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-advanced',
  templateUrl: './modal-advanced.component.html',
  styleUrls: ['./modal-advanced.component.scss']
})
export class ModalAdvancedComponent implements OnInit {

  colorSelect: Array<any>;
  sizeSelect: Array<any>;

  public itemsList: Object[] = [
    {
      title: 'Description',
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.'
    },
    {
      title: 'Details',
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.'
    },
    {
      title: 'Shipping',
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.'
    }
  ];

  ngOnInit() {
    this.colorSelect = [
      { value: 'Black', label: 'Black' },
      { value: 'White', label: 'White' },
      { value: 'Red', label: 'Red' },
    ];
    this.sizeSelect = [
      { value: 'XS', label: 'XS' },
      { value: 'S', label: 'S' },
      { value: 'L', label: 'L' },
    ];
  }

}
