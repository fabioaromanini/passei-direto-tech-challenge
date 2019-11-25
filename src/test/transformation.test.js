const transformationService = require('../service/transformation');

const subjects = require('./data/inputs/subjects.json');
const student_follow_subject = require('./data/inputs/student_follow_subject.json');
const students = require('./data/inputs/students.json');
const universities = require('./data/inputs/universities.json');
const courses = require('./data/inputs/courses.json');
const sessions = require('./data/inputs/sessions.json');
const subscriptions = require('./data/inputs/subscriptions.json');

const denormalizedStudents = require('./data/outputs/denormalizedStudents.json');
const denormalizedFollows = require('./data/outputs/denormalizedFollows.json');
const joinedCourse = require('./data/outputs/joinedCourse.json');
const joinedFollows = require('./data/outputs/joinedFollows.json');
const parsedSubscriptions = require('./data/outputs/parsedSubscriptions.json');
const parsedSessions = require('./data/outputs/parsedSessions.json');

describe('Joins', () => {
  test('Join By Key', () => {
    expect(
      transformationService.joinByKey(student_follow_subject, 'SubjectId', subjects, 'Id')
    ).toEqual(joinedFollows);
  });

  test('Join By Key With Missing Join Entry', () => {
    expect(transformationService.joinByKey(students, 'CourseId', courses, 'Id')).toEqual(
      joinedCourse
    );
  });
});

describe('Transformations', () => {
  test('Denormalize students', () => {
    expect(transformationService.denormalizeStudents(students, courses, universities)).toEqual(
      denormalizedStudents
    );
  });

  test('Denormalize Follows', () => {
    expect(transformationService.denormalizeFollows(student_follow_subject, subjects)).toEqual(
      denormalizedFollows
    );
  });

  test('Parse Subscriptions', () => {
    expect(transformationService.parseSubscriptions(subscriptions)).toEqual(parsedSubscriptions);
  });

  test('Parse Sessions', () => {
    expect(transformationService.parseSessions(sessions)).toEqual(parsedSessions);
  });
});
