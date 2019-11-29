const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const { DATA_SOURCE_BUCKET_NAME, DATA_WAREHOUSE_BUCKET_NAME } = process.env;

const client = new AWS.S3();

async function extractEntity(entityName) {
  const key = `a/${entityName}.json`;
  const payload = {
    Bucket: DATA_SOURCE_BUCKET_NAME,
    Key: key,
  };

  console.debug(`Finished downloading ${key}`);

  const response = await client.getObject(payload).promise();
  return { data: JSON.parse(response.Body.toString()), name: entityName };
}

function loadEntity(entityName, data) {
  const key = `a/${entityName}/${new Date().getTime()}.json`;
  const params = {
    Body: data,
    Bucket: DATA_WAREHOUSE_BUCKET_NAME,
    Key: key,
  };

  console.debug(`Finished downloading ${key}`);

  return client.putObject(params).promise();
}

exports.extractEntity = extractEntity;
exports.loadEntity = loadEntity;
