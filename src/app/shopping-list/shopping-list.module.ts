import { NgModule } from "@angular/core";

import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { RouterModule } from "@angular/router";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";
import { FormsModule,  } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";


@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],

    exports: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],

    imports: [
        FormsModule,
        SharedModule,
        RouterModule,
        ShoppingListRoutingModule,
        
        
     ]


})

export class ShoppingListModule { 

}