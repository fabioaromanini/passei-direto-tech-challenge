function indexEntityByKey(entity, keyName) {
  const entityByKey = {};
  entity.forEach(entry => {
    const key = entry[keyName];
    entityByKey[key] = entry;
  });

  return entityByKey;
}

function joinByKey(mainEntity, mainEntityKey, joinEntity, joinEntityKey) {
  const joinEntityByKey = indexEntityByKey(joinEntity, joinEntityKey);

  return mainEntity.map(mainEntry => {
    const joinKey = mainEntry[mainEntityKey];
    const joinEntry = joinEntityByKey[joinKey] || {};
    const { [joinEntityKey]: ignoredKey, ...joinEntryWithoutKey } = joinEntry;
    return {
      ...mainEntry,
      ...joinEntryWithoutKey,
    };
  });
}

function denormalizeStudents(students, courses, universities) {
  const parsedCourses = courses.map(course => ({
    Id: course.Id,
    Course: course.Name,
  }));
  const parsedUniversities = universities.map(university => ({
    Id: university.Id,
    University: university.Name,
  }));

  const studentsCoursesJoined = joinByKey(students, 'CourseId', parsedCourses, 'Id');
  const denormalizedStudents = joinByKey(
    studentsCoursesJoined,
    'UniversityId',
    parsedUniversities,
    'Id'
  );

  return denormalizedStudents.map(entry => {
    const { CourseId, UniversityId, ...filteredEntry } = entry;
    return filteredEntry;
  });
}

function denormalizeFollows(follows, subjects) {
  return [];
}

exports.joinByKey = joinByKey;
exports.denormalizeStudents = denormalizeStudents;
exports.denormalizeFollows = denormalizeFollows;
