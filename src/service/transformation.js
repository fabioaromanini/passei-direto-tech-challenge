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

    return {
      ...entry,
      [joinFieldName]: joinEntityByKey[key].map(joinEntry => {
        const { [joinEntityKey]: ignoredKey, ...joinEntryWithoutKey } = joinEntry;
        return joinEntryWithoutKey;
      }),
    };
  });
}

exports.joinByKey = joinByKey;
exports.joinMultipleByKey = joinMultipleByKey;
exports.parse = parse;
