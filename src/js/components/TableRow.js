let TableRow = React.createClass({
  render: function() {
    let instance = this.props.instance;
    return (
      <tr>
        <td>{instance.keyName}</td>
        <td>{instance.status}</td>
        <td>{instance.instanceType}</td>
      </tr>
    );
  }
});

export default TableRow;