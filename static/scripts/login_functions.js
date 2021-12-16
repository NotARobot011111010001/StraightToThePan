/**
 * login_function.js
 * This file contains the functions for the login system.
 * 
 * While this is all functional, it is not used by the website as the demo version assumes the user is already logged in for simplicity's sake.
 * This has been left in to show that is has been worked on.
 */


/**
 * Login()
 * Allows the user to log in to the website with an email and password.
 */
function Login()
{
    // Get login details from form.
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let url = "/users";
    let response = "Error while retrieving.";
    let xhttp = new XMLHttpRequest();
   
    xhttp.onreadystatechange = function() 
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            response = JSON.parse(xhttp.responseText);
            let users = response.result;

            for (let i = 0; i < users.length; i++)
            {
                // Compare inputted values to stored credentials
                if (users[i].email == email)
                {
                    if (users[i].password == password)
                    {
                        CreateCookie(users[i].userId);
                        window.location.href="/";
                        break;
                    }
                }
            }
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}


//-----------------------------------------
// LOGIN COOKIE FUNCTIONS
//-----------------------------------------


/**
 * CreateCookie()
 * Assigns the logged in users id to a cookie to enable user website functionality.
 */
function CreateCookie(userId)
{
    document.cookie = "userId=" + userId + "; path=/; SameSite=Strict";
}


/**
 * GetUserIdFromCookie()
 * Gets the currently logged in user's userId.
 * @returns userId stored in cookie OR empty string if not found.
 */
function GetUserIdFromCookie()
{
    let name = "userId=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieParams = decodedCookie.split(';')

    for (let i = 0; i < cookieParams.length; i++)
    {
        // Split the cookie string to get the userId substring.
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
}

/**
 * DeleteCookies()
 * Deletes the cookies.
 */
function DeleteCookies()
{
    document.cookie = "userId=;";
    CheckCookies();
}
