function indexEntityByKey(entity, keyName) {
  const entityByKey = {};
  entity.forEach(entry => {
    const key = entry[keyName];
    entityByKey[key] = entry;
  });

  return entityByKey;
}

function parse(originalEntity, fieldNamesMapping) {
  return originalEntity.map(originalEntry => {
    const parsedEntry = {};
    Object.keys(originalEntry).forEach(originalField => {
      const newFieldName = fieldNamesMapping[originalField];
      parsedEntry[newFieldName || originalField] = originalEntry[originalField];
    });
    return parsedEntry;
  });
}

function joinByKey(mainEntity, mainEntityKey, joinEntity, joinEntityKey) {
  const joinEntityByKey = indexEntityByKey(joinEntity, joinEntityKey);

  return mainEntity.map(mainEntry => {
    const joinKey = mainEntry[mainEntityKey];
    const { [joinEntityKey]: ignoredKey, ...joinEntryWithoutKey } = joinEntityByKey[joinKey];
    return {
      ...mainEntry,
      ...joinEntryWithoutKey,
    };
  });
}

function denormalizeStudents(students, courses, universities) {
  return [];
}

exports.parse = parse;
exports.joinByKey = joinByKey;
exports.denormalizeStudents = denormalizeStudents;
