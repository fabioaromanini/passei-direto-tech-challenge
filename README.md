# Passei Direto Tech Challenge

[![CircleCI](https://circleci.com/gh/fabioaromanini/passei-direto-tech-challenge.svg?style=svg)](https://circleci.com/gh/fabioaromanini/passei-direto-tech-challenge)

Repository with code for a technical challenge I'm facing in my job interview at Passei Direto.

The challenge consists of creating a data warehouse from a set of JSON files and running some Spark jobs that process data from the warehouse.

## Requirements

- Node v12.13.x
- [AWS Credentials as explained here](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

## Deploy

1. `npm install`
2. `npm run deploy -- --stage <stage-name>`

Since buckets in AWS require unique global namings, I created every single bucket with a _stage_ prefix. Therefore it is **required** to pass **an unique stage name** after the --stage parameter when deploying. It can be any string you want, just make it short and lowercase only. For example: `npm run deploy -- --stage fabio`

3. This project uses CloudFormation for cloud resources management, therefore everything you need to run the pipeline will be created when you execute the npm deploy script. Once the project infrastructure is deployed, you'll end-up with a few s3 buckets. Create the following file directories in the `<stage-name>.data.source.pdcase` bucket.

```
/
  a/
    courses.json
    sessions.json
    subjects.json
    subscriptions.json
    students.json
    student_follow_subject.json
    universities.json
  b/
    part-00001.json
    part-00002.json
    part-00003.json
    ...
```

- The schemas for each file are described in src/test/data/inputs/. Since the data is proprietary, I will not make it available in this repository, but you can create your own data from the schema I provided.

## Spark Jobs

1. In order to run spark jobs using EMR, open the file `src/spark-jobs/allTransformations.py` and replace the value in the _stage_ variable in line 7 for the name of your own stage, so that _input_dir_ will match the s3 data warehouse bucket in your environment.
2. Run `npm run deploy-spark <stage-name>.emr.jobs.pdcase`. This will upload your python file to a bucket named `<stage-name>.emr.jobs.pdcase`. EMR clusters will read from this bucket.
3. Run `npm run deploy-roles`. This will create the IAM Roles for your spark cluster.

## Trigger

#### Data ETL

In order to trigger an extraction from `<stage-name>.data.source.pdcase` to `<stage-name>.data.warehouse.pdcase`, simply send a message (any message) to a SNS topic called `<stage-name>-prod-trigger-etl`. In a few minutes a table will be created in athena with data available for ad-hoc, interactive queries.
All logs may be viewed in CloudWatch.

#### Spark Jobs

In order to trigger a spark job defined you uploaded to `<stage-name>.emr.jobs.pdcase`, simply send a message (any message) to an SNS topic called `<stage-name>-prod-emr-starter`. In a few seconds an EMR cluster with 1 m5.xlarge machine will be created and process data from your datasource/datawarehouse. Once the job is over, it will also create a few tables in an Athena database with very **rich and summarized data**.
Logs will be found on `<stage-name>.emr.jobs.pdcase/logs`.

## Cleaning

If you want to remove the complete stack, start by *removing all content from all the buckets* the project has created. They must be completely empty before proceeding. After doing that, open cloud formation on your AWS console, select the created stack (something like `passei-direto-<your-stage-name>`) and click "delete". In a few minutes, all resources will be deleted, and your account is as good as new.

## TODO

#### Step 2: Use spark to process site events

1. ~~Define a simple Spark job~~
2. ~~Add bucket for storing spark jobs~~
3. ~~Add spark jobs deploy to ci/cd pipeline~~
4. ~~Create an EMR job flow cluster~~
5. ~~Create EMR Cluster Role and Instance Profile~~
6. ~~Point results to data warehouse~~
7. ~~Improve simple Spark job~~
8. ~~Run Glue crawler on data warehouse upload~~

#### ~~Step 1: Load relational data about users into Athena~~

1. ~~Get data from data source bucket~~
2. ~~Join subjects and follows into a single denormalized schema~~
3. ~~Join students, courses and universities into a single denormalized schema~~
4. ~~Rename fields~~
5. ~~Write data into s3~~
6. ~~Trigger AWS Glue Crawler~~
7. ~~Enable x-ray~~
8. ~~Improve log system~~
