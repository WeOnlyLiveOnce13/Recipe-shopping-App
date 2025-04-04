import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { exhaustMap, map, take } from "rxjs";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(
        //private authService: AuthService,
        private store: Store<fromApp.AppState>,
    ){}

    // Add user's token to any outgoing requests
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
        console.log('Interceptor running');

        return this.store.select('auth').pipe(
                    take(1), 
                    map(authState => {
                        return authState.user
                    }),
                    exhaustMap(user => {

                        if (!user){
                            console.log('No user found, request without authentication');
                            return next.handle(req);
                        }
                        

                        console.log('User token:', user.token);

                        const updatedReq = req.clone({
                            params: new HttpParams().set('auth', user.token)
                            // params: new HttpParams().set('auth', environment.firebase.apiKey)
                            
                        });
                        console.log('Outgoing HTTP request', updatedReq.urlWithParams);
                        
                        return next.handle(updatedReq);
                    })

        );
   
    }

}