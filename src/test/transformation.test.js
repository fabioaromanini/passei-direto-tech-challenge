const transformationService = require('../service/transformation');

const input = require('./data/inputs/transformationService.json');
const combinedCourse = require('./data/outputs/combinedCourse.json');
const combinedSubscriptions = require('./data/outputs/combinedSubscriptions.json');

describe('Single Field Transformations', () => {
  test('Combine By Key', () => {
    const { students: mainEntity, courses: joinEntity } = input;

    const result = transformationService.combineByKey(mainEntity, 'CourseId', joinEntity, 'Id', {
      Name: 'CourseName',
    });

    expect(result).toEqual(combinedCourse);
  });

  test('Combine Multiple By Key', () => {
    const { students: mainEntity, courses: joinEntity } = input;

    const result = transformationService.combineMultipleByKey(
      mainEntity,
      'Id',
      joinEntity,
      'StudentId',
      {
        PaymentDate: 'Date',
        PlanType: 'Type',
      }
    );

    expect(result).toEqual(combinedCourse);
  });
});
