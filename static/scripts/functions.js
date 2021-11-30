//*
  * GetRecipes()
  * Gets all recipes from the recipes.JSON file as an object.
*//
function GetRecipes()
{
  let url = "/recipes";
  let response = "Error while retriving.";
  let recipesData = "";
  let recipes = "";
  let xhttp = new XMLHttpRequest();
  
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
}
GetRecipes();

/**
  * PopulateDiscover()
  * Gets a specified number of recipes for the discover
*//
function PopulateDiscover(int count) // count is number of recipes to get
{
  var recipeList = GetRecipes();
  var discoverList;
  
  for (int i = 0; i < count; i++)
  {
    int rng = Math.floor(Math.random() * (recipeList.length + 1));
    discoverList.push(recipeList[rng]);
  }
  
  
}
