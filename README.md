

# Shane Chat

Welcome to Shane Chat!

This is a simple chat app that supports multiple users with very basic "authentication" and "authorization".  

## How to run
This code runs on docker. You will need to have docker installed to run it.  
Clone this repo to a local directory with:  
`git clone git@github.com:ShaneK/shane-chat.git`  
Then run `docker-compose up` to get started.

The app will pull everything it needs, then it will `npm install` and start running on [http://localhost:4200](http://localhost:4200).


## Tech stack
- NX
- Angular
    - ngxs
    - rx-angular
    - Font Awesome
- Node
    - NestJS
    - pg
- PostgreSQL
