import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import * as ShoppingActions from '../../shopping-list/store/shopping-list.actions';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit{
  
  recipe: Recipe;
  id: number;

  constructor(
    private store: Store<fromApp.AppState>,
    private currentRoute: ActivatedRoute,
    private router: Router
  ){}


  ngOnInit() {
    this.currentRoute.params
      .pipe(
          map(params => {
            return +params['id']
          }),

          switchMap(id => {
            this.id = id
            return this.store.select('recipes')
          }),

          map(recipesState => {
            return recipesState.recipes.find((recipe, index) => {
              return index ===  this.id
            })
          })
      )
      .subscribe(recipe => {
        this.recipe = recipe
      })
  
  }

  // Access either the ShoppingListService OR 
  // RecipeService which will access ShoppingListService 
  onAddToShoppingList() {
    this.store.dispatch(new ShoppingActions.AddIngredients(this.recipe.ingredients))
  }


  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.currentRoute})
  }


  // Delete Recipe
  onDeleteRecipe(){
    this.store.dispatch(new RecipesActions.deleteRecipe(this.id))
    this.router.navigate(['/recipes'])
  }

}
