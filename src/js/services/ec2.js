let aws = electronRequire('./aws-config.json');

var AWS = electronRequire('aws-sdk'); 
AWS.config.update(aws);

let ec2Instances = {
  fetchInstances: function(region='eu-west-1') {
    return new Promise(function(resolve) {
      var ec2 = new AWS.EC2({region: region}); 
      ec2.describeInstances(function(err, data) {
        console.log(data);
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