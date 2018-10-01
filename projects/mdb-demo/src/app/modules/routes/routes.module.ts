import { ShadowsComponent } from './../../components/css/shadows/shadows.component';
import { MasksComponent } from './../../components/css/masks/masks.component';
import { HoverComponent } from './../../components/css/hover/hover.component';
import { CssMainComponent } from './../../components/css/css-main/css-main.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { MapsComponent } from './../../components/extended/maps/maps.component';

import { ModalStylesComponent } from './../../components/modals/modal-styles/modal-styles.component';
import { ModalFormsComponent } from './../../components/modals/modal-forms/modal-forms.component';
import { ModalEventsComponent } from './../../components/modals/modal-events/modal-events.component';
import { ModalAdvancedComponent } from './../../components/modals/modal-advanced/modal-advanced.component';
import { ModalBasicComponent } from './../../components/modals/modal-basic/modal-basic.component';
import { SearchTableComponent } from './../../components/tables/search/search.component';
import { PaginationTableComponent } from './../../components/tables/pagination/pagination.component';
import { ResponsiveComponent } from './../../components/tables/responsive/responsive.component';
import { EditableComponent } from './../../components/tables/editable/editable.component';
import { AdditionalComponent } from './../../components/tables/additional/additional.component';
import { BasicComponent } from './../../components/tables/basic/basic.component';
import { TextareaComponent } from './../../components/forms/textarea/textarea.component';
import { SearchComponent } from './../../components/forms/search/search.component';
import { InputValidationComponent } from './../../components/forms/input-validation/input-validation.component';
import { InputGroupsComponent } from './../../components/forms/input-groups/input-groups.component';
import { FormsComponent } from './../../components/forms/forms/forms.component';
import { CheckboxComponent } from './../../components/forms/checkbox/checkbox.component';
import { IFNComponent } from './../../components/navigation/navigation-layout/i-f-n/i-f-n.component';
import { INFNComponent } from './../../components/navigation/navigation-layout/i-n-f-n/i-n-f-n.component';
import { RNFNComponent } from './../../components/navigation/navigation-layout/r-n-f-n/r-n-f-n.component';
import { NavigationLayoutComponent } from './../../components/navigation/navigation-layout/navigation-layout.component';
import { NavsComponent } from './../../components/navigation/navs/navs.component';
import { PaginationBasicComponent } from './../../components/components/pagination-basic/pagination-basic.component';
import { PanelsComponent } from './../../components/components/panels/panels.component';
import { ListGroupsComponent } from './../../components/components/list-groups/list-groups.component';
import { DropdownsComponent } from './../../components/components/dropdowns/dropdowns.component';
import { CardsComponent } from './../../components/components/cards/cards.component';
import { ButtonsComponent } from './../../components/components/buttons/buttons.component';

import { ExtendedMainComponent } from './../../components/extended/extended-main/extended-main.component';
import { ModalsMainComponent } from './../../components/modals/modals-main/modals-main.component';
import { TablesMainComponent } from './../../components/tables/tables-main/tables-main.component';
import { FormsMainComponent } from './../../components/forms/forms-main/forms-main.component';

