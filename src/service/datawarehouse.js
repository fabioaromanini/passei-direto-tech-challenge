const s3Connector = require('../connector/s3');
const glueConnector = require('../connector/glue');

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

  return Promise.all(
    parsedData.map(entry => s3Connector.loadEntity(entry.collectionName, entry.data))
  );
}

async function refreshTables() {
  return glueConnector.startCrawler();
}

exports.load = load;
exports.refreshTables = refreshTables;
