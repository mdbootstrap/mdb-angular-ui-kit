import { MasksComponent } from './components/css/masks/masks.component';
import { ShadowsComponent } from './components/css/shadows/shadows.component';
import { HoverComponent } from './components/css/hover/hover.component';
import { CssMainComponent } from './components/css/css-main/css-main.component';
import { PaginationTableComponent } from './components/tables/pagination/pagination.component';
import { SharedService } from './shared/shared.service';
import { RoutesModule } from './modules/routes/routes.module';
import { BrowserModule } from '@angular/platform-browser';
import {MDBBootstrapModule} from 'angular-bootstrap-md';

import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ComponentsMainComponent } from './components/components/components-main/components-main.component';
import { AdvancedMainComponent } from './components/advanced/advanced-main/advanced-main.component';
import { NavigationMainComponent } from './components/navigation/navigation-main/navigation-main.component';
import { FormsMainComponent } from './components/forms/forms-main/forms-main.component';
import { TablesMainComponent } from './components/tables/tables-main/tables-main.component';
import { ModalsMainComponent } from './components/modals/modals-main/modals-main.component';
import { ExtendedMainComponent } from './components/extended/extended-main/extended-main.component';

import { ButtonsComponent } from './components/components/buttons/buttons.component';
import { CardsComponent } from './components/components/cards/cards.component';
import { DropdownsComponent } from './components/components/dropdowns/dropdowns.component';
import { ListGroupsComponent } from './components/components/list-groups/list-groups.component';
import { PanelsComponent } from './components/components/panels/panels.component';
import { PaginationComponent } from './components/components/pagination/pagination.component';

import { TagsLabelsBadgesComponent } from './components/components/tags-labels-badges/tags-labels-badges.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationBasicComponent } from './components/components/pagination-basic/pagination-basic.component';
import { PaginationAdvancedComponent } from './components/components/pagination-advanced/pagination-advanced.component';
import { CarouselComponent } from './components/advanced/carousel/carousel.component';
import { CollapseComponent } from './components/advanced/collapse/collapse.component';
import { ChartsComponent } from './components/advanced/charts/charts.component';
import { PopoverComponent } from './components/advanced/popover/popover.component';
import { TooltipComponent } from './components/advanced/tooltip/tooltip.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CarouselFullpageExampleComponent } from './components/advanced/carousel-fullpage-example/carousel-fullpage-example.component';
import { LineComponent } from './components/advanced/charts/line/line.component';
import { RadarComponent } from './components/advanced/charts/radar/radar.component';
import { BarComponent } from './components/advanced/charts/bar/bar.component';
import { PolarComponent } from './components/advanced/charts/polar/polar.component';
import { PieComponent } from './components/advanced/charts/pie/pie.component';
import { DounghnutComponent } from './components/advanced/charts/dounghnut/dounghnut.component';
import { EasyComponent } from './components/advanced/charts/easy/easy.component';
import { FooterExComponent } from './components/navigation/footer-ex/footer-ex.component';
import { HamburgerComponent } from './components/navigation/hamburger/hamburger.component';
import { NavsComponent } from './components/navigation/navs/navs.component';
import { NavbarsComponent } from './components/navigation/navbars/navbars.component';
import { NavigationLayoutComponent } from './components/navigation/navigation-layout/navigation-layout.component';

import { RFNComponent } from './components/navigation/navigation-layout/r-f-n/r-f-n.component';
import { RNFNComponent } from './components/navigation/navigation-layout/r-n-f-n/r-n-f-n.component';
import { INFNComponent } from './components/navigation/navigation-layout/i-n-f-n/i-n-f-n.component';
import { IFNComponent } from './components/navigation/navigation-layout/i-f-n/i-f-n.component';
import { IFTNComponent } from './components/navigation/navigation-layout/i-f-t-n/i-f-t-n.component';
import { INFTNComponent } from './components/navigation/navigation-layout/i-n-f-t-n/i-n-f-t-n.component';
import { CheckboxComponent } from './components/forms/checkbox/checkbox.component';
import { FormsComponent } from './components/forms/forms/forms.component';
import { InputsComponent } from './components/forms/inputs/inputs.component';
import { InputGroupsComponent } from './components/forms/input-groups/input-groups.component';
import { InputValidationComponent } from './components/forms/input-validation/input-validation.component';
import { RadioComponent } from './components/forms/radio/radio.component';
import { SearchComponent } from './components/forms/search/search.component';
import { TextareaComponent } from './components/forms/textarea/textarea.component';
import { BasicComponent } from './components/tables/basic/basic.component';
import { AdditionalComponent } from './components/tables/additional/additional.component';
import { EditableComponent } from './components/tables/editable/editable.component';
import { ResponsiveComponent } from './components/tables/responsive/responsive.component';
import { SortComponent } from './components/tables/sort/sort.component';
import { SearchTableComponent } from './components/tables/search/search.component';
import { ModalBasicComponent } from './components/modals/modal-basic/modal-basic.component';
import { ModalAdvancedComponent } from './components/modals/modal-advanced/modal-advanced.component';
import { ModalEventsComponent } from './components/modals/modal-events/modal-events.component';
import { ModalFormsComponent } from './components/modals/modal-forms/modal-forms.component';
import { ModalStylesComponent } from './components/modals/modal-styles/modal-styles.component';
import { MapsComponent } from './components/extended/maps/maps.component';
import { PaginationApiComponent } from './components/components/pagination-api/pagination-api.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ComponentsMainComponent,
    AdvancedMainComponent,
    NavigationMainComponent,
    FormsMainComponent,
    TablesMainComponent,
    ModalsMainComponent,
    ExtendedMainComponent,
    ButtonsComponent,
    CardsComponent,
    DropdownsComponent,
    ListGroupsComponent,
    PanelsComponent,
    PaginationComponent,
    TagsLabelsBadgesComponent,
    PaginationBasicComponent,
    PaginationAdvancedComponent,
    CarouselComponent,
    CollapseComponent,
    ChartsComponent,
    PopoverComponent,
    TooltipComponent,
    CarouselFullpageExampleComponent,
    LineComponent,
    RadarComponent,
    BarComponent,
    PolarComponent,
    PieComponent,
    DounghnutComponent,
    EasyComponent,
    FooterExComponent,
    HamburgerComponent,
    NavsComponent,
    NavbarsComponent,
    NavigationLayoutComponent,
    RFNComponent,
    RNFNComponent,
    INFNComponent,
    IFNComponent,
    IFTNComponent,
    INFTNComponent,
    CheckboxComponent,
    FormsComponent,
    InputsComponent,
    InputGroupsComponent,
    InputValidationComponent,
    RadioComponent,
    SearchComponent,
    TextareaComponent,
    BasicComponent,
    AdditionalComponent,
    EditableComponent,
    ResponsiveComponent,
    SortComponent,
    PaginationTableComponent,
    SearchTableComponent,
    ModalBasicComponent,
    ModalAdvancedComponent,
    ModalEventsComponent,
    ModalFormsComponent,
    ModalStylesComponent,
    MapsComponent,
    CssMainComponent,
    HoverComponent,
    ShadowsComponent,
    MasksComponent,
    PaginationApiComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    MDBBootstrapModule.forRoot(),
    RoutesModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({}),
    HttpModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
