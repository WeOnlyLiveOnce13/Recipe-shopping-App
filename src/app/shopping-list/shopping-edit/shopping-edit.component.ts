import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
//import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as shoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';



@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit , OnDestroy{
  @ViewChild('form') shopListForm: NgForm
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ){}

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {

      if (stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        // redundant: 
        // this.editedItemIndex = stateData.editedIngredientIndex
        this.shopListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });

      } else {
        this.editMode = false;
      }
    });
  }

  

  onAddItem(form: NgForm) {
    
    
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount)

    // If Editing --> Call "update" from Service
    // Else --> Call on "onIngredientAdded"
    if (this.editMode) {
      this.store.dispatch(
        new shoppingListActions.UpdateIngredient(
          //index: this.editedItemIndex, 
          newIngredient
        )
      );
    } else {
      this.store.dispatch(new shoppingListActions.AddIngredient(newIngredient))
    }
    
    this.editMode = false;
    this.shopListForm.reset()
  }

  // Clear form
  onClear(){
    this.shopListForm.reset();
    this.editMode = false;
    this.store.dispatch(new shoppingListActions.StopEdit())
  }


  // Delete item
  onDelete() {
    this.store.dispatch(
      new shoppingListActions.DeleteIngredient()
    );
    this.onClear()
  }

  // Unsuscribe
  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.store.dispatch(new shoppingListActions.StopEdit())
  }
}
