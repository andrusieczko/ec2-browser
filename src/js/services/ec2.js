let aws = electronRequire('./aws-config.json');

var AWS = electronRequire('aws-sdk'); 
AWS.config.update(aws);
var ec2 = new AWS.EC2({region: 'eu-west-1'}); 

let ec2Instances = {
  fetchInstances: function() {
    return new Promise(function(resolve) {
      ec2.describeInstances(function(err, data) {
        let instances = data.Reservations.map((instanceObject) => {
          let instance = instanceObject.Instances[0];
          return {
            status: instance.State.Name,
            instanceType: instance.InstanceType,
            keyName: instance.KeyName,
            tags: instance.Tags.map((tag) => {
              return {
                key: tag.Key,
                value: tag.Value
              };
            }),
            publicIpAddress: instance.PublicIpAddress,
            id: instance.InstanceId
          }
        });
        resolve(instances);
      });
    });
  }
};

export default ec2Instances;