/**
 * LoadContent()
 * Either loads a recipe specified in the URL parameters, or will load all user recipes if a parameter is not passed.
 */
function LoadContent()
{
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('id'))
    {
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

    var recipesData;
    var recipes;
    var recipe;
  /** SHOULD WE NAME THIS FUNCTION?**/
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
                    document.getElementById("titleInput").value = String(recipes[i].title);
    
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


function DeleteTableRow(btn)
{
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


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


function SaveRecipe()
{
    let recipeId = -1;
    //let userId = GetUserIdFromCookie();
    let userId = 0; // Ignore login system for now. Assume the userId is 0.
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
            if (urlParams.has('id'))
            {
                for (let i = 0; i < recipes.length; i++)
                {
                    if (recipes[i].recipeId == parseInt(urlParams.get('id')))
                    {
                        console.log("editing recipe");
                        recipes[i].title = title;
                        recipes[i].ingredients = ingredients;
                        recipes[i].method = method;
                        recipes[i].categories = categories;

                        break;
                    }
                }
            }

            if (!(urlParams.has('id')) || !recipeFound)
            {
                for (let i = 0; i < recipes.length; i++)
                {
                    if (recipes[i].recipeId > recipeId)
                    {
                        recipeId = recipes[i].recipeId;
                    }
                    recipeId++;
                }

                let newRecipe = {
                    "recipeId": recipeId,
                    "userId": userId,
                    "title": title,
                    "ingredients": ingredients,
                    "method": method,
                    "categories": categories
                };
                recipes.push(newRecipe);
            }



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

/**
 * CheckCookies()
 * Checks the cookies to see if a user is logged in.
 */
/*function CheckCookies()
{
    let userId = GetUserIdFromCookie();
    if (userId != "")
    {
        let loginButton = document.getElementById("loginButton");
        let registerButton = document.getElementById("registerButton");
        if (loginButton)
        {
            loginButton.innerHTML = "Log out";
            loginButton.removeAttribute("href");
            loginButton.setAttribute("onclick", "DeleteCookies()");
        }

        if (registerButton)
        {
            registerButton.style.display = "none";
        }
    }
    else
    {
        alert("You must be logged in to view this page!");
    }
}*/


/**
 * GetUserIdFromCookie()
 * Gets the currently logged in user's userId.
 * @returns userId stored in cookie OR empty string if not found.
 */
/*function GetUserIdFromCookie()
{
    let name = "userId=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieParams = decodedCookie.split(';')
    for (let i = 0; i < cookieParams.length; i++)
    {
        let c = cookieParams[i];
        while (c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}*/

/**
 * DeleteCookies()
 * Deletes the cookies.
 */
/*function DeleteCookies()
{
    document.cookie = "userId=;";
    CheckCookies();
}*/


//-----------------------------------------



//CheckCookies();
LoadContent();
