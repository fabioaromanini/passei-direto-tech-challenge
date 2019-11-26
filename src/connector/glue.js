const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const client = new AWS.Glue();

const { TABLE_REFRESHER_CRAWLER_NAME } = process.env;

async function startCrawler() {
  console.debug(`Starting crawler ${TABLE_REFRESHER_CRAWLER_NAME}`);
  return client
    .startCrawler({
      Name: TABLE_REFRESHER_CRAWLER_NAME,
    })
    .promise();
}

exports.startCrawler = startCrawler;
