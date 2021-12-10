/**
 * LoadContent()
 * Either loads a recipe specified in the URL parameters, or will load all user recipes if a parameter is not passed.
 */
function LoadContent()
{
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id'))
    {
        document.getElementById("recipeCard").style.display = 'block';
        document.getElementById("allRecipes").style.display = 'none';
        PopulateRecipe(parseInt(urlParams.get('id')));
    }
    else
    {
        document.getElementById("recipeCard").style.display = 'none';
        document.getElementById("allRecipes").style.display = 'block';
        GetRecipes();
    }
}


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

    var recipesData;
    var recipes;
    var recipe;
    
  /**SHOULD WE NAME THIS FUNCTION?**/
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
                    document.getElementById("recipeCreator").innerHTML = "by " + String(recipes[i].userId);
                    
                    //this formats the ingredients into a table
                    var tableData = "";
                    for (let j = 0; j < recipes[i].ingredients.length; j++)
                    {
                        tableData += "<tr><td>" + String(recipes[i].ingredients[j].name) + "</td><td>" + String(recipes[i].ingredients[j].amount) + "</td></tr>";
                    }
                    document.getElementById("recipeIngredients").innerHTML = "<tr><th>Ingredient</th><th>Amount</th></tr>" + tableData;
                    
                    //this formats the method steps into a a list
                    var methodList = "";
                    for (let j = 0; j < recipes[i].method.length; j++)
                    {
                        methodList += "<li>" + String(recipes[i].method[j]) + "</li>";
                    }
                    document.getElementById("recipeMethod").innerHTML = methodList;
                    
                    //this formats the catagories into a list 
                    var categories = "";
                    for (let j = 0; j < recipes[i].categories.length; j++)
                    {
                        categories += "<li>" + String(recipes[i].categories[j]) + "</li>";
                    }
                    document.getElementById("recipeCategories").innerHTML = categories;

                    break;
                }
            }
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}


//-----------------------------------------


/**
 * GetRecipes()
 * This function retrives all recipes from json file and places it in the recipes section
 */
 function GetRecipes() 
 {
    let recipeUrl = "/recipes";
    let response = "error while retriving";
    let recipesData = "";
    let allRecipes = "";
    let xhttp = new XMLHttpRequest();
     
     /**SHOULD WE NAME THIS FUNCTION?**/
    xhttp.onreadystatechange = function () 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            //extracting json data object
            response = JSON.parse(xhttp.responseText);
            recipesData = response.result;
            allRecipes = FormatJson(recipesData);
            document.getElementById("allRecipes").innerHTML = allRecipes;
        }
    }
    xhttp.open("GET", recipeUrl, true);
    xhttp.send();
}


/**
 * FormatJSON()
 * this function re-formats the json object
 * @param recipesData- the data from all recipes in the json file
 * @returns {reformatted data to suit html layout}
 * to be used in getRecipes method
 */
 function FormatJson(recipesData) 
 {
    let methodData = "";
    let ingredientsData = "";
    let allRecipes = "";

    for (let i = 0; i < recipesData.length; i++) 
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
                '<button type="button" id="editRecipe" onclick="EditRecipe()">Edit Recipe</button>' +
                '<button type="button" id="deleteRecipe" onclick="DeleteRecipe()">Delete Recipe</button>' +
            '</div>';
        ingredients = [];
        method = [];
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
 * to be used in formatJson method
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
 * to be used in formatJson method
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
 * this function displays the contents of a selected recipe
 * @param elementId
 */
function ToggleRecipeContent(recipeContent) 
{
    if (recipeContent.style.display == "block")
    {
        recipeContent.style.display = "none";
    }
    else
    {
        recipeContent.style.display = "block";
    }
}



LoadContent();
