const fs = require('fs');
const AWS = require('aws-sdk');

const s3Client = new AWS.S3();

fs.readdir('src/spark-jobs', async (error, files) => {
  if (error) {
    console.error(error);
  } else {
    console.log(files);
  }
});
