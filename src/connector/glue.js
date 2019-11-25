const AWS = require('aws-sdk');

const client = new AWS.Glue();

const { CRAWLER_NAME } = process.env;

async function startCrawler() {
  return client
    .startCrawler({
      Name: CRAWLER_NAME,
    })
    .promise();
}

exports.startCrawler = startCrawler;
