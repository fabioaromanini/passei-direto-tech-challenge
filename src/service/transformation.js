function indexEntityByKey(entity, keyName) {
  const entityByKey = {};
  entity.forEach(entry => {
    const key = entry[keyName];
    entityByKey[key] = entry;
  });

  return entityByKey;
}

function indexMultipleEntityByKey(entity, keyName) {
  const entityByKey = {};
  entity.forEach(entry => {
    const key = entry[keyName];
    if (!(key in entityByKey)) {
      entityByKey[key] = [];
    }
    entityByKey[key].push(entry);
  });

  return entityByKey;
}

function parseEntryFields(originalEntry, fieldNamesMapping) {
  const parsedEntry = {};
  Object.keys(originalEntry).forEach(originalField => {
    const newFieldName = fieldNamesMapping[originalField];
    if (newFieldName) {
      parsedEntry[newFieldName] = originalEntry[originalField];
    }
  });
  return parsedEntry;
}

function joinByKey(mainEntity, mainEntityKey, joinEntity, joinEntityKey, fieldNamesMapping) {
  const joinEntityByKey = indexEntityByKey(joinEntity, joinEntityKey);

  return mainEntity.map(mainEntry => {
    const joinKey = mainEntry[mainEntityKey];
    const joinEntry = joinEntityByKey[joinKey];
    return {
      ...mainEntry,
      ...parseEntryFields(joinEntry, fieldNamesMapping),
    };
  });
}

function joinMultipleByKey(
  mainEntity,
  mainEntityKey,
  joinEntity,
  joinEntityKey,
  joinFieldName,
  fieldNamesMapping
) {
  const joinEntityByKey = indexMultipleEntityByKey(joinEntity, joinEntityKey);

  return mainEntity.map(entry => {
    const key = entry[mainEntityKey];
    const joinEntries = joinEntityByKey[key];

    return {
      ...entry,
      [joinFieldName]: joinEntries.map(joinEntry => parseEntryFields(joinEntry, fieldNamesMapping)),
    };
  });
}

exports.joinByKey = joinByKey;
exports.joinMultipleByKey = joinMultipleByKey;
