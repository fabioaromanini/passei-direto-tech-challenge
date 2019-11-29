const AWS = require('aws-sdk');

const client = new AWS.IAM();

[
  {
    name: 'EMR_DefaultRole',
    service: 'elasticmapreduce.amazonaws.com',
    policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonElasticMapReduceRole',
  },
  {
    name: 'EMR_EC2_DefaultRole',
    service: 'ec2.amazonaws.com',
    policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonElasticMapReduceforEC2Role',
    instanceProfile: 'EMR_EC2_DefaultRole',
  },
].map(async role => {
  try {
    const a = await client.getRole({ RoleName: role.name }).promise();
    console.log(a);
  } catch (e) {
    console.log(`${role.name} not found. Creating...`);
    await client
      .createRole({
        AssumeRolePolicyDocument: JSON.stringify({
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Principal: {
                Service: role.service,
              },
              Effect: 'Allow',
              Sid: '',
            },
          ],
        }),
        RoleName: role.name,
      })
      .promise();
  }

  const response = await client.listAttachedRolePolicies({ RoleName: role.name }).promise();
  const attachedPolicies = response.AttachedPolicies.map(policy => policy.PolicyArn);
  if (!attachedPolicies.find(policy => policy === role.policyArn)) {
    console.log(attachedPolicies);
    console.log(`${role.policyArn} not found in attached policies for ${role.name}. Attaching...`);
    await client
      .attachRolePolicy({
        RoleName: role.name,
        PolicyArn: role.policyArn,
      })
      .promise();
  } else {
    console.debug(`${role.policyArn} found in attached policies for ${role.name}`);
  }

  if (role.instanceProfile) {
    try {
      console.log(
        await client
          .getInstanceProfile({
            InstanceProfileName: role.instanceProfile,
          })
          .promise()
      );
    } catch (e) {
      console.log(`Instance Profile ${role.instanceProfile} not found. Creating...`);
      await client.createInstanceProfile({ InstanceProfileName: role.instanceProfile }).promise();
      await client
        .addRoleToInstanceProfile({
          InstanceProfileName: role.instanceProfile,
          RoleName: role.name,
        })
        .promise();
    }
  }
});
