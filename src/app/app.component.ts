import { Component, OnInit } from '@angular/core';
import * as fromApp from '../app/store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  //    IF Using @If or *ngIf
  // Load <Recipe> by default
  // loadedFeature = 'recipe';

  // onNavigate(feature: string) {
  //   this.loadedFeature = feature;
  //}
  constructor(
    private store: Store<fromApp.AppState>,


  ){}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin())
  }
}
