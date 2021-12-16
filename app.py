from flask import Flask, render_template, jsonify, request, make_response
import sys, json
from werkzeug.wrappers import response

app = Flask(__name__)

"""
Loading HTML pages.
"""


@app.route('/')
def index():  # put application's code here
    """
    loads the main page of the website
    :return: main page of website
    """
    return render_template('discover.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    login method for login page - loads login page and input from login form
    :return: login page
    """
    if_error = "Error: 404 Not Found"  # if something goes wrong,this will show

    if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
        username = request.form['username']  # requesting username & password using the .form from <form> in HTML
        password = request.form['password']

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    """
    loads the register page of the websire
    :return: register page
    """
    return render_template('register.html')


@app.route('/discover', methods=['GET', 'POST'])
def discover():
    """
    disover page/main page of website
    :return: discover/main page
    """
    return render_template('discover.html')


@app.route('/recipe', methods=['GET', 'POST'])
def recipe():
    """
    loads the recipe page of website
    :return: recipe page
    """
    return render_template('recipe.html')


@app.route('/recipeCreator', methods=['GET', 'POST'])
def recipeCreator():
    """
    loads the recipe creator page of website. Where a user can create recipes and 'POST' it to the JSON file.
    :return: recipe creator page
    """
    return render_template('recipeCreator.html')


"""
Functions for the recipes.json file below. 

See documentation for more info
"""


@app.route('/recipes', methods=['GET', 'PUT', 'DELETE'])
def recipes():
    """
    Uses 'GET', 'PUT', 'DELETE' for loading, writing and deleting recipes from and to JSON file.
    GET - loads entire recipes.json file to list
    PUT - append item to recipes.json
    DELETE - load recipes.json to list, create new list with all but specified object, save new list to recipes.json
    """
    if request.method == 'GET':
        response = get_recipes()
    elif request.method == 'PUT':
        response = add_recipe(request.get_json(force=True))
    elif request.method == 'DELETE':
        response = delete_recipe(int(request.args.get('recipeId')))
    return response


def get_recipes():
    """
    this function gets recipes from JSON to be sent to javascript file
    """
    with open("data/recipes.json", "r") as file:
        data = json.load(file)["recipes"]
        file.close()
    response = make_response(jsonify({"result": data}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response


def add_recipe(recipes):
    """
    this function replaces recipes in JSON file with the updated recipes from the JavaScript file
    """
    with open("data/recipes.json", "w") as file:
        json.dump(recipes, file, indent=4)
    response = make_response(jsonify({"result": "Saved"}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response


def delete_recipe(recipeId):
    """
    Find recipe in JSON using recipeId, create new list with all but specified recipe, overwrite file.
    :return updated json object
    """
    with open("data/recipes.json", "r") as file:
        objs = []  # New list.
        recipes = json.load(file).get("recipes")
        # Check for recipe by recipeId.
        for obj in recipes:
            # Add all recipes but the one specified by recipeId to the new list.
            if not (obj['recipeId'] == recipeId):
                objs.append(obj)
        file.close()
        data = {"recipes": objs}
    # Overwrite recipes.json with new list (includes all but the deleted recipe.)
    with open("data/recipes.json", "w") as file:
        json.dump(data, file, indent=4)
        file.close()
    response = make_response(jsonify({}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response


@app.route('/users', methods=['GET', 'PUT', 'DELETE'])
def users():
    """
    gets users from the users.json file
    :return: json object
    """
    if request.method == 'GET':
        # read data from users file.
        with open("data/users.json", "r") as file:
            data = json.load(file)["users"]
            file.close()
        # create response.
        response = make_response(jsonify({"result": data}), 200, )
        response.headers["Content-Type"] = "application/json"
    return response


if __name__ == '__main__':
    app.run(debug=True)
