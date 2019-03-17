# Dependencies

1. [nvm](https://github.com/creationix/nvm#installation): node version manager

# Optional Dependencies

1. [docker](https://docs.docker.com/): [mac](https://download.docker.com/mac/stable/Docker.dmg) | [windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)

# Quickstart - Local Setup for Dev

1. `cd` to the project root
1. `nvm use` - Use specific node version in `.nvmrc`
1. `npm install` - Install dependencies
1. Duplicate `.env-template` to create `.env` next to the original in the project root, then fill in secrets as needed in `.env`
1. `npm run services:up` - Start backing services (or start a local mysql server and update your `.env` `DB_<TYPE>` vars as needed)
1. `npm run db:init && npx knex migrate:latest` - Initialize database and run migrations
1. `npm run api:dev` - Start API dev server
1. `npm run frontend:dev` - In a separate terminal, start webpack frontend
1. Head to `http://localhost:4000` to ensure you can see the homepage

# Database (for local dev environment)

We use a MySQL database to store our data.

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

# Deployments in Production Environments
There are numerous potential scenarios for deployment, which cannot all be covered in this document. This project was designed for deployment in a Docker container, which should enable use of various architectures. The database used on the backend is not currently configured for containerized deployment, though that could be accomplished with further design work.

The production environment for this project has been on the Google Cloud Platform using the gcloud build process to create and deploy the container. Some of the prerequisites for this kind of deployment include:
* Create a VM instance
* Selection of a docker registry location to hold the image

Some of the documentation that will be helpful to a developer using the Google Cloud Platform includes:
* [Deploying Containers on VMs and Managed Instance Groups](https://cloud.google.com/compute/docs/containers/deploying-containers)
* [Connecting MySQL Client from Compute Engine](https://cloud.google.com/sql/docs/mysql/connect-compute-engine)
* [gcloud builds submit](https://cloud.google.com/sdk/gcloud/reference/builds/submit)
* [About the Cloud SQL Proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy)

In the current project deployment model with the MySQL database being a standalone instance, we are utilizing Google CloudSQL. For the containerized application running on its VM, a VPC (Virtual Private Cloud) network must be configured with specific IP addressing parameters. Deployment of the database instance has not yet been scripted, although it can be, using the Google Cloud SDK; permitting developers to elaborate the current project to use try infrastructure as code.

Various build processes can be employed, depending on developer preferences for tools and the chosen environment. The project is currently being deployed using the `gcloud` tool from the SDK to automatically deploy to the Google Container Registry. This approach requires establishment of a storage bucket with appropriately configured access permissions. Developers are again encouraged to consult the documentation for their chosen hosting provider.

The build process employed for this project uses the `gcloud builds submit` process, as documented at the above link. Upon initial deployment, the database needs to be initialized, just as for the Development environment, though the process differs slightly. For our purposes, working with the Google Cloud SQL Proxy offered the simplest workflow. Download and connect to your Cloud SQL instance following the instructions in the [About the Cloud SQL Proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy) documentation. Then, use your preferred MySQL client to execute the db/eap_creation_script.sql and establish the base configuration. From a command line, this might look like:

`mysql -u root -P53306 -h 127.0.0.1 -p < eap_creation_script.sql`

where 53306 is the port configured for the local listener with the Google Cloud SQL Proxy.

As this project has evolved, some modifications to the database have been introduced, for which it was not desirable to completely reinitialize the database and reload data every time. These modifications have been written into knex migration scripts. Execution of these scripts is not automated at this time. Ideally, an automated approach to backing up the database prior to any schema change implementations, followed by reloading of data if necessary, to facilitate future upgrades to the application. At this time, it is necessary to run the knex migrations scripts manually from within the deployed docker container. Consult documentation for your deployment environment for steps necessary to obtain shell access within the container. For our Google Compute Engine deployment, basic steps are:
* Access the VM through SSH
* obtain the container ID with the command `docker container list`
* open a bash shell within the container using the docker command `docker exec -it <container_ID> bash`
* execute the migration scripts with the command `node_modules/.bin/knex migrate:latest`

Future work can improve automation of these steps. But at this point you should have a fully functional deployment.  


# ERRATA
1. Console error message may be observed when no new awards have been created that need to be sent. This happens when the cron job runs and attempts to add records to the emails data table, but has no data to write. The issue does not affect functionality.
1. When scheduling an award for a time in the future, the time at which the award is sent may differ from user expectation. The backend database server calculates current time as UTC. Therefore the actual time the award certificate is emailed will differ from the time the user entered when creating the award, unless user takes this into account and schedules the award to be sent based on UTC time.


