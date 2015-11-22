import Ec2Instances from 'components/Ec2Instances';

let PageContent = React.createClass({
  render: function() {
    return (
      <div>
        <Ec2Instances />
      </div>
    );
  }
});

export default PageContent;