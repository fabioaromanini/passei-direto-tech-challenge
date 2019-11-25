const sourceService = require('./service/source');
const transformationService = require('./service/transformation');

exports.extractTransform = async event => {
  console.log('Hello, world with Circle-ci and deploys happening only on master:D');
  const data = await sourceService.extract();
  const outputs = {
    students: transformationService.denormalizeStudents(
      data.students,
      data.courses,
      data.universities
    ),
    follows: transformationService.denormalizeFollows(data.student_follow_subject, data.subjects),
  };

  console.log(outputs.follows[0]);
  console.log(outputs.students[0]);
};
