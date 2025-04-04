import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate,  Router,  RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable , take} from "rxjs";
import { AuthService } from "./auth.service";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root'})
export class AuthGuardService implements CanActivate {
    constructor(
        private authService: AuthService,
        private currentRoute: Router,
        private store: Store<fromApp.AppState>,
    ){}


    canActivate(
        currentRoute: ActivatedRouteSnapshot, 
        routeState: RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean | UrlTree>   {
        
        return this.store.select('auth').pipe(
            take(1),
            
            map( authState => {
                return authState.user
            }),

            map( user => {
            const isAuth = !!user;
            if (isAuth) {
                return true;
            }

            return this.currentRoute.createUrlTree(['/auth']);
        })
        // OR
        // tap(isAuth => {
        //    if (!isAuth) {
        //        this.currentRoute.navigate(['/auth']);
        //    }
        // })
    
    
        );
    }
}