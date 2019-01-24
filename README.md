# Dependencies

1. [nvm](https://github.com/creationix/nvm#installation): node version manager

# Optional Dependencies

1. [docker](https://docs.docker.com/): [mac](https://download.docker.com/mac/stable/Docker.dmg) | [windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)

# Quickstart

1. cd to the project root
1. `nvm use`
1. `npm install`
1. Duplicate `.env-template` to create `.env` next to the original in the project root, then fill in secrets as needed in `.env`
1. `npm services:up` (or start a local mysql server and update your `.env` `DB_CONNECTION_STRING` var)
1. `mysql -u root --host 127.0.0.1 --port 3345 < mydb_creation_script.sql`
1. `npm run api:dev`
1. In a separate terminal, `npm run frontend:dev`
1. Run `npm run api:test` to validate the database connection
1. Head to `http://localhost:4000` to ensure you can see the homepage

# Testing

Make sure you have run
`npm install`
to have all of the latest dependencies

To test the API, run
`npm run api:test`

To test the frontend, run
`npm run frontend:test`


