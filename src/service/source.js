const s3Connector = require('../connector/s3');

const sourceEntities = [
  'courses',
  'sessions',
  'student_follow_subject',
  'students',
  'subjects',
  'subscriptions',
  'universities',
];

async function extract() {
  sourceEntities.forEach(sourceEntityName => s3Connector.extractEntity(sourceEntityName));
}

exports.extract = extract;
