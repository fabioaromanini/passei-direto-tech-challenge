const sourceService = require('./service/source');
const transformationService = require('./service/transformation');
const datawarehouseService = require('./service/datawarehouse');

exports.extractTransform = async event => {
  const data = await sourceService.extract();
  console.log('Extracted data from source');

  const students = transformationService.denormalizeStudents(
    data.students,
    data.courses,
    data.universities
  );
  console.log('Finished students transformation');

  const follows = transformationService.denormalizeFollows(
    data.student_follow_subject,
    data.subjects
  );
  console.log('Finished follows transformation');

  const sessions = transformationService.parseSessions(data.sessions);
  console.log('Finished sessions transformation');

  const subscriptions = transformationService.parseSubscriptions(data.subscriptions);
  console.log('Finished subscriptions transformation');

  await datawarehouseService.load({
    sessions,
    subscriptions,
    students,
    follows,
  });
  console.log('Finished uploading files to datawarehouse');
};
