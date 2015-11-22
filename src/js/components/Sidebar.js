let Sidebar = React.createClass({
  render: function() {
    return (
      <ul className="list-group">
        <li className="list-group-header">
          <h4>Regions</h4>
        </li>
        <li className="list-group-item">
          <img className="img-circle media-object pull-left" src="http://media.amazonwebservices.com/aws_singlebox_01.png" width="32" height="32" />
          <div className="media-body">
            <strong>EU (Ireland)</strong>
            <p>0 running</p>
          </div>
        </li>
        <li className="list-group-item">
          <img className="img-circle media-object pull-left" src="http://media.amazonwebservices.com/aws_singlebox_01.png" width="32" height="32" />
          <div className="media-body">
            <strong>US West (N. Carolina)</strong>
            <p>2 running</p>
          </div>
        </li>
      </ul>
    );
  }
});

export default Sidebar;