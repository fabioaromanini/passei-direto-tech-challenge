const sourceService = require('./service/source');
const transformationService = require('./service/transformation');
const datawarehouseService = require('./service/datawarehouse');

exports.extractTransformLoad = async event => {
  const data = await sourceService.extract();
  console.log('Extracted data from source');

  const students = transformationService.denormalizeStudents(
    data.students,
    data.courses,
    data.universities
  );
  const follows = transformationService.denormalizeFollows(
    data.student_follow_subject,
    data.subjects
  );
  const sessions = transformationService.parseSessions(data.sessions);
  const subscriptions = transformationService.parseSubscriptions(data.subscriptions);
  console.log('Finished transformations');

  await datawarehouseService.load({
    sessions,
    subscriptions,
    students,
    follows,
  });
  console.log('Finished uploading files to datawarehouse');

  await datawarehouseService.refreshTables();
  console.log('Crawler triggered');
};
