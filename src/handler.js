const sourceService = require('./service/source');

exports.extractTransform = async event => {
  console.log('Hello, world with Circle-ci and deploys happening only on master:D');
  await sourceService.extract();
};