import { MainViewComponent } from './../../components/main-view/main-view.component';
import { NavComponent } from './../../components/shared/nav/nav.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsMainComponent } from '../../components/components/components-main/components-main.component';
import { AdvancedMainComponent } from '../../components/advanced/advanced-main/advanced-main.component';
import { NavigationMainComponent } from '../../components/navigation/navigation-main/navigation-main.component';
import { PaginationComponent } from '../../components/components/pagination/pagination.component';
import { TagsLabelsBadgesComponent } from '../../components/components/tags-labels-badges/tags-labels-badges.component';
import { PaginationAdvancedComponent } from '../../components/components/pagination-advanced/pagination-advanced.component';
import { PaginationApiComponent } from '../../components/components/pagination-api/pagination-api.component';
import { CarouselComponent } from '../../components/advanced/carousel/carousel.component';
import { CollapseComponent } from '../../components/advanced/collapse/collapse.component';
import { ChartsComponent } from '../../components/advanced/charts/charts.component';
import { PopoverComponent } from '../../components/advanced/popover/popover.component';
import { TooltipComponent } from '../../components/advanced/tooltip/tooltip.component';
import { CarouselFullpageExampleComponent } from '../../components/advanced/carousel-fullpage-example/carousel-fullpage-example.component';
import { FooterExComponent } from '../../components/navigation/footer-ex/footer-ex.component';
import { HamburgerComponent } from '../../components/navigation/hamburger/hamburger.component';
import { NavbarsComponent } from '../../components/navigation/navbars/navbars.component';
import { RFNComponent } from '../../components/navigation/navigation-layout/r-f-n/r-f-n.component';
import { IFTNComponent } from '../../components/navigation/navigation-layout/i-f-t-n/i-f-t-n.component';
import { INFTNComponent } from '../../components/navigation/navigation-layout/i-n-f-t-n/i-n-f-t-n.component';
import { SharedService } from '../../shared/shared.service';
import { InputsComponent } from '../../components/forms/inputs/inputs.component';
import { RadioComponent } from '../../components/forms/radio/radio.component';
import { SortComponent } from '../../components/tables/sort/sort.component';
const routes: Routes = [
  { path: '', component: MainViewComponent },
  {
    path: 'css', component: CssMainComponent, children: [
      { path: 'hover', component: HoverComponent },
      { path: 'masks', component: MasksComponent },
      { path: 'shadows', component: ShadowsComponent }
    ]
  },
  {
    path: 'components', component: ComponentsMainComponent, children: [
      { path: 'buttons', component: ButtonsComponent },
      { path: 'cards', component: CardsComponent },
      { path: 'dropdowns', component: DropdownsComponent },
      { path: 'list-group', component: ListGroupsComponent },
      { path: 'panels', component: PanelsComponent },
      { path: 'pagination', component: PaginationComponent },
      { path: 'tags', component: TagsLabelsBadgesComponent },
      { path: 'pagination-basic', component: PaginationBasicComponent },
      { path: 'pagination-advanced', component: PaginationAdvancedComponent },
      { path: 'pagination-api', component: PaginationApiComponent },
    ]
  },
  {
    path: 'advanced', component: AdvancedMainComponent, children: [
      { path: 'carousel', component: CarouselComponent },
      { path: 'carousel-fullpage', component: CarouselFullpageExampleComponent },
      { path: 'collapse', component: CollapseComponent },
      { path: 'charts', component: ChartsComponent },
      { path: 'popover', component: PopoverComponent },
      { path: 'tooltip', component: TooltipComponent },
    ]
  },
  {
    path: 'navigation', component: NavigationMainComponent, children: [
      { path: 'footer', component: FooterExComponent },
      { path: 'hamburger', component: HamburgerComponent },
      { path: 'navs', component: NavsComponent },
      { path: 'navbars', component: NavbarsComponent },
      {
        path: 'layouts', component: NavigationLayoutComponent, children: [
          { path: 'r-f-n', component: RFNComponent },
          { path: 'r-n-f-n', component: RNFNComponent },
          { path: 'i-n-f-n', component: INFNComponent },
          { path: 'i-f-n', component: IFNComponent },
          { path: 'i-f-t-n', component: IFTNComponent },
          { path: 'i-n-f-t-n', component: INFTNComponent },
        ]
      }
    ]
  },
  {
    path: 'forms', component: FormsMainComponent, children: [
      { path: 'checkbox', component: CheckboxComponent },
      { path: 'forms', component: FormsComponent },
      { path: 'inputs', component: InputsComponent },
      { path: 'input-group', component: InputGroupsComponent },
      { path: 'input-validation', component: InputValidationComponent },
      { path: 'radio', component: RadioComponent },
      { path: 'search', component: SearchComponent },
      { path: 'textarea', component: TextareaComponent },
    ]
  },
  {
    path: 'tables', component: TablesMainComponent, children: [
      { path: 'basic', component: BasicComponent },
      { path: 'styles', component: AdditionalComponent },
      { path: 'editable', component: EditableComponent },
      { path: 'pagination', component: PaginationTableComponent },
      { path: 'responsive', component: ResponsiveComponent },
      { path: 'search', component: SearchTableComponent },
      { path: 'sort', component: SortComponent }
    ]
  },
  {
    path: 'modals', component: ModalsMainComponent, children: [
      { path: 'basic', component: ModalBasicComponent },
      { path: 'advanced', component: ModalAdvancedComponent },
      { path: 'events', component: ModalEventsComponent },
      { path: 'forms', component: ModalFormsComponent },
      { path: 'styles', component: ModalStylesComponent },
    ]
  },
  {
    path: 'extended', component: ExtendedMainComponent, children: [
      { path: 'maps', component: MapsComponent },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MDBBootstrapModule.forRoot()
  ],
  declarations: [NavComponent,
    MainViewComponent,
    ],
  exports: [RouterModule, NavComponent, MainViewComponent],
  providers: [SharedService]
})
export class RoutesModule { }
