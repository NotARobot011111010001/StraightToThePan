/**
 * recipe_functions.js
 * This file contains all functionality for the recipe page.
 * This page essentially just displays recipes.
 */


/**
 * LoadContent()
 * Either loads a recipe specified in the URL parameters, or will load all user recipes if a parameter is not passed.
 */
function LoadContent()
{
    var urlParams = new URLSearchParams(window.location.search);
    // Check if a recipe id had been passed through the URL parameters.
    if (urlParams.has('id'))
    {
        // Sets up the page to only display a single recipe card.
        document.getElementById("recipeCard").style.display = 'block';
        document.getElementById("allRecipes").remove();
        document.getElementById("newRecipe").remove();
        PopulateRecipe(parseInt(urlParams.get('id')));
    }
    else
    {
        // Sets up the page to display all user recipes + the add recipe button.
        document.getElementById("recipeCard").remove();
        document.getElementById("allRecipes").style.display = 'block';
        document.getElementById("newRecipe").style.display = 'block';
        GetRecipes();
    }
}


//-----------------------------------------
// SINGLE RECIPE FUNCTIONS
//-----------------------------------------


/**
 * PopulateRecipe()
 * Gets the details for the recipe specified in the URL parameters and displays it on the page.
 * Only runs if recipe page is loaded with a URL parameter (id).
 */
function PopulateRecipe(recipeId)
{
    let url = "/recipes";
    let response = "Error while retrieving.";
    let xhttp = new XMLHttpRequest();

    var recipes;
    
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            response = JSON.parse(xhttp.responseText);
            recipes = response.result;

            for (let i = 0; i < recipes.length; i++)
            {
                if (parseInt(recipes[i].recipeId) == recipeId)
                {
                    document.getElementById("recipeTitle").innerHTML = String(recipes[i].title);
                    
                    //this formats the ingredients into a table
                    let ingredientsTable = ExtractIngredients(recipes[i].ingredients);
                    document.getElementById("recipeIngredients").innerHTML = "<tr><th>Ingredient</th><th>Amount</th></tr>" + ingredientsTable;
                    
                    //this formats the method steps into a list
                    let methodList = ExtractMethod(recipes[i].method);
                    document.getElementById("recipeMethod").innerHTML = methodList;
                    
                    //this formats the categories into a list
                    let categories = ExtractCategories(recipes[i].categories);
                    document.getElementById("recipeCategories").innerHTML = categories;

                    // Check if current user is creator
                    if (recipes[i].userId == 0)
                    {
                        // Add recipeId to button functionality.
                        document.getElementById("editButton").href = "/recipeCreator?id=" + String(recipes[i].recipeId);
                        document.getElementById("deleteButton").setAttribute('onclick', "DeleteRecipe(" + String(recipes[i].recipeId) + ")");
                    }
                    else
                    {
                        // Remove edit / delete buttons if not creator.
                        document.getElementById("editButton").remove();
                        document.getElementById("deleteButton").remove();
                    }
                    

                    break;
                }
            }
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}


//-----------------------------------------
// ALL RECIPES FUNCTIONS
//-----------------------------------------


/**
 * GetRecipes()
 * This function retrives all recipes from json file and places it in the allRecipes section on the recipe page.
 * Only runs when no recipeId is provided in the URL parameters.
 */
 function GetRecipes() 
 {
    let recipeUrl = "/recipes";
    let response = "error while retriving";
    let recipesData = "";
    let allRecipes = "";

    let xhttp = new XMLHttpRequest();
    

    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            //extracting json data object
            response = JSON.parse(xhttp.responseText);
            recipesData = response.result;
            allRecipes = FormatJsonToHtml(recipesData);
            document.getElementById("allRecipes").innerHTML = allRecipes;
        }
    }
    xhttp.open("GET", recipeUrl, true);
    xhttp.send();
}


