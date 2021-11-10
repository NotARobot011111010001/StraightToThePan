from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    print("This is an edit")
    print("This is from a different git branch!")
    return 'Goodbye World!'


if __name__ == '__main__':
    app.run()
