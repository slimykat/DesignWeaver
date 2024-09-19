import requests
from flask import Flask, request, jsonify
from dotenv import dotenv_values

FIREBASE_CERT_PATH = dotenv_values(".env")["FIREBASE_CERT_PATH"] # requireing for Certificate

# Create a Flask app
def create_app(test_config=None):
    app = Flask(__name__.split('.')[0], instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        # DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    
    @app.route('/')
    def hello_world():
        # url = request.args.get('url')
        # print(url)
        return "Hello, World!\n This is the backend server"

    @app.route('/downloadImage')
    def download_image():
        full_path = request.full_path
        if ("?url=" not in full_path):
            return "please provide a url"
        full_url = full_path.split("?url=")[-1] # Remove prefix

        file_name = full_url.split("?")[0].split("/")[-1]

        if(".png" not in file_name and ".jpg" not in file_name):
            return file_name + ": this file don't seems like .jpg or .png"
        try:
            download_from_url(full_url, name=file_name)
            new_url = upload_to_storage(file_name)
            os.remove(file_name)
        except Exception as e:
            print(e)
            return full_url
        return jsonify({"url": new_url})

    return app


# import firebase
from firebase_admin import credentials, initialize_app, storage, db
import os

cred_obj = credentials.Certificate(FIREBASE_CERT_PATH)

# Init firebase with your credentials
Storage_path = "styleguide-c2cef.appspot.com"
databaseURL = dotenv_values(".env")["FIREBASE_DB_URL"] # requireing for Certificate


initialize_app(
    cred_obj,
    {
        "databaseURL": databaseURL,
        "storageBucket": Storage_path,
    },
)

def download_from_url(image_url, name="test.png"):
    img_data = requests.get(image_url).content
    with open(name, "wb") as handler:
        handler.write(img_data)


def upload_to_storage(fileName):
    # Put your local file path
    bucket = storage.bucket()
    fileExists = True
    i = 0
    while fileExists:
        blob = bucket.blob("image/" + (i*"*") + fileName)
        fileExists = blob.exists()
        i = i + 1
    blob.upload_from_filename(fileName)
    blob.make_public()
    return blob.public_url



