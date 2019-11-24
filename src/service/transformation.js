function indexJoinEntityByKey(joinEntity, joinEntityKey) {
  const joinEntityByKey = {};
  joinEntity.forEach(entry => {
    const key = entry[joinEntityKey];
    joinEntityByKey[key] = entry;
  });

  return joinEntityByKey;
}

function indexMultipleJoinEntityByKey(joinEntity, joinEntityKey) {
  const joinEntityByKey = {};
  joinEntity.forEach(entry => {
    const key = entry[joinEntityKey];
    if (!(key in joinEntityByKey)) {
      joinEntityByKey[key] = [];
    }
    joinEntityByKey[key].push(entry);
  });

  return joinEntityByKey;
}

function parseEntryFields(originalEntry, fieldNamesMapping) {
  const parsedEntity = {};
  Object.keys(originalEntry).forEach(originalField => {
    const newFieldName = fieldNamesMapping[originalField];
    if (newFieldName) {
      parsedEntity[newFieldName] = originalEntry[originalField];
    }
  });
  return parsedEntity;
}

function combineByKey(mainEntity, mainEntityKey, joinEntity, joinEntityKey, fieldNamesMapping) {
  const joinEntityByKey = indexJoinEntityByKey(joinEntity, joinEntityKey);

  return mainEntity.map(mainEntry => {
    const joinKey = mainEntry[mainEntityKey];
    const joinEntry = joinEntityByKey[joinKey];
    return {
      ...mainEntry,
      ...parseEntryFields(joinEntry, fieldNamesMapping),
    };
  });
}

function combineMultipleByKey(
  mainEntity,
  mainEntityKey,
  joinEntity,
  joinEntityKey,
  joinFieldName,
  fieldNamesMapping
) {
  const joinEntityByKey = indexMultipleJoinEntityByKey(joinEntity, joinEntityKey);

  return mainEntity.map(entry => {
    const key = entry[mainEntityKey];
    const joinEntries = joinEntityByKey[key];

    return {
      ...entry,
      [joinFieldName]: joinEntries.map(joinEntry => parseEntryFields(joinEntry, fieldNamesMapping)),
    };
  });
}

exports.combineByKey = combineByKey;
exports.combineMultipleByKey = combineMultipleByKey;
