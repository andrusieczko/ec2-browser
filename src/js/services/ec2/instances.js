let serializeInstances = function(instances) {
  return instances.Reservations.map(instanceObject => {
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
};

export default serializeInstances;