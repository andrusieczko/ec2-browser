(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/karol/workspace/karol/ec2-browser/node_modules/classnames/index.js":[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/AddRegion.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RegionList = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/RegionList');

var _RegionList2 = _interopRequireDefault(_RegionList);

var _ec = require('/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2');

var _ec2 = _interopRequireDefault(_ec);

var _dispatcher = require('/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AddRegion = React.createClass({
  displayName: 'AddRegion',

  getInitialState: function getInitialState() {
    return {
      listVisible: false,
      data: [],
      loading: false
    };
  },

  componentDidMount: function componentDidMount() {
    _dispatcher2.default.register('regionAdded', (function (region) {
      this.setState({
        loading: false,
        listVisible: false
      });
    }).bind(this));
  },

  addRegion: function addRegion(e) {
    var _this = this;

    if (this.state.data.length) {
      this.setState({
        listVisible: true
      });
    } else {
      (function () {
        var component = _this;
        _this.setState({
          loading: true,
          listVisible: true
        });
        _ec2.default.fetchRegions().then(function (regions) {
          component.setState({
            listVisible: true,
            data: regions,
            loading: false
          });
        });
      })();
    }
  },

  render: function render() {
    return React.createElement(
      'span',
      null,
      React.createElement(
        'span',
        { className: 'add-button', onClick: this.addRegion },
        '+'
      ),
      React.createElement(_RegionList2.default, { visible: this.state.listVisible, regions: this.state.data, loading: this.state.loading })
    );
  }
});

exports.default = AddRegion;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/RegionList":"/Users/karol/workspace/karol/ec2-browser/src/js/components/RegionList.js","/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher":"/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher.js","/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2":"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/Ec2Instances.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Table = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/Table');

var _Table2 = _interopRequireDefault(_Table);

var _ec = require('/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2');

var _ec2 = _interopRequireDefault(_ec);

var _dispatcher = require('/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tag = function tag(tagName) {
  return function (instance) {
    return instance.tags.filter(function (tag) {
      return tag.key === tagName;
    })[0].value;
  };
};

var Ec2Instances = React.createClass({
  displayName: 'Ec2Instances',

  columns: [{ name: "Id", key: 'id' }, { name: "Name", key: tag("Name") }, { name: "Key name", key: 'keyName' }, { name: "Instance type", key: 'instanceType' }, { name: "Status", key: 'status' }],

  getInitialState: function getInitialState() {
    return {
      data: [],
      loading: true,
      region: 'eu-west-1'
    };
  },

  fetchInstances: function fetchInstances(region) {
    this.setState({
      loading: true
    });

    var component = this;
    _ec2.default.fetchInstances(region).then(function (instances) {
      component.setState({
        data: instances,
        loading: false
      });
    });
  },

  componentDidMount: function componentDidMount() {
    this.fetchInstances(this.state.region);
    _dispatcher2.default.register('region', (function (region) {
      this.fetchInstances(region);
    }).bind(this));
  },

  changeRegion: function changeRegion(e) {
    var region = e.target.value;
    this.setState({
      region: region,
      loading: true
    });
    this.fetchInstances(region);
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(_Table2.default, { columns: this.columns, data: this.state.data, loading: this.state.loading })
    );
  }
});

exports.default = Ec2Instances;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/Table":"/Users/karol/workspace/karol/ec2-browser/src/js/components/Table.js","/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher":"/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher.js","/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2":"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/PageContent.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Ec2Instances = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/Ec2Instances');

var _Ec2Instances2 = _interopRequireDefault(_Ec2Instances);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageContent = React.createClass({
  displayName: 'PageContent',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(_Ec2Instances2.default, null)
    );
  }
});

exports.default = PageContent;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/Ec2Instances":"/Users/karol/workspace/karol/ec2-browser/src/js/components/Ec2Instances.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/RegionList.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dispatcher = require('/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = require('classnames');

var RegionList = React.createClass({
  displayName: 'RegionList',

  regionChosen: function regionChosen(region) {
    _dispatcher2.default.notifyAll('regionAdded', region);
  },
  render: function render() {
    var _this = this;

    var loading = React.createElement(
      'li',
      null,
      'Loading'
    );
    var regions = this.props.regions.map(function (region) {
      return React.createElement(
        'li',
        { key: region.key },
        React.createElement(
          'a',
          { onClick: _this.regionChosen.bind(_this, region) },
          region.name
        )
      );
    });

    var body = this.props.loading ? loading : regions;
    return React.createElement(
      'ul',
      { className: classNames("regions-list", this.props.visible ? 'visible' : '') },
      body
    );
  }
});

exports.default = RegionList;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher":"/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher.js","classnames":"/Users/karol/workspace/karol/ec2-browser/node_modules/classnames/index.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/Sidebar.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dispatcher = require('/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _AddRegion = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/AddRegion');

var _AddRegion2 = _interopRequireDefault(_AddRegion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = require('classnames');

var remote = electronRequire('electron').remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  contextMenu: null,

  getInitialState: function getInitialState() {
    return {
      region: 'eu-west-1',
      regions: JSON.parse(window.localStorage.getItem('regions') || "[]")
    };
  },

  componentDidMount: function componentDidMount() {
    _dispatcher2.default.register('regionAdded', (function (region) {
      this.state.regions.push(region);
      this.setState({
        regions: this.state.regions
      });
      window.localStorage.setItem('regions', JSON.stringify(this.state.regions));
    }).bind(this));
  },

  regionSelected: function regionSelected(region) {
    this.setState({
      region: region
    });
    _dispatcher2.default.notifyAll('region', region);
  },

  removeRegion: function removeRegion(region) {
    var index = this.state.regions.indexOf(region);
    this.state.regions.splice(index, 1);
    this.setState({
      regions: this.state.regions
    });
    window.localStorage.setItem('regions', JSON.stringify(this.state.regions));
  },

  isActive: function isActive(region) {
    if (region === this.state.region) {
      return "active";
    };
    return "";
  },

  onContextMenu: function onContextMenu(region) {
    var component = this;
    var menu = new Menu();
    menu.append(new MenuItem({ label: 'Remove', click: function click() {
        component.removeRegion(region);
      } }));
    menu.popup(remote.getCurrentWindow());
  },

  render: function render() {
    var _this = this;

    var regions = this.state.regions.map(function (region) {
      return React.createElement(
        'li',
        { key: region.key,
          className: classNames("list-group-item", "region", _this.isActive(region.key)),
          onContextMenu: _this.onContextMenu.bind(_this, region),
          onClick: _this.regionSelected.bind(_this, region.key) },
        React.createElement('img', { className: 'img-circle media-object pull-left', src: 'http://media.amazonwebservices.com/aws_singlebox_01.png', width: '32', height: '32' }),
        React.createElement(
          'div',
          { className: 'media-body' },
          React.createElement(
            'strong',
            null,
            region.name
          ),
          React.createElement(
            'p',
            null,
            '0 running'
          )
        )
      );
    });
    return React.createElement(
      'ul',
      { className: 'list-group' },
      React.createElement(
        'li',
        { className: 'list-group-header' },
        React.createElement(
          'h4',
          null,
          'Regions'
        ),
        React.createElement(_AddRegion2.default, null)
      ),
      regions
    );
  }
});

exports.default = Sidebar;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/AddRegion":"/Users/karol/workspace/karol/ec2-browser/src/js/components/AddRegion.js","/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher":"/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher.js","classnames":"/Users/karol/workspace/karol/ec2-browser/node_modules/classnames/index.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/Table.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TableHeader = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableContent = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/TableContent');

var _TableContent2 = _interopRequireDefault(_TableContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Table = React.createClass({
  displayName: 'Table',

  render: function render() {
    return React.createElement(
      'table',
      null,
      React.createElement(_TableHeader2.default, { columns: this.props.columns }),
      React.createElement(_TableContent2.default, { data: this.props.data,
        columns: this.props.columns,
        loading: this.props.loading })
    );
  }
});

exports.default = Table;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableContent":"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableContent.js","/Users/karol/workspace/karol/ec2-browser/src/js/components/TableHeader":"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableHeader.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableContent.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ec = require('/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2');

var _ec2 = _interopRequireDefault(_ec);

var _TableRow = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableContent = React.createClass({
  displayName: 'TableContent',

  render: function render() {
    var _this = this;

    var instancesRows = this.props.data.map(function (instance) {
      return React.createElement(_TableRow2.default, { key: instance.id, instance: instance, columns: _this.props.columns });
    });
    var emptyRow = React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        { colSpan: '4' },
        'No results yet.'
      )
    );
    var loading = React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        { colSpan: '4' },
        'Loading...'
      )
    );
    var body = this.props.loading ? loading : instancesRows.length ? instancesRows : emptyRow;
    return React.createElement(
      'tbody',
      null,
      body
    );
  }
});

exports.default = TableContent;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableRow":"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableRow.js","/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2":"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableHeader.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TableHeader = React.createClass({
  displayName: "TableHeader",

  render: function render() {
    var headers = this.props.columns.map(function (column, index) {
      return React.createElement(
        "th",
        { key: index },
        column.name
      );
    });
    return React.createElement(
      "thead",
      null,
      React.createElement(
        "tr",
        null,
        headers
      )
    );
  }
});

exports.default = TableHeader;


},{}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/TableRow.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TableRow = React.createClass({
  displayName: "TableRow",

  render: function render() {
    var instance = this.props.instance;
    var columns = this.props.columns.map(function (column) {
      var key = column.key;
      var value = typeof key === "function" ? key(instance) : instance[key];

      return React.createElement(
        "td",
        { key: value },
        value
      );
    });
    return React.createElement(
      "tr",
      null,
      columns
    );
  }
});

exports.default = TableRow;


},{}],"/Users/karol/workspace/karol/ec2-browser/src/js/components/Window.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sidebar = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _PageContent = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/PageContent');

var _PageContent2 = _interopRequireDefault(_PageContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Window = React.createClass({
  displayName: 'Window',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'pane-group' },
      React.createElement(
        'div',
        { className: 'pane-sm sidebar' },
        React.createElement(_Sidebar2.default, null)
      ),
      React.createElement(
        'div',
        { className: 'pane' },
        React.createElement(_PageContent2.default, null)
      )
    );
  }
});

exports.default = Window;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/PageContent":"/Users/karol/workspace/karol/ec2-browser/src/js/components/PageContent.js","/Users/karol/workspace/karol/ec2-browser/src/js/components/Sidebar":"/Users/karol/workspace/karol/ec2-browser/src/js/components/Sidebar.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/dispatcher.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _listeners = {};

var Dispatcher = function Dispatcher() {};
Dispatcher.prototype = {

  register: function register(actionName, callback) {
    if (!_listeners[actionName]) {
      _listeners[actionName] = [];
    }

    _listeners[actionName].push(callback);
  },

  notifyAll: function notifyAll(actionName) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var callbacks = _listeners[actionName] || [];
    callbacks.forEach(function (callback) {
      callback.call.apply(callback, [callback].concat(args));
    });
  }
};

var appDispacher = new Dispatcher();

