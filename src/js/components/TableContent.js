let ec2Instances = require('../services/ec2').default;

let TableRow = require('./TableRow').default;

let TableContent = React.createClass({
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
      <tbody>
        {body}
      </tbody>
    );
  }
});

export default TableContent;