from flask import Flask, render_template, jsonify, request, make_response
import sys, json

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return render_template("website.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if_error = "Error: 404 Not Found"  # if something goes wrong,this will show

    if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
        username = request.form['username'] # requesting username and password using the request.form from <form> in HTML
        passowrd = request.form['password']

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('register.html')


@app.route('/recipes', methods=['GET', 'PUT', 'POST', 'DELETE'])
def recipes():
    """
    Functions for the recipes.json file.
    """
    with open("data/recipes.json", "r") as file:
        recipes = file.read()


@app.route('/search', methods=['GET'])
def search():
    """
    Search the recipes.json file based on user input.
    """
    searchRequest = str(request.args.get('searchRequest'))
    with open("data/recipes.json", "r") as file:
        searchResults = []
        recipes = json.load(file).get("recipes")
        for recipe in recipes:
            search_loop(searchRequest, searchResults, recipe)
        file.close()
    response = make_response(jsonify({"result", searchResults}))
    response.headers["Content-Type"] = "application/json"
    return response


# Nested loops for the searching algorithm. Allows for loop breaking to the outermost loop in the above function.
def search_loop(searchRequest, searchResults, recipe):
    if (searchRequest in recipe['title']):
        searchResults.append(recipe)
        return
    for key in recipe['ingredients']:
        if (searchRequest in key):
            searchResults.append(recipe)
            return
    for tag in recipe['categories']:
        if (searchRequest in tag):
            searchResults.append(recipe)
            return


if __name__ == '__main__':
    app.run(debug=True)
