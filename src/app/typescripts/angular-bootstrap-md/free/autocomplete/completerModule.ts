import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { CompleterCmp } from "./components/completerComponent";
import { CompleterListItemCmp } from "./components/completerListitemComponent";
import { CompleterService } from "./services/completerService";
import { LocalDataFactoryProvider, RemoteDataFactoryProvider } from "./services/dataFactoryService";
import { CtrCompleter } from "./directives/completerDirective";
import { CtrDropdown } from "./directives/dropdownDirective";
import { CtrInput } from "./directives/inputDirective";
import { CtrList } from "./directives/listcontextDirective";
import { CtrRow } from "./directives/rowDirective";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
        CompleterListItemCmp,
        CtrCompleter,
        CtrDropdown,
        CtrInput,
        CtrList,
        CtrRow,
        CompleterCmp
    ],
    exports: [
        CompleterCmp,
        CompleterListItemCmp,
        CtrCompleter,
        CtrDropdown,
        CtrInput,
        CtrList,
        CtrRow
    ],
    providers: [
        CompleterService,
        LocalDataFactoryProvider,
        RemoteDataFactoryProvider
    ]
})
export class Ng2CompleterModule { }