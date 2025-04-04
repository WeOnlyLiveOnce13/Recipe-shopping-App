import { Component, OnDestroy, OnInit} from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit, OnDestroy{
  // Initialize Recipe as empty array
  recipes: Recipe[];
  subscription: Subscription;
  
  // Inject Recipe service
  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private currentRoute: ActivatedRoute
  ){}
  
  // Assign recipes from Service to initialized array
  ngOnInit() {
    // recipes state as result
    this.subscription = this.store.select('recipes')
      .pipe(map( recipesState => recipesState.recipes)
      )
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes
        }
      )
    //this.recipes = this.recipeService.getRecipes();
  }
  
  // Navigate to "/new" route
  onNewRecipe(){
    this.router.navigate(['new'], {
      relativeTo: this.currentRoute
    })
  }

  //End the subscription
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

}
