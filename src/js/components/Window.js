import Sidebar from 'components/Sidebar';
import PageContent from 'components/PageContent'; 
import ec2 from 'services/ec2';

let Window = React.createClass({

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
      <div className="pane-group">
        <div className="pane-sm sidebar">
          <Sidebar />
        </div>
        <div className="pane">
          <select value={this.state.region} onChange={this.changeRegion}>
            <option value="us-west-2">us-west-2</option>
            <option value="eu-west-1">eu-west-1</option>
          </select>

          <PageContent region={this.state.region} loading={this.state.loading} data={this.state.data}/>
        </div>
      </div>
    );
  }
});

export default Window;