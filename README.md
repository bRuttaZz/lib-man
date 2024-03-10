# Lib Man (A Library Manager)
Nothing special, just a fullstack app for library management :) [More like a simple project build within 1.5 days buffer] 

## Running the server
> **NB**: there is a simple to use Makefile

Start with a simple make command for detailed usage example
```sh
make
```

#### Managing Configurations
Create a config file similar to `example.env` file in the rootdirectory, and run the system.
If you want to go with a fancy name like `something.env` for your configuration, then set the environtment varaible `CONFIG_TYPE` to the curresponding one.

For loading the example config itself,
```sh
export CONFIG_TYPE=example
```
and then start running the system, it will take `example.env` as the config file. 

**NB** : If you are naming your config file as `.env`, you don't want to set an explicit `CONFIG_TYPE` env variable. 

## Features
1. There is a migration script

## About the admin user 
1. there is only one admin user
2. default username and password : `admin` and `passowrd` respectively can be change latter on using the env variable. 

## about the api calling
1. Just beacuse I am not that sure about the internet access facility in pythonanywhere, calling the API to import books directly from the browser (I knw it's dump)
2. But there was a difficulty due to the server's cross origin policy. So I am going with JSONP
**I admit! Not a good method at all. Anyway doing this for hosting on pythonanywhere for free. (I want that extra brownie)**
3. Okay there is no other way I am forced to go with Docker way

4. for a straight forward CRUD operation have a look into reader's section

## Tools and Libs
1. Flask 
2. Alembic
3. Gunicorn
4. bootstrap v5
5. [material design icons](https://pictogrammers.com)
6. pydantic


## TODO
1. has to migrate to sqlmodel to avoid sqlalachmey & pydantic related bug fixes