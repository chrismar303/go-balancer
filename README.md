# Description
This is a Load-Balancer for the [Wiki-Go App](https://github.com/chrismar303/wiki-go). It utilizes round-robin to distribute requests.

## Installation
    npm install
This will install all needed packages to run the application

## Run
    npm start
This will start the load-balancer

## Test
In another terminal

    curl http://localhost:8080/[insert request]
This will ping your load-balancer. Each request should ping a different servevr
