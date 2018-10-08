import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements AfterViewInit {
  isCollapsed: any;
  singleModel: any;
  @ViewChild('button') button: ElementRef;

  public checkModel: any = { left: true, middle: false, right: false };
  public radioModel: string = 'Left';

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.renderer.addClass(this.button.nativeElement, 'active');
    this.renderer.setAttribute(this.button.nativeElement, 'aria-pressed', 'true');
  }

}
