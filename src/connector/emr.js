const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const client = new AWS.EMR();

const { SPARK_JOBS_BUCKET, CLUSTER_SERVICE_ROLE, INSTANCE_PROFILE_ROLE } = process.env;

function runJob() {
  console.debug(`Starting allTransformations jobs`);
  return client
    .runJobFlow({
      Instances: {
        InstanceGroups: [
          {
            Name: 'Master nodes',
            Market: 'ON_DEMAND',
            InstanceRole: 'MASTER',
            InstanceType: 'm5.xlarge',
            InstanceCount: 1,
          },
        ],
        KeepJobFlowAliveWhenNoSteps: false,
        TerminationProtected: false,
      },
      Name: `allTransformations-${new Date().toISOString()}`,
      ReleaseLabel: 'emr-5.28.0',
      ServiceRole: 'EMR_DefaultRole',
      JobFlowRole: 'EMR_EC2_DefaultRole',
      VisibleToAllUsers: true,
      Applications: [
        {
          Name: 'spark',
        },
      ],
      LogUri: `s3://${SPARK_JOBS_BUCKET}/logs/`,
      Steps: [
        {
          Name: 'setup-debugging',
          ActionOnFailure: 'TERMINATE_CLUSTER',
          HadoopJarStep: {
            Jar: `command-runner.jar`,
            Args: ['state-pusher-script'],
          },
        },
        {
          Name: 'spark-submit',
          ActionOnFailure: 'TERMINATE_CLUSTER',
          HadoopJarStep: {
            Jar: `command-runner.jar`,
            Args: [
              'spark-submit',
              '--deploy-mode',
              'cluster',
              `s3://${SPARK_JOBS_BUCKET}/allTransformations.py`,
            ],
          },
        },
      ],
    })
    .promise();
}

exports.runJob = runJob;
