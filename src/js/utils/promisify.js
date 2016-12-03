let promisifyMethods = function(object, methodNames) {
  return methodNames.reduce((promisified, methodName) => {
    promisified[methodName] = function() {
      return new Promise((resolve, reject) => {
        object[methodName]((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        })
      });
    };
    return promisified;
  }, {});
};

export default promisifyMethods;