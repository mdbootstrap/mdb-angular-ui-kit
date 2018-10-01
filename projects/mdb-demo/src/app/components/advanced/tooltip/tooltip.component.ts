import { Component } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  public content: string = 'Add your content here';
  public html: string = '<span class="btn btn-danger">Your HTML here</span>';
}
