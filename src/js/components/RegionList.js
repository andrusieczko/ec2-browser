import dispatcher from 'dispatcher';
let classNames = require('classnames');

let RegionList = React.createClass({
  regionChosen: function(region) {
    dispatcher.notifyAll('regionAdded', region);
  },
  render: function() {
    let loading =  (
      <li>Loading</li>
    );
    let regions = this.props.regions.map((region) => {
      return (
        <li key={region.key}>
          <a onClick={this.regionChosen.bind(this, region)}>{region.name}</a>
        </li>
      );
    });

    let body = this.props.loading ? loading : regions;
    return (
      <ul className={classNames("regions-list", this.props.visible?'visible':'')}>
        {body}
      </ul>
    );
  }
});

export default RegionList;