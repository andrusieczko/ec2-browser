"use strict";

let aws = require('./aws-config.json');

var AWS = require('aws-sdk'); 
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

let TableRow = React.createClass({
  render: function() {
    let instance = this.props.instance;
    return (
      <tr>
        <td>{instance.keyName}</td>
        <td>{instance.status}</td>
        <td>{instance.instanceType}</td>
      </tr>
    );
  }
});

let TableHeader = React.createClass({
  render: function() {
    return (
      <thead>
        <tr>
          <th>Key name</th>
          <th>Status</th>
          <th>Instance type</th>
        </tr>
      </thead>
    );
  }
});

let Table = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      loading: true
    };
  },

  componentDidMount: function() {
    let component = this;
    ec2Instances.fetchInstances().then((instances) => {
      component.setState({
        data: instances,
        loading: false
      });
    });
  },

  render: function() {
    let instancesRows = this.state.data.map((instance) => {
      return (
        <TableRow key={instance.id} instance={instance} />
      );
    });
    let emptyRow = (
      <tr>
        <td colSpan="4">No results yet.</td>
      </tr>
    );
    let loading = (
      <tr>
        <td colSpan="4">Loading...</td>
      </tr>
    );
    let body = this.state.loading ? loading : instancesRows.length ? instancesRows : emptyRow;
    return (
      <table>
        <TableHeader />
        <tbody>
          {body}
        </tbody>
      </table>
    );
  }
});

let Content = React.createClass({
  render: function() {
    return (
      <div>
        <Table />
      </div>
    );
  }
})

ReactDOM.render(
  <Content />,
  document.getElementById('content')
);