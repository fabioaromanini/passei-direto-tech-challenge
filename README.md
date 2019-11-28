# Passei Direto Tech Challenge

[![CircleCI](https://circleci.com/gh/fabioaromanini/passei-direto-tech-challenge.svg?style=svg)](https://circleci.com/gh/fabioaromanini/passei-direto-tech-challenge)

Repository with code for a technical challenge I'm facing in my job interview for Passei Direto.

The challenge consist of creating a data warehouse from a set of json files, and running some Spark jobs that process data from said data warehouse.

## Requirements

- Node v12.13.x
- [AWS Credentials as explained here](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
- An s3 bucket that acts as a mocked data source with the following files:

```
root/
  a/
    courses.json
    sessions.json
    subjects.json
    subscriptions.json
    students.json
    student_follow_subject.json
    universities.json
```

- The schemas for each file are described in src/test/data/inputs/. Since the data is proprietary, I will not make it available in this repository, but you can create your own data from the schema I provided.
- Also, the name of the bucket must be exported as a environment variable named DATA_SOURCE_BUCKET_NAME.

```sh
export DATA_SOURCE_BUCKET_NAME=<your-data-source-bucket-name>
```

## Deploy

1. `npm install`
2. `npm run deploy --stage <your-name>`

This project uses CloudFormation for cloud resources management, therefore everything you need to run the pipeline (except for the mocked data source) will be created when you execute `npm run deploy`.

## Trigger

This pipeline is triggered by sending a message in a SNS topic named `dev-trigger-etl`. Once you do it, data will be available in a Athena database called `dev-data-warehouse-database` in a few minutes.

All logs may be viewed in CloudWatch.

## TODO

#### Step 2: Use spark to process site events

- ~~Define a simple Spark job~~
- ~~Add bucket for storing spark jobs~~
- Create an EMR jobflow cluster
- Add spark jobs deploy to cicd pipeline
- Point results to data warehouse
- Run Glue crawler on data warehouse upload
- Improve simple Spark job

#### ~~Step 1: Load relational data about users into Athena~~

- ~~Improve log system~~
- ~~Enable x-ray~~
- ~~Trigger AWS Glue Crawler~~
- ~~Write data into s3~~
- ~~Rename fields~~
- ~~Join students, courses and universities into a single denormalized schema~~
- ~~Join subjects and follows into a single denormalized schema~~
- ~~Get data from data source bucket~~
