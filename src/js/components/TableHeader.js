let TableHeader = React.createClass({
  render: function() {
    return (
      <thead>
        <tr>
          <th>Key name</th>
          <th>Status</th>
          <th>Instance type</th>
        </tr>
      </thead>
    );
  }
});

export default TableHeader;