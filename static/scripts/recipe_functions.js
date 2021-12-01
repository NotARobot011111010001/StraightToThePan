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
    let response = "Error while retriving.";
    let xhttp = new XMLHttpRequest();
    var recipesData;
    var recipes;
    var recipe
  
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            response = JSON.parse(xhttp.responseText);
            recipesData = JSON.parse(response.result).recipes;
            recipes = formatJson(recipesData);
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