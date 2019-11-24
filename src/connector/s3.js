const AWS = require('aws-sdk');

const { SOURCE_NAME } = process.env;

const client = new AWS.S3();

async function extractEntity(entityName) {
  const payload = {
    Bucket: SOURCE_NAME,
    Key: `a/${entityName}.json`,
  };

  const response = await client.getObject(payload).promise();
  return { data: JSON.parse(response.Body.toString()), name: entityName };
}

exports.extractEntity = extractEntity;
