# tapp
[![Build Status](https://travis-ci.org/uoft-tapp/tapp.svg?branch=master)](https://travis-ci.org/uoft-tapp/tapp)

- [deployment](#deployment)
- [backup & restore](#backup-restore)

TA assignment and matching application.

## Starting application
You should have a reasonably recent version of Docker
[installed](https://docs.docker.com/engine/installation/). Also, check that
you have Docker Compose installed.

Copy the `dev.env.default` file to `.env`.  This file is where the docker components
will pickup environment variables such as the postgres username and password.

```
cp dev.env.default .env
```

Once that's out of the way, clone this repo, navigate into the cloned
directory, and run

```
docker-compose up
```

In a new tab, open http://localhost:3000 to see the Rails welcome page!

On the technical side, `docker-compose up` launched two containers: `rails-app`
and `webpack-dev-server`. The former runs the Rails app, while the latter
watches and compiles React files located in `app/javascript/packs`.

## Trying things out
Application code is linked into containers with live reloading, so you can
see changes you make locally right away!

You have full control over Rails code, apply the usual methods. Check the next
section for details on running commands like `rake …` and `rails …`.

To get you started with React quicker, this app comes preloaded with a simple
React app. Visiting http://localhost:3000/hello_react will load JavaScript code
located in `app/javascript/packs/hello_react.jsx`.

## Running commands
To run any `bundle …`, `rails …`, `rake …`, or `yarn …` commands, launch them
via `rails-app` service. For example, `rails generate controller Welcome` is
```
docker-compose run rails-app rails generate controller Welcome
```

## Testing
This app comes pre-loaded with a testing framework for the Ruby parts,
[rspec-rails](https://github.com/rspec/rspec-rails). You can run all tests
like so:
```
docker-compose run rails-app rake spec
```
Tests are located in `spec/controllers`, `spec/models`, and `spec/routing`.

A test autorunner, [guard](https://github.com/guard/guard), will watch changes
to your files and run applicable tests automatically. When developing, start
it with
```
docker-compose run rails-app guard
```

## Dependencies
Ruby/Rails and JavaScript dependencies are checked on container start. Any
unmet dependencies will be installed automatically for the current container.

To add a Ruby/Rails dependency, modify `Gemfile` and (re-)start `rails-app`
service, `docker-compose up` or `docker-compose restart rails-app`.

To add a JavaScript dependency, use Yarn:  
```
docker-compose run rails-app yarn add <package-name>
```  
and restart `webpack-dev-server` service.

To add a system dependency, modify the Dockerfile.

## In case of container trouble

Try `docker-compose down -v`, then `docker-compose up`. This should delete
existing images & data for this project and rebuild them from scratch.

## Deployment <a id="deployment"></a>

* The Dockerfile serves instructions to set up the image of the container (linux, yarn, npm etc)
* The docker-compose files serves to setup the services that your container will be using (postgres, apache, nginx, apps)
* The [prod|dev].env.default files are served to the Dockerfile and the docker-compose files.

### Initial deployment
1. Check out the code locally: `git clone git@github.com:uoft-tapp/tapp.git`
2. Copy `prod.env.default` to `.env`, `cp prod.env.default .env`. Visually inspect `.env` to confirm all variables are assigned the right values for the environment!
3. Run `docker-compose build rails-app`
4. Run `docker-compose up -d` to launch all services and daemonize the control
5. Run `docker-compose run rails-app rake db:migrate db:seed` to create application database schema and initial data

If you don't specify the environment variable that the docker-compose file should reference, you might end
up with an error from postgres ("role "tapp" does not exist"). In that case stop/remove the containers and its volumes,
`docker-compose down -v`, and restart deployment from step 2.

### Updating an existing deployment
1. Fetch and apply changes: `git pull`
2. Rebuild the app with the following command:
    ```
    docker-compose build rails-app
    ```
3. If necessary, perform database migrations:
    ```
    docker-compose run rails-app rake db:migrate
    ```
    You can check the status of migrations:
    ```
    docker-compose run rails-app rake db:migrate:status
    ```
4. Then, restart `rails-app` only:
    ```
    docker-compose up -d --no-deps rails-app
    ```

Note: number 2 will update the rails app but not touch the database.

## Backup/Restore of database <a id="backuprestore"></a>

We should automatically backup postgres every few minutes.
The restore procedure is manual for emergencies when we need to step back to a backup

### Backup & Restore <a id="backup-restore"></a>
While the application is running,
1. Back up the database and it's content:
    ```
    docker exec -t tapp_postgres_1 pg_dumpall -U postgres > filename
    ```
2. Stop & remove all running containers and erase their volumes:
    ```
    docker-compose down -v
    ```

3. Start up docker:
    ```
    docker-compose up
    ```

4. Drop the database that was created on docker-compose up:
    ```
    docker-compose run rails-app rake db:drop
    ```

5. Restore backup:
  ```
  cat filename | docker exec -i tapp_postgres_1 psql -U postgres
  ```

## TODO
- [] JavaScript testing
- [] Build Docker images on CI
