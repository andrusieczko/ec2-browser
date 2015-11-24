import RegionList from 'components/RegionList';
import ec2 from 'services/ec2';
import dispatcher from 'dispatcher';

let AddRegion = React.createClass({
  getInitialState: function() {
    return {
      listVisible: false,
      data: [],
      loading: false
    };
  },

  componentDidMount: function() {
    dispatcher.register('regionAdded', function(region) {
      this.setState({
        loading: false,
        listVisible: false
      });
    }.bind(this));
  },

  addRegion: function(e) {
    if (this.state.data.length) {
      this.setState({
        listVisible: true
      });
    } else {
      let component = this;
      this.setState({
        loading: true,
        listVisible: true
      });
      ec2.fetchRegions().then(function(regions) {
        component.setState({
          listVisible: true,
          data: regions,
          loading: false
        });
      });
    }
  },

  render: function() {
    return (
      <span>
        <span className="add-button" onClick={this.addRegion}>+</span>
        <RegionList visible={this.state.listVisible} regions={this.state.data} loading={this.state.loading} />
      </span>
    );
  }
});

export default AddRegion;