import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import {  Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { AlertComponent } from "../shared/alert/alert.component";




@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})

// Shouldn't see "/recipes" if not logged-in
export class AuthComponent implements OnInit, OnDestroy{
   
    isLoginMode = true;
    isLoading = false;
    private storeSubscription: Subscription;

    // Can customize further for more messages
    error: string = null;

    constructor(
        private store: Store<fromApp.AppState>,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ){}

    ngOnInit(){
        // Subscribe to the LoginFail action from Reducer
        this.storeSubscription = this.store.select('auth').subscribe(
            authState => {
                this.isLoading = authState.loading;
                this.error = authState.authError;
                //this.showErrorAlert(error)
            }
        )
    }
    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }


    onSubmit(form: NgForm){
        // Double safety
        if (!form.valid){
            return ;
        }
        const email = form.value.email;
        const password = form.value.password;


        if (this.isLoginMode) {

            this.store.dispatch(new AuthActions.LoginStart({
                email: email,
                password: password
            }))
            

        } else {
            // Sign UP Logic
            // 
            this.store.dispatch(new AuthActions.Signup({
                email: email,
                password: password
            }))
        }


        form.reset();
    }

    onHandleError(){
        this.store.dispatch(new AuthActions.ClearError())
        this.error = null;
    }

    
    ngOnDestroy(){
        if (this.storeSubscription){
            this.storeSubscription.unsubscribe()
        }

        // if (this.closeSubscription){
        //     this.closeSubscription.unsubscribe()
        // }
    }

    // private showErrorAlert(message: string){
    //     //const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    //     const componentRef = this.viewContainerRef.createComponent(AlertComponent);
    //     this.error = null;
    // }
}