import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipe.actions";

export interface State {
    recipes: Recipe[],
};

const initialState: State = {
    recipes: [],
};


export function recipeReducer (
    state = initialState , 
    action: RecipesActions.recipeActions
) {

    switch(action.type){
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }

        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }

        case RecipesActions.UPDATE_RECIPE:
            const updatedRecipe = { 
                // create copy of current recipe
                ...state.recipes[action.payload.index],
                // Overwrite current recipe with newRecipe data
                ...action.payload.newRecipe
            
            };

            const updatedRecipes = [...state.recipes]
            updatedRecipes[action.payload.index] = updatedRecipe

            return {
                ...state,
                recipes: updatedRecipes
            }

        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload
                })    
            }

        default:
            return state;
    }
}