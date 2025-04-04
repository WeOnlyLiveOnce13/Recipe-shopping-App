import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
//import { ShoppingListService } from './shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as shoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private ingredientChangeSubscription: Subscription;


  // Distributed/Provided from "AppModule"
  constructor(
    //private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ){}


  ngOnInit() {
    // Using the Store:
    // OR this.store.select('shoppingList).subscribe()
    this.ingredients = this.store.select('shoppingList')




    // When using the Service:
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientChangeSubscription =  this.shoppingListService.ingredientChanged
    //     .subscribe(
    //       (ingredients: Ingredient[]) => {
    //         this.ingredients = ingredients
    //       }
        
    //     )
  
  }

  ngOnDestroy() {
    //this.ingredientChangeSubscription.unsubscribe()
  }

  // When an ingredient is clicked:
  // Send the index of the selected ingredient to other component (shopping-Edit i.e)
  onIngredientClicked(index: number){
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new shoppingListActions.StartEdit(index))
  }

  
}
