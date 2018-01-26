import { LinksComponent } from './links.component';
import { LogoComponent } from './logo.component';
import { NavbarService } from './navbar.service';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import { NavlinksComponent } from './navlinks.component';
@NgModule({
  imports: [CommonModule],
  declarations: [NavbarComponent, LinksComponent, LogoComponent, NavlinksComponent],
  exports: [NavbarComponent, LinksComponent , LogoComponent, NavlinksComponent],
  providers: [NavbarService]
})
export class NavbarModule {}
