import promisifyMethods from 'utils/promisify';
import serializeRegions from 'services/ec2/regions';
import serializeInstances from 'services/ec2/instances';

let aws = electronRequire('./aws-config.json');
let AWS = electronRequire('aws-sdk'); 
AWS.config.update(aws);

let getEc2 = function(region='eu-west-1') {
  let ec2 = new AWS.EC2({region: region});
  return promisifyMethods(ec2, ['describeInstances', 'describeRegions']);
};

let ec2Instances = {
  fetchInstances(region) {
    let ec2 = getEc2(region);
    return ec2.describeInstances()
      .then(serializeInstances)
      .catch((err) => console.error("Error in fetching instances!", err));
  },

  fetchRegions() {
    let ec2 = getEc2();
    return ec2.describeRegions()
      .then(serializeRegions)
      .catch((err) => console.error("Error in fetching regions!", err));
  }
};

export default ec2Instances;