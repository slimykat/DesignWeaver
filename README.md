# Deasign Weaver: Dimensional Scaffolding for Text-to-Image Product Design

<p align="center" width="100%">
<img src="cover.png" alt="DesignWeaverTeaser" style="width: 80%; min-width: 300px; display: block; margin: auto;">
</p>

#### TODO: the code will be uploaded soon

This repository accompanies our research paper titled ["DesignWeaver: Dimensional Scaffolding for Text-to-Image Product Design"](https://arxiv.org/abs/2502.09867). 

The repository contains the version that was presented in the CHI 2025's paper as well as a tool interface without the experiment controls. We create this new separate repository with cleaner code base for public access.

DesignWeaver is an AI-enabled product design interface for novice user. 
Generative AI has enabled novice designers to quickly create professional-looking visual representations for product concepts. However, novices also have limited domain knowledge that could constrain their ability to write prompts that effectively explore a product design space. DesignWeaver aims to help them generate prompts for a text-to-image model by surfacing key design dimensions from generated images.

Bellow, we described the setup instruction for the Web Application. 

## Installation
To setup, you will need to have a working Firebase project, generate `.env` that contains your OpenAI API key and other certification keys, and download the necessary packages.
### Step 1: Create a Firebase project
By default, both the loged data and generated images are stored in [Firebase](https://firebase.google.com/docs). Use your own account to start a project and enable Realtime Database and Storage.


### Step 2: Environment Variables
Create a file under the project's root folder named `.env`. The Web Application will get private inputs from this file, including your OpenAI api key and Firebase configurations. Bellow is the required variables, please configure the vallues according to your own account and setup.

1. **OpenAI key**: a paid OpenAI account to support DALLe3 model, gpt-4o model, and gpt-4o-mini model

2. **Firebase SDK configuration**: checkout the `SDK Setup and Configuration` section under Project Overview in your firebase project

3. **Firebase Storage key**: create and download a private key from the `Service account` section

4. **Backend URL**: default set to localhost port 31

<detail>
<summary>.env</summary>
<br>
REACT_APP_OPENAI_API_KEY=Your own OpenAI key

FIREBASE_DB_URL=Your own Firebase Realtime Database's URL

REACT_APP_FIREBASE_API_KEY=Get the following information in Project Overview
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

FIREBASE_CERT_PATH=PATH to your Storage_private_key.json

REACT_APP_BACKEND_URL=localhost:31 

</detail>

#### Backend
Auto-uploading to the Storage using scripts requires a private key. Go to your Firebase project setting and acces .  and it under the `backen/key` folder.


### Step 3: Dependency
You will have to install for both the Python backend and the React frontend.

#### Backend
The depency for the backend is recorded in `backend_requirement.txt`. You may install them directly but we strongly suggest you to use a [Python virtual environment](https://docs.python.org/3/library/venv.html).
```
# install virtual environment
python3 -i pip install virtualenv
python3 -m venv <virtual-environment-name>

# activate virtual environment
source <virtual-environment-name>/bin/activate

# install python packages
python3 -i pip install -r backend_requirement.txt
```

#### React Web Application
Execute the `npm install` command under the project's root folder. The required dependencies will be installed according the project.

### Step 4: Start the Web Application
Go to the project's root directory. Start the backend server first using. Then, you may run the `npm start` to start the Web Application.
```
# under DesignWeaver
python3 backend_server.py
npm start
```
Note: the Web Application will run on localhost:3030. If the port is ocupied by other process, you may change the port number in `package.json` Line 7.

## Run DesignWeaver's Testing Interface
You may use any browser to access the interface on the localhost. The default route `localhost:3030/` will lead you to an empty panel with the username "TestUser". Here you may explore the tool without hard time limit.

## Start a Full Task Session
To start a full session, access the endpoint `localhost:3030/Start` and enter a user name. The coresponding user will be setup in the database. Each user name will have 60 minutes to access the session before being blocked.



## Acknowledgement
This public repo is not meant for production usage and the Web App is set to run on localhost. To securely run the application online, please consider host the application using [nginx](https://nginx.org/en/docs/) or [Apache](https://httpd.apache.org/docs/2.4/).

The application is developed and tested in Node version 14.18.3 and Python version 3.10.2.

## License and Citation

If you find our work useful in your research, please cite our [paper](https://arxiv.org/abs/2502.09867):

```bibtex
@misc{chi2025designweaver,
      title={DesignWeaver: Dimensional Scaffolding for Text-to-Image Product Design}, 
      author={Sirui Tao, Ivan Liang, Cindy Peng, Zhiqing Wang, Srishti Palani, Steven P. Dow},
      year={2024},
      eprint={2502.09867},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2502.09867}, 
}
```

See [LICENSE](LICENSE) file.
