let TableRow = React.createClass({
  render: function() {
    let instance = this.props.instance;
    let columns = this.props.columns.map((column) => {
      let key = column.key;
      let value = (typeof key === "function") ? key(instance) : instance[key];

      return (
        <td key={value}>{value}</td>
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