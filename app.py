#IS "IMPORT RE" NEEDED?
import re
from flask import Flask, render_template, jsonify, request, make_response
import sys, json

from werkzeug.wrappers import response

app = Flask(__name__)


"""
Loading HTML pages.
"""


@app.route('/')
def index():  # put application's code here
    return render_template('discover.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if_error = "Error: 404 Not Found"  # if something goes wrong,this will show

    if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
        username = request.form['username']  # requesting username & password using the .form from <form> in HTML
        password = request.form['password']

    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('register.html')


@app.route('/discover', methods=['GET', 'POST'])
def discover():
    return render_template('discover.html')


@app.route('/recipe', methods=['GET', 'POST'])
def recipe():
    return render_template('recipe.html')

@app.route('/recipeCreator', methods=['GET', 'POST'])
def recipeCreator():
    return render_template('recipeCreator.html')


"""
Individual functions.
"""


"""
    Functions for the recipes.json file.
"""
@app.route('/recipes', methods=['GET', 'PUT', 'DELETE'])
def recipes():
    if request.method == 'GET':  # GET - loads entire recipes.json file to list
        response = get_recipes()
    elif request.method == 'PUT':  # PUT - append item to recipes.json
        response = add_recipe(request.get_json(force=True))
    elif request.method == 'DELETE':  # DELETE - load recipes.json to list, create new list with all but specified object, save new list to recipes.json
        response = delete_recipe(int(request.args.get('recipeId')))
    return response


"""
this function gets recipes from JSON to be sent to javascript file
"""
def get_recipes():
    with open("data/recipes.json", "r") as file:
        data = json.load(file)["recipes"]
        file.close()
    response = make_response(jsonify({"result": data}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response


"""
this function replaces recipes in JSON file with the updated recipes from the JavaScript file
"""
def add_recipe(recipes):
    with open("data/recipes.json", "w") as file:
        json.dump(recipes, file, indent=4)
    response = make_response(jsonify({"result": "Saved"}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response


"""
Find recipe in JSON using recipeId, create new list with all but specified recipe, overwrite file.
"""
def delete_recipe(recipeId):
    with open("data/recipes.json", "r") as file:
        objs = [] # New list.
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
    if request.method == 'GET':
        with open("data/users.json", "r") as file:
            data = json.load(file)["users"]
            file.close()
        response = make_response(jsonify({"result": data}), 200, )
        response.headers["Content-Type"] = "application/json"
    return response




if __name__ == '__main__':
    app.run(debug=True)
