from src.server import create_app

app = create_app()

if __name__ == "__main__":
    import os
    app.run(port=int(os.getenv("PORT", 8000)), host="0.0.0.0", debug=True)