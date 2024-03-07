

## Running the server
Create a config file similar to `example.env` file in the rootdirectory, and run the system.
If you want to go with a fancy name like `something.env` for your configuration, then set the environtment varaible `CONFIG_TYPE` to the curresponding one.

For loading the example config itself,
```sh
export CONFIG_TYPE=example
```
and then start running the system, it will take `example.env` as the config file. 

**NB** : If you are naming your config file as `.env`, you don't want to set an explicit `CONFIG_TYPE` env variable. 