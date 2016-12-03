let regionNames = {
  'us-east-1': "US East (N. Virginia)",
  'us-east-2': "US East (Ohio)",
  'us-west-1': "US West (N. California)",
  'us-west-2': "US West (Oregon)",
  'ap-south-1': "Asia Pacific (Mumbai)",
  'ap-northeast-2': "Asia Pacific (Seoul)",
  'ap-southeast-1': "Asia Pacific (Singapore)",
  'ap-southeast-2': "Asia Pacific (Sydney)",
  'ap-northeast-1': "Asia Pacific (Tokyo)",
  'eu-central-1': "EU (Frankfurt)",
  'eu-west-1': "EU (Ireland)",
  'sa-east-1': "South America (São Paulo)"
};

let serializeRegions = function(regions) {
  return regions.Regions.map(region => {
    let regionName = region.RegionName;
    return {
      key: regionName,
      name: regionNames[regionName] || regionName
    };
  });
};

export default serializeRegions;