let TableRow = React.createClass({
  render: function() {
    let instance = this.props.instance;
    let columns = this.props.columns.map((column) => {
      return (
        <td key={instance[column.key]}>{instance[column.key]}</td>
      );
    });
    return (
      <tr>
        {columns}
      </tr>
    );
  }
});

export default TableRow;