import Table from 'components/Table';
import ec2 from 'services/ec2';
import dispatcher from 'dispatcher';

let tag = function(tagName) {
  return function(instance) {
    return instance.tags.filter((tag) => {
      return tag.key === tagName;
    })[0].value;
  };
};

let Ec2Instances = React.createClass({
  columns: [
    {name: "Id", key: 'id'},
    {name: "Name", key: tag("Name")},
    {name: "Key name", key: 'keyName'},
    {name: "Instance type", key: 'instanceType'},
    {name: "Status", key: 'status'},
  ],

  getInitialState() {
    return {
      data: [],
      loading: true,
      region: 'eu-west-1'
    };
  },

  fetchInstances(region) {
    this.setState({
      loading: true
    });
    
    let component = this;
    ec2.fetchInstances(region).then(instances => {
      component.setState({
        data: instances,
        loading: false
      });
    });
  },

  componentDidMount() {
    this.fetchInstances(this.state.region);
    dispatcher.register('region', region => {
      this.fetchInstances(region);
    });
  },

  changeRegion(e) {
    let region = e.target.value;
    this.setState({
      region: region,
      loading: true
    });
    this.fetchInstances(region);
  },

  render() {
    return (
      <div>
        <Table columns={this.columns} data={this.state.data} loading={this.state.loading} />
      </div>
    );
  }
});

export default Ec2Instances;