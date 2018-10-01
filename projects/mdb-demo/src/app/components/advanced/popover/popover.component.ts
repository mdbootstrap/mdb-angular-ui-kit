import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
  public content: string = 'Add your content here';
  public html: string = '<span class="btn btn-danger">Your HTML here</span>';

  
  constructor() { }

  ngOnInit() {
  }

}
