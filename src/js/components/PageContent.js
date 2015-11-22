import Table from 'components/Table';
import ec2 from 'services/ec2';

let tag = function(tagName) {
  return function(instance) {
    return instance.tags.filter((tag) => {
      return tag.key === tagName;
    })[0].value;
  };
};

let PageContent = React.createClass({
  columns: [
    {name: "Id", key: 'id'},
    {name: "Name", key: tag("Name")},
    {name: "Key name", key: 'keyName'},
    {name: "Instance type", key: 'instanceType'},
    {name: "Status", key: 'status'},
  ],
  getInitialState: function() {
    return {
      data: [],
      loading: true,
      region: 'eu-west-1'
    };
  },

  fetchInstances: function(region) {
    let component = this;
    ec2.fetchInstances(region).then((instances) => {
      component.setState({
        data: instances,
        loading: false
      });
    });
  },

  componentDidMount: function() {
    this.fetchInstances(this.state.region);
  },

  changeRegion: function(e) {
    let region = e.target.value
    this.setState({
      region: region,
      loading: true
    });
    this.fetchInstances(region);
  },

  render: function() {
    return (
      <div>
        <select value={this.state.region} onChange={this.changeRegion}>
          <option value="us-west-2">us-west-2</option>
          <option value="eu-west-1">eu-west-1</option>
        </select>
        <Table columns={this.columns} data={this.state.data} loading={this.state.loading} />
      </div>
    );
  }
});

export default PageContent;