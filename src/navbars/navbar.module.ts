import { NavbarService } from './navbar.service';
import { LogoComponent } from './logo.component';
import {LinksComponent} from './links.component';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NavbarComponent} from './navbar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NavbarComponent, LinksComponent, LogoComponent],
  exports: [NavbarComponent, LinksComponent , LogoComponent],
  providers: [NavbarService]
})
export class NavbarModule {}
