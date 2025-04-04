import { Component, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent {
  // To retrieve data shape from outside components
  // To be used in template
  @Input() recipe: Recipe;

  @Input() index: number;



  

}
