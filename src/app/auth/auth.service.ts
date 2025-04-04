import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';


@Injectable({providedIn: 'root'})
export class AuthService {

    private tokenExpirationTimer: any;


    // Inject Services
    constructor(
        private store: Store<fromApp.AppState>,
    ){}


    // autoLogout when token expires after 1hr
    setLogoutTimer(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout())
        },
        expirationDuration 
        )
    }
    
    clearLogoutTimer(){
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }

    
}