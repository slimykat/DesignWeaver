import requests
# import firebase
from firebase_admin import credentials, initialize_app, storage, db
import os

cred_obj = credentials.Certificate(
    "../../key/storage_private_key.json"
)

# Init firebase with your credentials
Storage_path = "styleguide-c2cef.appspot.com"
databaseURL = "https://styleguide-c2cef-default-rtdb.firebaseio.com"
initialize_app(cred_obj, {
	'databaseURL':databaseURL,
    'storageBucket':Storage_path,
	})
openAI_url_prefix = "https://oaidalleapiprodscus.blob.core.windows.net/"


def download_from_url(image_url, name="test.png"):
    img_data = requests.get(image_url).content
    with open(name, 'wb') as handler:
        handler.write(img_data)


def upload_to_storage(fileName):
    # Put your local file path 
    bucket = storage.bucket()
    blob = bucket.blob("image/"+fileName)
    blob.upload_from_filename(fileName)
    blob.make_public()
    return blob.public_url


def update():
    ref = db.reference("/Image_pool")
    Image_list = ref.get()
    
    for key, value in Image_list.items():
        if(openAI_url_prefix in value["url"]):
            name = key+".png"
            download_from_url(value["url"], name=name)
            new_url = upload_to_storage(name)
            os.remove(name)
            # new_url = f"https://firebasestorage.googleapis.com/v0/b/styleguide-c2cef.appspot.com/o/Images%2F{name}?alt=media"
            ref.child(key).update({"url":new_url})
if __name__ == "__main__":
    update()
