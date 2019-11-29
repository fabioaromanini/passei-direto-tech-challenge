exports.getKeyFromS3Event = function(event) {
  console.debug(JSON.stringify(event, null, 2));
  return event.Records[0].s3.object.key;
};
