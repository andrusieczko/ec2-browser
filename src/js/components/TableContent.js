import ec2 from 'services/ec2';
import TableRow from 'components/TableRow';

let TableContent = React.createClass({
  render: function() {
    let instancesRows = this.props.data.map((instance) => {
      return (
        <TableRow key={instance.id} instance={instance} columns={this.props.columns} />
      );
    });
    let emptyRow = (
      <tr>
        <td colSpan="4">No results yet.</td>
      </tr>
    );
    let loading = (
      <tr>
        <td colSpan="4">Loading...</td>
      </tr>
    );
    let body = this.props.loading ? loading : instancesRows.length ? instancesRows : emptyRow;
    return (
      <tbody>
        {body}
      </tbody>
    );
  }
});

export default TableContent;
