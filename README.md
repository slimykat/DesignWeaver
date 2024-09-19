# Deasign Weaver: Dimensional Scaffolding for Text-to-Image Product Design

<p align="center" width="100%">
<img src="cover.png" alt="DesignWeaverTeaser" style="width: 80%; min-width: 300px; display: block; margin: auto;">
</p>

This repository accompanies our research paper titled "DesignWeaver: Dimensional Scaffolding for Text-to-Image Product Design" (currently under review.) The repository contains the version that was presented in the CHI 2025's paper as well as a tool interface without the experiment controls. We create this new separate repository with cleaner code base for public access.

DesignWeaver is an AI-enabled product design interface for novice user. 
Generative AI has enabled novice designers to quickly create professional-looking visual representations for product concepts. However, novices also have limited domain knowledge that could constrain their ability to write prompts that effectively explore a product design space. DesignWeaver aims to help them generate prompts for a text-to-image model by surfacing key design dimensions from generated images.

Bellow, we described the setup instruction for the Web Application. 

## Setting Up the Environment
To setup, you will need to have a working Firebase project, generate `.env` that contains your OpenAI API key and other certification keys, and download the necessary packages.
### Step 1: Create a Firebase project
By default, both the loged data and generated images are stored in [Firebase](https://firebase.google.com/docs). Use your own account to start a project and enable Realtime Database and Starge.

#### Realtime Database

#### Storage


### Step 2: Generate Environment Variable File
The Web Application will get private inputs from `.env` file, including your OpenAI api key. Bellow is the required variables, pleace configure the vallues according to your own setup.

```
REACT_APP_OPENAI_API_KEY=Your own ChatGPT key that supports gpt-4o and gpt-4o-mini

REACT_APP_FIREBASE_API_KEY=Get the following information on Firebase' website
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

FIREBASE_DB_URL=Your own Firebase Realtime Database's URL
FIREBASE_CERT_PATH=PATH to your Storage_private_key.json

REACT_APP_BACKEND_URL=localhost:31 
# the backend will run on port 31 by default. You may change its behavior in backend_server.py

```

### Step 3: Installation
You will have to install for both the Python backend and the React frontend.

#### Backend
The depency for the backend is recorded in `backend_requirement.txt`. You may install them directly but we strongly suggest you to use a [Python virtual environment]().
```
python3 -i pip install < backend_requirement.txt
```

#### React Web Application



## Running the Web Application
### Step 1: Start the server
You will need to start the backend server first using the command.
```
python3 backend_server.py
```
Then, you may run the npm command to start the application.
```
npm start
```
Now, the Web Application will be running on localhost:3030.

### Step 2: Running DesignWeaver
The default route of localhost:3030 will lead you to an empty panel using the username "TestUser". Here you may explore the tool without hard time limit.

To start a full experiment session, access the endpoint `localhost:3030/Start` and enter a user name. The coresponding user account will be setup in the database.



## Authors and Citation

## Acknowledgement
This public repo is not meant for production usage and the Web App is set to run on localhost. To securely run the application online, please consider host the application using [nginx]() or [Apache]().

The application is developed and tested in Node version and Python version 3.12.