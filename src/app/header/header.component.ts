import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  private userSubscription : Subscription;
  isUserAuthenticated = false;


  collapsed = true;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.collapsed = true;
  }

  constructor(
    private store: Store<fromApp.AppState>
  ){}

  ngOnInit(){
    this.userSubscription = this.store
      .select('auth')
      .pipe(
        map(authState => {
          return authState.user
        })
      )
      .subscribe(
        // If we have an authenticated user, set true, else false
        user => {
          this.isUserAuthenticated = !user ? false : true // OR !!user
        }
      )

      
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.storeRecipes())
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.fetchRecipes())
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout())
  }


  ngOnDestroy() { 
    this.userSubscription.unsubscribe()
  }
  
}