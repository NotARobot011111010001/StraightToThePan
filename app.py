from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    print("This is an edit")
    print("This is from a different git branch!")
    return render_template("website.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('register.html')


if __name__ == '__main__':
    app.run(debug=True)