exports.default = appDispacher;


},{}],"/Users/karol/workspace/karol/ec2-browser/src/js/main.js":[function(require,module,exports){
'use strict';

var _Window = require('/Users/karol/workspace/karol/ec2-browser/src/js/components/Window');

var _Window2 = _interopRequireDefault(_Window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ReactDOM.render(React.createElement(_Window2.default, null), document.getElementById('window-content'));


},{"/Users/karol/workspace/karol/ec2-browser/src/js/components/Window":"/Users/karol/workspace/karol/ec2-browser/src/js/components/Window.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var aws = electronRequire('./aws-config.json');

var AWS = electronRequire('aws-sdk');
AWS.config.update(aws);

var getEc2 = function getEc2() {
  var region = arguments.length <= 0 || arguments[0] === undefined ? 'eu-west-1' : arguments[0];

  return new AWS.EC2({ region: region });
};

var regionNames = {
  'us-east-1': "US East (N. Virginia)",
  'us-west-2': "US West (Oregon)",
  'us-west-1': "US West (N. California)",
  'eu-west-1': "EU (Ireland)",
  'eu-central-1': "EU (Frankfurt)",
  'ap-southeast-1': "Asia Pacific (Singapore)",
  'ap-northeast-1': "Asia Pacific (Tokyo)",
  'ap-southeast-2': "Asia Pacific (Sydney)",
  'sa-east-1': "South America (São Paulo)"
};

var ec2Instances = {
  fetchInstances: function fetchInstances(region) {
    return new Promise(function (resolve) {
      var ec2 = getEc2(region);
      ec2.describeInstances(function (err, data) {
        console.log(data);
        var instances = data.Reservations.map(function (instanceObject) {
          var instance = instanceObject.Instances[0];
          return {
            status: instance.State.Name,
            instanceType: instance.InstanceType,
            keyName: instance.KeyName,
            tags: instance.Tags.map(function (tag) {
              return {
                key: tag.Key,
                value: tag.Value
              };
            }),
            publicIpAddress: instance.PublicIpAddress,
            id: instance.InstanceId
          };
        });
        resolve(instances);
      });
    });
  },

  fetchRegions: function fetchRegions() {
    return new Promise(function (resolve) {
      var ec2 = getEc2();
      ec2.describeRegions(function (err, data) {

        var regions = data.Regions.map(function (region) {
          var regionName = region.RegionName;
          return {
            key: regionName,
            name: regionNames[regionName] || regionName
          };
        });

        resolve(regions);
      });
    });
  }
};

exports.default = ec2Instances;


},{}]},{},["/Users/karol/workspace/karol/ec2-browser/src/js/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvQWRkUmVnaW9uLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9FYzJJbnN0YW5jZXMuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1BhZ2VDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9SZWdpb25MaXN0LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9TaWRlYmFyLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZS5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZUhlYWRlci5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdy5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXIuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9tYWluLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7RUFDM0MsS0FBSyxFQUFFLElBQUk7QUFDYixDQUFDLENBQUMsQ0FBQzs7QUFFSCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsdUVBQXVFLENBQUMsQ0FBQzs7QUFFbkcsSUFBSSxZQUFZLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXZELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDOztBQUVsRixJQUFJLElBQUksR0FBRyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDREQUE0RCxDQUFDLENBQUM7O0FBRXhGLElBQUksWUFBWSxHQUFHLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV2RCxTQUFTLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdB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USxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUU7Y0FDckMsT0FBTztnQkFDTCxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUc7Z0JBQ1osS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO2VBQ2pCLENBQUM7YUFDSCxDQUFDO1lBQ0YsZUFBZSxFQUFFLFFBQVEsQ0FBQyxlQUFlO1lBQ3pDLEVBQUUsRUFBRSxRQUFRLENBQUMsVUFBVTtXQUN4QixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO09BQ3BCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztBQUNQLEdBQUc7O0VBRUQsWUFBWSxFQUFFLFNBQVMsWUFBWSxHQUFHO0lBQ3BDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPLEVBQUU7TUFDcEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDekIsTUFBTSxHQUFHLENBQUMsZUFBZSxDQUFDLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRTs7UUFFdkMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxNQUFNLEVBQUU7VUFDL0MsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztVQUNuQyxPQUFPO1lBQ0wsR0FBRyxFQUFFLFVBQVU7WUFDZixJQUFJLEVBQUUsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVU7V0FDNUMsQ0FBQztBQUNaLFNBQVMsQ0FBQyxDQUFDOztRQUVILE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNsQixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSjtBQUNILENBQUMsQ0FBQzs7QUFFRixPQUFPLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztBQUMvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE1IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSAnJztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGFyZztcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgY2xhc3NOYW1lcy5hcHBseShudWxsLCBhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBrZXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuc3Vic3RyKDEpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1JlZ2lvbkxpc3QgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1JlZ2lvbkxpc3QnKTtcblxudmFyIF9SZWdpb25MaXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1JlZ2lvbkxpc3QpO1xuXG52YXIgX2VjID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyJyk7XG5cbnZhciBfZWMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWMpO1xuXG52YXIgX2Rpc3BhdGNoZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9kaXNwYXRjaGVyJyk7XG5cbnZhciBfZGlzcGF0Y2hlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXNwYXRjaGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEFkZFJlZ2lvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdBZGRSZWdpb24nLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsaXN0VmlzaWJsZTogZmFsc2UsXG4gICAgICBkYXRhOiBbXSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgX2Rpc3BhdGNoZXIyLmRlZmF1bHQucmVnaXN0ZXIoJ3JlZ2lvbkFkZGVkJywgKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbGlzdFZpc2libGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBhZGRSZWdpb246IGZ1bmN0aW9uIGFkZFJlZ2lvbihlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnN0YXRlLmRhdGEubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGlzdFZpc2libGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gX3RoaXM7XG4gICAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgIGxpc3RWaXNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBfZWMyLmRlZmF1bHQuZmV0Y2hSZWdpb25zKCkudGhlbihmdW5jdGlvbiAocmVnaW9ucykge1xuICAgICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBsaXN0VmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHJlZ2lvbnMsXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pKCk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NwYW4nLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdzcGFuJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdhZGQtYnV0dG9uJywgb25DbGljazogdGhpcy5hZGRSZWdpb24gfSxcbiAgICAgICAgJysnXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfUmVnaW9uTGlzdDIuZGVmYXVsdCwgeyB2aXNpYmxlOiB0aGlzLnN0YXRlLmxpc3RWaXNpYmxlLCByZWdpb25zOiB0aGlzLnN0YXRlLmRhdGEsIGxvYWRpbmc6IHRoaXMuc3RhdGUubG9hZGluZyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBBZGRSZWdpb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtGa1pGSmxaMmx2Ymk1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3T3pzN096dEJRVWxCTEVsQlFVa3NVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTm9ReXhwUWtGQlpTeEZRVUZGTERKQ1FVRlhPMEZCUXpGQ0xGZEJRVTg3UVVGRFRDeHBRa0ZCVnl4RlFVRkZMRXRCUVVzN1FVRkRiRUlzVlVGQlNTeEZRVUZGTEVWQlFVVTdRVUZEVWl4aFFVRlBMRVZCUVVVc1MwRkJTenRMUVVObUxFTkJRVU03UjBGRFNEczdRVUZGUkN4dFFrRkJhVUlzUlVGQlJTdzJRa0ZCVnp0QlFVTTFRaXg1UWtGQlZ5eFJRVUZSTEVOQlFVTXNZVUZCWVN4RlFVRkZMRU5CUVVFc1ZVRkJVeXhOUVVGTkxFVkJRVVU3UVVGRGJFUXNWVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOYUxHVkJRVThzUlVGQlJTeExRVUZMTzBGQlEyUXNiVUpCUVZjc1JVRkJSU3hMUVVGTE8wOUJRMjVDTEVOQlFVTXNRMEZCUXp0TFFVTktMRU5CUVVFc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0SFFVTm1PenRCUVVWRUxGZEJRVk1zUlVGQlJTeHRRa0ZCVXl4RFFVRkRMRVZCUVVVN096dEJRVU55UWl4UlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTXhRaXhWUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NiVUpCUVZjc1JVRkJSU3hKUVVGSk8wOUJRMnhDTEVOQlFVTXNRMEZCUXp0TFFVTktMRTFCUVUwN08wRkJRMHdzV1VGQlNTeFRRVUZUTEZGQlFVOHNRMEZCUXp0QlFVTnlRaXhqUVVGTExGRkJRVkVzUTBGQlF6dEJRVU5hTEdsQ1FVRlBMRVZCUVVVc1NVRkJTVHRCUVVOaUxIRkNRVUZYTEVWQlFVVXNTVUZCU1R0VFFVTnNRaXhEUVVGRExFTkJRVU03UVVGRFNDeHhRa0ZCU1N4WlFVRlpMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlV5eFBRVUZQTEVWQlFVVTdRVUZEZUVNc2JVSkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEYWtJc2RVSkJRVmNzUlVGQlJTeEpRVUZKTzBGQlEycENMR2RDUVVGSkxFVkJRVVVzVDBGQlR6dEJRVU5pTEcxQ1FVRlBMRVZCUVVVc1MwRkJTenRYUVVObUxFTkJRVU1zUTBGQlF6dFRRVU5LTEVOQlFVTXNRMEZCUXpzN1MwRkRTanRIUVVOR096dEJRVVZFTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3pzN1RVRkRSVHM3VlVGQlRTeFRRVUZUTEVWQlFVTXNXVUZCV1N4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEJRVUZET3p0UFFVRlRPMDFCUXpsRUxEUkRRVUZaTEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGZEJRVmNzUVVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUVVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUVVGQlF5eEhRVUZITzB0QlEycEhMRU5CUTFBN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdhMEpCUlZrc1UwRkJVeUlzSW1acGJHVWlPaUpCWkdSU1pXZHBiMjR1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTGk5emNtTXZhbk12SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZKbFoybHZia3hwYzNRZ1puSnZiU0FuWTI5dGNHOXVaVzUwY3k5U1pXZHBiMjVNYVhOMEp6dGNibWx0Y0c5eWRDQmxZeklnWm5KdmJTQW5jMlZ5ZG1salpYTXZaV015Snp0Y2JtbHRjRzl5ZENCa2FYTndZWFJqYUdWeUlHWnliMjBnSjJScGMzQmhkR05vWlhJbk8xeHVYRzVzWlhRZ1FXUmtVbVZuYVc5dUlEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0JzYVhOMFZtbHphV0pzWlRvZ1ptRnNjMlVzWEc0Z0lDQWdJQ0JrWVhSaE9pQmJYU3hjYmlBZ0lDQWdJR3h2WVdScGJtYzZJR1poYkhObFhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmx4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdaR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWduY21WbmFXOXVRV1JrWldRbkxDQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNCc2IyRmthVzVuT2lCbVlXeHpaU3hjYmlBZ0lDQWdJQ0FnYkdsemRGWnBjMmxpYkdVNklHWmhiSE5sWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dVhHNGdJR0ZrWkZKbFoybHZiam9nWm5WdVkzUnBiMjRvWlNrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG5OMFlYUmxMbVJoZEdFdWJHVnVaM1JvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjYmlBZ0lDQWdJQ0FnYkdsemRGWnBjMmxpYkdVNklIUnlkV1ZjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQnNaWFFnWTI5dGNHOXVaVzUwSUQwZ2RHaHBjenRjYmlBZ0lDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UxeHVJQ0FnSUNBZ0lDQnNiMkZrYVc1bk9pQjBjblZsTEZ4dUlDQWdJQ0FnSUNCc2FYTjBWbWx6YVdKc1pUb2dkSEoxWlZ4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNCbFl6SXVabVYwWTJoU1pXZHBiMjV6S0NrdWRHaGxiaWhtZFc1amRHbHZiaWh5WldkcGIyNXpLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJYQnZibVZ1ZEM1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNBZ0lDQWdiR2x6ZEZacGMybGliR1U2SUhSeWRXVXNYRzRnSUNBZ0lDQWdJQ0FnWkdGMFlUb2djbVZuYVc5dWN5eGNiaUFnSUNBZ0lDQWdJQ0JzYjJGa2FXNW5PaUJtWVd4elpWeHVJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDFjYmlBZ2ZTeGNibHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4YzNCaGJqNWNiaUFnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2lZV1JrTFdKMWRIUnZibHdpSUc5dVEyeHBZMnM5ZTNSb2FYTXVZV1JrVW1WbmFXOXVmVDRyUEM5emNHRnVQbHh1SUNBZ0lDQWdJQ0E4VW1WbmFXOXVUR2x6ZENCMmFYTnBZbXhsUFh0MGFHbHpMbk4wWVhSbExteHBjM1JXYVhOcFlteGxmU0J5WldkcGIyNXpQWHQwYUdsekxuTjBZWFJsTG1SaGRHRjlJR3h2WVdScGJtYzllM1JvYVhNdWMzUmhkR1V1Ykc5aFpHbHVaMzBnTHo1Y2JpQWdJQ0FnSUR3dmMzQmhiajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnUVdSa1VtVm5hVzl1T3lKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfVGFibGUgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlJyk7XG5cbnZhciBfVGFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGUpO1xuXG52YXIgX2VjID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyJyk7XG5cbnZhciBfZWMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWMpO1xuXG52YXIgX2Rpc3BhdGNoZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9kaXNwYXRjaGVyJyk7XG5cbnZhciBfZGlzcGF0Y2hlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXNwYXRjaGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHRhZyA9IGZ1bmN0aW9uIHRhZyh0YWdOYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UudGFncy5maWx0ZXIoZnVuY3Rpb24gKHRhZykge1xuICAgICAgcmV0dXJuIHRhZy5rZXkgPT09IHRhZ05hbWU7XG4gICAgfSlbMF0udmFsdWU7XG4gIH07XG59O1xuXG52YXIgRWMySW5zdGFuY2VzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0VjMkluc3RhbmNlcycsXG5cbiAgY29sdW1uczogW3sgbmFtZTogXCJJZFwiLCBrZXk6ICdpZCcgfSwgeyBuYW1lOiBcIk5hbWVcIiwga2V5OiB0YWcoXCJOYW1lXCIpIH0sIHsgbmFtZTogXCJLZXkgbmFtZVwiLCBrZXk6ICdrZXlOYW1lJyB9LCB7IG5hbWU6IFwiSW5zdGFuY2UgdHlwZVwiLCBrZXk6ICdpbnN0YW5jZVR5cGUnIH0sIHsgbmFtZTogXCJTdGF0dXNcIiwga2V5OiAnc3RhdHVzJyB9XSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogW10sXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgcmVnaW9uOiAnZXUtd2VzdC0xJ1xuICAgIH07XG4gIH0sXG5cbiAgZmV0Y2hJbnN0YW5jZXM6IGZ1bmN0aW9uIGZldGNoSW5zdGFuY2VzKHJlZ2lvbikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXM7XG4gICAgX2VjMi5kZWZhdWx0LmZldGNoSW5zdGFuY2VzKHJlZ2lvbikudGhlbihmdW5jdGlvbiAoaW5zdGFuY2VzKSB7XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoe1xuICAgICAgICBkYXRhOiBpbnN0YW5jZXMsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5mZXRjaEluc3RhbmNlcyh0aGlzLnN0YXRlLnJlZ2lvbik7XG4gICAgX2Rpc3BhdGNoZXIyLmRlZmF1bHQucmVnaXN0ZXIoJ3JlZ2lvbicsIChmdW5jdGlvbiAocmVnaW9uKSB7XG4gICAgICB0aGlzLmZldGNoSW5zdGFuY2VzKHJlZ2lvbik7XG4gICAgfSkuYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgY2hhbmdlUmVnaW9uOiBmdW5jdGlvbiBjaGFuZ2VSZWdpb24oZSkge1xuICAgIHZhciByZWdpb24gPSBlLnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlZ2lvbjogcmVnaW9uLFxuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH0pO1xuICAgIHRoaXMuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlMi5kZWZhdWx0LCB7IGNvbHVtbnM6IHRoaXMuY29sdW1ucywgZGF0YTogdGhpcy5zdGF0ZS5kYXRhLCBsb2FkaW5nOiB0aGlzLnN0YXRlLmxvYWRpbmcgfSlcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRWMySW5zdGFuY2VzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrVmpNa2x1YzNSaGJtTmxjeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPenM3T3p0QlFVbEJMRWxCUVVrc1IwRkJSeXhIUVVGSExGTkJRVTRzUjBGQlJ5eERRVUZaTEU5QlFVOHNSVUZCUlR0QlFVTXhRaXhUUVVGUExGVkJRVk1zVVVGQlVTeEZRVUZGTzBGQlEzaENMRmRCUVU4c1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCUXl4SFFVRkhMRVZCUVVzN1FVRkRia01zWVVGQlR5eEhRVUZITEVOQlFVTXNSMEZCUnl4TFFVRkxMRTlCUVU4c1EwRkJRenRMUVVNMVFpeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRE8wZEJRMklzUTBGQlF6dERRVU5JTEVOQlFVTTdPMEZCUlVZc1NVRkJTU3haUVVGWkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRMjVETEZOQlFVOHNSVUZCUlN4RFFVTlFMRVZCUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJTeEhRVUZITEVWQlFVVXNTVUZCU1N4RlFVRkRMRVZCUTNaQ0xFVkJRVU1zU1VGQlNTeEZRVUZGTEUxQlFVMHNSVUZCUlN4SFFVRkhMRVZCUVVVc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eEZRVUZETEVWQlEyaERMRVZCUVVNc1NVRkJTU3hGUVVGRkxGVkJRVlVzUlVGQlJTeEhRVUZITEVWQlFVVXNVMEZCVXl4RlFVRkRMRVZCUTJ4RExFVkJRVU1zU1VGQlNTeEZRVUZGTEdWQlFXVXNSVUZCUlN4SFFVRkhMRVZCUVVVc1kwRkJZeXhGUVVGRExFVkJRelZETEVWQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hIUVVGSExFVkJRVVVzVVVGQlVTeEZRVUZETEVOQlEyaERPenRCUVVWRUxHbENRVUZsTEVWQlFVVXNNa0pCUVZjN1FVRkRNVUlzVjBGQlR6dEJRVU5NTEZWQlFVa3NSVUZCUlN4RlFVRkZPMEZCUTFJc1lVRkJUeXhGUVVGRkxFbEJRVWs3UVVGRFlpeFpRVUZOTEVWQlFVVXNWMEZCVnp0TFFVTndRaXhEUVVGRE8wZEJRMGc3TzBGQlJVUXNaMEpCUVdNc1JVRkJSU3gzUWtGQlV5eE5RVUZOTEVWQlFVVTdRVUZETDBJc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdGQlFVOHNSVUZCUlN4SlFVRkpPMHRCUTJRc1EwRkJReXhEUVVGRE96dEJRVVZJTEZGQlFVa3NVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOeVFpeHBRa0ZCU1N4alFVRmpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFVTXNVMEZCVXl4RlFVRkxPMEZCUXpkRExHVkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEYWtJc1dVRkJTU3hGUVVGRkxGTkJRVk03UVVGRFppeGxRVUZQTEVWQlFVVXNTMEZCU3p0UFFVTm1MRU5CUVVNc1EwRkJRenRMUVVOS0xFTkJRVU1zUTBGQlF6dEhRVU5LT3p0QlFVVkVMRzFDUVVGcFFpeEZRVUZGTERaQ1FVRlhPMEZCUXpWQ0xGRkJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU4yUXl4NVFrRkJWeXhSUVVGUkxFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVRXNWVUZCVXl4TlFVRk5MRVZCUVVVN1FVRkROME1zVlVGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRMUVVNM1FpeERRVUZCTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRFpqczdRVUZGUkN4alFVRlpMRVZCUVVVc2MwSkJRVk1zUTBGQlF5eEZRVUZGTzBGQlEzaENMRkZCUVVrc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkJPMEZCUXpOQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4WlFVRk5MRVZCUVVVc1RVRkJUVHRCUVVOa0xHRkJRVThzUlVGQlJTeEpRVUZKTzB0QlEyUXNRMEZCUXl4RFFVRkRPMEZCUTBnc1VVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0SFFVTTNRanM3UVVGRlJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdPMDFCUTBVc2RVTkJRVThzVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4UFFVRlBMRUZCUVVNc1JVRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRUZCUVVNc1JVRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRUZCUVVNc1IwRkJSenRMUVVOb1JpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08ydENRVVZaTEZsQlFWa2lMQ0ptYVd4bElqb2lSV015U1c1emRHRnVZMlZ6TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVlXSnNaU0JtY205dElDZGpiMjF3YjI1bGJuUnpMMVJoWW14bEp6dGNibWx0Y0c5eWRDQmxZeklnWm5KdmJTQW5jMlZ5ZG1salpYTXZaV015Snp0Y2JtbHRjRzl5ZENCa2FYTndZWFJqYUdWeUlHWnliMjBnSjJScGMzQmhkR05vWlhJbk8xeHVYRzVzWlhRZ2RHRm5JRDBnWm5WdVkzUnBiMjRvZEdGblRtRnRaU2tnZTF4dUlDQnlaWFIxY200Z1puVnVZM1JwYjI0b2FXNXpkR0Z1WTJVcElIdGNiaUFnSUNCeVpYUjFjbTRnYVc1emRHRnVZMlV1ZEdGbmN5NW1hV3gwWlhJb0tIUmhaeWtnUFQ0Z2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhSaFp5NXJaWGtnUFQwOUlIUmhaMDVoYldVN1hHNGdJQ0FnZlNsYk1GMHVkbUZzZFdVN1hHNGdJSDA3WEc1OU8xeHVYRzVzWlhRZ1JXTXlTVzV6ZEdGdVkyVnpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQmpiMngxYlc1ek9pQmJYRzRnSUNBZ2UyNWhiV1U2SUZ3aVNXUmNJaXdnYTJWNU9pQW5hV1FuZlN4Y2JpQWdJQ0I3Ym1GdFpUb2dYQ0pPWVcxbFhDSXNJR3RsZVRvZ2RHRm5LRndpVG1GdFpWd2lLWDBzWEc0Z0lDQWdlMjVoYldVNklGd2lTMlY1SUc1aGJXVmNJaXdnYTJWNU9pQW5hMlY1VG1GdFpTZDlMRnh1SUNBZ0lIdHVZVzFsT2lCY0lrbHVjM1JoYm1ObElIUjVjR1ZjSWl3Z2EyVjVPaUFuYVc1emRHRnVZMlZVZVhCbEozMHNYRzRnSUNBZ2UyNWhiV1U2SUZ3aVUzUmhkSFZ6WENJc0lHdGxlVG9nSjNOMFlYUjFjeWQ5TEZ4dUlDQmRMRnh1WEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUdSaGRHRTZJRnRkTEZ4dUlDQWdJQ0FnYkc5aFpHbHVaem9nZEhKMVpTeGNiaUFnSUNBZ0lISmxaMmx2YmpvZ0oyVjFMWGRsYzNRdE1TZGNiaUFnSUNCOU8xeHVJQ0I5TEZ4dVhHNGdJR1psZEdOb1NXNXpkR0Z1WTJWek9pQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjYmlBZ0lDQWdJR3h2WVdScGJtYzZJSFJ5ZFdWY2JpQWdJQ0I5S1R0Y2JpQWdJQ0JjYmlBZ0lDQnNaWFFnWTI5dGNHOXVaVzUwSUQwZ2RHaHBjenRjYmlBZ0lDQmxZekl1Wm1WMFkyaEpibk4wWVc1alpYTW9jbVZuYVc5dUtTNTBhR1Z1S0NocGJuTjBZVzVqWlhNcElEMCtJSHRjYmlBZ0lDQWdJR052YlhCdmJtVnVkQzV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0FnSUdSaGRHRTZJR2x1YzNSaGJtTmxjeXhjYmlBZ0lDQWdJQ0FnYkc5aFpHbHVaem9nWm1Gc2MyVmNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEVScFpFMXZkVzUwT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCMGFHbHpMbVpsZEdOb1NXNXpkR0Z1WTJWektIUm9hWE11YzNSaGRHVXVjbVZuYVc5dUtUdGNiaUFnSUNCa2FYTndZWFJqYUdWeUxuSmxaMmx6ZEdWeUtDZHlaV2RwYjI0bkxDQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNBZ0lIUm9hWE11Wm1WMFkyaEpibk4wWVc1alpYTW9jbVZuYVc5dUtUdGNiaUFnSUNCOUxtSnBibVFvZEdocGN5a3BPMXh1SUNCOUxGeHVYRzRnSUdOb1lXNW5aVkpsWjJsdmJqb2dablZ1WTNScGIyNG9aU2tnZTF4dUlDQWdJR3hsZENCeVpXZHBiMjRnUFNCbExuUmhjbWRsZEM1MllXeDFaVnh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnY21WbmFXOXVPaUJ5WldkcGIyNHNYRzRnSUNBZ0lDQnNiMkZrYVc1bk9pQjBjblZsWEc0Z0lDQWdmU2s3WEc0Z0lDQWdkR2hwY3k1bVpYUmphRWx1YzNSaGJtTmxjeWh5WldkcGIyNHBPMXh1SUNCOUxGeHVYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZK1hHNGdJQ0FnSUNBZ0lEeFVZV0pzWlNCamIyeDFiVzV6UFh0MGFHbHpMbU52YkhWdGJuTjlJR1JoZEdFOWUzUm9hWE11YzNSaGRHVXVaR0YwWVgwZ2JHOWhaR2x1WnoxN2RHaHBjeTV6ZEdGMFpTNXNiMkZrYVc1bmZTQXZQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFVmpNa2x1YzNSaGJtTmxjenNpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9FYzJJbnN0YW5jZXMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL0VjMkluc3RhbmNlcycpO1xuXG52YXIgX0VjMkluc3RhbmNlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9FYzJJbnN0YW5jZXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgUGFnZUNvbnRlbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUGFnZUNvbnRlbnQnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfRWMySW5zdGFuY2VzMi5kZWZhdWx0LCBudWxsKVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQYWdlQ29udGVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbEJoWjJWRGIyNTBaVzUwTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096dEJRVVZCTEVsQlFVa3NWMEZCVnl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTnNReXhSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3TzAxQlEwVXNhVVJCUVdkQ08wdEJRMW9zUTBGRFRqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeFhRVUZYSWl3aVptbHNaU0k2SWxCaFoyVkRiMjUwWlc1MExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQkZZekpKYm5OMFlXNWpaWE1nWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlGWXpKSmJuTjBZVzVqWlhNbk8xeHVYRzVzWlhRZ1VHRm5aVU52Ym5SbGJuUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWStYRzRnSUNBZ0lDQWdJRHhGWXpKSmJuTjBZVzVqWlhNZ0x6NWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCUVlXZGxRMjl1ZEdWdWREc2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2Rpc3BhdGNoZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9kaXNwYXRjaGVyJyk7XG5cbnZhciBfZGlzcGF0Y2hlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXNwYXRjaGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBSZWdpb25MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JlZ2lvbkxpc3QnLFxuXG4gIHJlZ2lvbkNob3NlbjogZnVuY3Rpb24gcmVnaW9uQ2hvc2VuKHJlZ2lvbikge1xuICAgIF9kaXNwYXRjaGVyMi5kZWZhdWx0Lm5vdGlmeUFsbCgncmVnaW9uQWRkZWQnLCByZWdpb24pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGxvYWRpbmcgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2xpJyxcbiAgICAgIG51bGwsXG4gICAgICAnTG9hZGluZydcbiAgICApO1xuICAgIHZhciByZWdpb25zID0gdGhpcy5wcm9wcy5yZWdpb25zLm1hcChmdW5jdGlvbiAocmVnaW9uKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2xpJyxcbiAgICAgICAgeyBrZXk6IHJlZ2lvbi5rZXkgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnYScsXG4gICAgICAgICAgeyBvbkNsaWNrOiBfdGhpcy5yZWdpb25DaG9zZW4uYmluZChfdGhpcywgcmVnaW9uKSB9LFxuICAgICAgICAgIHJlZ2lvbi5uYW1lXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB2YXIgYm9keSA9IHRoaXMucHJvcHMubG9hZGluZyA/IGxvYWRpbmcgOiByZWdpb25zO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3VsJyxcbiAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWVzKFwicmVnaW9ucy1saXN0XCIsIHRoaXMucHJvcHMudmlzaWJsZSA/ICd2aXNpYmxlJyA6ICcnKSB9LFxuICAgICAgYm9keVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBSZWdpb25MaXN0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsSmxaMmx2Ymt4cGMzUXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenM3TzBGQlEwRXNTVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZET3p0QlFVVjJReXhKUVVGSkxGVkJRVlVzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRGFrTXNZMEZCV1N4RlFVRkZMSE5DUVVGVExFMUJRVTBzUlVGQlJUdEJRVU0zUWl4NVFrRkJWeXhUUVVGVExFTkJRVU1zWVVGQllTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMGRCUXpkRE8wRkJRMFFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPenM3UVVGRGFrSXNVVUZCU1N4UFFVRlBMRWRCUTFRN096czdTMEZCWjBJc1FVRkRha0lzUTBGQlF6dEJRVU5HTEZGQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkRMRTFCUVUwc1JVRkJTenRCUVVNdlF5eGhRVU5GT3p0VlFVRkpMRWRCUVVjc1JVRkJSU3hOUVVGTkxFTkJRVU1zUjBGQlJ5eEJRVUZETzFGQlEyeENPenRaUVVGSExFOUJRVThzUlVGQlJTeE5RVUZMTEZsQlFWa3NRMEZCUXl4SlFVRkpMRkZCUVU4c1RVRkJUU3hEUVVGRExFRkJRVU03VlVGQlJTeE5RVUZOTEVOQlFVTXNTVUZCU1R0VFFVRkxPMDlCUTJoRkxFTkJRMHc3UzBGRFNDeERRVUZETEVOQlFVTTdPMEZCUlVnc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRWRCUVVjc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF6dEJRVU5zUkN4WFFVTkZPenRSUVVGSkxGTkJRVk1zUlVGQlJTeFZRVUZWTEVOQlFVTXNZMEZCWXl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEhRVUZETEZOQlFWTXNSMEZCUXl4RlFVRkZMRU5CUVVNc1FVRkJRenROUVVONFJTeEpRVUZKTzB0QlEwWXNRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4VlFVRlZJaXdpWm1sc1pTSTZJbEpsWjJsdmJreHBjM1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTGk5emNtTXZhbk12SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUdScGMzQmhkR05vWlhJZ1puSnZiU0FuWkdsemNHRjBZMmhsY2ljN1hHNXNaWFFnWTJ4aGMzTk9ZVzFsY3lBOUlISmxjWFZwY21Vb0oyTnNZWE56Ym1GdFpYTW5LVHRjYmx4dWJHVjBJRkpsWjJsdmJreHBjM1FnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsWjJsdmJrTm9iM05sYmpvZ1puVnVZM1JwYjI0b2NtVm5hVzl1S1NCN1hHNGdJQ0FnWkdsemNHRjBZMmhsY2k1dWIzUnBabmxCYkd3b0ozSmxaMmx2YmtGa1pHVmtKeXdnY21WbmFXOXVLVHRjYmlBZ2ZTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JzWlhRZ2JHOWhaR2x1WnlBOUlDQW9YRzRnSUNBZ0lDQThiR2srVEc5aFpHbHVaend2YkdrK1hHNGdJQ0FnS1R0Y2JpQWdJQ0JzWlhRZ2NtVm5hVzl1Y3lBOUlIUm9hWE11Y0hKdmNITXVjbVZuYVc5dWN5NXRZWEFvS0hKbFoybHZiaWtnUFQ0Z2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUNBZ1BHeHBJR3RsZVQxN2NtVm5hVzl1TG10bGVYMCtYRzRnSUNBZ0lDQWdJQ0FnUEdFZ2IyNURiR2xqYXoxN2RHaHBjeTV5WldkcGIyNURhRzl6Wlc0dVltbHVaQ2gwYUdsekxDQnlaV2RwYjI0cGZUNTdjbVZuYVc5dUxtNWhiV1Y5UEM5aFBseHVJQ0FnSUNBZ0lDQThMMnhwUGx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5S1R0Y2JseHVJQ0FnSUd4bGRDQmliMlI1SUQwZ2RHaHBjeTV3Y205d2N5NXNiMkZrYVc1bklEOGdiRzloWkdsdVp5QTZJSEpsWjJsdmJuTTdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MWJDQmpiR0Z6YzA1aGJXVTllMk5zWVhOelRtRnRaWE1vWENKeVpXZHBiMjV6TFd4cGMzUmNJaXdnZEdocGN5NXdjbTl3Y3k1MmFYTnBZbXhsUHlkMmFYTnBZbXhsSnpvbkp5bDlQbHh1SUNBZ0lDQWdJQ0I3WW05a2VYMWNiaUFnSUNBZ0lEd3ZkV3crWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZKbFoybHZia3hwYzNRN0lsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG52YXIgX0FkZFJlZ2lvbiA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvQWRkUmVnaW9uJyk7XG5cbnZhciBfQWRkUmVnaW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0FkZFJlZ2lvbik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgcmVtb3RlID0gZWxlY3Ryb25SZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZTtcbnZhciBNZW51ID0gcmVtb3RlLk1lbnU7XG52YXIgTWVudUl0ZW0gPSByZW1vdGUuTWVudUl0ZW07XG5cbnZhciBTaWRlYmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1NpZGViYXInLFxuXG4gIGNvbnRleHRNZW51OiBudWxsLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZWdpb246ICdldS13ZXN0LTEnLFxuICAgICAgcmVnaW9uczogSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZ2lvbnMnKSB8fCBcIltdXCIpXG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgX2Rpc3BhdGNoZXIyLmRlZmF1bHQucmVnaXN0ZXIoJ3JlZ2lvbkFkZGVkJywgKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHRoaXMuc3RhdGUucmVnaW9ucy5wdXNoKHJlZ2lvbik7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVnaW9uczogdGhpcy5zdGF0ZS5yZWdpb25zXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVnaW9ucycsIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucmVnaW9ucykpO1xuICAgIH0pLmJpbmQodGhpcykpO1xuICB9LFxuXG4gIHJlZ2lvblNlbGVjdGVkOiBmdW5jdGlvbiByZWdpb25TZWxlY3RlZChyZWdpb24pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlZ2lvbjogcmVnaW9uXG4gICAgfSk7XG4gICAgX2Rpc3BhdGNoZXIyLmRlZmF1bHQubm90aWZ5QWxsKCdyZWdpb24nLCByZWdpb24pO1xuICB9LFxuXG4gIHJlbW92ZVJlZ2lvbjogZnVuY3Rpb24gcmVtb3ZlUmVnaW9uKHJlZ2lvbikge1xuICAgIHZhciBpbmRleCA9IHRoaXMuc3RhdGUucmVnaW9ucy5pbmRleE9mKHJlZ2lvbik7XG4gICAgdGhpcy5zdGF0ZS5yZWdpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWdpb25zOiB0aGlzLnN0YXRlLnJlZ2lvbnNcbiAgICB9KTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZ2lvbnMnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnJlZ2lvbnMpKTtcbiAgfSxcblxuICBpc0FjdGl2ZTogZnVuY3Rpb24gaXNBY3RpdmUocmVnaW9uKSB7XG4gICAgaWYgKHJlZ2lvbiA9PT0gdGhpcy5zdGF0ZS5yZWdpb24pIHtcbiAgICAgIHJldHVybiBcImFjdGl2ZVwiO1xuICAgIH07XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG5cbiAgb25Db250ZXh0TWVudTogZnVuY3Rpb24gb25Db250ZXh0TWVudShyZWdpb24pIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcztcbiAgICB2YXIgbWVudSA9IG5ldyBNZW51KCk7XG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHsgbGFiZWw6ICdSZW1vdmUnLCBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgIGNvbXBvbmVudC5yZW1vdmVSZWdpb24ocmVnaW9uKTtcbiAgICAgIH0gfSkpO1xuICAgIG1lbnUucG9wdXAocmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciByZWdpb25zID0gdGhpcy5zdGF0ZS5yZWdpb25zLm1hcChmdW5jdGlvbiAocmVnaW9uKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2xpJyxcbiAgICAgICAgeyBrZXk6IHJlZ2lvbi5rZXksXG4gICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc05hbWVzKFwibGlzdC1ncm91cC1pdGVtXCIsIFwicmVnaW9uXCIsIF90aGlzLmlzQWN0aXZlKHJlZ2lvbi5rZXkpKSxcbiAgICAgICAgICBvbkNvbnRleHRNZW51OiBfdGhpcy5vbkNvbnRleHRNZW51LmJpbmQoX3RoaXMsIHJlZ2lvbiksXG4gICAgICAgICAgb25DbGljazogX3RoaXMucmVnaW9uU2VsZWN0ZWQuYmluZChfdGhpcywgcmVnaW9uLmtleSkgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW1nJywgeyBjbGFzc05hbWU6ICdpbWctY2lyY2xlIG1lZGlhLW9iamVjdCBwdWxsLWxlZnQnLCBzcmM6ICdodHRwOi8vbWVkaWEuYW1hem9ud2Vic2VydmljZXMuY29tL2F3c19zaW5nbGVib3hfMDEucG5nJywgd2lkdGg6ICczMicsIGhlaWdodDogJzMyJyB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWJvZHknIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHJlZ2lvbi5uYW1lXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICcwIHJ1bm5pbmcnXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3VsJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1ncm91cCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsaScsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1ncm91cC1oZWFkZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2g0JyxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgICdSZWdpb25zJ1xuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9BZGRSZWdpb24yLmRlZmF1bHQsIG51bGwpXG4gICAgICApLFxuICAgICAgcmVnaW9uc1xuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBTaWRlYmFyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsTnBaR1ZpWVhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPenM3T3p0QlFVVkJMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXpzN1FVRkZka01zU1VGQlRTeE5RVUZOTEVkQlFVY3NaVUZCWlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF6dEJRVU5zUkN4SlFVRk5MRWxCUVVrc1IwRkJSeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETzBGQlEzcENMRWxCUVUwc1VVRkJVU3hIUVVGSExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTTdPMEZCUldwRExFbEJRVWtzVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU01UWl4aFFVRlhMRVZCUVVVc1NVRkJTVHM3UVVGRmFrSXNhVUpCUVdVc1JVRkJSU3d5UWtGQlZ6dEJRVU14UWl4WFFVRlBPMEZCUTB3c1dVRkJUU3hGUVVGRkxGZEJRVmM3UVVGRGJrSXNZVUZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETzB0QlEzQkZMRU5CUVVNN1IwRkRTRHM3UVVGRlJDeHRRa0ZCYVVJc1JVRkJSU3cyUWtGQlZ6dEJRVU0xUWl4NVFrRkJWeXhSUVVGUkxFTkJRVU1zWVVGQllTeEZRVUZGTEVOQlFVRXNWVUZCVXl4TlFVRk5MRVZCUVVVN1FVRkRiRVFzVlVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlEyaERMRlZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeGxRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUE8wOUJRelZDTEVOQlFVTXNRMEZCUXp0QlFVTklMRmxCUVUwc1EwRkJReXhaUVVGWkxFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVNMVJTeERRVUZCTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRFpqczdRVUZGUkN4blFrRkJZeXhGUVVGRkxIZENRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTXZRaXhSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NXVUZCVFN4RlFVRkZMRTFCUVUwN1MwRkRaaXhEUVVGRExFTkJRVU03UVVGRFNDeDVRa0ZCVnl4VFFVRlRMRU5CUVVNc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBkQlEzaERPenRCUVVWRUxHTkJRVmtzUlVGQlJTeHpRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkROMElzVVVGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXk5RExGRkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY0VNc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdGQlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTg3UzBGRE5VSXNRMEZCUXl4RFFVRkRPMEZCUTBnc1ZVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRelZGT3p0QlFVVkVMRlZCUVZFc1JVRkJSU3hyUWtGQlV5eE5RVUZOTEVWQlFVVTdRVUZEZWtJc1VVRkJTU3hOUVVGTkxFdEJRVXNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRhRU1zWVVGQlR5eFJRVUZSTEVOQlFVRTdTMEZEYUVJc1EwRkJRenRCUVVOR0xGZEJRVThzUlVGQlJTeERRVUZETzBkQlExZzdPMEZCUlVRc1pVRkJZU3hGUVVGRkxIVkNRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTTVRaXhSUVVGSkxGTkJRVk1zUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEY2tJc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTjBRaXhSUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVsQlFVa3NVVUZCVVN4RFFVRkRMRVZCUVVVc1MwRkJTeXhGUVVGRkxGRkJRVkVzUlVGQlJTeExRVUZMTEVWQlFVVXNhVUpCUVZjN1FVRkROVVFzYVVKQlFWTXNRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03VDBGRGFFTXNSVUZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOTUxGRkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR2RDUVVGblFpeEZRVUZGTEVOQlFVTXNRMEZCUXp0SFFVTjJRenM3UVVGRlJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN096dEJRVU5xUWl4UlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJReXhOUVVGTkxFVkJRVXM3UVVGREwwTXNZVUZEUlRzN1ZVRkJTU3hIUVVGSExFVkJRVVVzVFVGQlRTeERRVUZETEVkQlFVY3NRVUZCUXp0QlFVTm9RaXh0UWtGQlV5eEZRVUZGTEZWQlFWVXNRMEZCUXl4cFFrRkJhVUlzUlVGQlJTeFJRVUZSTEVWQlFVVXNUVUZCU3l4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVGQlFVTTdRVUZET1VVc2RVSkJRV0VzUlVGQlJTeE5RVUZMTEdGQlFXRXNRMEZCUXl4SlFVRkpMRkZCUVU4c1RVRkJUU3hEUVVGRExFRkJRVU03UVVGRGNrUXNhVUpCUVU4c1JVRkJSU3hOUVVGTExHTkJRV01zUTBGQlF5eEpRVUZKTEZGQlFVOHNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhCUVVGRE8xRkJRM1JFTERaQ1FVRkxMRk5CUVZNc1JVRkJReXh0UTBGQmJVTXNSVUZCUXl4SFFVRkhMRVZCUVVNc2VVUkJRWGxFTEVWQlFVTXNTMEZCU3l4RlFVRkRMRWxCUVVrc1JVRkJReXhOUVVGTkxFVkJRVU1zU1VGQlNTeEhRVUZITzFGQlF6RkpPenRaUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzFWQlEzcENPenM3V1VGQlV5eE5RVUZOTEVOQlFVTXNTVUZCU1R0WFFVRlZPMVZCUXpsQ096czdPMWRCUVdkQ08xTkJRMW83VDBGRFNDeERRVU5NTzB0QlEwZ3NRMEZCUXl4RFFVRkRPMEZCUTBnc1YwRkRSVHM3VVVGQlNTeFRRVUZUTEVWQlFVTXNXVUZCV1R0TlFVTjRRanM3VlVGQlNTeFRRVUZUTEVWQlFVTXNiVUpCUVcxQ08xRkJReTlDT3pzN08xTkJRV2RDTzFGQlEyaENMRGhEUVVGaE8wOUJRMVk3VFVGRFNpeFBRVUZQTzB0QlEwd3NRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4UFFVRlBJaXdpWm1sc1pTSTZJbE5wWkdWaVlYSXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJR1JwYzNCaGRHTm9aWElnWm5KdmJTQW5aR2x6Y0dGMFkyaGxjaWM3WEc1cGJYQnZjblFnUVdSa1VtVm5hVzl1SUdaeWIyMGdKMk52YlhCdmJtVnVkSE12UVdSa1VtVm5hVzl1Snp0Y2JteGxkQ0JqYkdGemMwNWhiV1Z6SUQwZ2NtVnhkV2x5WlNnblkyeGhjM051WVcxbGN5Y3BPMXh1WEc1amIyNXpkQ0J5WlcxdmRHVWdQU0JsYkdWamRISnZibEpsY1hWcGNtVW9KMlZzWldOMGNtOXVKeWt1Y21WdGIzUmxPMXh1WTI5dWMzUWdUV1Z1ZFNBOUlISmxiVzkwWlM1TlpXNTFPMXh1WTI5dWMzUWdUV1Z1ZFVsMFpXMGdQU0J5WlcxdmRHVXVUV1Z1ZFVsMFpXMDdYRzVjYm14bGRDQlRhV1JsWW1GeUlEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCamIyNTBaWGgwVFdWdWRUb2diblZzYkN4Y2JseHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQnlaV2RwYjI0NklDZGxkUzEzWlhOMExURW5MRnh1SUNBZ0lDQWdjbVZuYVc5dWN6b2dTbE5QVGk1d1lYSnpaU2gzYVc1a2IzY3ViRzlqWVd4VGRHOXlZV2RsTG1kbGRFbDBaVzBvSjNKbFoybHZibk1uS1NCOGZDQmNJbHRkWENJcFhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmx4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdaR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWduY21WbmFXOXVRV1JrWldRbkxDQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNBZ0lIUm9hWE11YzNSaGRHVXVjbVZuYVc5dWN5NXdkWE5vS0hKbFoybHZiaWs3WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lDQWdjbVZuYVc5dWN6b2dkR2hwY3k1emRHRjBaUzV5WldkcGIyNXpYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJSGRwYm1SdmR5NXNiMk5oYkZOMGIzSmhaMlV1YzJWMFNYUmxiU2duY21WbmFXOXVjeWNzSUVwVFQwNHVjM1J5YVc1bmFXWjVLSFJvYVhNdWMzUmhkR1V1Y21WbmFXOXVjeWtwTzF4dUlDQWdJSDB1WW1sdVpDaDBhR2x6S1NrN1hHNGdJSDBzWEc1Y2JpQWdjbVZuYVc5dVUyVnNaV04wWldRNklHWjFibU4wYVc5dUtISmxaMmx2YmlrZ2UxeHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdjbVZuYVc5dU9pQnlaV2RwYjI1Y2JpQWdJQ0I5S1R0Y2JpQWdJQ0JrYVhOd1lYUmphR1Z5TG01dmRHbG1lVUZzYkNnbmNtVm5hVzl1Snl3Z2NtVm5hVzl1S1R0Y2JpQWdmU3hjYmx4dUlDQnlaVzF2ZG1WU1pXZHBiMjQ2SUdaMWJtTjBhVzl1S0hKbFoybHZiaWtnZTF4dUlDQWdJR3hsZENCcGJtUmxlQ0E5SUhSb2FYTXVjM1JoZEdVdWNtVm5hVzl1Y3k1cGJtUmxlRTltS0hKbFoybHZiaWs3WEc0Z0lDQWdkR2hwY3k1emRHRjBaUzV5WldkcGIyNXpMbk53YkdsalpTaHBibVJsZUN3Z01TazdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0J5WldkcGIyNXpPaUIwYUdsekxuTjBZWFJsTG5KbFoybHZibk5jYmlBZ0lDQjlLVHRjYmlBZ0lDQjNhVzVrYjNjdWJHOWpZV3hUZEc5eVlXZGxMbk5sZEVsMFpXMG9KM0psWjJsdmJuTW5MQ0JLVTA5T0xuTjBjbWx1WjJsbWVTaDBhR2x6TG5OMFlYUmxMbkpsWjJsdmJuTXBLVHRjYmlBZ2ZTeGNibHh1SUNCcGMwRmpkR2wyWlRvZ1puVnVZM1JwYjI0b2NtVm5hVzl1S1NCN1hHNGdJQ0FnYVdZZ0tISmxaMmx2YmlBOVBUMGdkR2hwY3k1emRHRjBaUzV5WldkcGIyNHBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmNJbUZqZEdsMlpWd2lYRzRnSUNBZ2ZUdGNiaUFnSUNCeVpYUjFjbTRnWENKY0lqdGNiaUFnZlN4Y2JseHVJQ0J2YmtOdmJuUmxlSFJOWlc1MU9pQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNCc1pYUWdZMjl0Y0c5dVpXNTBJRDBnZEdocGN6dGNiaUFnSUNCMllYSWdiV1Z1ZFNBOUlHNWxkeUJOWlc1MUtDazdYRzRnSUNBZ2JXVnVkUzVoY0hCbGJtUW9ibVYzSUUxbGJuVkpkR1Z0S0hzZ2JHRmlaV3c2SUNkU1pXMXZkbVVuTENCamJHbGphem9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnSUNCamIyMXdiMjVsYm5RdWNtVnRiM1psVW1WbmFXOXVLSEpsWjJsdmJpazdYRzRnSUNBZ2ZYMHBLVHRjYmlBZ0lDQnRaVzUxTG5CdmNIVndLSEpsYlc5MFpTNW5aWFJEZFhKeVpXNTBWMmx1Wkc5M0tDa3BPMXh1SUNCOUxGeHVYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnYkdWMElISmxaMmx2Ym5NZ1BTQjBhR2x6TG5OMFlYUmxMbkpsWjJsdmJuTXViV0Z3S0NoeVpXZHBiMjRwSUQwK0lIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeHNhU0JyWlhrOWUzSmxaMmx2Ymk1clpYbDlYRzRnSUNBZ0lDQWdJQ0FnSUNCamJHRnpjMDVoYldVOWUyTnNZWE56VG1GdFpYTW9YQ0pzYVhOMExXZHliM1Z3TFdsMFpXMWNJaXdnWENKeVpXZHBiMjVjSWl3Z2RHaHBjeTVwYzBGamRHbDJaU2h5WldkcGIyNHVhMlY1S1NsOUlGeHVJQ0FnSUNBZ0lDQWdJQ0FnYjI1RGIyNTBaWGgwVFdWdWRUMTdkR2hwY3k1dmJrTnZiblJsZUhSTlpXNTFMbUpwYm1Rb2RHaHBjeXdnY21WbmFXOXVLWDFjYmlBZ0lDQWdJQ0FnSUNBZ0lHOXVRMnhwWTJzOWUzUm9hWE11Y21WbmFXOXVVMlZzWldOMFpXUXVZbWx1WkNoMGFHbHpMQ0J5WldkcGIyNHVhMlY1S1gwK1hHNGdJQ0FnSUNBZ0lDQWdQR2x0WnlCamJHRnpjMDVoYldVOVhDSnBiV2N0WTJseVkyeGxJRzFsWkdsaExXOWlhbVZqZENCd2RXeHNMV3hsWm5SY0lpQnpjbU05WENKb2RIUndPaTh2YldWa2FXRXVZVzFoZW05dWQyVmljMlZ5ZG1salpYTXVZMjl0TDJGM2MxOXphVzVuYkdWaWIzaGZNREV1Y0c1blhDSWdkMmxrZEdnOVhDSXpNbHdpSUdobGFXZG9kRDFjSWpNeVhDSWdMejVjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xbFpHbGhMV0p2WkhsY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4emRISnZibWMrZTNKbFoybHZiaTV1WVcxbGZUd3ZjM1J5YjI1blBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEhBK01DQnlkVzV1YVc1blBDOXdQbHh1SUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4TDJ4cFBseHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOUtUdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhWc0lHTnNZWE56VG1GdFpUMWNJbXhwYzNRdFozSnZkWEJjSWo1Y2JpQWdJQ0FnSUNBZ1BHeHBJR05zWVhOelRtRnRaVDFjSW14cGMzUXRaM0p2ZFhBdGFHVmhaR1Z5WENJK1hHNGdJQ0FnSUNBZ0lDQWdQR2cwUGxKbFoybHZibk04TDJnMFBseHVJQ0FnSUNBZ0lDQWdJRHhCWkdSU1pXZHBiMjRnTHo1Y2JpQWdJQ0FnSUNBZ1BDOXNhVDVjYmlBZ0lDQWdJQ0FnZTNKbFoybHZibk45WEc0Z0lDQWdJQ0E4TDNWc1BseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlRhV1JsWW1GeU95SmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1RhYmxlSGVhZGVyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZUhlYWRlcicpO1xuXG52YXIgX1RhYmxlSGVhZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RhYmxlSGVhZGVyKTtcblxudmFyIF9UYWJsZUNvbnRlbnQgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlQ29udGVudCcpO1xuXG52YXIgX1RhYmxlQ29udGVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZUNvbnRlbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVGFibGUnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RhYmxlJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9UYWJsZUhlYWRlcjIuZGVmYXVsdCwgeyBjb2x1bW5zOiB0aGlzLnByb3BzLmNvbHVtbnMgfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9UYWJsZUNvbnRlbnQyLmRlZmF1bHQsIHsgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgICBjb2x1bW5zOiB0aGlzLnByb3BzLmNvbHVtbnMsXG4gICAgICAgIGxvYWRpbmc6IHRoaXMucHJvcHMubG9hZGluZyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096czdPenM3T3pzN1FVRkhRU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRE5VSXNVVUZCVFN4RlFVRkZMR3RDUVVGWE8wRkJRMnBDTEZkQlEwVTdPenROUVVORkxEWkRRVUZoTEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUVVGQlF5eEhRVUZITzAxQlF6VkRMRGhEUVVGakxFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1FVRkJRenRCUVVOMFFpeGxRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFRkJRVU03UVVGRE5VSXNaVUZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEJRVUZETEVkQlFVVTdTMEZEZEVNc1EwRkRVanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0clFrRkZXU3hMUVVGTElpd2labWxzWlNJNklsUmhZbXhsTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVVlXSnNaVWhsWVdSbGNpQm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsU0dWaFpHVnlKenRjYm1sdGNHOXlkQ0JVWVdKc1pVTnZiblJsYm5RZ1puSnZiU0FuWTI5dGNHOXVaVzUwY3k5VVlXSnNaVU52Ym5SbGJuUW5PMXh1WEc1c1pYUWdWR0ZpYkdVZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwWVdKc1pUNWNiaUFnSUNBZ0lDQWdQRlJoWW14bFNHVmhaR1Z5SUdOdmJIVnRibk05ZTNSb2FYTXVjSEp2Y0hNdVkyOXNkVzF1YzMwZ0x6NWNiaUFnSUNBZ0lDQWdQRlJoWW14bFEyOXVkR1Z1ZENCa1lYUmhQWHQwYUdsekxuQnliM0J6TG1SaGRHRjlJRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZiSFZ0Ym5NOWUzUm9hWE11Y0hKdmNITXVZMjlzZFcxdWMzMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc2IyRmthVzVuUFh0MGFHbHpMbkJ5YjNCekxteHZZV1JwYm1kOUx6NWNiaUFnSUNBZ0lEd3ZkR0ZpYkdVK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElGUmhZbXhsT3lKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfVGFibGVSb3cgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlUm93Jyk7XG5cbnZhciBfVGFibGVSb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGVSb3cpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgVGFibGVDb250ZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RhYmxlQ29udGVudCcsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBpbnN0YW5jZXNSb3dzID0gdGhpcy5wcm9wcy5kYXRhLm1hcChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KF9UYWJsZVJvdzIuZGVmYXVsdCwgeyBrZXk6IGluc3RhbmNlLmlkLCBpbnN0YW5jZTogaW5zdGFuY2UsIGNvbHVtbnM6IF90aGlzLnByb3BzLmNvbHVtbnMgfSk7XG4gICAgfSk7XG4gICAgdmFyIGVtcHR5Um93ID0gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICd0cicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3RkJyxcbiAgICAgICAgeyBjb2xTcGFuOiAnNCcgfSxcbiAgICAgICAgJ05vIHJlc3VsdHMgeWV0LidcbiAgICAgIClcbiAgICApO1xuICAgIHZhciBsb2FkaW5nID0gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICd0cicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3RkJyxcbiAgICAgICAgeyBjb2xTcGFuOiAnNCcgfSxcbiAgICAgICAgJ0xvYWRpbmcuLi4nXG4gICAgICApXG4gICAgKTtcbiAgICB2YXIgYm9keSA9IHRoaXMucHJvcHMubG9hZGluZyA/IGxvYWRpbmcgOiBpbnN0YW5jZXNSb3dzLmxlbmd0aCA/IGluc3RhbmNlc1Jvd3MgOiBlbXB0eVJvdztcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICd0Ym9keScsXG4gICAgICBudWxsLFxuICAgICAgYm9keVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZUNvbnRlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxSaFlteGxRMjl1ZEdWdWRDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN08wRkJSMEVzU1VGQlNTeFpRVUZaTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlEyNURMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6czdPMEZCUTJwQ0xGRkJRVWtzWVVGQllTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZETEZGQlFWRXNSVUZCU3p0QlFVTndSQ3hoUVVORkxEQkRRVUZWTEVkQlFVY3NSVUZCUlN4UlFVRlJMRU5CUVVNc1JVRkJSU3hCUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZGTEZGQlFWRXNRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hOUVVGTExFdEJRVXNzUTBGQlF5eFBRVUZQTEVGQlFVTXNSMEZCUnl4RFFVTXZSVHRMUVVOSUxFTkJRVU1zUTBGQlF6dEJRVU5JTEZGQlFVa3NVVUZCVVN4SFFVTldPenM3VFVGRFJUczdWVUZCU1N4UFFVRlBMRVZCUVVNc1IwRkJSenM3VDBGQmNVSTdTMEZEYWtNc1FVRkRUaXhEUVVGRE8wRkJRMFlzVVVGQlNTeFBRVUZQTEVkQlExUTdPenROUVVORk96dFZRVUZKTEU5QlFVOHNSVUZCUXl4SFFVRkhPenRQUVVGblFqdExRVU0xUWl4QlFVTk9MRU5CUVVNN1FVRkRSaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFZEJRVWNzWVVGQllTeERRVUZETEUxQlFVMHNSMEZCUnl4aFFVRmhMRWRCUVVjc1VVRkJVU3hEUVVGRE8wRkJRekZHTEZkQlEwVTdPenROUVVOSExFbEJRVWs3UzBGRFF5eERRVU5TTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08ydENRVVZaTEZsQlFWa2lMQ0ptYVd4bElqb2lWR0ZpYkdWRGIyNTBaVzUwTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JVWVdKc1pWSnZkeUJtY205dElDZGpiMjF3YjI1bGJuUnpMMVJoWW14bFVtOTNKenRjYmx4dWJHVjBJRlJoWW14bFEyOXVkR1Z1ZENBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JzWlhRZ2FXNXpkR0Z1WTJWelVtOTNjeUE5SUhSb2FYTXVjSEp2Y0hNdVpHRjBZUzV0WVhBb0tHbHVjM1JoYm1ObEtTQTlQaUI3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdJQ0E4VkdGaWJHVlNiM2NnYTJWNVBYdHBibk4wWVc1alpTNXBaSDBnYVc1emRHRnVZMlU5ZTJsdWMzUmhibU5sZlNCamIyeDFiVzV6UFh0MGFHbHpMbkJ5YjNCekxtTnZiSFZ0Ym5OOUlDOCtYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMHBPMXh1SUNBZ0lHeGxkQ0JsYlhCMGVWSnZkeUE5SUNoY2JpQWdJQ0FnSUR4MGNqNWNiaUFnSUNBZ0lDQWdQSFJrSUdOdmJGTndZVzQ5WENJMFhDSStUbThnY21WemRXeDBjeUI1WlhRdVBDOTBaRDVjYmlBZ0lDQWdJRHd2ZEhJK1hHNGdJQ0FnS1R0Y2JpQWdJQ0JzWlhRZ2JHOWhaR2x1WnlBOUlDaGNiaUFnSUNBZ0lEeDBjajVjYmlBZ0lDQWdJQ0FnUEhSa0lHTnZiRk53WVc0OVhDSTBYQ0krVEc5aFpHbHVaeTR1TGp3dmRHUStYRzRnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ2s3WEc0Z0lDQWdiR1YwSUdKdlpIa2dQU0IwYUdsekxuQnliM0J6TG14dllXUnBibWNnUHlCc2IyRmthVzVuSURvZ2FXNXpkR0Z1WTJWelVtOTNjeTVzWlc1bmRHZ2dQeUJwYm5OMFlXNWpaWE5TYjNkeklEb2daVzF3ZEhsU2IzYzdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MFltOWtlVDVjYmlBZ0lDQWdJQ0FnZTJKdlpIbDlYRzRnSUNBZ0lDQThMM1JpYjJSNVBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlVZV0pzWlVOdmJuUmxiblE3WEc0aVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBUYWJsZUhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6IFwiVGFibGVIZWFkZXJcIixcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgaGVhZGVycyA9IHRoaXMucHJvcHMuY29sdW1ucy5tYXAoZnVuY3Rpb24gKGNvbHVtbiwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBcInRoXCIsXG4gICAgICAgIHsga2V5OiBpbmRleCB9LFxuICAgICAgICBjb2x1bW4ubmFtZVxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFwidGhlYWRcIixcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBcInRyXCIsXG4gICAgICAgIG51bGwsXG4gICAgICAgIGhlYWRlcnNcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVIZWFkZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxSaFlteGxTR1ZoWkdWeUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzBGQlFVRXNTVUZCU1N4WFFVRlhMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTJ4RExGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhSUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlF5eE5RVUZOTEVWQlFVVXNTMEZCU3l4RlFVRkxPMEZCUTNSRUxHRkJRMFU3TzFWQlFVa3NSMEZCUnl4RlFVRkZMRXRCUVVzc1FVRkJRenRSUVVGRkxFMUJRVTBzUTBGQlF5eEpRVUZKTzA5QlFVMHNRMEZEYkVNN1MwRkRTQ3hEUVVGRExFTkJRVU03UVVGRFNDeFhRVU5GT3pzN1RVRkRSVHM3TzFGQlEwY3NUMEZCVHp0UFFVTk1PMHRCUTBNc1EwRkRVanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0clFrRkZXU3hYUVVGWElpd2labWxzWlNJNklsUmhZbXhsU0dWaFpHVnlMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW14bGRDQlVZV0pzWlVobFlXUmxjaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYUdWaFpHVnljeUE5SUhSb2FYTXVjSEp2Y0hNdVkyOXNkVzF1Y3k1dFlYQW9LR052YkhWdGJpd2dhVzVrWlhncElEMCtJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHgwYUNCclpYazllMmx1WkdWNGZUNTdZMjlzZFcxdUxtNWhiV1Y5UEM5MGFENWNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZTazdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MGFHVmhaRDVjYmlBZ0lDQWdJQ0FnUEhSeVBseHVJQ0FnSUNBZ0lDQWdJSHRvWldGa1pYSnpmVnh1SUNBZ0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNBZ1BDOTBhR1ZoWkQ1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1ZHRmliR1ZJWldGa1pYSTdJbDE5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgVGFibGVSb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiBcIlRhYmxlUm93XCIsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGluc3RhbmNlID0gdGhpcy5wcm9wcy5pbnN0YW5jZTtcbiAgICB2YXIgY29sdW1ucyA9IHRoaXMucHJvcHMuY29sdW1ucy5tYXAoZnVuY3Rpb24gKGNvbHVtbikge1xuICAgICAgdmFyIGtleSA9IGNvbHVtbi5rZXk7XG4gICAgICB2YXIgdmFsdWUgPSB0eXBlb2Yga2V5ID09PSBcImZ1bmN0aW9uXCIgPyBrZXkoaW5zdGFuY2UpIDogaW5zdGFuY2Vba2V5XTtcblxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidGRcIixcbiAgICAgICAgeyBrZXk6IHZhbHVlIH0sXG4gICAgICAgIHZhbHVlXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgXCJ0clwiLFxuICAgICAgbnVsbCxcbiAgICAgIGNvbHVtbnNcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVSb3c7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxSaFlteGxVbTkzTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUVVFc1NVRkJTU3hSUVVGUkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJReTlDTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU51UXl4UlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJReXhOUVVGTkxFVkJRVXM3UVVGREwwTXNWVUZCU1N4SFFVRkhMRWRCUVVjc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF6dEJRVU55UWl4VlFVRkpMRXRCUVVzc1IwRkJSeXhCUVVGRExFOUJRVThzUjBGQlJ5eExRVUZMTEZWQlFWVXNSMEZCU1N4SFFVRkhMRU5CUVVNc1VVRkJVU3hEUVVGRExFZEJRVWNzVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWNFJTeGhRVU5GT3p0VlFVRkpMRWRCUVVjc1JVRkJSU3hMUVVGTExFRkJRVU03VVVGQlJTeExRVUZMTzA5QlFVMHNRMEZETlVJN1MwRkRTQ3hEUVVGRExFTkJRVU03UVVGRFNDeFhRVU5GT3pzN1RVRkRSeXhQUVVGUE8wdEJRMHdzUTBGRFREdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeFJRVUZSSWl3aVptbHNaU0k2SWxSaFlteGxVbTkzTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklteGxkQ0JVWVdKc1pWSnZkeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYVc1emRHRnVZMlVnUFNCMGFHbHpMbkJ5YjNCekxtbHVjM1JoYm1ObE8xeHVJQ0FnSUd4bGRDQmpiMngxYlc1eklEMGdkR2hwY3k1d2NtOXdjeTVqYjJ4MWJXNXpMbTFoY0Nnb1kyOXNkVzF1S1NBOVBpQjdYRzRnSUNBZ0lDQnNaWFFnYTJWNUlEMGdZMjlzZFcxdUxtdGxlVHRjYmlBZ0lDQWdJR3hsZENCMllXeDFaU0E5SUNoMGVYQmxiMllnYTJWNUlEMDlQU0JjSW1aMWJtTjBhVzl1WENJcElEOGdhMlY1S0dsdWMzUmhibU5sS1NBNklHbHVjM1JoYm1ObFcydGxlVjA3WEc1Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4MFpDQnJaWGs5ZTNaaGJIVmxmVDU3ZG1Gc2RXVjlQQzkwWkQ1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlNrN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwY2o1Y2JpQWdJQ0FnSUNBZ2UyTnZiSFZ0Ym5OOVhHNGdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JVWVdKc1pWSnZkenNpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9TaWRlYmFyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9TaWRlYmFyJyk7XG5cbnZhciBfU2lkZWJhcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TaWRlYmFyKTtcblxudmFyIF9QYWdlQ29udGVudCA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvUGFnZUNvbnRlbnQnKTtcblxudmFyIF9QYWdlQ29udGVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9QYWdlQ29udGVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBXaW5kb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnV2luZG93JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdwYW5lLWdyb3VwJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZS1zbSBzaWRlYmFyJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9TaWRlYmFyMi5kZWZhdWx0LCBudWxsKVxuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ3BhbmUnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1BhZ2VDb250ZW50Mi5kZWZhdWx0LCBudWxsKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBXaW5kb3c7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxkcGJtUnZkeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPMEZCUjBFc1NVRkJTU3hOUVVGTkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJSVGRDTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRkxMRk5CUVZNc1JVRkJReXhaUVVGWk8wMUJRM3BDT3p0VlFVRkxMRk5CUVZNc1JVRkJReXhwUWtGQmFVSTdVVUZET1VJc05FTkJRVmM3VDBGRFVEdE5RVU5PT3p0VlFVRkxMRk5CUVZNc1JVRkJReXhOUVVGTk8xRkJRMjVDTEdkRVFVRmxPMDlCUTFnN1MwRkRSaXhEUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMnRDUVVWWkxFMUJRVTBpTENKbWFXeGxJam9pVjJsdVpHOTNMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JUYVdSbFltRnlJR1p5YjIwZ0oyTnZiWEJ2Ym1WdWRITXZVMmxrWldKaGNpYzdYRzVwYlhCdmNuUWdVR0ZuWlVOdmJuUmxiblFnWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlRWVdkbFEyOXVkR1Z1ZENjN0lGeHVYRzVzWlhRZ1YybHVaRzkzSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2ljR0Z1WlMxbmNtOTFjRndpUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CaGJtVXRjMjBnYzJsa1pXSmhjbHdpUGx4dUlDQWdJQ0FnSUNBZ0lEeFRhV1JsWW1GeUlDOCtYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luQmhibVZjSWo1Y2JpQWdJQ0FnSUNBZ0lDQThVR0ZuWlVOdmJuUmxiblFnTHo1Y2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdWMmx1Wkc5M095SmRmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgX2xpc3RlbmVycyA9IHt9O1xuXG52YXIgRGlzcGF0Y2hlciA9IGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7fTtcbkRpc3BhdGNoZXIucHJvdG90eXBlID0ge1xuXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3RlcihhY3Rpb25OYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICghX2xpc3RlbmVyc1thY3Rpb25OYW1lXSkge1xuICAgICAgX2xpc3RlbmVyc1thY3Rpb25OYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIF9saXN0ZW5lcnNbYWN0aW9uTmFtZV0ucHVzaChjYWxsYmFjayk7XG4gIH0sXG5cbiAgbm90aWZ5QWxsOiBmdW5jdGlvbiBub3RpZnlBbGwoYWN0aW9uTmFtZSkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGNhbGxiYWNrcyA9IF9saXN0ZW5lcnNbYWN0aW9uTmFtZV0gfHwgW107XG4gICAgY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjay5jYWxsLmFwcGx5KGNhbGxiYWNrLCBbY2FsbGJhY2tdLmNvbmNhdChhcmdzKSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbnZhciBhcHBEaXNwYWNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBhcHBEaXNwYWNoZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1ScGMzQmhkR05vWlhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3UVVGQlFTeEpRVUZKTEZWQlFWVXNSMEZCUnl4RlFVRkZMRU5CUVVNN08wRkJSWEJDTEVsQlFVa3NWVUZCVlN4SFFVRkhMRk5CUVdJc1ZVRkJWU3hIUVVGakxFVkJRVVVzUTBGQlF6dEJRVU12UWl4VlFVRlZMRU5CUVVNc1UwRkJVeXhIUVVGSE96dEJRVVZ5UWl4VlFVRlJMRVZCUVVVc2EwSkJRVk1zVlVGQlZTeEZRVUZGTEZGQlFWRXNSVUZCUlR0QlFVTjJReXhSUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEZWQlFWVXNRMEZCUXl4RlFVRkZPMEZCUXpOQ0xHZENRVUZWTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGRE8wdEJRemRDT3p0QlFVVkVMR05CUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNN1IwRkRka003TzBGQlJVUXNWMEZCVXl4RlFVRkZMRzFDUVVGVExGVkJRVlVzUlVGQlZ6dHpRMEZCVGl4SlFVRkpPMEZCUVVvc1ZVRkJTVHM3TzBGQlEzSkRMRkZCUVVrc1UwRkJVeXhIUVVGSExGVkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkROME1zWVVGQlV5eERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRkRMRkZCUVZFc1JVRkJTenRCUVVNNVFpeGpRVUZSTEVOQlFVTXNTVUZCU1N4TlFVRkJMRU5CUVdJc1VVRkJVU3hIUVVGTkxGRkJRVkVzVTBGQlN5eEpRVUZKTEVWQlFVTXNRMEZCUXp0TFFVTnNReXhEUVVGRExFTkJRVU03UjBGRFNqdERRVU5HTEVOQlFVTTdPMEZCUlVZc1NVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeFZRVUZWTEVWQlFVVXNRMEZCUXpzN2EwSkJSWEpDTEZsQlFWa2lMQ0ptYVd4bElqb2laR2x6Y0dGMFkyaGxjaTVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUl1TDNOeVl5OXFjeThpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKc1pYUWdYMnhwYzNSbGJtVnljeUE5SUh0OU8xeHVYRzVzWlhRZ1JHbHpjR0YwWTJobGNpQTlJR1oxYm1OMGFXOXVLQ2tnZTMwN1hHNUVhWE53WVhSamFHVnlMbkJ5YjNSdmRIbHdaU0E5SUh0Y2JpQWdYRzRnSUhKbFoybHpkR1Z5T2lCbWRXNWpkR2x2YmloaFkzUnBiMjVPWVcxbExDQmpZV3hzWW1GamF5a2dlMXh1SUNBZ0lHbG1JQ2doWDJ4cGMzUmxibVZ5YzF0aFkzUnBiMjVPWVcxbFhTa2dlMXh1SUNBZ0lDQWdYMnhwYzNSbGJtVnljMXRoWTNScGIyNU9ZVzFsWFNBOUlGdGRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lGOXNhWE4wWlc1bGNuTmJZV04wYVc5dVRtRnRaVjB1Y0hWemFDaGpZV3hzWW1GamF5azdYRzRnSUgwc1hHNWNiaUFnYm05MGFXWjVRV3hzT2lCbWRXNWpkR2x2YmloaFkzUnBiMjVPWVcxbExDQXVMaTVoY21kektTQjdYRzRnSUNBZ2JHVjBJR05oYkd4aVlXTnJjeUE5SUY5c2FYTjBaVzVsY25OYllXTjBhVzl1VG1GdFpWMGdmSHdnVzEwN1hHNGdJQ0FnWTJGc2JHSmhZMnR6TG1admNrVmhZMmdvS0dOaGJHeGlZV05yS1NBOVBpQjdYRzRnSUNBZ0lDQmpZV3hzWW1GamF5NWpZV3hzS0dOaGJHeGlZV05yTENBdUxpNWhjbWR6S1R0Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1ZlR0Y2JseHViR1YwSUdGd2NFUnBjM0JoWTJobGNpQTlJRzVsZHlCRWFYTndZWFJqYUdWeUtDazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR0Z3Y0VScGMzQmhZMmhsY2pzaVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfV2luZG93ID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9XaW5kb3cnKTtcblxudmFyIF9XaW5kb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfV2luZG93KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1dpbmRvdzIuZGVmYXVsdCwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aW5kb3ctY29udGVudCcpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTFoYVc0dWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN1FVRkZRU3hSUVVGUkxFTkJRVU1zVFVGQlRTeERRVU5pTERKRFFVRlZMRVZCUTFZc1VVRkJVU3hEUVVGRExHTkJRV01zUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVNeFF5eERRVUZESWl3aVptbHNaU0k2SW0xaGFXNHVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRmRwYm1SdmR5Qm1jbTl0SUNkamIyMXdiMjVsYm5SekwxZHBibVJ2ZHljN1hHNWNibEpsWVdOMFJFOU5MbkpsYm1SbGNpaGNiaUFnUEZkcGJtUnZkeUF2UGl4Y2JpQWdaRzlqZFcxbGJuUXVaMlYwUld4bGJXVnVkRUo1U1dRb0ozZHBibVJ2ZHkxamIyNTBaVzUwSnlsY2JpazdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBhd3MgPSBlbGVjdHJvblJlcXVpcmUoJy4vYXdzLWNvbmZpZy5qc29uJyk7XG5cbnZhciBBV1MgPSBlbGVjdHJvblJlcXVpcmUoJ2F3cy1zZGsnKTtcbkFXUy5jb25maWcudXBkYXRlKGF3cyk7XG5cbnZhciBnZXRFYzIgPSBmdW5jdGlvbiBnZXRFYzIoKSB7XG4gIHZhciByZWdpb24gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAnZXUtd2VzdC0xJyA6IGFyZ3VtZW50c1swXTtcblxuICByZXR1cm4gbmV3IEFXUy5FQzIoeyByZWdpb246IHJlZ2lvbiB9KTtcbn07XG5cbnZhciByZWdpb25OYW1lcyA9IHtcbiAgJ3VzLWVhc3QtMSc6IFwiVVMgRWFzdCAoTi4gVmlyZ2luaWEpXCIsXG4gICd1cy13ZXN0LTInOiBcIlVTIFdlc3QgKE9yZWdvbilcIixcbiAgJ3VzLXdlc3QtMSc6IFwiVVMgV2VzdCAoTi4gQ2FsaWZvcm5pYSlcIixcbiAgJ2V1LXdlc3QtMSc6IFwiRVUgKElyZWxhbmQpXCIsXG4gICdldS1jZW50cmFsLTEnOiBcIkVVIChGcmFua2Z1cnQpXCIsXG4gICdhcC1zb3V0aGVhc3QtMSc6IFwiQXNpYSBQYWNpZmljIChTaW5nYXBvcmUpXCIsXG4gICdhcC1ub3J0aGVhc3QtMSc6IFwiQXNpYSBQYWNpZmljIChUb2t5bylcIixcbiAgJ2FwLXNvdXRoZWFzdC0yJzogXCJBc2lhIFBhY2lmaWMgKFN5ZG5leSlcIixcbiAgJ3NhLWVhc3QtMSc6IFwiU291dGggQW1lcmljYSAoU8OjbyBQYXVsbylcIlxufTtcblxudmFyIGVjMkluc3RhbmNlcyA9IHtcbiAgZmV0Y2hJbnN0YW5jZXM6IGZ1bmN0aW9uIGZldGNoSW5zdGFuY2VzKHJlZ2lvbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgdmFyIGVjMiA9IGdldEVjMihyZWdpb24pO1xuICAgICAgZWMyLmRlc2NyaWJlSW5zdGFuY2VzKGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHZhciBpbnN0YW5jZXMgPSBkYXRhLlJlc2VydmF0aW9ucy5tYXAoZnVuY3Rpb24gKGluc3RhbmNlT2JqZWN0KSB7XG4gICAgICAgICAgdmFyIGluc3RhbmNlID0gaW5zdGFuY2VPYmplY3QuSW5zdGFuY2VzWzBdO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IGluc3RhbmNlLlN0YXRlLk5hbWUsXG4gICAgICAgICAgICBpbnN0YW5jZVR5cGU6IGluc3RhbmNlLkluc3RhbmNlVHlwZSxcbiAgICAgICAgICAgIGtleU5hbWU6IGluc3RhbmNlLktleU5hbWUsXG4gICAgICAgICAgICB0YWdzOiBpbnN0YW5jZS5UYWdzLm1hcChmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAga2V5OiB0YWcuS2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0YWcuVmFsdWVcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcHVibGljSXBBZGRyZXNzOiBpbnN0YW5jZS5QdWJsaWNJcEFkZHJlc3MsXG4gICAgICAgICAgICBpZDogaW5zdGFuY2UuSW5zdGFuY2VJZFxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKGluc3RhbmNlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBmZXRjaFJlZ2lvbnM6IGZ1bmN0aW9uIGZldGNoUmVnaW9ucygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgIHZhciBlYzIgPSBnZXRFYzIoKTtcbiAgICAgIGVjMi5kZXNjcmliZVJlZ2lvbnMoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuXG4gICAgICAgIHZhciByZWdpb25zID0gZGF0YS5SZWdpb25zLm1hcChmdW5jdGlvbiAocmVnaW9uKSB7XG4gICAgICAgICAgdmFyIHJlZ2lvbk5hbWUgPSByZWdpb24uUmVnaW9uTmFtZTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiByZWdpb25OYW1lLFxuICAgICAgICAgICAgbmFtZTogcmVnaW9uTmFtZXNbcmVnaW9uTmFtZV0gfHwgcmVnaW9uTmFtZVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmUocmVnaW9ucyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZWMySW5zdGFuY2VzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVmpNaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096dEJRVUZCTEVsQlFVa3NSMEZCUnl4SFFVRkhMR1ZCUVdVc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4RFFVRkRPenRCUVVVdlF5eEpRVUZKTEVkQlFVY3NSMEZCUnl4bFFVRmxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGNrTXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdPMEZCUlhaQ0xFbEJRVWtzVFVGQlRTeEhRVUZITEZOQlFWUXNUVUZCVFN4SFFVRm5RenROUVVGd1FpeE5RVUZOTEhsRVFVRkRMRmRCUVZjN08wRkJRM1JETEZOQlFVOHNTVUZCU1N4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFVkJRVU1zVFVGQlRTeEZRVUZGTEUxQlFVMHNSVUZCUXl4RFFVRkRMRU5CUVVNN1EwRkRkRU1zUTBGQlFUczdRVUZGUkN4SlFVRkpMRmRCUVZjc1IwRkJSenRCUVVOb1FpeGhRVUZYTEVWQlFVVXNkVUpCUVhWQ08wRkJRM0JETEdGQlFWY3NSVUZCUlN4clFrRkJhMEk3UVVGREwwSXNZVUZCVnl4RlFVRkZMSGxDUVVGNVFqdEJRVU4wUXl4aFFVRlhMRVZCUVVVc1kwRkJZenRCUVVNelFpeG5Ra0ZCWXl4RlFVRkZMR2RDUVVGblFqdEJRVU5vUXl4clFrRkJaMElzUlVGQlJTd3dRa0ZCTUVJN1FVRkROVU1zYTBKQlFXZENMRVZCUVVVc2MwSkJRWE5DTzBGQlEzaERMR3RDUVVGblFpeEZRVUZGTEhWQ1FVRjFRanRCUVVONlF5eGhRVUZYTEVWQlFVVXNNa0pCUVRKQ08wTkJRM3BETEVOQlFVTTdPMEZCUlVZc1NVRkJTU3haUVVGWkxFZEJRVWM3UVVGRGFrSXNaMEpCUVdNc1JVRkJSU3gzUWtGQlV5eE5RVUZOTEVWQlFVVTdRVUZETDBJc1YwRkJUeXhKUVVGSkxFOUJRVThzUTBGQlF5eFZRVUZUTEU5QlFVOHNSVUZCUlR0QlFVTnVReXhWUVVGSkxFZEJRVWNzUjBGQlJ5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRla0lzVTBGQlJ5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExGVkJRVk1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NSVUZCUlR0QlFVTjRReXhsUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTJ4Q0xGbEJRVWtzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVU1zWTBGQll5eEZRVUZMTzBGQlEzaEVMR05CUVVrc1VVRkJVU3hIUVVGSExHTkJRV01zUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRNME1zYVVKQlFVODdRVUZEVEN4clFrRkJUU3hGUVVGRkxGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1R0QlFVTXpRaXgzUWtGQldTeEZRVUZGTEZGQlFWRXNRMEZCUXl4WlFVRlpPMEZCUTI1RExHMUNRVUZQTEVWQlFVVXNVVUZCVVN4RFFVRkRMRTlCUVU4N1FVRkRla0lzWjBKQlFVa3NSVUZCUlN4UlFVRlJMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZETEVkQlFVY3NSVUZCU3p0QlFVTXZRaXh4UWtGQlR6dEJRVU5NTEcxQ1FVRkhMRVZCUVVVc1IwRkJSeXhEUVVGRExFZEJRVWM3UVVGRFdpeHhRa0ZCU3l4RlFVRkZMRWRCUVVjc1EwRkJReXhMUVVGTE8yVkJRMnBDTEVOQlFVTTdZVUZEU0N4RFFVRkRPMEZCUTBZc01rSkJRV1VzUlVGQlJTeFJRVUZSTEVOQlFVTXNaVUZCWlR0QlFVTjZReXhqUVVGRkxFVkJRVVVzVVVGQlVTeERRVUZETEZWQlFWVTdWMEZEZUVJc1EwRkJRVHRUUVVOR0xFTkJRVU1zUTBGQlF6dEJRVU5JTEdWQlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRQUVVOd1FpeERRVUZETEVOQlFVTTdTMEZEU2l4RFFVRkRMRU5CUVVNN1IwRkRTanM3UVVGRlJDeGpRVUZaTEVWQlFVVXNkMEpCUVZjN1FVRkRka0lzVjBGQlR5eEpRVUZKTEU5QlFVOHNRMEZCUXl4VlFVRlRMRTlCUVU4c1JVRkJSVHRCUVVOdVF5eFZRVUZKTEVkQlFVY3NSMEZCUnl4TlFVRk5MRVZCUVVVc1EwRkJRenRCUVVOdVFpeFRRVUZITEVOQlFVTXNaVUZCWlN4RFFVRkRMRlZCUVZNc1IwRkJSeXhGUVVGRkxFbEJRVWtzUlVGQlJUczdRVUZGZEVNc1dVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJVeXhOUVVGTkxFVkJRVVU3UVVGRE9VTXNZMEZCU1N4VlFVRlZMRWRCUVVjc1RVRkJUU3hEUVVGRExGVkJRVlVzUTBGQlF6dEJRVU51UXl4cFFrRkJUenRCUVVOTUxHVkJRVWNzUlVGQlJTeFZRVUZWTzBGQlEyWXNaMEpCUVVrc1JVRkJSU3hYUVVGWExFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NWVUZCVlR0WFFVTTFReXhEUVVGRE8xTkJRMGdzUTBGQlF5eERRVUZET3p0QlFVVklMR1ZCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dFBRVU5zUWl4RFFVRkRMRU5CUVVNN1MwRkRTaXhEUVVGRExFTkJRVU03UjBGRFNqdERRVU5HTEVOQlFVTTdPMnRDUVVWaExGbEJRVmtpTENKbWFXeGxJam9pWldNeUxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbXhsZENCaGQzTWdQU0JsYkdWamRISnZibEpsY1hWcGNtVW9KeTR2WVhkekxXTnZibVpwWnk1cWMyOXVKeWs3WEc1Y2JteGxkQ0JCVjFNZ1BTQmxiR1ZqZEhKdmJsSmxjWFZwY21Vb0oyRjNjeTF6WkdzbktUc2dYRzVCVjFNdVkyOXVabWxuTG5Wd1pHRjBaU2hoZDNNcE8xeHVYRzVzWlhRZ1oyVjBSV015SUQwZ1puVnVZM1JwYjI0b2NtVm5hVzl1UFNkbGRTMTNaWE4wTFRFbktTQjdYRzRnSUhKbGRIVnliaUJ1WlhjZ1FWZFRMa1ZETWloN2NtVm5hVzl1T2lCeVpXZHBiMjU5S1R0Y2JuMWNibHh1YkdWMElISmxaMmx2Yms1aGJXVnpJRDBnZTF4dUlDQW5kWE10WldGemRDMHhKem9nWENKVlV5QkZZWE4wSUNoT0xpQldhWEpuYVc1cFlTbGNJaXhjYmlBZ0ozVnpMWGRsYzNRdE1pYzZJRndpVlZNZ1YyVnpkQ0FvVDNKbFoyOXVLVndpTEZ4dUlDQW5kWE10ZDJWemRDMHhKem9nWENKVlV5QlhaWE4wSUNoT0xpQkRZV3hwWm05eWJtbGhLVndpTEZ4dUlDQW5aWFV0ZDJWemRDMHhKem9nWENKRlZTQW9TWEpsYkdGdVpDbGNJaXhjYmlBZ0oyVjFMV05sYm5SeVlXd3RNU2M2SUZ3aVJWVWdLRVp5WVc1clpuVnlkQ2xjSWl4Y2JpQWdKMkZ3TFhOdmRYUm9aV0Z6ZEMweEp6b2dYQ0pCYzJsaElGQmhZMmxtYVdNZ0tGTnBibWRoY0c5eVpTbGNJaXhjYmlBZ0oyRndMVzV2Y25Sb1pXRnpkQzB4SnpvZ1hDSkJjMmxoSUZCaFkybG1hV01nS0ZSdmEzbHZLVndpTEZ4dUlDQW5ZWEF0YzI5MWRHaGxZWE4wTFRJbk9pQmNJa0Z6YVdFZ1VHRmphV1pwWXlBb1UzbGtibVY1S1Z3aUxGeHVJQ0FuYzJFdFpXRnpkQzB4SnpvZ1hDSlRiM1YwYUNCQmJXVnlhV05oSUNoVHc2TnZJRkJoZFd4dktWd2lYRzU5TzF4dVhHNXNaWFFnWldNeVNXNXpkR0Z1WTJWeklEMGdlMXh1SUNCbVpYUmphRWx1YzNSaGJtTmxjem9nWm5WdVkzUnBiMjRvY21WbmFXOXVLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXBJSHRjYmlBZ0lDQWdJR3hsZENCbFl6SWdQU0JuWlhSRll6SW9jbVZuYVc5dUtUdGNiaUFnSUNBZ0lHVmpNaTVrWlhOamNtbGlaVWx1YzNSaGJtTmxjeWhtZFc1amRHbHZiaWhsY25Jc0lHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29aR0YwWVNrN1hHNGdJQ0FnSUNBZ0lHeGxkQ0JwYm5OMFlXNWpaWE1nUFNCa1lYUmhMbEpsYzJWeWRtRjBhVzl1Y3k1dFlYQW9LR2x1YzNSaGJtTmxUMkpxWldOMEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2JHVjBJR2x1YzNSaGJtTmxJRDBnYVc1emRHRnVZMlZQWW1wbFkzUXVTVzV6ZEdGdVkyVnpXekJkTzF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J6ZEdGMGRYTTZJR2x1YzNSaGJtTmxMbE4wWVhSbExrNWhiV1VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQnBibk4wWVc1alpWUjVjR1U2SUdsdWMzUmhibU5sTGtsdWMzUmhibU5sVkhsd1pTeGNiaUFnSUNBZ0lDQWdJQ0FnSUd0bGVVNWhiV1U2SUdsdWMzUmhibU5sTGt0bGVVNWhiV1VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQjBZV2R6T2lCcGJuTjBZVzVqWlM1VVlXZHpMbTFoY0Nnb2RHRm5LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYTJWNU9pQjBZV2N1UzJWNUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhiSFZsT2lCMFlXY3VWbUZzZFdWY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdjSFZpYkdsalNYQkJaR1J5WlhOek9pQnBibk4wWVc1alpTNVFkV0pzYVdOSmNFRmtaSEpsYzNNc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWkRvZ2FXNXpkR0Z1WTJVdVNXNXpkR0Z1WTJWSlpGeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lISmxjMjlzZG1Vb2FXNXpkR0Z1WTJWektUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVYRzRnSUdabGRHTm9VbVZuYVc5dWN6b2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJRY205dGFYTmxLR1oxYm1OMGFXOXVLSEpsYzI5c2RtVXBJSHRjYmlBZ0lDQWdJR3hsZENCbFl6SWdQU0JuWlhSRll6SW9LVHRjYmlBZ0lDQWdJR1ZqTWk1a1pYTmpjbWxpWlZKbFoybHZibk1vWm5WdVkzUnBiMjRvWlhKeUxDQmtZWFJoS1NCN1hHNWNiaUFnSUNBZ0lDQWdiR1YwSUhKbFoybHZibk1nUFNCa1lYUmhMbEpsWjJsdmJuTXViV0Z3S0daMWJtTjBhVzl1S0hKbFoybHZiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lHeGxkQ0J5WldkcGIyNU9ZVzFsSUQwZ2NtVm5hVzl1TGxKbFoybHZiazVoYldVN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUd0bGVUb2djbVZuYVc5dVRtRnRaU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHNWhiV1U2SUhKbFoybHZiazVoYldWelczSmxaMmx2Yms1aGJXVmRJSHg4SUhKbFoybHZiazVoYldWY2JpQWdJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0lDQnlaWE52YkhabEtISmxaMmx2Ym5NcE8xeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTazdYRzRnSUgxY2JuMDdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1ZqTWtsdWMzUmhibU5sY3pzaVhYMD0iXX0=
