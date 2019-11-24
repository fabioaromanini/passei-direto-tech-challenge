const transformationService = require('../service/transformation');

const input = require('./data/inputs/transformationService.json');
const joinedCourse = require('./data/outputs/joinedCourse.json');
const joinedSubscriptions = require('./data/outputs/joinedSubscriptions.json');

describe('Joins', () => {
  test('Join By Key', () => {
    const { students: mainEntity, courses: joinEntity } = input;

    const result = transformationService.joinByKey(mainEntity, 'CourseId', joinEntity, 'Id', {
      Name: 'CourseName',
    });

    expect(result).toEqual(joinedCourse);
  });

  test('Join Multiple By Key', () => {
    const { students: mainEntity, subscriptions: joinEntity } = input;

    const result = transformationService.joinMultipleByKey(
      mainEntity,
      'Id',
      joinEntity,
      'StudentId',
      'Subscriptions',
      {
        PaymentDate: 'Date',
        PlanType: 'Type',
      }
    );

    expect(result).toEqual(joinedSubscriptions);
  });
});
