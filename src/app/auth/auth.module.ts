import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AuthComponent } from "./auth.component";
import { AuthService } from "./auth.service";
import { AuthEffects } from "./store/auth.effects";
import { authReducer } from "./store/auth.reducer";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule ({
    declarations: [
        AuthComponent,
    ],
    imports: [
        CommonModule,
        FormsModule, // template driven forms
        HttpClientModule,
        AuthRoutingModule,
        SharedModule,
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forFeature([AuthEffects]),
    ],
    exports: [
        AuthComponent,
    ],
    providers: [
        AuthService,
    ]
})
export class AuthModule { }