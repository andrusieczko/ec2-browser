import Table from 'components/Table';
import ec2 from 'services/ec2';

let PageContent = React.createClass({
  columns: [
    {name: "Id", key: 'id'},
    {name: "Key name", key: 'keyName'},
    {name: "Instance type", key: 'instanceType'},
    {name: "Status", key: 'status'}
  ],
  getInitialState: function() {
    return {
      data: [],
      loading: true
    };
  },
  componentDidMount: function() {
    let component = this;
    ec2.fetchInstances().then((instances) => {
      component.setState({
        data: instances,
        loading: false
      });
    });
  },
  render: function() {
    return (
      <div>
        <Table columns={this.columns} data={this.state.data} loading={this.state.loading} />
      </div>
    );
  }
});

export default PageContent;