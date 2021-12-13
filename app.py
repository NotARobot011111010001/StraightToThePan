import re
from flask import Flask, render_template, jsonify, request, make_response
import sys, json

from werkzeug.wrappers import response

app = Flask(__name__)

"""
HTML page loading things.
"""


@app.route('/')
def index():  # put application's code here
    return render_template('index.html')


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

@app.route('/RecipeTemplate.html')
def recipeTemplate():
    return render_template('RecipeTemplate.html')


"""
Individual functions.
"""


@app.route('/recipes', methods=['GET', 'PUT', 'DELETE'])
def recipes():
    """
    Functions for the recipes.json file.
    """
    if request.method == 'GET':  # GET - loads entire recipes.json file to list
        response = get_recipes()
    elif request.method == 'PUT':  # PUT - append item to recipes.json
        response = add_recipe(request.get_json(force=True))
    elif request.method == 'DELETE':  # DELETE - load recipes.json to list, create new list with all but specified object, save new list to recipes.json
        response = delete_recipe(request.args.get('recipeId'))
    return response


def get_recipes():
    with open("data/recipes.json", "r") as file:
        data = json.load(file)["recipes"]
        file.close()
    response = make_response(jsonify({"result": data}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response


def add_recipe(recipes):
    with open("data/recipes.json", "w") as file:
        json.dump(recipes, file, indent=4)
    response = make_response(jsonify({"result": "Saved"}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response

#DO WE NEED THIS?
#def add_recipe(new_recipe):
    with open("data/recipes.json", "r+") as file:
        current_recipes = file.read()
    with open("data/recipes.json", "w") as file:
        """formatting new recipe to have correct quote"""
        new_recipe = str(new_recipe).replace("'", '"')
        """formatting old recipes to trim the last ']}' for correct syntax"""
        str_to_remove = len(current_recipes)-2
        current_recipes = current_recipes[0:str_to_remove]
        """joining new recipe to the end of old recipes with additional syntax added"""
        recipes_data = current_recipes + ", " + str(new_recipe) + "]}"
        recipes_data = json.loads(recipes_data)
        json.dump(recipes_data, file)
    response = make_response(jsonify({"result": "Saved"}), 200, )
    response.headers["Content-Type"] = "application/json"
    return response



def delete_recipe(recipeId):
    with open("data/recipes.json", "r") as file:
        objs = []
        recipes = json.load(file).get("recipes")
        for obj in recipes:
            if not (obj['recipeId'] == recipeId):
                objs.append(obj)
        file.close()
        data = {"recipes": objs}
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
