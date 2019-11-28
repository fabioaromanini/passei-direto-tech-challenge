const fs = require('fs');
const AWS = require('aws-sdk');

const { SPARK_JOBS_BUCKET } = process.env;
const bucketName = process.argv[2];

const client = new AWS.S3();

const baseDir = 'src/spark-jobs/';

fs.readdir(baseDir, async (error, files) => {
  if (error) {
    console.error(error);
  } else {
    await Promise.all(
      files.map(filename =>
        client
          .upload({
            Bucket: bucketName,
            Key: filename,
            Body: fs.readFileSync(baseDir + filename),
          })
          .promise()
      )
    );
    console.log(`spark jobs succesfully updated to ${bucketName}`);
  }
});
