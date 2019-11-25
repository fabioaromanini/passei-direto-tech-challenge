const sourceService = require('./service/source');
const transformationService = require('./service/transformation');
const datawarehouseService = require('./service/datawarehouse');

exports.extractTransformLoad = async event => {
  const data = await sourceService.extract();
  console.log('Extracted data from source');

  const transformedData = transformationService.transform(data);
  console.log('Finished transformations');

  await datawarehouseService.load(transformedData);
  console.log('Finished uploading files to datawarehouse');

  await datawarehouseService.refreshTables();
  console.log('Crawler triggered');
};
