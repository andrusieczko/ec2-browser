import dispatcher from 'dispatcher';
import AddRegion from 'components/AddRegion';
let classNames = require('classnames');

const remote = electronRequire('remote');
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

let Sidebar = React.createClass({
  contextMenu: null,

  getInitialState() {
    return {
      region: 'eu-west-1',
      regions: JSON.parse(window.localStorage.getItem('regions') || "[]")
    };
  },

  componentDidMount() {
    dispatcher.register('regionAdded', function(region) {
      this.state.regions.push(region);
      this.setState({
        regions: this.state.regions
      });
      window.localStorage.setItem('regions', JSON.stringify(this.state.regions));
    }.bind(this));
  },

  regionSelected(region) {
    this.setState({
      region: region
    });
    dispatcher.notifyAll('region', region);
  },

  removeRegion(region) {
    let index = this.state.regions.indexOf(region);
    this.state.regions.splice(index, 1);
    this.setState({
      regions: this.state.regions
    });
    window.localStorage.setItem('regions', JSON.stringify(this.state.regions));
  },

  isActive(region) {
    if (region === this.state.region) {
      return "active";
    };
    return "";
  },

  onContextMenu(region) {
    let component = this;
    var menu = new Menu();
    menu.append(new MenuItem({ label: 'Remove', click: function() {
      component.removeRegion(region);
    }}));
    menu.popup(remote.getCurrentWindow());
  },

  render() {
    let regions = this.state.regions.map(region => {
      return (
        <li key={region.key}
            className={classNames("list-group-item", "region", this.isActive(region.key))} 
            onContextMenu={this.onContextMenu.bind(this, region)}
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
          <AddRegion />
        </li>
        {regions}
      </ul>
    );
  }
});

export default Sidebar;