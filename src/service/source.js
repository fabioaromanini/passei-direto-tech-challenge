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

  const mappedEntities = {};
  entities.forEach(entity => (mappedEntities[entity.name] = entity.data));
  return mappedEntities;
}

exports.extract = extract;
