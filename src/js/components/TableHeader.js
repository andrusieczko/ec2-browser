let TableHeader = React.createClass({
  render: function() {
    let headers = this.props.columns.map((column, index) => {
      return (
        <th key={index}>{column.name}</th>
      );
    });
    return (
      <thead>
        <tr>
          {headers}
        </tr>
      </thead>
    );
  }
});

export default TableHeader;