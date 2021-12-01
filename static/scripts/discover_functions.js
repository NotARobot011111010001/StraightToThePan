/**
 * This file contains the functionality for the discover.html page.
 */


/**
  * GetRecipes()
  * Returns all recipes from the recipes.JSON file as an array of objects.
**/
function GetRecipes()
{
  let url = "/recipes";
  let response = "Error while retriving.";
  let xhttp = new XMLHttpRequest();
  var recipesData;
  var recipes;
  
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
  
  return recipes;
}

/**
  * PopulateDiscover()
  * Gets a specified number of recipes for the discover page/area
**/
function PopulateDiscover(count) // count is the number of recipes to get
{
  let recipeList = GetRecipes();
  var discoverList;
  
  for (let i = 0; i < count; i++)
  {
    let rng = Math.floor(Math.random() * (recipeList.length + 1));
    if (recipeList[rng])
    {
        discoverList.push(recipeList[rng]);
    }
  }
  
  var discoverField = document.GetElementByID("discover");
  var list;
  discoverField.innerHTML = "";
  for (recipe in discoverList)
  {
    list += '<li><a href="/recipe.html?id=' + String(recipe.recipeId) + '">' + String(recipe.title) + '</a></li>';
  }
  discoverField = list;
}
PopulateDiscover();
