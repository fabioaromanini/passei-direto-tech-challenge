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
2. `npm run deploy --stage <your-name-lowercase-only>`

This project uses CloudFormation for cloud resources management, therefore everything you need to run the pipeline (except for the mocked data source) will be created when you execute `npm run deploy`.

## Trigger

This pipeline is triggered by sending a message in a SNS topic named `dev-trigger-etl`. Once you do it, data will be available in a Athena database called `dev-data-warehouse-database` in a few minutes.

All logs may be viewed in CloudWatch.

## TODO

#### Step 2: Use spark to process site events

1. ~~Define a simple Spark job~~
2. ~~Add bucket for storing spark jobs~~
3. ~~Add spark jobs deploy to cicd pipeline~~
4. ~~Create an EMR jobflow cluster~~
5. ~~Create EMR Cluster Role and Instance Profile~~
6. ~~Point results to data warehouse~~
7. Improve simple Spark job
8. Run Glue crawler on data warehouse upload

#### ~~Step 1: Load relational data about users into Athena~~

1. ~~Get data from data source bucket~~
2. ~~Join subjects and follows into a single denormalized schema~~
3. ~~Join students, courses and universities into a single denormalized schema~~
4. ~~Rename fields~~
5. ~~Write data into s3~~
6. ~~Trigger AWS Glue Crawler~~
7. ~~Enable x-ray~~
8. ~~Improve log system~~
