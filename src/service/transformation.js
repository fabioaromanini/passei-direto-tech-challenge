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
  console.debug(
    `Denormalized ${students.length} students, ${courses.length} courses and ${universities.length} universities`
  );

  return denormalizedStudents.map(entry => {
    const { CourseId, UniversityId, RegisteredDate, ...filteredEntry } = entry;
    return { ...filteredEntry, Date: RegisteredDate };
  });
}

function denormalizeFollows(follows, subjects) {
  const joinedFollows = joinByKey(follows, 'SubjectId', subjects, 'Id');
  console.debug(`Denormalized ${follows.length} follows and ${subjects.length} subjects`);
  return joinedFollows.map(entry => {
    const { FollowDate, Name, SubjectId, ...filteredEntry } = entry;
    return { ...filteredEntry, Subject: Name, Date: FollowDate };
  });
}

function parseSubscriptions(subscriptions) {
  console.debug(`Parsing ${subscriptions.length} subscriptions`);
  return subscriptions.map(entry => ({
    Date: entry.PaymentDate,
    Type: entry.PlanType,
    StudentId: entry.StudentId,
  }));
}

function parseSessions(sessions) {
  console.debug(`Parsing ${sessions.length} sessions`);
  return sessions.map(entry => ({
    Client: entry.StudentClient,
    StartTime: entry.SessionStartTime,
    StudentId: entry.StudentId,
  }));
}

function transform(data) {
  return {
    students: denormalizeStudents(data.students, data.courses, data.universities),
    follows: denormalizeFollows(data.student_follow_subject, data.subjects),
    sessions: parseSessions(data.sessions),
    subscriptions: parseSubscriptions(data.subscriptions),
  };
}

exports.joinByKey = joinByKey;
exports.denormalizeStudents = denormalizeStudents;
exports.denormalizeFollows = denormalizeFollows;
exports.parseSubscriptions = parseSubscriptions;
exports.parseSessions = parseSessions;
exports.transform = transform;
