# Passei Direto Tech Challenge

[![CircleCI](https://circleci.com/gh/fabioaromanini/passei-direto-tech-challenge.svg?style=svg&circle-token=fe0b0cf773d6dbacbf1f77c427c31ae1f1c0f19f)](https://circleci.com/gh/fabioaromanini/passei-direto-tech-challenge)

Code for Passei Direto Tech Challenge.

## Step 1: Data Wrangling

It consists of a serverless ETL which reads data from s3, apply a few transformations (type parsing and joins), and loads it into a data warehouse (also a s3 bucket). It is triggered by a SNS topic, and in case it needed to run periodically, it's trigger mechanism could easily be switched to a cloudwatch scheduled event. Once the data is loaded into the data warehouse, an AWS Glue Crawler is triggered for creating a Athena table from the transformed data.

## Dependencies

- Node v12.13.x
- [Serverless Framewok](https://serverless.com)
- [AWS Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

## Deploy

1. `npm install`
2. `npm run deploy`

## TODO

- Parse fields
- Join students, courses and universities into a single denormalized schema
- Join subjects and follows into a single denormalized schema
- Write data into s3
- Trigger AWS Glue Crawler
- Document solution and alternatives
- ~~Get raw data from buckets~~
