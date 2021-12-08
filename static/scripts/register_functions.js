/** button listeners**/
document.getElementById("submit").addEventListener("click", register);


function register(){
    let url = "/register";
    let xhttp = new XMLHttpRequest();
    let response = "Error Registering";
    newUser = {
                username: document.getElementById("username"),
                email: document.getElementById("email"),
                password: document.getElementById("password"),
                }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //extracting json data object
            response = JSON.parse(xhttp.responseText);

        }
    }
    xhttp.open("POST", url, true);
    xhttp.send(newUser);
    alert("Successfully Register!")

}
