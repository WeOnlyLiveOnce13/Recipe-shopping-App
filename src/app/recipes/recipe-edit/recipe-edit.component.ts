import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit{

  id: number;
  editMode = false;
  recipeForm: FormGroup;
  editedRecipe = null;
  //rivate storeSubscription: Subscription;


  constructor(
    private currentRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private router: Router,
  ){}

  ngOnInit() {
    this.currentRoute.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          // If it has an id in the path --> Edit Mode (true)
          // If No "id" in path --> Create Mode (false)
          this.editMode = params['id'] != null;
          this.initForm()
        }
      )
  }

  // Submit the Recipe-Edit Form:
  // Extract values from the Form
  // Submit depending on the Mode (editMode OR not)
  onSubmit(){
    const newlyRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imgPath'],
      this.recipeForm.value['ingredients']
    );

    if (this.editMode){
      this.store.dispatch(new RecipesActions.updateRecipe({
        index: this.id, 
        newRecipe: newlyRecipe
      }))
  
    // Adding from "New Recipe button"
    } else {
      this.store.dispatch(new RecipesActions.addRecipe(newlyRecipe))
    }


    // Redirect after submitting
    this.onCancel()
  }



  // Adding Ingredients:
  // Add new controls to existing controls:
  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      // Add a group of input(name, amount)
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    )
  }

  // Cancel Edit-Recipe-Form;
  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.currentRoute})
  }

  // To be called Whenever Route-parent changes
  // Needs to be sync with .html
  private initForm() {
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDescription = '';
    let recipeIngredient = new FormArray([])

    if (this.editMode){
      this.store.select('recipes')
        .pipe(

            map(recipesState => {
                  return recipesState.recipes.find((recipe, index) => {
                    return index ===  this.id
                  })
            })
        )
        .subscribe(EditedRecipe => {

            recipeName = EditedRecipe.name
            recipeImgPath = EditedRecipe.imgPath
            recipeDescription = EditedRecipe.description

            // Check if Recipe has ingredients:
            if(EditedRecipe['ingredients']){
              for (let ingredient of EditedRecipe.ingredients){
                  recipeIngredient.push( 
                    new FormGroup({
                      'name': new FormControl(ingredient.name, Validators.required),
                      'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
                    })
                  )
              }
            }
        })


      
    }


    // Initialize form:
    this.recipeForm = new FormGroup({
      'name' : new FormControl(recipeName, Validators.required),
      'imgPath' : new FormControl(recipeImgPath, Validators.required),
      'description' : new FormControl(recipeDescription, Validators.required),
      'ingredients' : recipeIngredient
    });
  }

  get controls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }


  // Delete Ingredient
  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }


  // ngOnDestroy(){
  //   if (this.storeSubscription){
  //     this.storeSubscription.unsubscribe()
  //   }
  // }
  
}
