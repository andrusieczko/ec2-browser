import TableHeader from 'components/TableHeader';
import TableContent from 'components/TableContent';

let Table = React.createClass({
  render: function() {
    return (
      <table>
        <TableHeader />
        <TableContent />
      </table>
    );
  }
});

export default Table;