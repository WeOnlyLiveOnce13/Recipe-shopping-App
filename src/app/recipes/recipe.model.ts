import { Ingredient } from "../shared/ingredient.model";

export class Recipe {
    public name: string;
    public description: string;
    public imgPath: string;
    public ingredients: Ingredient[];

    
    constructor(name: string, descr: string, imgPath: string, ingredients: Ingredient[]) {
        this.name = name,
        this.description = descr,
        this.imgPath = imgPath,
        this.ingredients = ingredients
    }

}