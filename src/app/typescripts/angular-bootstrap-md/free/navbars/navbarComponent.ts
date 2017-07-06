import { Component, ElementRef ,ViewChild, Input, OnInit, Renderer, AfterViewInit, HostListener } from '@angular/core';

@Component ({
  selector: 'navbar',
  template: `
  	<nav class="{{SideClass}}" #nav>
		<div [ngClass]="{'container': containerInside}" [ngStyle]="{'display': displayStyle}">
			<button class="navbar-toggler navbar-toggler-right" type="button" class="navbar-toggler navbar-toggler-right" type="button" (click)="toggle($event)" ripple-radius>
				<span class="navbar-toggler-icon"></span>
			</button>
			<ng-content select="logo"></ng-content>
			<div #navbar [style.height]="height" class="navbar-collapse" [ngClass]="{'collapse': collapse, 'show': showClass, 'collapsing': collapsing}">
				<ng-content select="links" ></ng-content>
			</div>
		</div>
	</nav>
  `
})

export class Navbars implements AfterViewInit{
	@Input() SideClass: string;
	@Input() containerInside: boolean = true;

  	shown: boolean = false;

	public height: number;
	public duration: number = 350; //ms

	public collapse: boolean = false;
	public showClass: boolean = false;
	public collapsing: boolean = false;

	@ViewChild('navbar') el:ElementRef;
	@ViewChild('mobile') mobile:ElementRef;
	@ViewChild('nav') navbar:ElementRef;

	constructor(public renderer: Renderer) {
	}

	ngAfterViewInit() {
		//bugfix - bez tego sypie ExpressionChangedAfterItHasBeenCheckedError - https://github.com/angular/angular/issues/6005#issuecomment-165951692
		setTimeout(() => {
			this.height = this.el.nativeElement.scrollHeight;
			this.collapse = true;
		});
	}

	toggle(event: any) {
		event.preventDefault();
		if(!this.collapsing) {
			if(this.shown) {
				this.hide();
			} else {
				this.show();
			}
		}
	}

	show() { 
		this.shown = true;
		this.collapse = false;
		this.collapsing = true;
		setTimeout(() => {
			this.renderer.setElementStyle(this.el.nativeElement, "height",  this.height + "px");
		}, 10);
			

		setTimeout(() => {
			this.collapsing = false;
			this.collapse = true;
			this.showClass = true;
		}, this.duration);
	}

	hide() {
		this.shown = false;
		this.collapse = false;
		this.showClass = false;
		this.collapsing = true;
		setTimeout(() => {
			this.renderer.setElementStyle(this.el.nativeElement, "height",  "0px");
		}, 10);
			

		setTimeout(() => {
			this.collapsing = false;
			this.collapse = true;
		}, this.duration);	
	}

	get displayStyle() {
		// if(!this.containerInside) {
		// 	return 'flex';
		// } else {
			return '';
		// }
	}

	@HostListener('window:resize', ['$event']) onResize(event: any) {
		if(event.target.innerWidth < 992) {
			if(!this.shown) {
				this.collapse = false;
				this.renderer.setElementStyle(this.el.nativeElement, "height",  "0px");
				this.renderer.setElementStyle(this.el.nativeElement, "opacity",  "0");
				setTimeout(() => {
					this.height = this.el.nativeElement.scrollHeight;
					this.collapse = true;
					this.renderer.setElementStyle(this.el.nativeElement, "opacity",  "");
				}, 4);
			}


			
		} else {
			this.collapsing = false;
			this.shown = false;
			this.showClass = false;
			this.collapse = true;
			this.renderer.setElementStyle(this.el.nativeElement, "height",  "");
		}
	}

	
}
