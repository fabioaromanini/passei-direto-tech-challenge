const sourceData = [
  'courses',
  'sessions',
  'student_follow_subject',
  'students',
  'subjects',
  'subscriptions',
  'universities',
];

async function extract() {
  sourceData.forEach(sourceDataName => console.log(sourceDataName));
}

exports.extract = extract;
