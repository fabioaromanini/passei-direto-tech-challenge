const transformationService = require('../service/transformation');

const input = require('./data/inputs/transformationService.json');
const joinedCourse = require('./data/outputs/joinedCourse.json');
const denormalizedStudents = require('./data/outputs/denormalizedStudents.json');

describe('Joins', () => {
  test('Join By Key', () => {
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
