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

  const response = await client.getObject(payload).promise();
  console.debug(`Finished downloading ${key}`);

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

async function listEntities(base) {
  const response = await client
    .listObjectsV2({
      Bucket: DATA_WAREHOUSE_BUCKET_NAME,
      Prefix: `${base}/`,
      Delimiter: '/',
    })
    .promise();
  console.debug(`Finished downloading objects for base ${base}`);
  return response.CommonPrefixes.map(element => element.Prefix.split('/')[1]);
}

exports.extractEntity = extractEntity;
exports.loadEntity = loadEntity;
exports.listEntities = listEntities;
