import dispatcher from 'dispatcher';
let classNames = require('classnames');

let Sidebar = React.createClass({
  regions: [{
    key: 'eu-west-1',
    name: "EU (Ireland)"
  }, {
    key: 'us-west-2',
    name: "US West (N. Carolina)"
  }],

  getInitialState: function() {
    return {
      region: 'eu-west-1'
    };
  },

  regionSelected: function(region) {
    this.setState({
      region: region
    });
    dispatcher.notifyAll('region', region);
  },

  isActive: function(region) {
    if (region === this.state.region) {
      return "active"
    };
    return "";
  },

  render: function() {
    let regions = this.regions.map((region) => {
      return (
        <li key={region.key} 
            className={classNames("list-group-item", this.isActive(region.key))} 
            onClick={this.regionSelected.bind(this, region.key)}>
          <img className="img-circle media-object pull-left" src="http://media.amazonwebservices.com/aws_singlebox_01.png" width="32" height="32" />
          <div className="media-body">
            <strong>{region.name}</strong>
            <p>0 running</p>
          </div>
        </li>
      );
    });
    return (
      <ul className="list-group">
        <li className="list-group-header">
          <h4>Regions</h4>
        </li>
        {regions}
      </ul>
    );
  }
});

export default Sidebar;