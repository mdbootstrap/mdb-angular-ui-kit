import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule {}
