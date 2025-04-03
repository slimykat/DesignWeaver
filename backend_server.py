from dotenv import dotenv_values
from src.backend import create_app
from flask_cors import CORS


HOST, PORT = dotenv_values(".env")["REACT_APP_BACKEND_URL"].split(
    ":"
)  # requireing for hosting

app = create_app(args=dotenv_values(".env"))
CORS(app)
if __name__ == "__main__":
    app.run(
        host=HOST,
        port=PORT,
        threaded=True,
    )
