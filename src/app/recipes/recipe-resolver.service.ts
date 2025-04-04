import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve,  RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions'
import { map, of, switchMap, take } from "rxjs";


@Injectable({providedIn: "root"})
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(
        private store : Store<fromApp.AppState>,
        private actions$: Actions
    ){}

    // Resolve automatically subscribe to know when data available
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
            return this.store.select('recipes').pipe(
                take(1),
                map(recipesState => {
                    // Filled array OR empty if recipes never fetched
                    return recipesState.recipes
                }),

                // Do not send a request if recipes exist,
                // just return it
                switchMap(recipes => {
                    if(recipes.length === 0){
                        // Do not return as fetchRecipes() doesn't yield an observable
                        this.store.dispatch(new RecipesActions.fetchRecipes());
                        return this.actions$.pipe(
                            //when "SetRecipes()" is triggered, I know recipes exist
                            // take 1 value from the sub then unsubscribe
                            ofType(RecipesActions.SET_RECIPES),
                            take(1)
                        );
                    } else {
                        return of(recipes)
                    }
                })
            )

        
    }
}