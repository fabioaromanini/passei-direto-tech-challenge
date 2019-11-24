const { SOURCE_NAME } = process.env;

async function extractEntity(entityName) {
  const payload = {
    Bucket: SOURCE_NAME,
    Key: `a/${entityName}.json`,
  };
  console.log(payload);
}

exports.extractEntity = extractEntity;
