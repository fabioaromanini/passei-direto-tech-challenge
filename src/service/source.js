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
  const entities = await Promise.all(
    sourceEntities.map(sourceEntityName => s3Connector.extractEntity(sourceEntityName))
  );
  entities.forEach(entity => console.log(entity.name));
}

exports.extract = extract;
