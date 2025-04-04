import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from '../store/recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {

    private action$ = inject(Actions);
    private http = inject(HttpClient);
    private store = inject(Store<fromApp.AppState>);


    fetchRecipes$ = createEffect(() => {
            return this.action$.pipe(
                ofType(RecipesActions.FETCH_RECIPES),
                switchMap( () => {
                    return this.http
                    .get<Recipe[]>(
                        'https://recipe-book-ng-953b1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
                    )
                }),
                map(recipes => {
                    return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                    });
                }),

                //automatic dispatch of the new action
                map(recipes => {
                    return new RecipesActions.setRecipes(recipes)
                })
            )
    })


    storeRecipes$ = createEffect(() => {
        return this.action$.pipe(
            ofType(RecipesActions.STORE_RECIPES),
            // get recipes data from NgRx Store
            withLatestFrom(
                this.store.select('recipes')
            ),
            switchMap(([actionData, recipesState]) => {
                return this.http.put(
                    'https://recipe-book-ng-953b1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
                    recipesState.recipes
                )
            })
        )
    },
    {dispatch: false}
    )

    
}