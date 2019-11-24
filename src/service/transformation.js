function indexJoinEntityByKey(joinEntity, joinEntityKey) {
  const joinEntityByKey = {};
  joinEntity.forEach(entry => {
    const key = entry[joinEntityKey];
    joinEntityByKey[key] = entry;
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

exports.combineByKey = combineByKey;
