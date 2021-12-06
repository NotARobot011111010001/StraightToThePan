

function PopulateRecipe()
{
    let url = "/recipes";
    let response = "Error while retrieving.";
    let xhttp = new XMLHttpRequest();

    var urlParams = new URLSearchParams(window.location.search);
    let recipeId = parseInt(urlParams.get('id'));

    var recipesData;
    var recipes;
    var recipe;
  
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
    
                    var tableData = "";
                    for (let j = 0; j < recipes[i].ingredients.length; j++)
                    {
                        tableData += "<tr><td>" + String(recipes[i].ingredients[j].name) + "</td><td>" + String(recipes[i].ingredients[j].amount) + "</td></tr>";
                    }
                    document.getElementById("recipeIngredients").innerHTML = "<tr><th>Ingredient</th><th>Amount</th></tr>" + tableData;

                    var methodList = "";
                    for (let j = 0; j < recipes[i].method.length; j++)
                    {
                        methodList += "<li>" + String(recipes[i].method[j]) + "</li>";
                    }
                    document.getElementById("recipeMethod").innerHTML = methodList;

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



PopulateRecipe();