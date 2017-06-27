import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Navbars } from "./navbarComponent";


@NgModule({
    imports: [CommonModule],
    declarations: [Navbars],
    exports: [Navbars]
})
export class NavbarModule {
}
