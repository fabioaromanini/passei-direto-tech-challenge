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

const expectedEntitiesByBase = {
  a: ['subscriptions', 'students', 'sessions', 'follows'],
  b: [
    'events',
    'sessions-by-campaign',
    'events-by-state',
    'events-by-pagename',
    'events-by-city',
    'events-by-client-type',
    'events-by-course',
    'events-by-university',
  ],
};

async function refreshTables(key) {
  const base = key.split('/')[0];

  const expectedEntities = expectedEntitiesByBase[base];
  const downloadedEntities = await s3Connector.listEntities(base);
  const downloadedEntitiesSet = new Set(downloadedEntities);

  const remainingFiles = expectedEntities.filter(entity => !downloadedEntitiesSet.has(entity));
  console.debug(`remainingFiles: ${remainingFiles}`);

  const downloadAll = remainingFiles.length === 0;
  if (downloadAll) {
    try {
      await glueConnector.startCrawler();
    } catch (e) {
      console.warn(`Crawler is already running`);
      return false;
    }
  }
  return downloadAll;
}

exports.load = load;
exports.refreshTables = refreshTables;
