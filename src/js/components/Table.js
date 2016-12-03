import TableHeader from 'components/TableHeader';
import TableContent from 'components/TableContent';

let Table = React.createClass({
  render() {
    return (
      <table>
        <TableHeader columns={this.props.columns} />
        <TableContent data={this.props.data} 
                      columns={this.props.columns}
                      loading={this.props.loading}/>
      </table>
    );
  }
});

export default Table;