import RegionList from 'components/RegionList';
import ec2 from 'services/ec2';
import dispatcher from 'dispatcher';

let AddRegion = React.createClass({
  getInitialState() {
    return {
      listVisible: false,
      data: [],
      loading: false
    };
  },

  componentDidMount() {
    dispatcher.register('regionAdded', region => {
      this.setState({
        loading: false,
        listVisible: false
      });
    });
  },

  addRegion(e) {
    if (this.state.data.length) {
      this.setState({
        listVisible: true
      });
    } else {
      this.setState({
        loading: true,
        listVisible: true
      });
      ec2.fetchRegions().then(regions => {
        this.setState({
          listVisible: true,
          data: regions,
          loading: false
        });
      });
    }
  },

  render() {
    return (
      <span>
        <span className="add-button" onClick={this.addRegion}>+</span>
        <RegionList visible={this.state.listVisible} regions={this.state.data} loading={this.state.loading} />
      </span>
    );
  }
});

export default AddRegion;