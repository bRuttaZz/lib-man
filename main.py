from server.server import create_app

app = create_app()

if __name__ == "__main__":
    import os, sys

    # I am feeling lazy to implement an argparser based cli
    if len(sys.argv) > 1:
        if sys.argv[1] == "run":
            app.run(port=int(os.getenv("PORT", 8000)), host="0.0.0.0", debug=True)
            sys.exit(0)
        elif sys.argv[1] == "make-migrations":
            from server.db.migrations import make_migrations
            make_migrations()
            sys.exit(0)
        elif sys.argv[1] == "migrate":
            from server.db.migrations import migrate
            migrate()
            sys.exit(0)
    print(f"""Invalid usage of script!
    {f'''Invalid command : {sys.argv[1]}
''' if len(sys.argv) > 1 else ""}  
usage : `python3 main.py <command>`

commands:
    run : to run test application
    make-migrations : to start test application
    migrate         : to apply generated migrations 

    
    """)
    