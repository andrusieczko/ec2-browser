import Table from 'components/Table';

let tag = function(tagName) {
  return function(instance) {
    return instance.tags.filter((tag) => {
      return tag.key === tagName;
    })[0].value;
  };
};

let PageContent = React.createClass({
  columns: [
    {name: "Id", key: 'id'},
    {name: "Name", key: tag("Name")},
    {name: "Key name", key: 'keyName'},
    {name: "Instance type", key: 'instanceType'},
    {name: "Status", key: 'status'},
  ],

  render: function() {
    return (
      <div>
        <Table columns={this.columns} data={this.props.data} loading={this.props.loading} />
      </div>
    );
  }
});

export default PageContent;