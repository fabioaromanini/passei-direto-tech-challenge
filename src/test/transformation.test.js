const transformationService = require('../service/transformation');

const input = require('./data/inputs/transformationService.json');
const denormalizedStudents = require('./data/outputs/denormalizedStudents.json');
const joinedCourse = require('./data/outputs/joinedCourse.json');
const joinedFollows = require('./data/outputs/joinedFollows.json');

describe('Joins', () => {
  test('Join By Key', () => {
    const { student_follow_subject: mainEntity, subjects: joinEntity } = input;

    const result = transformationService.joinByKey(mainEntity, 'SubjectId', joinEntity, 'Id');

    expect(result).toEqual(joinedFollows);
  });

  test('Join By Key With Missing Join Entry', () => {
    const { students: mainEntity, courses: joinEntity } = input;

    const result = transformationService.joinByKey(mainEntity, 'CourseId', joinEntity, 'Id');

    expect(result).toEqual(joinedCourse);
  });
});

describe('Transformations', () => {
  test('Denormalize students', () => {
    const { students, courses, universities } = input;
    const result = transformationService.denormalizeStudents(students, courses, universities);
    expect(result).toEqual(denormalizedStudents);
  });
});
