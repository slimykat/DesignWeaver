# DesignWeaver: Dimensional Scaffolding for Text-to-Image Product Design

DesignWeaver is an AI-enabled product design interface that helps generate prompts for a text-to-image model by surfacing key design dimensions from generated images.  
It is designed for novice designers with limited domain knowledge who struggle to write prompts that effectively explore a product design space.

<p align="center" width="100%">
<img src="cover.png" alt="DesignWeaver Teaser" style="width: 80%; min-width: 300px; display: block; margin: auto;">
</p>

This repository accompanies the CHI 2025 paper:  
**"DesignWeaver: Dimensional Scaffolding for Text-to-Image Product Design"**

[arXiv preprint](https://arxiv.org/abs/2502.09867)

---

## Installation

To set up, you will need:
- A working Firebase project
- An `.env` file containing your OpenAI API key and Firebase configuration
- Installed dependencies for both the backend (Python) and frontend (React)

---

### Step 1: Create a Firebase Project

By default, all logged data and generated images are stored in [Firebase](https://firebase.google.com/docs).

Using your own Firebase account:
- Create a new project
- Enable **Realtime Database** and **Storage**
- Initialize the Realtime Database with the following structure:

```json
{
  "Image_pool": {},
  "participants": {}
}
```

---

### Step 2: Environment Variables

Create a `.env` file in the project root directory.  
The Web Application reads private configurations from this file, including your OpenAI API key and Firebase credentials.

You will need:

1. **OpenAI API Key**: A paid OpenAI account supporting DALL·E 3, GPT-4o, and GPT-4o-mini models.
2. **Firebase SDK Configuration**: Available under `Project Overview` → `SDK Setup and Configuration`.
3. **Firebase Storage Service Account Key**: Downloadable under `Project Settings` → `Service accounts`.
4. **Backend URL**: Default is `localhost:31`.

<details>
<summary><b>Example .env file</b></summary>

```env
REACT_APP_OPENAI_API_KEY=your-openai-api-key

FIREBASE_DB_URL=your-firebase-realtime-database-url

REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...

FIREBASE_CERT_PATH=path/to/your/storage_private_key.json

REACT_APP_BACKEND_URL=localhost:31
```

</details>

---

### Step 3: Install Dependencies

You need to install dependencies for both the backend (Python) and frontend (React).

#### Backend (Python)

Dependencies are listed in `backend_requirement.txt`.  
It is **strongly recommended** to use a [Python virtual environment](https://docs.python.org/3/library/venv.html).

```bash
# Install virtualenv if needed
pip install virtualenv

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python packages
pip install -r backend_requirement.txt
```

#### Frontend (React)

Install frontend dependencies:

```bash
npm install
```
(Ensure you are in the project root directory.)

---

## Run the Application

Start the backend server first, then the frontend Web Application:

```bash
# Start backend
python3 backend_server.py

# In a new terminal, start frontend
npm start
```

- The frontend will run by default at: `http://localhost:3030/`
- If port 3030 is occupied, you can change the port in `package.json` (line 7).

---

## Start a Session

1. Assign a user ID under `participants` in your Firebase Realtime Database (e.g., `{ "TestUser": 1 }`).
2. Use that ID to start a session by visiting:  
   `http://localhost:3030/`

---

## Acknowledgments

This repository is intended for **research purposes** and **local development** only.  
For production deployment, consider hosting with [nginx](https://nginx.org/en/docs/) or [Apache](https://httpd.apache.org/docs/2.4/).

- Developed and tested with:
  - Node.js v14.18.3
  - Python v3.10.2

---

## License and Citation

If you find our work useful in your research, please cite:

```bibtex
@article{tao2025designweaver,
  title={DesignWeaver: Dimensional Scaffolding for Text-to-Image Product Design},
  author={Sirui Tao, Ivan Liang, Cindy Peng, Zhiqing Wang, Srishti Palani, Steven P. Dow},
  journal={Conference on Human Factors in Computing Systems},
  year={2025},
  eprint={2502.09867},
  archivePrefix={arXiv},
  primaryClass={cs.HC},
  url={https://arxiv.org/abs/2502.09867}
}
```

See [LICENSE](LICENSE) for license information.
```
