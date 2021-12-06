from flask import Flask, render_template, jsonify, request, make_response
import sys, json

from werkzeug.wrappers import response

app = Flask(__name__)

"""
HTML page loading things.
"""


@app.route('/')
def hello_world():  # put application's code here
    return render_template("index.html")


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


"""
Individual functions.
"""


@app.route('/recipes', methods=['GET', 'PUT', 'DELETE'])
def recipes():
    """
    Functions for the recipes.json file.
    """
    if request.method == 'GET':  # GET - loads entire recipes.json file to list
        with open("data/recipes.json", "r") as file:
            data = json.load(file)["recipes"]
            file.close()
        response = make_response(jsonify({"result": data}), 200, )
        response.headers["Content-Type"] = "application/json"
    elif request.method == 'PUT':  # PUT - append item to recipes.json
        data = request.get_json(force=True)
        with open("data/recipes.json", "w") as file:
            json.dump(data, file, indent=4)
            file.close()
        response = make_response(jsonify({"result": "Saved"}), 200, )
        response.headers["Content-Type"] = "application/json"
    elif request.method == 'DELETE':  # DELETE - load recipes.json to list, create new list with all but specified object, save new list to recipes.json
        recipeId = int(request.args.get('recipeId'))
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


if __name__ == '__main__':
    app.run(debug=True)
