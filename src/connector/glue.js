const AWS = require('aws-sdk');

const client = new AWS.Glue();

const { TABLE_REFRESHER_CRAWLER_NAME } = process.env;

async function startCrawler() {
  return client
    .startCrawler({
      Name: TABLE_REFRESHER_CRAWLER_NAME,
    })
    .promise();
}

exports.startCrawler = startCrawler;
