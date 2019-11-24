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

function combineByKey(mainEntity, mainEntityKey, joinEntity, joinEntityKey, fieldNamesMapping) {
  const joinEntityByKey = indexJoinEntityByKey(joinEntity, joinEntityKey);

  return mainEntity.map(entry => {
    const key = entry[mainEntityKey];
    const joinEntry = joinEntityByKey[key];

    const result = { ...entry };
    Object.keys(joinEntry).forEach(originalField => {
      const newFieldName = fieldNamesMapping[originalField];
      if (newFieldName) {
        result[newFieldName] = joinEntry[originalField];
      }
    });

    return result;
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

    const result = { ...entry };

    result[joinFieldName] = joinEntries.map(joinEntry => {
      const joinEntryResult = {};
      Object.keys(joinEntry).forEach(originalField => {
        const newFieldName = fieldNamesMapping[originalField];
        if (newFieldName) {
          joinEntryResult[newFieldName] = joinEntry[originalField];
        }
      });
      return joinEntryResult;
    });

    return result;
  });
}

exports.combineByKey = combineByKey;
exports.combineMultipleByKey = combineMultipleByKey;
