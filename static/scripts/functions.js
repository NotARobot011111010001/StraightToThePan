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
function PopulateDiscover(int count) // count is the number of recipes to get
{
  let recipeList = GetRecipes();
  var discoverList;
  
  for (int i = 0; i < count; i++)
  {
   int rng = Math.floor(Math.random() * (recipeList.length + 1));
   discoverList.push(recipeList[rng]);
  }
  
  var discoverField = document.GetElementByID("discover");
  for (var recipe in discoverList)
  {
   
  }
}
PopulateDiscover();
