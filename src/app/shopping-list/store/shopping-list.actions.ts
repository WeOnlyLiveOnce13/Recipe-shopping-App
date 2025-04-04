import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

// For safe typing
// Prefixing for uniqueness throughout the app
export const ADD_INGREDIENT = '[Shopping List] Add ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';
export const ADD_INGREDIENT_TO_SHOP = '[Recipes] Add Recipe ingredient to ShopList';



// Define the Action (an object, hence {} ) of "addIngredient()":
// - type of the action & payload: what should be added
// To be displached in "shopping-edit"
export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;

    // enable external use of payload as argument
    constructor(public payload: Ingredient){}

}

// Adding many ingredients
export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;
    constructor(public payload: Ingredient[]) {}
}

// Update ingredients
export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;
    constructor(
        public payload: Ingredient
        
    ) {}
}


// Delete ingredients
export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
    // constructor(
    //     public payload: number
    // ){}
} 

// Start editing shopping-list
export class StartEdit implements Action {
    readonly type = START_EDIT;
    constructor(public payload: number){}
}

// Stop editing shopping-list
export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}

export class addIngredientToShoppingList implements Action {
    readonly type = ADD_INGREDIENT_TO_SHOP;
    constructor(
        public payload: Ingredient[]
    ){}
}
// Types of Actions
export type ShoppingListActions = 
|   AddIngredient 
|   AddIngredients 
|   UpdateIngredient 
|   DeleteIngredient
|   StopEdit
|   StartEdit
|   addIngredientToShoppingList;