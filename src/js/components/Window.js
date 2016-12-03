import Sidebar from 'components/Sidebar';
import PageContent from 'components/PageContent'; 

let Window = React.createClass({

  render() {
    return (
      <div className="pane-group">
        <div className="pane-sm sidebar">
          <Sidebar />
        </div>
        <div className="pane">
          <PageContent />
        </div>
      </div>
    );
  }
});

export default Window;