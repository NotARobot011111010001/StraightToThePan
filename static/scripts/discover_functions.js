/**
 * This file contains the functionality for the discover.html page.
*/


/**
* PopulateDiscover()
* Gets four random recipes and inserts them as links to the discover section on the discover page.
*/
function PopulateDiscover()
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
      recipes = response.result;
      console.log(response)
      console.log(recipes)

      let discoverList = "";

      for (let i = 0; i < 4; i++)
      {
        let rng = Math.floor(Math.random() * (recipes.length + 1));
        if (recipes[rng])
        {
          discoverList += '<li><a href="/recipe?id=' + String(recipes[rng].recipeId) + '">' + String(recipes[rng].title) + '</a></li>';
          recipes.splice(rng, 1);
        }
      }
      document.getElementById("discoverUl").innerHTML = discoverList;
    }
  }
  xhttp.open("GET", url, true);
  xhttp.send();
}


/**
 * Search()
 * Takes the user input in the search bar on the discover page and searches the recipes.json file for any objects that contain it in either the title, the ingredients list, or the category tags list.
 */
function Search()
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
      recipes = response.result;
      console.log(response)
      console.log(recipes)

      let searchRequest = document.getElementById("searchBar").value;
      let resultsList = ""

      if (searchRequest != "")
      {
        search_outer: for (let i = 0; i < recipes.length; i++)
        {
          // Check the title.
          if (recipes[i].title.includes(searchRequest))
          {
            resultsList += '<li><a href="/recipe?id=' + String(recipes[i].recipeId) + '">' + String(recipes[i].title) + '</a></li>';
            continue search_outer;
          }

          // Check the ingredients list.
          for (let j = 0; j < recipes[i].ingredients.length; j++)
          {
            if (recipes[i].ingredients[j].name.includes(searchRequest))
            {
              resultsList += '<li><a href="/recipe?id=' + String(recipes[i].recipeId) + '">' + String(recipes[i].title) + '</a></li>';
              continue search_outer;
            }
          }

          // Check the tags.
          for (let j = 0; j < recipes[i].categories.length; j++) // this is done with iterator loops instead of for-each style loops because js doesn't like assigning object properties to temporary variables i guess.
          {
            if (recipes[i].categories[j].includes(searchRequest))
            {
              resultsList += '<li><a href="/recipe?id=' + String(recipes[i].recipeId) + '">' + String(recipes[i].title) + '</a></li>';
              continue search_outer;
            }
          }
        }
        document.getElementById("results").innerHTML = resultsList;
      }
    }
  }
  xhttp.open("GET", url, true);
  xhttp.send();
}

function PopulateResults()
{
  //let results = GetRecipes();
  /*let results = Search();
  var resultsField = document.getElementById("results");

  resultsField.innerHTML = "";
  if (results)
  {
    for (recipe in results)
    {
      resultsField.innerHTML += '<li><a href="/recipe.html?id=' + String(recipe.recipeId) + '">' + String(recipe.title) + '</a></li>';
    }
  }*/
}


PopulateDiscover();