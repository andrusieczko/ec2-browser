let aws = electronRequire('./aws-config.json');

let AWS = electronRequire('aws-sdk'); 
AWS.config.update(aws);

let getEc2 = function(region='eu-west-1') {
  return new AWS.EC2({region: region});
};

let regionNames = {
  'us-east-1': "US East (N. Virginia)",
  'us-west-2': "US West (Oregon)",
  'us-west-1': "US West (N. California)",
  'eu-west-1': "EU (Ireland)",
  'eu-central-1': "EU (Frankfurt)",
  'ap-southeast-1': "Asia Pacific (Singapore)",
  'ap-northeast-1': "Asia Pacific (Tokyo)",
  'ap-southeast-2': "Asia Pacific (Sydney)",
  'sa-east-1': "South America (São Paulo)"
};

let ec2Instances = {
  fetchInstances: function(region) {
    return new Promise(function(resolve) {
      let ec2 = getEc2(region);
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
          };
        });
        resolve(instances);
      });
    });
  },

  fetchRegions: function() {
    return new Promise(function(resolve) {
      let ec2 = getEc2();
      ec2.describeRegions(function(err, data) {

        let regions = data.Regions.map(function(region) {
          let regionName = region.RegionName;
          return {
            key: regionName,
            name: regionNames[regionName] || regionName
          };
        });

        resolve(regions);
      });
    });
  }
};

export default ec2Instances;