# Dependencies

1. [nvm](https://github.com/creationix/nvm#installation): node version manager

# Optional Dependencies

1. [docker](https://docs.docker.com/): [mac](https://download.docker.com/mac/stable/Docker.dmg) | [windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)

# Quickstart

1. `cd` to the project root
1. `nvm use` - Use specific node version in `.nvmrc`
1. `npm install` - Install dependencies
1. Duplicate `.env-template` to create `.env` next to the original in the project root, then fill in secrets as needed in `.env`
1. `npm run services:up` - Start backing services (or start a local mysql server and update your `.env` `DB_<TYPE>` vars as needed)
1. `npm run db:init && npx knex migrate:latest` - Initialize database and run migrations
1. `npm run api:dev` - Start API dev server
1. `npm run frontend:dev` - In a separate terminal, start webpack frontend
1. Head to `http://localhost:4000` to ensure you can see the homepage

# Database

We use a MySQl database to store our data.

To initialize the database, run `npm init:db`. This will create the base schema. Next run all migrations to move the data models to their latest state `npx knex migrate:latest`.

## Migrations

To run all migrations, run `npx knex migrate:latest`

To roll back a migration, run `knex migrate:rollback`

To create a migration, run `npx knex migrate:make migration_name`

Check out the [knex migration documentation](https://knexjs.org/#Migrations) for a more detailed view of the knex migration api.


# Testing

Tests are ran against a separate database (currently at port 3346)

Make sure you have run
`npm install`
to have all of the latest dependencies

To test the API, run
`npm run api:test`

To test the frontend, run
`npm run frontend:test`


