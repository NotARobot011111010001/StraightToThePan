function GetRecipes()
{
  
}

//*
  * Recipe suggestions.
  * 
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
