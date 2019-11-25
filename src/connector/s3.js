const AWS = require('aws-sdk');

const { DATA_SOURCE_BUCKET_NAME, DATA_WAREHOUSE_BUCKET_NAME } = process.env;

const client = new AWS.S3();

async function extractEntity(entityName) {
  const payload = {
    Bucket: DATA_SOURCE_BUCKET_NAME,
    Key: `a/${entityName}.json`,
  };

  const response = await client.getObject(payload).promise();
  return { data: JSON.parse(response.Body.toString()), name: entityName };
}

function loadEntity(entityName, data) {
  const params = {
    Body: data,
    Bucket: DATA_WAREHOUSE_BUCKET_NAME,
    Key: `a/${entityName}/${new Date().toISOString()}.json`,
  };

  return client.putObject(params).promise();
}

exports.extractEntity = extractEntity;
exports.loadEntity = loadEntity;
