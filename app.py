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


@app.route('/recipes', methods=['GET', 'PUT', 'DELETE'])
def recipes():
    """
    Functions for the recipes.json file.
    """
    if (request.method == 'GET'): # GET - loads entire recipes.json file to list
        with open("data/recipes.json", "r") as file:
            data = json.load(file)
            file.close()
        response = make_response(jsonify({"result": data}),200,)
        response.headers["Content-Type"] = "application/json"
    elif request.method == 'PUT': # PUT - append item to recipes.json
        data = request.get_json(force=True)
        with open("data/recipes.json", "w") as file:
            json.dump(data, file, indent=4)
            file.close()
        response = make_response(jsonify({"result": "Saved"}),200,)
        response.headers["Content-Type"] = "application/json"
    else: # DELETE - load recipes.json to list, create new list with all but specified object, save new list to recipes.json
        recipeId = int(request.args.get('recipeId'))
        with open("data/recipes.json", "r") as file:
            objs = []
            recipes = json.load(file).get("recipes")
            for obj in recipes:
                if not (obj['recipeId'] == recipeId):
                    objs.append(obj)
            file.close
            data = {"recipes": objs}
        with open("data/recipes.json", "w") as file:
            json.dump(data, file, indent=4)
            file.close()
        response = make_response(jsonify({}),200,)
        response.headers["Content-Type"] = "application/json"
    return response


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


@app.route('/suggestions', methods=['GET'])
def suggestions():
    """
    Get recipes for the 'suggested' section on the homepage.
    """
    count = 4


if __name__ == '__main__':
    app.run(debug=True)
