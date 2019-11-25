const sourceService = require('./service/source');
const transformationService = require('./service/transformation');

exports.extractTransform = async event => {
  const data = await sourceService.extract();
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
};
