# Transactions service

This package implements the transactions microsservice, it uses a mongodb and exposes a public api on port 3001 and an internal api in port 3003.

## Instalation

First, ensure you use the projects node version using
`nvm use`

Then, install dependencies
`npm ci`

Then, you can develop locally using Jest as you test runner
`npm test`

## Running locally

To run the microsservice locally just execute
`docker compose up transactions`
And port 3001 will be available

## Api
The swagger definition for the api can be found in [ms-transactions.yaml](../../ms-transactions.yaml)
