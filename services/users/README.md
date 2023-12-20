# Users service

This package implements the transactions microsservice, it uses a mongodb and exposes a public api on port 3002 

And it uses the transactions microsservice, to know more go to [transactions](../transactions/README.md)

## Instalation

First, ensure you use the projects node version using
`nvm use`

Then, install dependencies
`npm ci`

Then, you can develop locally using Jest as you test runner
`npm test`

## Running locally

To run the microsservice locally just execute
`docker compose up users`
And port 3002 will be available

## Api
The swagger definition for the api can be found in (ms-users.yaml)[../../ms-users.yaml]
