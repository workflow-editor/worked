# README

Currently only _Chrome based_ browsers are supported.

## IDE
- Clone repository
- Download and install [WebStorm](https://www.jetbrains.com/webstorm/)
- Import repository
- Install [react dev tools extension](http://extension.remotedev.io/) for Chrome or Firefox

## Configuration, Install, Run

1. Use [Docker](https://www.docker.com) for running and deploying/shipping the application or take a look at the manual environment in 2 or in combination with docker-compose.
2. Use manual _local_ environment: download, install and configure [NodeJS](https://nodejs.org).

## Important preparations

1. Extract `dist/node_modules.zip` in the `dist` folder, there should be a module called `varakh-react-diagrams`
2. Besides _keeping_ `varakh-react-diagrams` there (for Docker), copy it manually to `node_modules/` as the dependency isn't available anymore

### Docker

Be sure you did _important preparations_ before continuing!

Build images for each environment:

```
sudo docker build -t worked-dev:latest -f Dockerfile-dev .

# OR

sudo docker build -t worked-prod:latest -f Dockerfile-prod .
```

Maybe use docker-compose afterwards and reference the images.

### docker-compose

Docker has to be installed locally.

Available Dockerfiles:

1. `docker-compose-dev.yml.example` for development (node based)
2. `docker-compose-prod.yml.example` for production (nginx based)

In the following a parameter might be `-f ymlFile`. If so, select one of the files from above.

```
# build and run docker containers in DAEMON mode
(sudo) docker-compose -f ymlFile up --build -d

# stop containers
(sudo) docker-compose -f ymlFile stop -v

# reset the containers
(sudo) docker-compose -f ymlFile down -v 
```

You can push images to a repository at your will.

### Local

1. NodeJS has to be installed locally.
2. After this use `npm install` to install dependencies

#### Run via CLI
The application can be run by sourcing the environment variables from `local_env` locally and then running `npm start`.
There is a wrapper script for this purpose. Just issue the command `sh local_run.sh` and everything should be fired up. Maybe adjust ENV vars in `local_env`.

You can issue `npm` commands by hand, but always source `local_env` before you do so. Sourcing can be done via `set -a; source local_env; set +a;`.

Once the application is running, go to [host:port](http://host:port). Host and port is defined by `docker-compose.yml` or `local_env`.

## Versions and Versioning

This application uses x.y.z. x indicates major changes, y some minor features and z fixes. Change docker-compose files accordingly if you want to increase the version.

This application communicates with worked-api. Be sure to have compatible versions. Your ENV var `REACT_APP_API_URL` should point to a valid local instance or remote url.

## Deployment

Use Docker:

1. Build if application (stated in the Dockerfile) requires it.
2. Build image with `docker-compose -f docker-compose(-{dev|prod}).yml --build`.
3. Tag the resulting image and send it to a registry (e.g. your own).
4. Create a container which adds all required environment variables. They are listed the file `docker_env` or in the compose file itself.

Manual:

1. Compile the application if required.
2. Be sure that all required environment files are visible or included in the application.
3. Create an initd file for managing the application if required.
