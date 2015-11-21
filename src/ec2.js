"use strict";

let aws = require('./aws-config.json');

var $ = require('jquery');
var AWS = require('aws-sdk'); 
AWS.config.update(aws);
var ec2 = new AWS.EC2({region: 'eu-west-1'}); 

let Table = React.createClass({
  render: function() {
    let instancesRows = this.props.data.map((instance) => {
      let {status, instanceType, keyName} = instance;
      return (
        <tr>
          <td>{status}</td>
          <td>{instanceType}</td>
          <td>{keyName}</td>
        </tr>
      );
    });
    return (
      <table>
        <tbody>
          {instancesRows}
        </tbody>
      </table>
    );
  }
});

ec2.describeInstances(function(err, data) {
  let instances = data.Reservations.map((instanceObject) => {
    let instance = instanceObject.Instances[0];
    return {
      status: instance.State.Name,
      instanceType: instance.InstanceType,
      keyName: instance.KeyName,
      tags: instance.Tags.map((tag) => { return {key: tag.Key, value: tag.Value}; }),
      publicIpAddress: instance.PublicIpAddress
    }
  });

  ReactDOM.render(
    <Table data={instances} />,
    document.getElementById('content')
  );
});