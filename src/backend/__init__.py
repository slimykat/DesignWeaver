import os
import requests
from flask import Flask, request, jsonify

# import firebase
from firebase_admin import credentials, initialize_app, storage, db
import firebase_admin


# Create a Flask app
def create_app(args, test_config=None):
    """
    Create and configure a Flask application.

    This function initializes a Flask application, sets up Firebase 
    Realtime Database and Storage using the provided credentials, 
    and configures the application with a secret key and optional 
    test configuration. It also ensures the instance folder exists 
    and defines routes for a simple hello world page and an image 
    download endpoint.

    :param args: A dictionary containing configuration parameters 
                 including paths and URLs for Firebase setup.
    :param test_config: Optional dictionary for test configuration.
    :return: Configured Flask application instance.
    """
    
    # setup firebase real time database and storage
    setup_db(
        args["FIREBASE_CERT_PATH"],
        args["FIREBASE_DB_URL"],
        args["FIREBASE_STORAGE_URL"],
    )

    # create and configure the app
    app = Flask("DesignWeaver-backend", instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="dev",
        # DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello

    @app.route("/")
    def hello_world():
        # url = request.args.get('url')
        # print(url)
        return "Hello, World!\n This is the backend server"

    @app.route("/downloadImage")
    def download_image():
        full_path = request.full_path
        if "?url=" not in full_path:
            return "please provide a url"
        full_url = full_path.split("?url=")[-1]  # Remove prefix

        file_name = full_url.split("?")[0].split("/")[-1]

        if ".png" not in file_name and ".jpg" not in file_name:
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


def setup_db(cert_file_path:str, database_url:str, storage_url:str):
    """
    Set up the Firebase database and storage.

    :param cert_file_path: path to the service account certificate
    :param database_url: URL of the Realtime Database
    :param storage_url: URL to the Storage bucket
    :return: None
    """
    if firebase_admin._apps:
        return
    cred_obj = credentials.Certificate(cert_file_path)

    initialize_app(
        cred_obj,
        {
            "databaseURL": database_url,
            "storageBucket": storage_url,
        },
    )


def download_from_url(image_url, name="test.png"):
    """
    Download a file from a URL and save it locally.

    Parameters
    ----------
    image_url : str
        The URL of the file to download
    name : str, optional
        The name of the file to save, by default "test.png"

    Returns
    -------
    None
    """
    img_data = requests.get(image_url).content
    with open(name, "wb") as handler:
        handler.write(img_data)


def upload_to_storage(fileName):
    # Put your local file path
    """
    Uploads a file to Google Cloud Storage and makes it publicly accessible.

    Parameters
    ----------
    fileName : str
        The name of the file to upload

    Returns
    -------
    str
        The public URL of the uploaded file
    """
    bucket = storage.bucket()
    file_exists = True
    i = 0
    while file_exists:
        blob = bucket.blob("image/" + (i * "*") + fileName)
        file_exists = blob.exists()
        i = i + 1
    blob.upload_from_filename(fileName)
    blob.make_public()
    return blob.public_url
