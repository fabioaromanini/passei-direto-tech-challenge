const emrConnector = require('../connector/emr');

async function startJob() {
  return emrConnector.runJob();
}

exports.startJob = startJob;
