/**
 * recipeCreator_functions.js
 * This file contains all functionality for the recipe creator.
 * This allows the user to create or edit (based on URL parameters) recipes on the website.
 */


/**
 * LoadContent()
 * Either loads a recipe specified in the URL parameters, or will load all user recipes if a parameter is not passed.
 */
function LoadContent()
{
    var urlParams = new URLSearchParams(window.location.search);
    // Check for id in url parameters
    if (urlParams.has('id'))
    {
        // Loads recipe based on passed id.
        PopulateRecipe(parseInt(urlParams.get('id')));
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

    var recipes;

    // Get recipes from server (recipes.json file)
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            response = JSON.parse(xhttp.responseText);
            recipes = response.result;

            // Find recipe
            for (let i = 0; i < recipes.length; i++)
            {
                if (parseInt(recipes[i].recipeId) == recipeId)
                {
                    // Populate title field from recipe object
                    document.getElementById("titleInput").value = String(recipes[i].title);
    
                    // populate ingredients table from recipe object
                    var ingredientsTable = "";
                    for (let j = 0; j < recipes[i].ingredients.length; j++)
                    {
                        ingredientsTable += 
                        '<tr>' + 
                            '<td contenteditable="true">' + String(recipes[i].ingredients[j].name) + '</td>' +
                            '<td contenteditable="true">' + String(recipes[i].ingredients[j].amount) + '</td>' +
                            '<td>' +
                                '<button type="button" onclick=DeleteTableRow(this)>Delete Ingredient</button>' +
                            '</td>'  
                        '</tr>';
                    }
                    document.getElementById("ingredientInput").innerHTML = '<tr><th>Ingredient</th><th>Amount</th><th><button type="button" onclick="AddIngredientRow()">Add Ingredient</button><th></tr>' + ingredientsTable;
                   
                    // populate method from recipe object
                    var methodTable = "";
                    for (let j = 0; j < recipes[i].method.length; j++)
                    {
                        methodTable += 
                        '<tr>' + 
                            '<td contenteditable="true">' + String(recipes[i].method[j]) + '</td>' +
                            '<td>' +
                                '<button type="button" onclick=DeleteTableRow(this)>Delete Step</button>' +
                            '</td>'  
                        '</tr>';
                    }
                    document.getElementById("methodInput").innerHTML = '<tr><th>Step</th><th><button type="button" onclick="AddMethodRow()">Add Step</button><th></tr>' + methodTable;
                    
                    // populate catagories from recipe object
                    var categoryTable = "";
                    for (let j = 0; j < recipes[i].categories.length; j++)
                    {
                        categoryTable += 
                        '<tr>' + 
                            '<td contenteditable="true">' + String(recipes[i].categories[j]) + '</td>' +
                            '<td>' +
                                '<button type="button" onclick=DeleteTableRow(this)>Delete Tag</button>' +
                            '</td>'  
                        '</tr>';
                    }
                    document.getElementById("categoryInput").innerHTML = '<tr><th>Step</th><th><button type="button" onclick="AddCategoryRow()">Add Tag</button><th></tr>' + categoryTable;

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
 * DeleteTableRow()
 * This function lets the user delete rows from any of the tables (based on the button that activates the function.)
 * @param {the specific delete button that was clicked} btn 
 */
function DeleteTableRow(btn)
{
    // Get ingredient row from the button.
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


/**
 * AddIngredientRow()
 * Adds a row to the ingredients table
 */
function AddIngredientRow()
{
    document.getElementById("ingredientInput").innerHTML +=
    '<tr>' + 
        '<td contenteditable="true">New Ingredient</td>' +
        '<td contenteditable="true">New Amount</td>' +
        '<td>' +
            '<button type="button" onclick=DeleteTableRow(this)>Delete Ingredient</button>' +
        '</td>'  
    '</tr>';
}


/**
 * AddMethodRow()
 * Adds a row to the method table.
 */
function AddMethodRow()
{
    document.getElementById("methodInput").innerHTML +=
    '<tr>' + 
        '<td contenteditable="true">New Step</td>' +
        '<td>' +
            '<button type="button" onclick=DeleteTableRow(this)>Delete Step</button>' +
        '</td>'  
    '</tr>';
}

/**
 * AddCategoryRow()
 * Adds a row to the categories table.
 */
function AddCategoryRow()
{
    document.getElementById("categoryInput").innerHTML +=
    '<tr>' + 
        '<td contenteditable="true">New Tag</td>' +
        '<td>' +
            '<button type="button" onclick=DeleteTableRow(this)>Delete Tag</button>' +
        '</td>'  
    '</tr>';
}


/**
 * IngredientsTableToJSON()
 * This function gets all relevant data on the ingredients table and converts it to a json object.
 * @returns {a dictionary of data from the table} 
 * to be used in SaveRecipe()
 */ 
function IngredientsTableToJSON()
{
    var ingredients = [];
    let table = document.getElementById("ingredientInput");

    for (let i = 1; i < table.rows.length; i++)
    {
        let row = table.rows[i];
        let ingredient = {
            "name": String(row.cells[0].textContent),
            "amount": String(row.cells[1].textContent)
        };
        ingredients.push(ingredient);
    }
    return ingredients;
}


/**
 * MethodTableToJSON()
 * This function gets all data from the method table and converts it to a list.
 * @returns {a list of all steps from the table}
 * to be used in SaveRecipe()
 */ 
function MethodTableToJSON()
{
    var method = [];
    let table = document.getElementById("methodInput");

    for (let i = 1; i < table.rows.length; i++)
    {
        let row = table.rows[i];
        method.push(String(row.cells[0].textContent));
    }
    return method;
}


/**
 * CategoryTableToJSON()
 * This function gets all data from the categories table and converts it to a list.
 * @returns {a list of all categories from the table}
 * to be used in SaveRecipe()
 */ 
function CategoryTableToJSON()
{
    var categories = [];
    let table = document.getElementById("categoryInput");

    for (let i = 1; i < table.rows.length; i++)
    {
        let row = table.rows[i];
        categories.push(String(row.cells[0].textContent));
    }
    return categories;
}


/**
 * SaveRecipe()
 * This function will save the modified data from the HTML elements to the recipes.json file.
 * This is done by either creating a new recipe object (if not editing a recipe), or overwriting an existing recipe object (if editing a recipe).
 */
function SaveRecipe()
{
    // Get recipe data from HTML elements.
    let recipeId = -1; // Set to -1 to make sure it's lower than the lowest possible recipe value (0) by default.
    let userId = 0; // Assume userId is 0 for testing purposes.
    let title = document.getElementById("titleInput").value;
    let ingredients = IngredientsTableToJSON();
    let method = MethodTableToJSON();
    let categories = CategoryTableToJSON();

    let url = "/recipes";
    let response = "Error while retrieving.";
    let xhttp = new XMLHttpRequest();

    var recipes;
  
    // Gets the recipe list.
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            response = JSON.parse(xhttp.responseText);
            recipes = response.result;

            let recipeFound = false;

            var urlParams = new URLSearchParams(window.location.search);
            
            // Check for url parameters (used if editing a recipe.)
            if (urlParams.has('id'))
            {
                for (let i = 0; i < recipes.length; i++)
                {
                    if (recipes[i].recipeId == parseInt(urlParams.get('id')))
                    {
                        recipes[i].title = title;
                        recipes[i].ingredients = ingredients;
                        recipes[i].method = method;
                        recipes[i].categories = categories;

                        break;
                    }
                }
            }
            
            // If there are no url parameters or the recipe specified by them has not been found.
            if (!(urlParams.has('id')) || !recipeFound)
            {
                // Save as new recipe.
                // Generate new recipeId (largest number in file + 1)
                for (let i = 0; i < recipes.length; i++)
                {
                    if (recipes[i].recipeId > recipeId)
                    {
                        recipeId = recipes[i].recipeId;
                    }
                    recipeId++;
                }

                // Create new recipe object.
                let newRecipe = {
                    "recipeId": recipeId,
                    "userId": userId,
                    "title": title,
                    "ingredients": ingredients,
                    "method": method,
                    "categories": categories
                };
                // Add new object to list.
                recipes.push(newRecipe);
            }


            // Create a nested XMLHttpRequest to send the updated data to the table.
            let xhttp2 = new XMLHttpRequest();
            xhttp2.open("PUT", url, true);
            xhttp2.send(JSON.stringify({ "recipes": recipes }));
            alert("Successfully saved!");
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}


//-----------------------------------------
// LISTENERS / FUNCTION CALLS
//-----------------------------------------


LoadContent();
