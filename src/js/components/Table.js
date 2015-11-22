let TableHeader = require('./TableHeader').default;
let TableContent = require('./TableContent').default;

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