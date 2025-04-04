import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";


export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number,
}



const initialState: State = {
    ingredients: [
            new Ingredient('Apples', 5),
            new Ingredient('Organes', 12)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer (
    state: State = initialState, 
    action: ShoppingListActions.ShoppingListActions
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT :
            return  {
                // copy all state
                ...state,  

                // overwrite the ingredients property of the state         
                ingredients: [...state.ingredients, action.payload]       
            };
            
        case ShoppingListActions.ADD_INGREDIENTS :
        case ShoppingListActions.ADD_INGREDIENT_TO_SHOP:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            }    
        
        case ShoppingListActions.UPDATE_INGREDIENT:
            // Get ingredient based on the index
            const ingredient = state.ingredients[state.editedIngredientIndex]
            const updatedIngredient = {
                // Copy ingredient
                // Overwrite ingredient
                ...ingredient,
                ...action.payload
            };
            // Update ingredients array
            const updatedIngredients = [...state.ingredients]
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1,
                
            }    
        
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, index) => {
                    return index !== state.editedIngredientIndex
                }),
                editedIngredient: null,
                editedIngredientIndex: -1,
                 
            };
        
        case ShoppingListActions.START_EDIT: 
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] } 
            };

        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1,
            };


        default:
            return state;
    }
}