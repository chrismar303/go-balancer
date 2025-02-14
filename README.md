# Description
This is a Load-Balancer for the [Wiki-Go App](https://github.com/chrismar303/wiki-go). It utilizes round-robin to distribute requests.

## Installation
    npm install
This will install all needed packages to run the application

## Run
    npm start
This will start the load-balancer

![image](https://github.com/user-attachments/assets/1efacb5b-2c49-45c2-8dbc-7fa5c4bae825)



## Test
In another terminal

    curl http://localhost:8080/[insert request]
This will ping your load-balancer. Each request should ping a different server

![image](https://github.com/user-attachments/assets/43ba6fe9-47fb-4a9f-99d0-3974d68e7928)

