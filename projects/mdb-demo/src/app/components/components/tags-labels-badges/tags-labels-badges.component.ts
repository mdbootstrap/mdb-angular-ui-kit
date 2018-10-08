import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tags-labels-badges',
  templateUrl: './tags-labels-badges.component.html',
  styleUrls: ['./tags-labels-badges.component.scss']
})
export class TagsLabelsBadgesComponent implements OnInit {
  hideElement: boolean = true;
  addtags: string[]  = [];
  initialtags: string[] = ['Tag 1', 'Tag 2', 'Tag 3'];
  constructor() { }

  ngOnInit() {
  }

}