/**
 * FormatJsonToHtml()
 * this function re-formats the json object
 * @param recipesData- the data from all recipes in the json file
 * @returns {reformatted data to suit html layout}
 * to be used in getRecipes method
 */
 function FormatJsonToHtml(recipesData) 
 {
    let methodData = "";
    let ingredientsData = "";
    let allRecipes = "";

    let userId = 0;

    for (let i = 0; i < recipesData.length; i++) 
    {
        if (recipesData[i].userId == userId)
        {
            //extracting ingredients
            ingredientsData = recipesData[i].ingredients;
            let ingredients = ExtractIngredients(ingredientsData)
            //extracting method
            methodData = recipesData[i].method;
            let method = ExtractMethod(methodData)
            //extracting categories
            categoryData = recipesData[i].categories;
            let categories = ExtractCategories(categoryData);
            // situating recipe the rest of the data in a div for each recipe
            allRecipes += 
            '<button type="button" class="collapsible" onclick="ToggleRecipeContent(recipe' + String(recipesData[i].recipeId) + ')">' + String(recipesData[i].title) + '</button>' +
            '<div class="recipeContent" id="recipe' + String(recipesData[i].recipeId) + '">' +
                '<table id="recipeIngredients">' +
                    '<tr>' +
                        '<th>Ingredient</th>' +
                        '<th>Amount</th>' +
                    '</tr>' +
                    ingredients +
                '</table>' +
                '<ol id="recipeMethod" type="1">' + 
                    method +
                '</ol>' +
                '<ul id="recipeCategories">' +
                    categories +
                '</ul>' +
                '<div class="recipeBtns">' +
                    '<a href="/recipeCreator?id=' + String(recipesData[i].recipeId) + '" class="editButton">Edit Recipe</a>' +
                    '<button type="button" class="deleteButton" onclick="DeleteRecipe(' + String(recipesData[i].recipeId) + ')">Delete Recipe</button>' +
                '</div>' +
            '</div>';
            ingredients = [];
            method = [];
        }
    }
    return (allRecipes)
}


/** 
 * ExtractIngredients()
 * this method extracts individual ingredients and their quantity's,
 * and places the data inside a table
 *
 * @param ingredientsData
 * @returns {a list of ingredients formatted for html}
 * to be used in formatJsonToHtml method
 */
function ExtractIngredients(ingredientsData) 
{
    let ingredientsList = "";
    for (let i = 0; i < ingredientsData.length; i++) 
    {
        ingredientsList +=
            '<tr>' +
            '<td id="ingredient' + i + '">' + ingredientsData[i].name + '</td>' +
            '<td id="quantity' + i + '">' + ingredientsData[i].amount + '</td>' +
            '</tr>';
    }
    return (ingredientsList)
}


/** 
 * ExtractMethod()
 * this function formats the method
 * @param methodData
 * @returns {each step of a method in its own pararaph element}
 * to be used in formatJsonToHtml method
 */
function ExtractMethod(methodData) 
{
    let methodList = "";
    for (let i = 0; i < methodData.length; i++) 
    {
        methodList += '<li id="step' + String(i) + '">' + methodData[i] + '</li>';
    }
    return (methodList)
} 

/**
 * ExtractCategories()
 * This function extracts the categories from the recipe object, and formats them into html elements.
 * @param categoryData 
 * @returns {a list of categories formatted for html}
 * to be used in formatJsonToHtml method
 */
function ExtractCategories(categoryData)
{
    let categoryList = "";
    for (let i = 0; i < categoryData.length; i++)
    {
        categoryList += '<li id="tag' + String(i) + '">' + categoryData[i] + '</li>';
    }
    return (categoryList);
}


/**
 * ToggleRecipeContent()
 * this function displays the contents of a selected recipe.
 * this is done using collapsible divs on the html page.
 * @param elementId
 */
function ToggleRecipeContent(recipeContent) 
{
    if (recipeContent.style.display != "none")
    {
        recipeContent.style.display = "none";
    }
    else
    {
        recipeContent.style.display = "block";
    }
}

/**
 * DeleteRecipe()
 * This function will delete a recipe from the recipes.json file based on the passed recipeId.
 * @param recipeId 
 */
function DeleteRecipe(recipeId)
{
    let recipeUrl = "/recipes?recipeId=" + recipeId; // Create the url with recipeID in the parameters.

    // Send the recipeID to delete.
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", recipeUrl, true);
    xhttp.send();
    alert("Recipe " + recipeId + " successfully deleted!");
    
    location.reload(); // Refresh the page.
}


//-----------------------------------------
// LISTENERS / FUNCTION CALLS
//-----------------------------------------


LoadContent();
