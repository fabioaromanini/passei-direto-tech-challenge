const sourceService = require('./service/source');
const transformationService = require('./service/transformation');
const datawarehouseService = require('./service/datawarehouse');
const jobService = require('./service/job');
const utils = require('./utils');

exports.extractTransformLoad = async event => {
  const data = await sourceService.extract();
  console.log('Extracted data from source');

  const transformedData = transformationService.transform(data);
  console.log('Finished transformations');

  await datawarehouseService.load(transformedData);
  console.log('Finished uploading files to datawarehouse');
};

exports.startEmrJob = async () => {
  await jobService.startJob();
  console.log('EMR Job started');
};

exports.startTableRefresher = async event => {
  const key = utils.getKeyFromS3Event(event);
  const triggered = await datawarehouseService.refreshTables(key);
  if (triggered) {
    console.log(`Crawler triggered by file ${key}`);
  } else {
    console.log(`Crawler not yet triggered by file ${key}`);
  }
};
