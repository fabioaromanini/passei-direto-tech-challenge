const s3Connector = require('../connector/s3');

function toNewLineDelimitedJson(dataArray) {
  return dataArray
    .map(entry => JSON.stringify(entry))
    .reduce((prev, curr) => `${prev}${curr}\n`, '');
}

async function load(data) {
  const parsedData = Object.keys(data).map(collectionName => ({
    collectionName,
    data: toNewLineDelimitedJson(data[collectionName]),
  }));
  console.log(parsedData[0].data);

  return Promise.all(
    parsedData.map(entry => s3Connector.loadEntity(entry.collectionName, entry.data))
  );
}

exports.load = load;
