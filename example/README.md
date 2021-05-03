# sequelize-typescript-model-migration example

In order to run the example, you must configure the config file in the `./config` folder:

```
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "database_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

Run `yarn install` to install required depedencies.

Run `yarn migrate:up` to migrate create all necessary tables, foreign keys, indexes in your database.

Run `yarn migrate:down` to remove all tables, foreign keys, indexes from your database.