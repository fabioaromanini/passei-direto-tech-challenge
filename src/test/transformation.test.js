const transformationService = require('../service/transformation');

const input = require('./data/inputs/transformationService.json');
const joinedCourse = require('./data/outputs/joinedCourse.json');
const joinedSubscriptions = require('./data/outputs/joinedSubscriptions.json');
const parsedSubscription = require('./data/outputs/parsedSubscription.json');

describe('Joins', () => {
  beforeAll(() => {
    const { courses, subscriptions } = input;

    input.parsedCourse = transformationService.parse(courses, {
      Name: 'CourseName',
    });
  });

  test('Join By Key', () => {
    const { students: mainEntity, parsedCourse: joinEntity } = input;

    const result = transformationService.joinByKey(mainEntity, 'CourseId', joinEntity, 'Id');

    expect(result).toEqual(joinedCourse);
  });
});

describe('Joins', () => {
  test('Parse', () => {
    const result = transformationService.parse(input.subscriptions, {
      PlanType: 'Type',
      PaymentDate: 'Date',
    });

    expect(result).toEqual(parsedSubscription);
  });
});
