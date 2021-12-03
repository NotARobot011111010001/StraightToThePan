/* Button Listeners */



function PopulateRecipe()
{
    var urlParams = new URLSearchParams(window.location.search);
    let recipeId = int(urlParams.get('id'));
    let recipe = GetRecipe(recipeId);

    document.getElementById("recipeTitle").innerHTML = String(recipe.title);
    document.getElementById("recipeCreator").innerHTML = "by " + recipe.userId;
    
    let ingredients = formatJson(recipe.ingredients);
    var tableData;
    for (ingredient in ingredients)
    {
        tableData += "<tr><td>" + String(ingredient.name) + "</td><td>" + String(ingredient.amount) + "</td></tr>";
    }
    document.getElementById("recipeIngredients").innerHTML = "<tr><th>Ingredient</th><th>Amount</th></tr>" + tableData;

    var method;
    for (step in recipe.method)
    {
        method += "<li>" + String(step) + "</li>";
    }
    document.getElementById("recipeMethod").innerHTML = method;

    var categories;
    for (tag in recipe.categories)
    {
        method += "<li>" + String(tag) + "</li>";
    }
    document.getElementById("recipeCategories").innerHTML = categories;
}

function GetRecipe(id)
{
    let url = "/recipes";
    let response = "Error while retrieving.";
    let xhttp = new XMLHttpRequest();
    var recipesData;
    var recipes;
    var recipe;
  
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            //extracting json data object
            response = JSON.parse(xhttp.responseText);
            recipesData = JSON.parse(response.result).recipes;
            recipes = formatJson(recipesData);
            document.getElementById("allRecipes").innerHTML = recipes;

        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();

    for (item in recipes)
    {
        if (int(item.recipeId) == id)
        {
            recipe = item;
            break;
        }
    }

    return recipe;
}


/**this function re-formats the json object
 * @param recipesData- the data from all recipes in the json file
 * @returns {reformatted data to suit html layout}
 * to be used in getRecipes method
 */
function formatJson(recipesData) {
    let methodData = "";
    let ingredientsData = "";
    let counter = 0;
    let allRecipes = "";
    for (recipe of recipesData) {
        //extracting ingredients
        ingredientsData = recipe.ingredients;
        let ingredients = extractIngredients(ingredientsData)
        //extracting method
        methodData = recipe.method;
        let method = extractMethod(methodData)
        // situating recipe the rest of the data in a div for each recipe
        allRecipes = String(allRecipes) +
            '<div id="recipe' + recipesData.indexOf(recipe) + '">' +
            '<button id="recipeName" onclick="showContent(this.parentElement)">' + String(recipe.name) + '</button>' +
            '<table id="ingredientsList" width="100%" class="hidden">' +
            '<tr>' +
            '<th> Ingredient</th>' +
            '<th> Quantity</th>' +
            '</tr>' +
            ingredients +
            '</table>' +
            '<ol id= "recipeMethod" class="hidden">' +
            method +
            '</ol>' +
            '<div id="selectedRecipeButtons" class="hidden">' +
            '<button id="editRecipe">edit recipe</button>'+
            '<button id="deleteRecipe" onClick="deleteRecipe(this.parentElement.parentElement)">delete recipe </button>'+
            '</div>'+
            '</div>' +
            '</div>';
        counter = counter++
        ingredients = [];
        method = [];
    }
    return (allRecipes)
}

/** this method extracts individual ingredients and their quantity's,
 * and places the data inside a table
 *
 * @param ingredientsData
 * @returns {a list of ingredients formatted for html}
 * to be used in formatJson method
 */
function extractIngredients(ingredientsData) {
    let ingredientsList = "";
    for (let i = 0; i < ingredientsData.length; i++) {
        ingredientsList = ingredientsList +
            '<tr>' +
            '<td id="ingredient' + i + '">' + (ingredientsData[i])[0] + '</td>' +
            '<td id="quantity' + i + '">' + (ingredientsData[i])[1] + '</td>' +
            '</tr>';
    }
    return (ingredientsList)
}

/** this function formats the method
 * @param methodData
 * @returns {each step of a method in its own pararaph element}
 * to be used in formatJson method
 */
function extractMethod(methodData) {
    let methodList = "";
    for (let i = 0; i < methodData.length; i++) {
        methodList = methodList + '<li stepId="stepId' + i + '">' + methodData[i] + '</li>';
    }
    return (methodList)
}