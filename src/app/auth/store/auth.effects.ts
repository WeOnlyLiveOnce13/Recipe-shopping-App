import { Actions, ofType , createEffect} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';


// How response is shaped
export interface AuthResponseData {
    kind: string;
    idToken: string;	
    email: string;	
    refreshToken: string;	
    expiresIn: string;	
    localId: string;
    registered? : boolean       
}

// Authentication helper function
const handleAth = 
(
    email: string,
    userId: string,
    token: string,
    expiresIn: number

) => {
    const expirationDate = new Date(
        new Date().getTime() + expiresIn * 1000
    );  
    const user = new User(
        email,
        userId,
        token,
        expirationDate 
    );
    localStorage.setItem('userData', JSON.stringify(user));

    // Returning an action object --> Login()
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    })
}

// Error handler helper function
const handleError = 
(
    errorResponse: any
) => {
    // Create an error message
    let errorMessage = 'An error occurred. Please try again later.'
    console.log('Error Response:', errorResponse)

    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    console.log('Error Message:', errorResponse.error.error.message);

    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'Error. Please use a new email or sign-in.';
        break;

        case 'EMAIL_NOT_FOUND':
            errorMessage = 'Error. Please use an existing new email or sign-up.';
        break;

        case 'INVALID_PASSWORD':
            errorMessage = 'Error. Please use a valid password.';
        break;
        
        case 'INVALID_LOGIN_CREDENTIALS':
            errorMessage = 'Error. Please check your credentials.';
        break;

        case 'USER_DISABLED':
            errorMessage = 'Error. Please use a valid email.';
        break;

        default:
            console.error('Unhandled Error:', errorResponse.error.error.message); // Log unhandled errors
        break;
        

    }
    
    // Return the LoginFail action with the error message
    return of(new AuthActions.AuthenticateFail(errorMessage));
}


// Enabling injections into the class
@Injectable()
export class AuthEffects {

    // CAUSED AN INJECTION BUG, weirdly enough
    // constructor(
    //     private actions$: Actions,
    //     private http: HttpClient,
    //     private currentRoute: Router
    // ){};

    private action$ = inject(Actions);
    private http = inject(HttpClient);
    private currentRoute = inject(Router);
    private authService = inject(AuthService);

    authLogin$ = createEffect(() => {
        return this.action$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http
                    .post<AuthResponseData>(
                        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
                            ${environment.firebase.apiKey}`,
                            {
                                email: authData.payload.email ,
                                password: authData.payload.password ,
                                returnSecureToken: true
                            }
                    )
                    .pipe(
                        
                        tap(responseData => {
                            this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
                        }),
                        map((responseData) => {
                            return handleAth(
                                responseData.email,
                                responseData.localId,
                                responseData.idToken,
                                +responseData.expiresIn
                            )                   
                        }),

                        catchError(errorResponse => {
                            return handleError(errorResponse)
                        })

                    )
            })
        )
    })

    
    // Redirect
    authRedirect$ = createEffect(() => {
        return this.action$.pipe(
            ofType(
                AuthActions.AUTHENTICATE_SUCCESS
            ),
            tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
                // Redirect to current route if authentication is successful
                if (authSuccessAction.payload.redirect){
                    this.currentRoute.navigate(['./'])
                }
                
            })
        )
    },
    { dispatch: false }
    )


    // Logout action
    authLogout$ = createEffect(() => {
        return this.action$.pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.currentRoute.navigate(['/auth'])
            })
        )
    },
    { dispatch: false }
    )

    // Auto-Login action
    authAutoLogin$ = createEffect(() => {
        return this.action$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                // Parse data from LocalStore
                const userData: {
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
        
                } = JSON.parse(localStorage.getItem('userData'));
        
                // If no user in LocalStorage, return nothing
                if (!userData){
                    return {
                        type: 'Dummy'
                    }
                }
                
                // Create a user based on the parsed data
                const loadedUser = new User(
                    userData.email,
                    userData.id,
                    userData._token,
                    new Date(userData._tokenExpirationDate)
                );
        
                // token is a getter function
                // If token is valid, launch authenticate action
                if (loadedUser.token){

                    const expirationDate = 
                        new Date(userData._tokenExpirationDate).getTime() - 
                        new Date().getTime()

                    this.authService.setLogoutTimer(expirationDate)
                    return new AuthActions.AuthenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                        redirect: false
                    })
        
                    // milliseconds
                    
        
                    // this.autoLogout(expirationDate)
                }
                // if token invalid
                return {
                    type: 'Dummy'
                }
            })
        )
    })



    // Sign up actions
    authSignUp$ = createEffect(() => {
        return this.action$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((authData: AuthActions.Signup) =>{
                return this.http
                    .post<AuthResponseData>(
                        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
                        {
                            email: authData.payload.email,
                            password: authData.payload.password,
                            returnSecureToken: true
                        }
                    )
                    .pipe(
                        tap(responseData => {
                            this.authService.setLogoutTimer(+responseData.expiresIn * 1000)
                        }),
                        map((responseData) => {
                            return handleAth(
                                responseData.email,
                                responseData.localId,
                                responseData.idToken,
                                +responseData.expiresIn
                            )                        
                        }),

                        catchError(errorResponse => {
                            return handleError(errorResponse)
                        })
                    )
            })
        )
    })
}

