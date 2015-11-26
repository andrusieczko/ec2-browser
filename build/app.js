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

var remote = electronRequire('remote');
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
'use strict';
'use scrict';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvQWRkUmVnaW9uLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9FYzJJbnN0YW5jZXMuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1BhZ2VDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9SZWdpb25MaXN0LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9TaWRlYmFyLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZS5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZUhlYWRlci5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdy5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXIuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9tYWluLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7RUFDM0MsS0FBSyxFQUFFLElBQUk7QUFDYixDQUFDLENBQUMsQ0FBQzs7QUFFSCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsdUVBQXVFLENBQUMsQ0FBQzs7QUFFbkcsSUFBSSxZQUFZLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXZELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDOztBQUVsRixJQUFJLElBQUksR0FBRyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDREQUE0RCxDQUFDLENBQUM7O0FBRXhGLElBQUksWUFBWSxHQUFHLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV2RCxTQUFTLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdB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RSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRTtjQUNyQyxPQUFPO2dCQUNMLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDWixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7ZUFDakIsQ0FBQzthQUNILENBQUM7WUFDRixlQUFlLEVBQUUsUUFBUSxDQUFDLGVBQWU7WUFDekMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxVQUFVO1dBQ3hCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDcEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0FBQ1AsR0FBRzs7RUFFRCxZQUFZLEVBQUUsU0FBUyxZQUFZLEdBQUc7SUFDcEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtNQUNwQyxJQUFJLEdBQUcsR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUN6QixNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsVUFBVSxHQUFHLEVBQUUsSUFBSSxFQUFFOztRQUV2QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLE1BQU0sRUFBRTtVQUMvQyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1VBQ25DLE9BQU87WUFDTCxHQUFHLEVBQUUsVUFBVTtZQUNmLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVTtXQUM1QyxDQUFDO0FBQ1osU0FBUyxDQUFDLENBQUM7O1FBRUgsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2xCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKO0FBQ0gsQ0FBQyxDQUFDOztBQUVGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBQy9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTUgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfUmVnaW9uTGlzdCA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvUmVnaW9uTGlzdCcpO1xuXG52YXIgX1JlZ2lvbkxpc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUmVnaW9uTGlzdCk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgQWRkUmVnaW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0FkZFJlZ2lvbicsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpc3RWaXNpYmxlOiBmYWxzZSxcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgbG9hZGluZzogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uQWRkZWQnLCAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsaXN0VmlzaWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGFkZFJlZ2lvbjogZnVuY3Rpb24gYWRkUmVnaW9uKGUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuZGF0YS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaXN0VmlzaWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBfdGhpcztcbiAgICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgbGlzdFZpc2libGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIF9lYzIuZGVmYXVsdC5mZXRjaFJlZ2lvbnMoKS50aGVuKGZ1bmN0aW9uIChyZWdpb25zKSB7XG4gICAgICAgICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgICAgICAgIGxpc3RWaXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogcmVnaW9ucyxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkoKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc3BhbicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3NwYW4nLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2FkZC1idXR0b24nLCBvbkNsaWNrOiB0aGlzLmFkZFJlZ2lvbiB9LFxuICAgICAgICAnKydcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9SZWdpb25MaXN0Mi5kZWZhdWx0LCB7IHZpc2libGU6IHRoaXMuc3RhdGUubGlzdFZpc2libGUsIHJlZ2lvbnM6IHRoaXMuc3RhdGUuZGF0YSwgbG9hZGluZzogdGhpcy5zdGF0ZS5sb2FkaW5nIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEFkZFJlZ2lvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa0ZrWkZKbFoybHZiaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPenM3T3p0QlFVbEJMRWxCUVVrc1UwRkJVeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOb1F5eHBRa0ZCWlN4RlFVRkZMREpDUVVGWE8wRkJRekZDTEZkQlFVODdRVUZEVEN4cFFrRkJWeXhGUVVGRkxFdEJRVXM3UVVGRGJFSXNWVUZCU1N4RlFVRkZMRVZCUVVVN1FVRkRVaXhoUVVGUExFVkJRVVVzUzBGQlN6dExRVU5tTEVOQlFVTTdSMEZEU0RzN1FVRkZSQ3h0UWtGQmFVSXNSVUZCUlN3MlFrRkJWenRCUVVNMVFpeDVRa0ZCVnl4UlFVRlJMRU5CUVVNc1lVRkJZU3hGUVVGRkxFTkJRVUVzVlVGQlV5eE5RVUZOTEVWQlFVVTdRVUZEYkVRc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdWQlFVOHNSVUZCUlN4TFFVRkxPMEZCUTJRc2JVSkJRVmNzUlVGQlJTeExRVUZMTzA5QlEyNUNMRU5CUVVNc1EwRkJRenRMUVVOS0xFTkJRVUVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVObU96dEJRVVZFTEZkQlFWTXNSVUZCUlN4dFFrRkJVeXhEUVVGRExFVkJRVVU3T3p0QlFVTnlRaXhSUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVNeFFpeFZRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTFvc2JVSkJRVmNzUlVGQlJTeEpRVUZKTzA5QlEyeENMRU5CUVVNc1EwRkJRenRMUVVOS0xFMUJRVTA3TzBGQlEwd3NXVUZCU1N4VFFVRlRMRkZCUVU4c1EwRkJRenRCUVVOeVFpeGpRVUZMTEZGQlFWRXNRMEZCUXp0QlFVTmFMR2xDUVVGUExFVkJRVVVzU1VGQlNUdEJRVU5pTEhGQ1FVRlhMRVZCUVVVc1NVRkJTVHRUUVVOc1FpeERRVUZETEVOQlFVTTdRVUZEU0N4eFFrRkJTU3haUVVGWkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVXl4UFFVRlBMRVZCUVVVN1FVRkRlRU1zYlVKQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRha0lzZFVKQlFWY3NSVUZCUlN4SlFVRkpPMEZCUTJwQ0xHZENRVUZKTEVWQlFVVXNUMEZCVHp0QlFVTmlMRzFDUVVGUExFVkJRVVVzUzBGQlN6dFhRVU5tTEVOQlFVTXNRMEZCUXp0VFFVTktMRU5CUVVNc1EwRkJRenM3UzBGRFNqdEhRVU5HT3p0QlFVVkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenM3VFVGRFJUczdWVUZCVFN4VFFVRlRMRVZCUVVNc1dVRkJXU3hGUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4QlFVRkRPenRQUVVGVE8wMUJRemxFTERSRFFVRlpMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZkQlFWY3NRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4SFFVRkhPMHRCUTJwSExFTkJRMUE3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN2EwSkJSVmtzVTBGQlV5SXNJbVpwYkdVaU9pSkJaR1JTWldkcGIyNHVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRkpsWjJsdmJreHBjM1FnWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlTWldkcGIyNU1hWE4wSnp0Y2JtbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dVhHNXNaWFFnUVdSa1VtVm5hVzl1SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQnNhWE4wVm1semFXSnNaVG9nWm1Gc2MyVXNYRzRnSUNBZ0lDQmtZWFJoT2lCYlhTeGNiaUFnSUNBZ0lHeHZZV1JwYm1jNklHWmhiSE5sWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNibHh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ1pHbHpjR0YwWTJobGNpNXlaV2RwYzNSbGNpZ25jbVZuYVc5dVFXUmtaV1FuTENCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdJQ0JzYjJGa2FXNW5PaUJtWVd4elpTeGNiaUFnSUNBZ0lDQWdiR2x6ZEZacGMybGliR1U2SUdaaGJITmxYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlMRnh1WEc0Z0lHRmtaRkpsWjJsdmJqb2dablZ1WTNScGIyNG9aU2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbk4wWVhSbExtUmhkR0V1YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lDQWdiR2x6ZEZacGMybGliR1U2SUhSeWRXVmNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCc1pYUWdZMjl0Y0c5dVpXNTBJRDBnZEdocGN6dGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNCc2IyRmthVzVuT2lCMGNuVmxMRnh1SUNBZ0lDQWdJQ0JzYVhOMFZtbHphV0pzWlRvZ2RISjFaVnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0JsWXpJdVptVjBZMmhTWldkcGIyNXpLQ2t1ZEdobGJpaG1kVzVqZEdsdmJpaHlaV2RwYjI1ektTQjdYRzRnSUNBZ0lDQWdJR052YlhCdmJtVnVkQzV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0FnSUNBZ2JHbHpkRlpwYzJsaWJHVTZJSFJ5ZFdVc1hHNGdJQ0FnSUNBZ0lDQWdaR0YwWVRvZ2NtVm5hVzl1Y3l4Y2JpQWdJQ0FnSUNBZ0lDQnNiMkZrYVc1bk9pQm1ZV3h6WlZ4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThjM0JoYmo1Y2JpQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVlXUmtMV0oxZEhSdmJsd2lJRzl1UTJ4cFkyczllM1JvYVhNdVlXUmtVbVZuYVc5dWZUNHJQQzl6Y0dGdVBseHVJQ0FnSUNBZ0lDQThVbVZuYVc5dVRHbHpkQ0IyYVhOcFlteGxQWHQwYUdsekxuTjBZWFJsTG14cGMzUldhWE5wWW14bGZTQnlaV2RwYjI1elBYdDBhR2x6TG5OMFlYUmxMbVJoZEdGOUlHeHZZV1JwYm1jOWUzUm9hWE11YzNSaGRHVXViRzloWkdsdVozMGdMejVjYmlBZ0lDQWdJRHd2YzNCaGJqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdRV1JrVW1WbmFXOXVPeUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9UYWJsZSA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGUnKTtcblxudmFyIF9UYWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZSk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgdGFnID0gZnVuY3Rpb24gdGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50YWdzLmZpbHRlcihmdW5jdGlvbiAodGFnKSB7XG4gICAgICByZXR1cm4gdGFnLmtleSA9PT0gdGFnTmFtZTtcbiAgICB9KVswXS52YWx1ZTtcbiAgfTtcbn07XG5cbnZhciBFYzJJbnN0YW5jZXMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRWMySW5zdGFuY2VzJyxcblxuICBjb2x1bW5zOiBbeyBuYW1lOiBcIklkXCIsIGtleTogJ2lkJyB9LCB7IG5hbWU6IFwiTmFtZVwiLCBrZXk6IHRhZyhcIk5hbWVcIikgfSwgeyBuYW1lOiBcIktleSBuYW1lXCIsIGtleTogJ2tleU5hbWUnIH0sIHsgbmFtZTogXCJJbnN0YW5jZSB0eXBlXCIsIGtleTogJ2luc3RhbmNlVHlwZScgfSwgeyBuYW1lOiBcIlN0YXR1c1wiLCBrZXk6ICdzdGF0dXMnIH1dLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICByZWdpb246ICdldS13ZXN0LTEnXG4gICAgfTtcbiAgfSxcblxuICBmZXRjaEluc3RhbmNlczogZnVuY3Rpb24gZmV0Y2hJbnN0YW5jZXMocmVnaW9uKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcztcbiAgICBfZWMyLmRlZmF1bHQuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKS50aGVuKGZ1bmN0aW9uIChpbnN0YW5jZXMpIHtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIGRhdGE6IGluc3RhbmNlcyxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmZldGNoSW5zdGFuY2VzKHRoaXMuc3RhdGUucmVnaW9uKTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uJywgKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHRoaXMuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKTtcbiAgICB9KS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBjaGFuZ2VSZWdpb246IGZ1bmN0aW9uIGNoYW5nZVJlZ2lvbihlKSB7XG4gICAgdmFyIHJlZ2lvbiA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVnaW9uOiByZWdpb24sXG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSk7XG4gICAgdGhpcy5mZXRjaEluc3RhbmNlcyhyZWdpb24pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfVGFibGUyLmRlZmF1bHQsIHsgY29sdW1uczogdGhpcy5jb2x1bW5zLCBkYXRhOiB0aGlzLnN0YXRlLmRhdGEsIGxvYWRpbmc6IHRoaXMuc3RhdGUubG9hZGluZyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBFYzJJbnN0YW5jZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtWak1rbHVjM1JoYm1ObGN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN096czdPenRCUVVsQkxFbEJRVWtzUjBGQlJ5eEhRVUZITEZOQlFVNHNSMEZCUnl4RFFVRlpMRTlCUVU4c1JVRkJSVHRCUVVNeFFpeFRRVUZQTEZWQlFWTXNVVUZCVVN4RlFVRkZPMEZCUTNoQ0xGZEJRVThzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJReXhIUVVGSExFVkJRVXM3UVVGRGJrTXNZVUZCVHl4SFFVRkhMRU5CUVVNc1IwRkJSeXhMUVVGTExFOUJRVThzUTBGQlF6dExRVU0xUWl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETzBkQlEySXNRMEZCUXp0RFFVTklMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlEyNURMRk5CUVU4c1JVRkJSU3hEUVVOUUxFVkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlN4SFFVRkhMRVZCUVVVc1NVRkJTU3hGUVVGRExFVkJRM1pDTEVWQlFVTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1JVRkJSU3hIUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkRMRVZCUTJoRExFVkJRVU1zU1VGQlNTeEZRVUZGTEZWQlFWVXNSVUZCUlN4SFFVRkhMRVZCUVVVc1UwRkJVeXhGUVVGRExFVkJRMnhETEVWQlFVTXNTVUZCU1N4RlFVRkZMR1ZCUVdVc1JVRkJSU3hIUVVGSExFVkJRVVVzWTBGQll5eEZRVUZETEVWQlF6VkRMRVZCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeEhRVUZITEVWQlFVVXNVVUZCVVN4RlFVRkRMRU5CUTJoRE96dEJRVVZFTEdsQ1FVRmxMRVZCUVVVc01rSkJRVmM3UVVGRE1VSXNWMEZCVHp0QlFVTk1MRlZCUVVrc1JVRkJSU3hGUVVGRk8wRkJRMUlzWVVGQlR5eEZRVUZGTEVsQlFVazdRVUZEWWl4WlFVRk5MRVZCUVVVc1YwRkJWenRMUVVOd1FpeERRVUZETzBkQlEwZzdPMEZCUlVRc1owSkJRV01zUlVGQlJTeDNRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkRMMElzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR0ZCUVU4c1JVRkJSU3hKUVVGSk8wdEJRMlFzUTBGQlF5eERRVUZET3p0QlFVVklMRkZCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU55UWl4cFFrRkJTU3hqUVVGakxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVVNc1UwRkJVeXhGUVVGTE8wRkJRemRETEdWQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRha0lzV1VGQlNTeEZRVUZGTEZOQlFWTTdRVUZEWml4bFFVRlBMRVZCUVVVc1MwRkJTenRQUVVObUxFTkJRVU1zUTBGQlF6dExRVU5LTEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjJReXg1UWtGQlZ5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVFc1ZVRkJVeXhOUVVGTkxFVkJRVVU3UVVGRE4wTXNWVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dExRVU0zUWl4RFFVRkJMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEWmpzN1FVRkZSQ3hqUVVGWkxFVkJRVVVzYzBKQlFWTXNRMEZCUXl4RlFVRkZPMEZCUTNoQ0xGRkJRVWtzVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRXaXhaUVVGTkxFVkJRVVVzVFVGQlRUdEJRVU5rTEdGQlFVOHNSVUZCUlN4SlFVRkpPMHRCUTJRc1EwRkJReXhEUVVGRE8wRkJRMGdzVVVGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRIUVVNM1FqczdRVUZGUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN08wMUJRMFVzZFVOQlFVOHNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFRkJRVU1zUlVGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFRkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFRkJRVU1zUjBGQlJ6dExRVU5vUml4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmxCUVZraUxDSm1hV3hsSWpvaVJXTXlTVzV6ZEdGdVkyVnpMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWVdKc1pTQm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsSnp0Y2JtbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dVhHNXNaWFFnZEdGbklEMGdablZ1WTNScGIyNG9kR0ZuVG1GdFpTa2dlMXh1SUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRvYVc1emRHRnVZMlVwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdhVzV6ZEdGdVkyVXVkR0ZuY3k1bWFXeDBaWElvS0hSaFp5a2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJoWnk1clpYa2dQVDA5SUhSaFowNWhiV1U3WEc0Z0lDQWdmU2xiTUYwdWRtRnNkV1U3WEc0Z0lIMDdYRzU5TzF4dVhHNXNaWFFnUldNeVNXNXpkR0Z1WTJWeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCamIyeDFiVzV6T2lCYlhHNGdJQ0FnZTI1aGJXVTZJRndpU1dSY0lpd2dhMlY1T2lBbmFXUW5mU3hjYmlBZ0lDQjdibUZ0WlRvZ1hDSk9ZVzFsWENJc0lHdGxlVG9nZEdGbktGd2lUbUZ0WlZ3aUtYMHNYRzRnSUNBZ2UyNWhiV1U2SUZ3aVMyVjVJRzVoYldWY0lpd2dhMlY1T2lBbmEyVjVUbUZ0WlNkOUxGeHVJQ0FnSUh0dVlXMWxPaUJjSWtsdWMzUmhibU5sSUhSNWNHVmNJaXdnYTJWNU9pQW5hVzV6ZEdGdVkyVlVlWEJsSjMwc1hHNGdJQ0FnZTI1aGJXVTZJRndpVTNSaGRIVnpYQ0lzSUd0bGVUb2dKM04wWVhSMWN5ZDlMRnh1SUNCZExGeHVYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR1JoZEdFNklGdGRMRnh1SUNBZ0lDQWdiRzloWkdsdVp6b2dkSEoxWlN4Y2JpQWdJQ0FnSUhKbFoybHZiam9nSjJWMUxYZGxjM1F0TVNkY2JpQWdJQ0I5TzF4dUlDQjlMRnh1WEc0Z0lHWmxkR05vU1c1emRHRnVZMlZ6T2lCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lHeHZZV1JwYm1jNklIUnlkV1ZjYmlBZ0lDQjlLVHRjYmlBZ0lDQmNiaUFnSUNCc1pYUWdZMjl0Y0c5dVpXNTBJRDBnZEdocGN6dGNiaUFnSUNCbFl6SXVabVYwWTJoSmJuTjBZVzVqWlhNb2NtVm5hVzl1S1M1MGFHVnVLQ2hwYm5OMFlXNWpaWE1wSUQwK0lIdGNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQWdJR1JoZEdFNklHbHVjM1JoYm1ObGN5eGNiaUFnSUNBZ0lDQWdiRzloWkdsdVp6b2dabUZzYzJWY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJR052YlhCdmJtVnVkRVJwWkUxdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0IwYUdsekxtWmxkR05vU1c1emRHRnVZMlZ6S0hSb2FYTXVjM1JoZEdVdWNtVm5hVzl1S1R0Y2JpQWdJQ0JrYVhOd1lYUmphR1Z5TG5KbFoybHpkR1Z5S0NkeVpXZHBiMjRuTENCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVabVYwWTJoSmJuTjBZVzVqWlhNb2NtVm5hVzl1S1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dVhHNGdJR05vWVc1blpWSmxaMmx2YmpvZ1puVnVZM1JwYjI0b1pTa2dlMXh1SUNBZ0lHeGxkQ0J5WldkcGIyNGdQU0JsTG5SaGNtZGxkQzUyWVd4MVpUdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjYmlBZ0lDQWdJSEpsWjJsdmJqb2djbVZuYVc5dUxGeHVJQ0FnSUNBZ2JHOWhaR2x1WnpvZ2RISjFaVnh1SUNBZ0lIMHBPMXh1SUNBZ0lIUm9hWE11Wm1WMFkyaEpibk4wWVc1alpYTW9jbVZuYVc5dUtUdGNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wyUGx4dUlDQWdJQ0FnSUNBOFZHRmliR1VnWTI5c2RXMXVjejE3ZEdocGN5NWpiMngxYlc1emZTQmtZWFJoUFh0MGFHbHpMbk4wWVhSbExtUmhkR0Y5SUd4dllXUnBibWM5ZTNSb2FYTXVjM1JoZEdVdWJHOWhaR2x1WjMwZ0x6NWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCRll6Skpibk4wWVc1alpYTTdJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX0VjMkluc3RhbmNlcyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvRWMySW5zdGFuY2VzJyk7XG5cbnZhciBfRWMySW5zdGFuY2VzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0VjMkluc3RhbmNlcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBQYWdlQ29udGVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdQYWdlQ29udGVudCcsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9FYzJJbnN0YW5jZXMyLmRlZmF1bHQsIG51bGwpXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFBhZ2VDb250ZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsQmhaMlZEYjI1MFpXNTBMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenM3T3p0QlFVVkJMRWxCUVVrc1YwRkJWeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOc1F5eFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdPMDFCUTBVc2FVUkJRV2RDTzB0QlExb3NRMEZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4WFFVRlhJaXdpWm1sc1pTSTZJbEJoWjJWRGIyNTBaVzUwTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCRll6Skpibk4wWVc1alpYTWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OUZZekpKYm5OMFlXNWpaWE1uTzF4dVhHNXNaWFFnVUdGblpVTnZiblJsYm5RZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZK1hHNGdJQ0FnSUNBZ0lEeEZZekpKYm5OMFlXNWpaWE1nTHo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JRWVdkbFEyOXVkR1Z1ZERzaVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFJlZ2lvbkxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUmVnaW9uTGlzdCcsXG5cbiAgcmVnaW9uQ2hvc2VuOiBmdW5jdGlvbiByZWdpb25DaG9zZW4ocmVnaW9uKSB7XG4gICAgX2Rpc3BhdGNoZXIyLmRlZmF1bHQubm90aWZ5QWxsKCdyZWdpb25BZGRlZCcsIHJlZ2lvbik7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgbG9hZGluZyA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnbGknLFxuICAgICAgbnVsbCxcbiAgICAgICdMb2FkaW5nJ1xuICAgICk7XG4gICAgdmFyIHJlZ2lvbnMgPSB0aGlzLnByb3BzLnJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnbGknLFxuICAgICAgICB7IGtleTogcmVnaW9uLmtleSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdhJyxcbiAgICAgICAgICB7IG9uQ2xpY2s6IF90aGlzLnJlZ2lvbkNob3Nlbi5iaW5kKF90aGlzLCByZWdpb24pIH0sXG4gICAgICAgICAgcmVnaW9uLm5hbWVcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZhciBib2R5ID0gdGhpcy5wcm9wcy5sb2FkaW5nID8gbG9hZGluZyA6IHJlZ2lvbnM7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndWwnLFxuICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJyZWdpb25zLWxpc3RcIiwgdGhpcy5wcm9wcy52aXNpYmxlID8gJ3Zpc2libGUnIDogJycpIH0sXG4gICAgICBib2R5XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFJlZ2lvbkxpc3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxKbFoybHZia3hwYzNRdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPMEZCUTBFc1NVRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWMlF5eEpRVUZKTEZWQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZEYWtNc1kwRkJXU3hGUVVGRkxITkNRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTTNRaXg1UWtGQlZ5eFRRVUZUTEVOQlFVTXNZVUZCWVN4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wZEJRemRETzBGQlEwUXNVVUZCVFN4RlFVRkZMR3RDUVVGWE96czdRVUZEYWtJc1VVRkJTU3hQUVVGUExFZEJRMVE3T3pzN1MwRkJaMElzUVVGRGFrSXNRMEZCUXp0QlFVTkdMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExFMUJRVTBzUlVGQlN6dEJRVU12UXl4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4QlFVRkRPMUZCUTJ4Q096dFpRVUZITEU5QlFVOHNSVUZCUlN4TlFVRkxMRmxCUVZrc1EwRkJReXhKUVVGSkxGRkJRVThzVFVGQlRTeERRVUZETEVGQlFVTTdWVUZCUlN4TlFVRk5MRU5CUVVNc1NVRkJTVHRUUVVGTE8wOUJRMmhGTEVOQlEwdzdTMEZEU0N4RFFVRkRMRU5CUVVNN08wRkJSVWdzVVVGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXp0QlFVTnNSQ3hYUVVORk96dFJRVUZKTEZOQlFWTXNSVUZCUlN4VlFVRlZMRU5CUVVNc1kwRkJZeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4SFFVRkRMRk5CUVZNc1IwRkJReXhGUVVGRkxFTkJRVU1zUVVGQlF6dE5RVU40UlN4SlFVRkpPMHRCUTBZc1EwRkRURHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0clFrRkZXU3hWUVVGVklpd2labWxzWlNJNklsSmxaMmx2Ymt4cGMzUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJR1JwYzNCaGRHTm9aWElnWm5KdmJTQW5aR2x6Y0dGMFkyaGxjaWM3WEc1c1pYUWdZMnhoYzNOT1lXMWxjeUE5SUhKbGNYVnBjbVVvSjJOc1lYTnpibUZ0WlhNbktUdGNibHh1YkdWMElGSmxaMmx2Ymt4cGMzUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxaMmx2YmtOb2IzTmxiam9nWm5WdVkzUnBiMjRvY21WbmFXOXVLU0I3WEc0Z0lDQWdaR2x6Y0dGMFkyaGxjaTV1YjNScFpubEJiR3dvSjNKbFoybHZia0ZrWkdWa0p5d2djbVZuYVc5dUtUdGNiaUFnZlN4Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYkc5aFpHbHVaeUE5SUNBb1hHNGdJQ0FnSUNBOGJHaytURzloWkdsdVp6d3ZiR2srWEc0Z0lDQWdLVHRjYmlBZ0lDQnNaWFFnY21WbmFXOXVjeUE5SUhSb2FYTXVjSEp2Y0hNdWNtVm5hVzl1Y3k1dFlYQW9LSEpsWjJsdmJpa2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEd4cElHdGxlVDE3Y21WbmFXOXVMbXRsZVgwK1hHNGdJQ0FnSUNBZ0lDQWdQR0VnYjI1RGJHbGphejE3ZEdocGN5NXlaV2RwYjI1RGFHOXpaVzR1WW1sdVpDaDBhR2x6TENCeVpXZHBiMjRwZlQ1N2NtVm5hVzl1TG01aGJXVjlQQzloUGx4dUlDQWdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDQWdLVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJR3hsZENCaWIyUjVJRDBnZEdocGN5NXdjbTl3Y3k1c2IyRmthVzVuSUQ4Z2JHOWhaR2x1WnlBNklISmxaMmx2Ym5NN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOWUyTnNZWE56VG1GdFpYTW9YQ0p5WldkcGIyNXpMV3hwYzNSY0lpd2dkR2hwY3k1d2NtOXdjeTUyYVhOcFlteGxQeWQyYVhOcFlteGxKem9uSnlsOVBseHVJQ0FnSUNBZ0lDQjdZbTlrZVgxY2JpQWdJQ0FnSUR3dmRXdytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRkpsWjJsdmJreHBjM1E3SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kaXNwYXRjaGVyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvZGlzcGF0Y2hlcicpO1xuXG52YXIgX2Rpc3BhdGNoZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlzcGF0Y2hlcik7XG5cbnZhciBfQWRkUmVnaW9uID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9BZGRSZWdpb24nKTtcblxudmFyIF9BZGRSZWdpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQWRkUmVnaW9uKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciByZW1vdGUgPSBlbGVjdHJvblJlcXVpcmUoJ3JlbW90ZScpO1xudmFyIE1lbnUgPSByZW1vdGUuTWVudTtcbnZhciBNZW51SXRlbSA9IHJlbW90ZS5NZW51SXRlbTtcblxudmFyIFNpZGViYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2lkZWJhcicsXG5cbiAgY29udGV4dE1lbnU6IG51bGwsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZ2lvbjogJ2V1LXdlc3QtMScsXG4gICAgICByZWdpb25zOiBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVnaW9ucycpIHx8IFwiW11cIilcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uQWRkZWQnLCAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgdGhpcy5zdGF0ZS5yZWdpb25zLnB1c2gocmVnaW9uKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWdpb25zOiB0aGlzLnN0YXRlLnJlZ2lvbnNcbiAgICAgIH0pO1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWdpb25zJywgSlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5yZWdpb25zKSk7XG4gICAgfSkuYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgcmVnaW9uU2VsZWN0ZWQ6IGZ1bmN0aW9uIHJlZ2lvblNlbGVjdGVkKHJlZ2lvbikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVnaW9uOiByZWdpb25cbiAgICB9KTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5ub3RpZnlBbGwoJ3JlZ2lvbicsIHJlZ2lvbik7XG4gIH0sXG5cbiAgcmVtb3ZlUmVnaW9uOiBmdW5jdGlvbiByZW1vdmVSZWdpb24ocmVnaW9uKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS5yZWdpb25zLmluZGV4T2YocmVnaW9uKTtcbiAgICB0aGlzLnN0YXRlLnJlZ2lvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlZ2lvbnM6IHRoaXMuc3RhdGUucmVnaW9uc1xuICAgIH0pO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVnaW9ucycsIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucmVnaW9ucykpO1xuICB9LFxuXG4gIGlzQWN0aXZlOiBmdW5jdGlvbiBpc0FjdGl2ZShyZWdpb24pIHtcbiAgICBpZiAocmVnaW9uID09PSB0aGlzLnN0YXRlLnJlZ2lvbikge1xuICAgICAgcmV0dXJuIFwiYWN0aXZlXCI7XG4gICAgfTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcblxuICBvbkNvbnRleHRNZW51OiBmdW5jdGlvbiBvbkNvbnRleHRNZW51KHJlZ2lvbikge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzO1xuICAgIHZhciBtZW51ID0gbmV3IE1lbnUoKTtcbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oeyBsYWJlbDogJ1JlbW92ZScsIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgY29tcG9uZW50LnJlbW92ZVJlZ2lvbihyZWdpb24pO1xuICAgICAgfSB9KSk7XG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHJlZ2lvbnMgPSB0aGlzLnN0YXRlLnJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnbGknLFxuICAgICAgICB7IGtleTogcmVnaW9uLmtleSxcbiAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJsaXN0LWdyb3VwLWl0ZW1cIiwgXCJyZWdpb25cIiwgX3RoaXMuaXNBY3RpdmUocmVnaW9uLmtleSkpLFxuICAgICAgICAgIG9uQ29udGV4dE1lbnU6IF90aGlzLm9uQ29udGV4dE1lbnUuYmluZChfdGhpcywgcmVnaW9uKSxcbiAgICAgICAgICBvbkNsaWNrOiBfdGhpcy5yZWdpb25TZWxlY3RlZC5iaW5kKF90aGlzLCByZWdpb24ua2V5KSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbWcnLCB7IGNsYXNzTmFtZTogJ2ltZy1jaXJjbGUgbWVkaWEtb2JqZWN0IHB1bGwtbGVmdCcsIHNyYzogJ2h0dHA6Ly9tZWRpYS5hbWF6b253ZWJzZXJ2aWNlcy5jb20vYXdzX3NpbmdsZWJveF8wMS5wbmcnLCB3aWR0aDogJzMyJywgaGVpZ2h0OiAnMzInIH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbWVkaWEtYm9keScgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgcmVnaW9uLm5hbWVcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAncCcsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJzAgcnVubmluZydcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndWwnLFxuICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWdyb3VwJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2xpJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWdyb3VwLWhlYWRlcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaDQnLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgJ1JlZ2lvbnMnXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX0FkZFJlZ2lvbjIuZGVmYXVsdCwgbnVsbClcbiAgICAgICksXG4gICAgICByZWdpb25zXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFNpZGViYXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxOcFpHVmlZWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3pzN096czdPenRCUVVWQkxFbEJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenM3UVVGRmRrTXNTVUZCVFN4TlFVRk5MRWRCUVVjc1pVRkJaU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzcERMRWxCUVUwc1NVRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZEZWtJc1NVRkJUU3hSUVVGUkxFZEJRVWNzVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXpzN1FVRkZha01zU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6bENMR0ZCUVZjc1JVRkJSU3hKUVVGSk96dEJRVVZxUWl4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4N1FVRkRUQ3haUVVGTkxFVkJRVVVzVjBGQlZ6dEJRVU51UWl4aFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTTdTMEZEY0VVc1EwRkJRenRIUVVOSU96dEJRVVZFTEcxQ1FVRnBRaXhGUVVGRkxEWkNRVUZYTzBGQlF6VkNMSGxDUVVGWExGRkJRVkVzUTBGQlF5eGhRVUZoTEVWQlFVVXNRMEZCUVN4VlFVRlRMRTFCUVUwc1JVRkJSVHRCUVVOc1JDeFZRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEYUVNc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdWQlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTg3VDBGRE5VSXNRMEZCUXl4RFFVRkRPMEZCUTBnc1dVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRelZGTEVOQlFVRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU5tT3p0QlFVVkVMR2RDUVVGakxFVkJRVVVzZDBKQlFWTXNUVUZCVFN4RlFVRkZPMEZCUXk5Q0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4WlFVRk5MRVZCUVVVc1RVRkJUVHRMUVVObUxFTkJRVU1zUTBGQlF6dEJRVU5JTEhsQ1FVRlhMRk5CUVZNc1EwRkJReXhSUVVGUkxFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdSMEZEZUVNN08wRkJSVVFzWTBGQldTeEZRVUZGTEhOQ1FVRlRMRTFCUVUwc1JVRkJSVHRCUVVNM1FpeFJRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRMME1zVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTndReXhSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NZVUZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR6dExRVU0xUWl4RFFVRkRMRU5CUVVNN1FVRkRTQ3hWUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03UjBGRE5VVTdPMEZCUlVRc1ZVRkJVU3hGUVVGRkxHdENRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTjZRaXhSUVVGSkxFMUJRVTBzUzBGQlN5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVOb1F5eGhRVUZQTEZGQlFWRXNRMEZCUXp0TFFVTnFRaXhEUVVGRE8wRkJRMFlzVjBGQlR5eEZRVUZGTEVOQlFVTTdSMEZEV0RzN1FVRkZSQ3hsUVVGaExFVkJRVVVzZFVKQlFWTXNUVUZCVFN4RlFVRkZPMEZCUXpsQ0xGRkJRVWtzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnlRaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NSVUZCUlN4RFFVRkRPMEZCUTNSQ0xGRkJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4UlFVRlJMRU5CUVVNc1JVRkJSU3hMUVVGTExFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlN4cFFrRkJWenRCUVVNMVJDeHBRa0ZCVXl4RFFVRkRMRmxCUVZrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFBRVU5vUXl4RlFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMHdzVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTNaRE96dEJRVVZFTEZGQlFVMHNSVUZCUlN4clFrRkJWenM3TzBGQlEycENMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExFMUJRVTBzUlVGQlN6dEJRVU12UXl4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4QlFVRkRPMEZCUTJoQ0xHMUNRVUZUTEVWQlFVVXNWVUZCVlN4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEZGQlFWRXNSVUZCUlN4TlFVRkxMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRVUZCUXp0QlFVTTVSU3gxUWtGQllTeEZRVUZGTEUxQlFVc3NZVUZCWVN4RFFVRkRMRWxCUVVrc1VVRkJUeXhOUVVGTkxFTkJRVU1zUVVGQlF6dEJRVU55UkN4cFFrRkJUeXhGUVVGRkxFMUJRVXNzWTBGQll5eERRVUZETEVsQlFVa3NVVUZCVHl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFRkJRVU03VVVGRGRFUXNOa0pCUVVzc1UwRkJVeXhGUVVGRExHMURRVUZ0UXl4RlFVRkRMRWRCUVVjc1JVRkJReXg1UkVGQmVVUXNSVUZCUXl4TFFVRkxMRVZCUVVNc1NVRkJTU3hGUVVGRExFMUJRVTBzUlVGQlF5eEpRVUZKTEVkQlFVYzdVVUZETVVrN08xbEJRVXNzVTBGQlV5eEZRVUZETEZsQlFWazdWVUZEZWtJN096dFpRVUZUTEUxQlFVMHNRMEZCUXl4SlFVRkpPMWRCUVZVN1ZVRkRPVUk3T3pzN1YwRkJaMEk3VTBGRFdqdFBRVU5JTEVOQlEwdzdTMEZEU0N4RFFVRkRMRU5CUVVNN1FVRkRTQ3hYUVVORk96dFJRVUZKTEZOQlFWTXNSVUZCUXl4WlFVRlpPMDFCUTNoQ096dFZRVUZKTEZOQlFWTXNSVUZCUXl4dFFrRkJiVUk3VVVGREwwSTdPenM3VTBGQlowSTdVVUZEYUVJc09FTkJRV0U3VDBGRFZqdE5RVU5LTEU5QlFVODdTMEZEVEN4RFFVTk1PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRTlCUVU4aUxDSm1hV3hsSWpvaVUybGtaV0poY2k1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdUwzTnlZeTlxY3k4aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1pHbHpjR0YwWTJobGNpQm1jbTl0SUNka2FYTndZWFJqYUdWeUp6dGNibWx0Y0c5eWRDQkJaR1JTWldkcGIyNGdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OUJaR1JTWldkcGIyNG5PMXh1YkdWMElHTnNZWE56VG1GdFpYTWdQU0J5WlhGMWFYSmxLQ2RqYkdGemMyNWhiV1Z6SnlrN1hHNWNibU52Ym5OMElISmxiVzkwWlNBOUlHVnNaV04wY205dVVtVnhkV2x5WlNnbmNtVnRiM1JsSnlrN1hHNWpiMjV6ZENCTlpXNTFJRDBnY21WdGIzUmxMazFsYm5VN1hHNWpiMjV6ZENCTlpXNTFTWFJsYlNBOUlISmxiVzkwWlM1TlpXNTFTWFJsYlR0Y2JseHViR1YwSUZOcFpHVmlZWElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJR052Ym5SbGVIUk5aVzUxT2lCdWRXeHNMRnh1WEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUhKbFoybHZiam9nSjJWMUxYZGxjM1F0TVNjc1hHNGdJQ0FnSUNCeVpXZHBiMjV6T2lCS1UwOU9MbkJoY25ObEtIZHBibVJ2ZHk1c2IyTmhiRk4wYjNKaFoyVXVaMlYwU1hSbGJTZ25jbVZuYVc5dWN5Y3BJSHg4SUZ3aVcxMWNJaWxjYmlBZ0lDQjlPMXh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEVScFpFMXZkVzUwT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCa2FYTndZWFJqYUdWeUxuSmxaMmx6ZEdWeUtDZHlaV2RwYjI1QlpHUmxaQ2NzSUdaMWJtTjBhVzl1S0hKbFoybHZiaWtnZTF4dUlDQWdJQ0FnZEdocGN5NXpkR0YwWlM1eVpXZHBiMjV6TG5CMWMyZ29jbVZuYVc5dUtUdGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNCeVpXZHBiMjV6T2lCMGFHbHpMbk4wWVhSbExuSmxaMmx2Ym5OY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ2QybHVaRzkzTG14dlkyRnNVM1J2Y21GblpTNXpaWFJKZEdWdEtDZHlaV2RwYjI1ekp5d2dTbE5QVGk1emRISnBibWRwWm5rb2RHaHBjeTV6ZEdGMFpTNXlaV2RwYjI1ektTazdYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBLVHRjYmlBZ2ZTeGNibHh1SUNCeVpXZHBiMjVUWld4bFkzUmxaRG9nWm5WdVkzUnBiMjRvY21WbmFXOXVLU0I3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCeVpXZHBiMjQ2SUhKbFoybHZibHh1SUNBZ0lIMHBPMXh1SUNBZ0lHUnBjM0JoZEdOb1pYSXVibTkwYVdaNVFXeHNLQ2R5WldkcGIyNG5MQ0J5WldkcGIyNHBPMXh1SUNCOUxGeHVYRzRnSUhKbGJXOTJaVkpsWjJsdmJqb2dablZ1WTNScGIyNG9jbVZuYVc5dUtTQjdYRzRnSUNBZ2JHVjBJR2x1WkdWNElEMGdkR2hwY3k1emRHRjBaUzV5WldkcGIyNXpMbWx1WkdWNFQyWW9jbVZuYVc5dUtUdGNiaUFnSUNCMGFHbHpMbk4wWVhSbExuSmxaMmx2Ym5NdWMzQnNhV05sS0dsdVpHVjRMQ0F4S1R0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lISmxaMmx2Ym5NNklIUm9hWE11YzNSaGRHVXVjbVZuYVc5dWMxeHVJQ0FnSUgwcE8xeHVJQ0FnSUhkcGJtUnZkeTVzYjJOaGJGTjBiM0poWjJVdWMyVjBTWFJsYlNnbmNtVm5hVzl1Y3ljc0lFcFRUMDR1YzNSeWFXNW5hV1o1S0hSb2FYTXVjM1JoZEdVdWNtVm5hVzl1Y3lrcE8xeHVJQ0I5TEZ4dVhHNGdJR2x6UVdOMGFYWmxPaUJtZFc1amRHbHZiaWh5WldkcGIyNHBJSHRjYmlBZ0lDQnBaaUFvY21WbmFXOXVJRDA5UFNCMGFHbHpMbk4wWVhSbExuSmxaMmx2YmlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUZ3aVlXTjBhWFpsWENJN1hHNGdJQ0FnZlR0Y2JpQWdJQ0J5WlhSMWNtNGdYQ0pjSWp0Y2JpQWdmU3hjYmx4dUlDQnZia052Ym5SbGVIUk5aVzUxT2lCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0JzWlhRZ1kyOXRjRzl1Wlc1MElEMGdkR2hwY3p0Y2JpQWdJQ0IyWVhJZ2JXVnVkU0E5SUc1bGR5Qk5aVzUxS0NrN1hHNGdJQ0FnYldWdWRTNWhjSEJsYm1Rb2JtVjNJRTFsYm5WSmRHVnRLSHNnYkdGaVpXdzZJQ2RTWlcxdmRtVW5MQ0JqYkdsamF6b2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdJQ0JqYjIxd2IyNWxiblF1Y21WdGIzWmxVbVZuYVc5dUtISmxaMmx2YmlrN1hHNGdJQ0FnZlgwcEtUdGNiaUFnSUNCdFpXNTFMbkJ2Y0hWd0tISmxiVzkwWlM1blpYUkRkWEp5Wlc1MFYybHVaRzkzS0NrcE8xeHVJQ0I5TEZ4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdiR1YwSUhKbFoybHZibk1nUFNCMGFHbHpMbk4wWVhSbExuSmxaMmx2Ym5NdWJXRndLQ2h5WldkcGIyNHBJRDArSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4c2FTQnJaWGs5ZTNKbFoybHZiaTVyWlhsOVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYkdGemMwNWhiV1U5ZTJOc1lYTnpUbUZ0WlhNb1hDSnNhWE4wTFdkeWIzVndMV2wwWlcxY0lpd2dYQ0p5WldkcGIyNWNJaXdnZEdocGN5NXBjMEZqZEdsMlpTaHlaV2RwYjI0dWEyVjVLU2w5SUZ4dUlDQWdJQ0FnSUNBZ0lDQWdiMjVEYjI1MFpYaDBUV1Z1ZFQxN2RHaHBjeTV2YmtOdmJuUmxlSFJOWlc1MUxtSnBibVFvZEdocGN5d2djbVZuYVc5dUtYMWNiaUFnSUNBZ0lDQWdJQ0FnSUc5dVEyeHBZMnM5ZTNSb2FYTXVjbVZuYVc5dVUyVnNaV04wWldRdVltbHVaQ2gwYUdsekxDQnlaV2RwYjI0dWEyVjVLWDArWEc0Z0lDQWdJQ0FnSUNBZ1BHbHRaeUJqYkdGemMwNWhiV1U5WENKcGJXY3RZMmx5WTJ4bElHMWxaR2xoTFc5aWFtVmpkQ0J3ZFd4c0xXeGxablJjSWlCemNtTTlYQ0pvZEhSd09pOHZiV1ZrYVdFdVlXMWhlbTl1ZDJWaWMyVnlkbWxqWlhNdVkyOXRMMkYzYzE5emFXNW5iR1ZpYjNoZk1ERXVjRzVuWENJZ2QybGtkR2c5WENJek1sd2lJR2hsYVdkb2REMWNJak15WENJZ0x6NWNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbTFsWkdsaExXSnZaSGxjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHh6ZEhKdmJtYytlM0psWjJsdmJpNXVZVzFsZlR3dmMzUnliMjVuUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQSEErTUNCeWRXNXVhVzVuUEM5d1BseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ0lDQThMMnhwUGx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5S1R0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0WjNKdmRYQmNJajVjYmlBZ0lDQWdJQ0FnUEd4cElHTnNZWE56VG1GdFpUMWNJbXhwYzNRdFozSnZkWEF0YUdWaFpHVnlYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BHZzBQbEpsWjJsdmJuTThMMmcwUGx4dUlDQWdJQ0FnSUNBZ0lEeEJaR1JTWldkcGIyNGdMejVjYmlBZ0lDQWdJQ0FnUEM5c2FUNWNiaUFnSUNBZ0lDQWdlM0psWjJsdmJuTjlYRzRnSUNBZ0lDQThMM1ZzUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCVGFXUmxZbUZ5T3lKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfVGFibGVIZWFkZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlSGVhZGVyJyk7XG5cbnZhciBfVGFibGVIZWFkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGVIZWFkZXIpO1xuXG52YXIgX1RhYmxlQ29udGVudCA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50Jyk7XG5cbnZhciBfVGFibGVDb250ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RhYmxlQ29udGVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUYWJsZScsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndGFibGUnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlSGVhZGVyMi5kZWZhdWx0LCB7IGNvbHVtbnM6IHRoaXMucHJvcHMuY29sdW1ucyB9KSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlQ29udGVudDIuZGVmYXVsdCwgeyBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICAgIGNvbHVtbnM6IHRoaXMucHJvcHMuY29sdW1ucyxcbiAgICAgICAgbG9hZGluZzogdGhpcy5wcm9wcy5sb2FkaW5nIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096czdPenM3UVVGSFFTeEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETlVJc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN096dE5RVU5GTERaRFFVRmhMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4SFFVRkhPMDFCUXpWRExEaERRVUZqTEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUVVGQlF6dEJRVU4wUWl4bFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVGQlFVTTdRVUZETlVJc1pVRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4QlFVRkRMRWRCUVVVN1MwRkRkRU1zUTBGRFVqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeExRVUZMSWl3aVptbHNaU0k2SWxSaFlteGxMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWVdKc1pVaGxZV1JsY2lCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFSaFlteGxTR1ZoWkdWeUp6dGNibWx0Y0c5eWRDQlVZV0pzWlVOdmJuUmxiblFnWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlVWVdKc1pVTnZiblJsYm5Rbk8xeHVYRzVzWlhRZ1ZHRmliR1VnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBZV0pzWlQ1Y2JpQWdJQ0FnSUNBZ1BGUmhZbXhsU0dWaFpHVnlJR052YkhWdGJuTTllM1JvYVhNdWNISnZjSE11WTI5c2RXMXVjMzBnTHo1Y2JpQWdJQ0FnSUNBZ1BGUmhZbXhsUTI5dWRHVnVkQ0JrWVhSaFBYdDBhR2x6TG5CeWIzQnpMbVJoZEdGOUlGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOdmJIVnRibk05ZTNSb2FYTXVjSEp2Y0hNdVkyOXNkVzF1YzMxY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzYjJGa2FXNW5QWHQwYUdsekxuQnliM0J6TG14dllXUnBibWQ5THo1Y2JpQWdJQ0FnSUR3dmRHRmliR1UrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZSaFlteGxPeUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9lYyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMicpO1xuXG52YXIgX2VjMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VjKTtcblxudmFyIF9UYWJsZVJvdyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cnKTtcblxudmFyIF9UYWJsZVJvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZVJvdyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBUYWJsZUNvbnRlbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVGFibGVDb250ZW50JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGluc3RhbmNlc1Jvd3MgPSB0aGlzLnByb3BzLmRhdGEubWFwKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlUm93Mi5kZWZhdWx0LCB7IGtleTogaW5zdGFuY2UuaWQsIGluc3RhbmNlOiBpbnN0YW5jZSwgY29sdW1uczogX3RoaXMucHJvcHMuY29sdW1ucyB9KTtcbiAgICB9KTtcbiAgICB2YXIgZW1wdHlSb3cgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNvbFNwYW46ICc0JyB9LFxuICAgICAgICAnTm8gcmVzdWx0cyB5ZXQuJ1xuICAgICAgKVxuICAgICk7XG4gICAgdmFyIGxvYWRpbmcgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNvbFNwYW46ICc0JyB9LFxuICAgICAgICAnTG9hZGluZy4uLidcbiAgICAgIClcbiAgICApO1xuICAgIHZhciBib2R5ID0gdGhpcy5wcm9wcy5sb2FkaW5nID8gbG9hZGluZyA6IGluc3RhbmNlc1Jvd3MubGVuZ3RoID8gaW5zdGFuY2VzUm93cyA6IGVtcHR5Um93O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3Rib2R5JyxcbiAgICAgIG51bGwsXG4gICAgICBib2R5XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlQ29udGVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFEyOXVkR1Z1ZEM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3TzBGQlIwRXNTVUZCU1N4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTI1RExGRkJRVTBzUlVGQlJTeHJRa0ZCVnpzN08wRkJRMnBDTEZGQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkRMRkZCUVZFc1JVRkJTenRCUVVOd1JDeGhRVU5GTERCRFFVRlZMRWRCUVVjc1JVRkJSU3hSUVVGUkxFTkJRVU1zUlVGQlJTeEJRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkZMRkZCUVZFc1FVRkJReXhGUVVGRExFOUJRVThzUlVGQlJTeE5RVUZMTEV0QlFVc3NRMEZCUXl4UFFVRlBMRUZCUVVNc1IwRkJSeXhEUVVNdlJUdExRVU5JTEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVrc1VVRkJVU3hIUVVOV096czdUVUZEUlRzN1ZVRkJTU3hQUVVGUExFVkJRVU1zUjBGQlJ6czdUMEZCY1VJN1MwRkRha01zUVVGRFRpeERRVUZETzBGQlEwWXNVVUZCU1N4UFFVRlBMRWRCUTFRN096dE5RVU5GT3p0VlFVRkpMRTlCUVU4c1JVRkJReXhIUVVGSE96dFBRVUZuUWp0TFFVTTFRaXhCUVVOT0xFTkJRVU03UVVGRFJpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVkQlFVY3NZVUZCWVN4RFFVRkRMRTFCUVUwc1IwRkJSeXhoUVVGaExFZEJRVWNzVVVGQlVTeERRVUZETzBGQlF6RkdMRmRCUTBVN096dE5RVU5ITEVsQlFVazdTMEZEUXl4RFFVTlNPMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmxCUVZraUxDSm1hV3hsSWpvaVZHRmliR1ZEYjI1MFpXNTBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JsWXpJZ1puSnZiU0FuYzJWeWRtbGpaWE12WldNeUp6dGNibWx0Y0c5eWRDQlVZV0pzWlZKdmR5Qm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsVW05M0p6dGNibHh1YkdWMElGUmhZbXhsUTI5dWRHVnVkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYVc1emRHRnVZMlZ6VW05M2N5QTlJSFJvYVhNdWNISnZjSE11WkdGMFlTNXRZWEFvS0dsdWMzUmhibU5sS1NBOVBpQjdYRzRnSUNBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0lDQThWR0ZpYkdWU2IzY2dhMlY1UFh0cGJuTjBZVzVqWlM1cFpIMGdhVzV6ZEdGdVkyVTllMmx1YzNSaGJtTmxmU0JqYjJ4MWJXNXpQWHQwYUdsekxuQnliM0J6TG1OdmJIVnRibk45SUM4K1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUd4bGRDQmxiWEIwZVZKdmR5QTlJQ2hjYmlBZ0lDQWdJRHgwY2o1Y2JpQWdJQ0FnSUNBZ1BIUmtJR052YkZOd1lXNDlYQ0kwWENJK1RtOGdjbVZ6ZFd4MGN5QjVaWFF1UEM5MFpENWNiaUFnSUNBZ0lEd3ZkSEkrWEc0Z0lDQWdLVHRjYmlBZ0lDQnNaWFFnYkc5aFpHbHVaeUE5SUNoY2JpQWdJQ0FnSUR4MGNqNWNiaUFnSUNBZ0lDQWdQSFJrSUdOdmJGTndZVzQ5WENJMFhDSStURzloWkdsdVp5NHVMand2ZEdRK1hHNGdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDazdYRzRnSUNBZ2JHVjBJR0p2WkhrZ1BTQjBhR2x6TG5CeWIzQnpMbXh2WVdScGJtY2dQeUJzYjJGa2FXNW5JRG9nYVc1emRHRnVZMlZ6VW05M2N5NXNaVzVuZEdnZ1B5QnBibk4wWVc1alpYTlNiM2R6SURvZ1pXMXdkSGxTYjNjN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwWW05a2VUNWNiaUFnSUNBZ0lDQWdlMkp2WkhsOVhHNGdJQ0FnSUNBOEwzUmliMlI1UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCVVlXSnNaVU52Ym5SbGJuUTdYRzRpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIFRhYmxlSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogXCJUYWJsZUhlYWRlclwiLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBoZWFkZXJzID0gdGhpcy5wcm9wcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoY29sdW1uLCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidGhcIixcbiAgICAgICAgeyBrZXk6IGluZGV4IH0sXG4gICAgICAgIGNvbHVtbi5uYW1lXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgXCJ0aGVhZFwiLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidHJcIixcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaGVhZGVyc1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZUhlYWRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFNHVmhaR1Z5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUVVFc1NVRkJTU3hYUVVGWExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRMnhETEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUXl4TlFVRk5MRVZCUVVVc1MwRkJTeXhGUVVGTE8wRkJRM1JFTEdGQlEwVTdPMVZCUVVrc1IwRkJSeXhGUVVGRkxFdEJRVXNzUVVGQlF6dFJRVUZGTEUxQlFVMHNRMEZCUXl4SlFVRkpPMDlCUVUwc1EwRkRiRU03UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVTkZPenM3VFVGRFJUczdPMUZCUTBjc1QwRkJUenRQUVVOTU8wdEJRME1zUTBGRFVqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeFhRVUZYSWl3aVptbHNaU0k2SWxSaFlteGxTR1ZoWkdWeUxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbXhsZENCVVlXSnNaVWhsWVdSbGNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdhR1ZoWkdWeWN5QTlJSFJvYVhNdWNISnZjSE11WTI5c2RXMXVjeTV0WVhBb0tHTnZiSFZ0Yml3Z2FXNWtaWGdwSUQwK0lIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeDBhQ0JyWlhrOWUybHVaR1Y0ZlQ1N1kyOXNkVzF1TG01aGJXVjlQQzkwYUQ1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlNrN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwYUdWaFpENWNiaUFnSUNBZ0lDQWdQSFJ5UGx4dUlDQWdJQ0FnSUNBZ0lIdG9aV0ZrWlhKemZWeHVJQ0FnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ0FnUEM5MGFHVmhaRDVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVkdGaWJHVklaV0ZrWlhJN0lsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBUYWJsZVJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6IFwiVGFibGVSb3dcIixcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLnByb3BzLmluc3RhbmNlO1xuICAgIHZhciBjb2x1bW5zID0gdGhpcy5wcm9wcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICB2YXIga2V5ID0gY29sdW1uLmtleTtcbiAgICAgIHZhciB2YWx1ZSA9IHR5cGVvZiBrZXkgPT09IFwiZnVuY3Rpb25cIiA/IGtleShpbnN0YW5jZSkgOiBpbnN0YW5jZVtrZXldO1xuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgXCJ0ZFwiLFxuICAgICAgICB7IGtleTogdmFsdWUgfSxcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBcInRyXCIsXG4gICAgICBudWxsLFxuICAgICAgY29sdW1uc1xuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZVJvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFVtOTNMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJRVUVzU1VGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF5OUNMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnVReXhSUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlF5eE5RVUZOTEVWQlFVczdRVUZETDBNc1ZVRkJTU3hIUVVGSExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXp0QlFVTnlRaXhWUVVGSkxFdEJRVXNzUjBGQlJ5eEJRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRlZCUVZVc1IwRkJTU3hIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVY0UlN4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeExRVUZMTEVGQlFVTTdVVUZCUlN4TFFVRkxPMDlCUVUwc1EwRkROVUk3UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVTkZPenM3VFVGRFJ5eFBRVUZQTzB0QlEwd3NRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4UlFVRlJJaXdpWm1sc1pTSTZJbFJoWW14bFVtOTNMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW14bGRDQlVZV0pzWlZKdmR5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdhVzV6ZEdGdVkyVWdQU0IwYUdsekxuQnliM0J6TG1sdWMzUmhibU5sTzF4dUlDQWdJR3hsZENCamIyeDFiVzV6SUQwZ2RHaHBjeTV3Y205d2N5NWpiMngxYlc1ekxtMWhjQ2dvWTI5c2RXMXVLU0E5UGlCN1hHNGdJQ0FnSUNCc1pYUWdhMlY1SUQwZ1kyOXNkVzF1TG10bGVUdGNiaUFnSUNBZ0lHeGxkQ0IyWVd4MVpTQTlJQ2gwZVhCbGIyWWdhMlY1SUQwOVBTQmNJbVoxYm1OMGFXOXVYQ0lwSUQ4Z2EyVjVLR2x1YzNSaGJtTmxLU0E2SUdsdWMzUmhibU5sVzJ0bGVWMDdYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHgwWkNCclpYazllM1poYkhWbGZUNTdkbUZzZFdWOVBDOTBaRDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU2s3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBjajVjYmlBZ0lDQWdJQ0FnZTJOdmJIVnRibk45WEc0Z0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlVZV0pzWlZKdmR6c2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1NpZGViYXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1NpZGViYXInKTtcblxudmFyIF9TaWRlYmFyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1NpZGViYXIpO1xuXG52YXIgX1BhZ2VDb250ZW50ID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9QYWdlQ29udGVudCcpO1xuXG52YXIgX1BhZ2VDb250ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1BhZ2VDb250ZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFdpbmRvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdXaW5kb3cnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ3BhbmUtZ3JvdXAnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdwYW5lLXNtIHNpZGViYXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1NpZGViYXIyLmRlZmF1bHQsIG51bGwpXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZScgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfUGFnZUNvbnRlbnQyLmRlZmF1bHQsIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFdpbmRvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbGRwYm1SdmR5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN08wRkJSMEVzU1VGQlNTeE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlJUZENMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenRSUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzAxQlEzcENPenRWUVVGTExGTkJRVk1zUlVGQlF5eHBRa0ZCYVVJN1VVRkRPVUlzTkVOQlFWYzdUMEZEVUR0TlFVTk9PenRWUVVGTExGTkJRVk1zUlVGQlF5eE5RVUZOTzFGQlEyNUNMR2RFUVVGbE8wOUJRMWc3UzBGRFJpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08ydENRVVZaTEUxQlFVMGlMQ0ptYVd4bElqb2lWMmx1Wkc5M0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlRhV1JsWW1GeUlHWnliMjBnSjJOdmJYQnZibVZ1ZEhNdlUybGtaV0poY2ljN1hHNXBiWEJ2Y25RZ1VHRm5aVU52Ym5SbGJuUWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OVFZV2RsUTI5dWRHVnVkQ2M3SUZ4dVhHNXNaWFFnVjJsdVpHOTNJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWNHRnVaUzFuY205MWNGd2lQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJoYm1VdGMyMGdjMmxrWldKaGNsd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4VGFXUmxZbUZ5SUM4K1hHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CaGJtVmNJajVjYmlBZ0lDQWdJQ0FnSUNBOFVHRm5aVU52Ym5SbGJuUWdMejVjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1YybHVaRzkzT3lKZGZRPT0iLCIndXNlIHN0cmljdCc7XG4ndXNlIHNjcmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgX2xpc3RlbmVycyA9IHt9O1xuXG52YXIgRGlzcGF0Y2hlciA9IGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7fTtcbkRpc3BhdGNoZXIucHJvdG90eXBlID0ge1xuXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3RlcihhY3Rpb25OYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICghX2xpc3RlbmVyc1thY3Rpb25OYW1lXSkge1xuICAgICAgX2xpc3RlbmVyc1thY3Rpb25OYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIF9saXN0ZW5lcnNbYWN0aW9uTmFtZV0ucHVzaChjYWxsYmFjayk7XG4gIH0sXG5cbiAgbm90aWZ5QWxsOiBmdW5jdGlvbiBub3RpZnlBbGwoYWN0aW9uTmFtZSkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIGNhbGxiYWNrcyA9IF9saXN0ZW5lcnNbYWN0aW9uTmFtZV0gfHwgW107XG4gICAgY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjay5jYWxsLmFwcGx5KGNhbGxiYWNrLCBbY2FsbGJhY2tdLmNvbmNhdChhcmdzKSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbnZhciBhcHBEaXNwYWNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBhcHBEaXNwYWNoZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1ScGMzQmhkR05vWlhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTEZsQlFWa3NRMEZCUXpzN096czdRVUZGWWl4SlFVRkpMRlZCUVZVc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYQkNMRWxCUVVrc1ZVRkJWU3hIUVVGSExGTkJRV0lzVlVGQlZTeEhRVUZqTEVWQlFVVXNRMEZCUXp0QlFVTXZRaXhWUVVGVkxFTkJRVU1zVTBGQlV5eEhRVUZIT3p0QlFVVnlRaXhWUVVGUkxFVkJRVVVzYTBKQlFWTXNWVUZCVlN4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVOMlF5eFJRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhGUVVGRk8wRkJRek5DTEdkQ1FVRlZMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzB0QlF6ZENPenRCUVVWRUxHTkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UjBGRGRrTTdPMEZCUlVRc1YwRkJVeXhGUVVGRkxHMUNRVUZUTEZWQlFWVXNSVUZCVnp0elEwRkJUaXhKUVVGSk8wRkJRVW9zVlVGQlNUczdPMEZCUTNKRExGRkJRVWtzVTBGQlV5eEhRVUZITEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRE4wTXNZVUZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGRExGRkJRVkVzUlVGQlN6dEJRVU01UWl4alFVRlJMRU5CUVVNc1NVRkJTU3hOUVVGQkxFTkJRV0lzVVVGQlVTeEhRVUZOTEZGQlFWRXNVMEZCU3l4SlFVRkpMRVZCUVVNc1EwRkJRenRMUVVOc1F5eERRVUZETEVOQlFVTTdSMEZEU2p0RFFVTkdMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVY3NTVUZCU1N4VlFVRlZMRVZCUVVVc1EwRkJRenM3YTBKQlJYSkNMRmxCUVZraUxDSm1hV3hsSWpvaVpHbHpjR0YwWTJobGNpNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSXVMM055WXk5cWN5OGlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUluZFhObElITmpjbWxqZENjN1hHNWNibXhsZENCZmJHbHpkR1Z1WlhKeklEMGdlMzA3WEc1Y2JteGxkQ0JFYVhOd1lYUmphR1Z5SUQwZ1puVnVZM1JwYjI0b0tTQjdmVHRjYmtScGMzQmhkR05vWlhJdWNISnZkRzkwZVhCbElEMGdlMXh1SUNCY2JpQWdjbVZuYVhOMFpYSTZJR1oxYm1OMGFXOXVLR0ZqZEdsdmJrNWhiV1VzSUdOaGJHeGlZV05yS1NCN1hHNGdJQ0FnYVdZZ0tDRmZiR2x6ZEdWdVpYSnpXMkZqZEdsdmJrNWhiV1ZkS1NCN1hHNGdJQ0FnSUNCZmJHbHpkR1Z1WlhKelcyRmpkR2x2Yms1aGJXVmRJRDBnVzEwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWDJ4cGMzUmxibVZ5YzF0aFkzUnBiMjVPWVcxbFhTNXdkWE5vS0dOaGJHeGlZV05yS1R0Y2JpQWdmU3hjYmx4dUlDQnViM1JwWm5sQmJHdzZJR1oxYm1OMGFXOXVLR0ZqZEdsdmJrNWhiV1VzSUM0dUxtRnlaM01wSUh0Y2JpQWdJQ0JzWlhRZ1kyRnNiR0poWTJ0eklEMGdYMnhwYzNSbGJtVnljMXRoWTNScGIyNU9ZVzFsWFNCOGZDQmJYVHRjYmlBZ0lDQmpZV3hzWW1GamEzTXVabTl5UldGamFDZ29ZMkZzYkdKaFkyc3BJRDArSUh0Y2JpQWdJQ0FnSUdOaGJHeGlZV05yTG1OaGJHd29ZMkZzYkdKaFkyc3NJQzR1TG1GeVozTXBPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNTlPMXh1WEc1c1pYUWdZWEJ3UkdsemNHRmphR1Z5SUQwZ2JtVjNJRVJwYzNCaGRHTm9aWElvS1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1lYQndSR2x6Y0dGamFHVnlPeUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9XaW5kb3cgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdycpO1xuXG52YXIgX1dpbmRvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9XaW5kb3cpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChfV2luZG93Mi5kZWZhdWx0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbmRvdy1jb250ZW50JykpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltMWhhVzR1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3UVVGRlFTeFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVTmlMREpEUVVGVkxFVkJRMVlzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eERRVU14UXl4RFFVRkRJaXdpWm1sc1pTSTZJbTFoYVc0dWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUxpOXpjbU12YW5Ndklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGZHBibVJ2ZHlCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFkcGJtUnZkeWM3WEc1Y2JsSmxZV04wUkU5TkxuSmxibVJsY2loY2JpQWdQRmRwYm1SdmR5QXZQaXhjYmlBZ1pHOWpkVzFsYm5RdVoyVjBSV3hsYldWdWRFSjVTV1FvSjNkcGJtUnZkeTFqYjI1MFpXNTBKeWxjYmlrN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGF3cyA9IGVsZWN0cm9uUmVxdWlyZSgnLi9hd3MtY29uZmlnLmpzb24nKTtcblxudmFyIEFXUyA9IGVsZWN0cm9uUmVxdWlyZSgnYXdzLXNkaycpO1xuQVdTLmNvbmZpZy51cGRhdGUoYXdzKTtcblxudmFyIGdldEVjMiA9IGZ1bmN0aW9uIGdldEVjMigpIHtcbiAgdmFyIHJlZ2lvbiA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/ICdldS13ZXN0LTEnIDogYXJndW1lbnRzWzBdO1xuXG4gIHJldHVybiBuZXcgQVdTLkVDMih7IHJlZ2lvbjogcmVnaW9uIH0pO1xufTtcblxudmFyIHJlZ2lvbk5hbWVzID0ge1xuICAndXMtZWFzdC0xJzogXCJVUyBFYXN0IChOLiBWaXJnaW5pYSlcIixcbiAgJ3VzLXdlc3QtMic6IFwiVVMgV2VzdCAoT3JlZ29uKVwiLFxuICAndXMtd2VzdC0xJzogXCJVUyBXZXN0IChOLiBDYWxpZm9ybmlhKVwiLFxuICAnZXUtd2VzdC0xJzogXCJFVSAoSXJlbGFuZClcIixcbiAgJ2V1LWNlbnRyYWwtMSc6IFwiRVUgKEZyYW5rZnVydClcIixcbiAgJ2FwLXNvdXRoZWFzdC0xJzogXCJBc2lhIFBhY2lmaWMgKFNpbmdhcG9yZSlcIixcbiAgJ2FwLW5vcnRoZWFzdC0xJzogXCJBc2lhIFBhY2lmaWMgKFRva3lvKVwiLFxuICAnYXAtc291dGhlYXN0LTInOiBcIkFzaWEgUGFjaWZpYyAoU3lkbmV5KVwiLFxuICAnc2EtZWFzdC0xJzogXCJTb3V0aCBBbWVyaWNhIChTw6NvIFBhdWxvKVwiXG59O1xuXG52YXIgZWMySW5zdGFuY2VzID0ge1xuICBmZXRjaEluc3RhbmNlczogZnVuY3Rpb24gZmV0Y2hJbnN0YW5jZXMocmVnaW9uKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICB2YXIgZWMyID0gZ2V0RWMyKHJlZ2lvbik7XG4gICAgICBlYzIuZGVzY3JpYmVJbnN0YW5jZXMoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgdmFyIGluc3RhbmNlcyA9IGRhdGEuUmVzZXJ2YXRpb25zLm1hcChmdW5jdGlvbiAoaW5zdGFuY2VPYmplY3QpIHtcbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZU9iamVjdC5JbnN0YW5jZXNbMF07XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogaW5zdGFuY2UuU3RhdGUuTmFtZSxcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogaW5zdGFuY2UuSW5zdGFuY2VUeXBlLFxuICAgICAgICAgICAga2V5TmFtZTogaW5zdGFuY2UuS2V5TmFtZSxcbiAgICAgICAgICAgIHRhZ3M6IGluc3RhbmNlLlRhZ3MubWFwKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IHRhZy5LZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRhZy5WYWx1ZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBwdWJsaWNJcEFkZHJlc3M6IGluc3RhbmNlLlB1YmxpY0lwQWRkcmVzcyxcbiAgICAgICAgICAgIGlkOiBpbnN0YW5jZS5JbnN0YW5jZUlkXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2VzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIGZldGNoUmVnaW9uczogZnVuY3Rpb24gZmV0Y2hSZWdpb25zKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgdmFyIGVjMiA9IGdldEVjMigpO1xuICAgICAgZWMyLmRlc2NyaWJlUmVnaW9ucyhmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG5cbiAgICAgICAgdmFyIHJlZ2lvbnMgPSBkYXRhLlJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgICAgICB2YXIgcmVnaW9uTmFtZSA9IHJlZ2lvbi5SZWdpb25OYW1lO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IHJlZ2lvbk5hbWUsXG4gICAgICAgICAgICBuYW1lOiByZWdpb25OYW1lc1tyZWdpb25OYW1lXSB8fCByZWdpb25OYW1lXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZShyZWdpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBlYzJJbnN0YW5jZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wak1pNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0QlFVRkJMRWxCUVVrc1IwRkJSeXhIUVVGSExHVkJRV1VzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE96dEJRVVV2UXl4SlFVRkpMRWRCUVVjc1IwRkJSeXhsUVVGbExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEY2tNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWFpDTEVsQlFVa3NUVUZCVFN4SFFVRkhMRk5CUVZRc1RVRkJUU3hIUVVGblF6dE5RVUZ3UWl4TlFVRk5MSGxFUVVGRExGZEJRVmM3TzBGQlEzUkRMRk5CUVU4c1NVRkJTU3hIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkZMRTFCUVUwc1JVRkJReXhEUVVGRExFTkJRVU03UTBGRGRFTXNRMEZCUXpzN1FVRkZSaXhKUVVGSkxGZEJRVmNzUjBGQlJ6dEJRVU5vUWl4aFFVRlhMRVZCUVVVc2RVSkJRWFZDTzBGQlEzQkRMR0ZCUVZjc1JVRkJSU3hyUWtGQmEwSTdRVUZETDBJc1lVRkJWeXhGUVVGRkxIbENRVUY1UWp0QlFVTjBReXhoUVVGWExFVkJRVVVzWTBGQll6dEJRVU16UWl4blFrRkJZeXhGUVVGRkxHZENRVUZuUWp0QlFVTm9ReXhyUWtGQlowSXNSVUZCUlN3d1FrRkJNRUk3UVVGRE5VTXNhMEpCUVdkQ0xFVkJRVVVzYzBKQlFYTkNPMEZCUTNoRExHdENRVUZuUWl4RlFVRkZMSFZDUVVGMVFqdEJRVU42UXl4aFFVRlhMRVZCUVVVc01rSkJRVEpDTzBOQlEzcERMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVYzdRVUZEYWtJc1owSkJRV01zUlVGQlJTeDNRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkRMMElzVjBGQlR5eEpRVUZKTEU5QlFVOHNRMEZCUXl4VlFVRlRMRTlCUVU4c1JVRkJSVHRCUVVOdVF5eFZRVUZKTEVkQlFVY3NSMEZCUnl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGVrSXNVMEZCUnl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEZWQlFWTXNSMEZCUnl4RlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVONFF5eGxRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRMnhDTEZsQlFVa3NVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVTXNZMEZCWXl4RlFVRkxPMEZCUTNoRUxHTkJRVWtzVVVGQlVTeEhRVUZITEdOQlFXTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE0wTXNhVUpCUVU4N1FVRkRUQ3hyUWtGQlRTeEZRVUZGTEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTVHRCUVVNelFpeDNRa0ZCV1N4RlFVRkZMRkZCUVZFc1EwRkJReXhaUVVGWk8wRkJRMjVETEcxQ1FVRlBMRVZCUVVVc1VVRkJVU3hEUVVGRExFOUJRVTg3UVVGRGVrSXNaMEpCUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkRMRWRCUVVjc1JVRkJTenRCUVVNdlFpeHhRa0ZCVHp0QlFVTk1MRzFDUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEVkQlFVYzdRVUZEV2l4eFFrRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eExRVUZMTzJWQlEycENMRU5CUVVNN1lVRkRTQ3hEUVVGRE8wRkJRMFlzTWtKQlFXVXNSVUZCUlN4UlFVRlJMRU5CUVVNc1pVRkJaVHRCUVVONlF5eGpRVUZGTEVWQlFVVXNVVUZCVVN4RFFVRkRMRlZCUVZVN1YwRkRlRUlzUTBGQlF6dFRRVU5JTEVOQlFVTXNRMEZCUXp0QlFVTklMR1ZCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFBRVU53UWl4RFFVRkRMRU5CUVVNN1MwRkRTaXhEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4alFVRlpMRVZCUVVVc2QwSkJRVmM3UVVGRGRrSXNWMEZCVHl4SlFVRkpMRTlCUVU4c1EwRkJReXhWUVVGVExFOUJRVThzUlVGQlJUdEJRVU51UXl4VlFVRkpMRWRCUVVjc1IwRkJSeXhOUVVGTkxFVkJRVVVzUTBGQlF6dEJRVU51UWl4VFFVRkhMRU5CUVVNc1pVRkJaU3hEUVVGRExGVkJRVk1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NSVUZCUlRzN1FVRkZkRU1zV1VGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlV5eE5RVUZOTEVWQlFVVTdRVUZET1VNc1kwRkJTU3hWUVVGVkxFZEJRVWNzVFVGQlRTeERRVUZETEZWQlFWVXNRMEZCUXp0QlFVTnVReXhwUWtGQlR6dEJRVU5NTEdWQlFVY3NSVUZCUlN4VlFVRlZPMEZCUTJZc1owSkJRVWtzUlVGQlJTeFhRVUZYTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1ZVRkJWVHRYUVVNMVF5eERRVUZETzFOQlEwZ3NRMEZCUXl4RFFVRkRPenRCUVVWSUxHVkJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0UFFVTnNRaXhEUVVGRExFTkJRVU03UzBGRFNpeERRVUZETEVOQlFVTTdSMEZEU2p0RFFVTkdMRU5CUVVNN08ydENRVVZoTEZsQlFWa2lMQ0ptYVd4bElqb2laV015TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklteGxkQ0JoZDNNZ1BTQmxiR1ZqZEhKdmJsSmxjWFZwY21Vb0p5NHZZWGR6TFdOdmJtWnBaeTVxYzI5dUp5azdYRzVjYm14bGRDQkJWMU1nUFNCbGJHVmpkSEp2YmxKbGNYVnBjbVVvSjJGM2N5MXpaR3NuS1RzZ1hHNUJWMU11WTI5dVptbG5MblZ3WkdGMFpTaGhkM01wTzF4dVhHNXNaWFFnWjJWMFJXTXlJRDBnWm5WdVkzUnBiMjRvY21WbmFXOXVQU2RsZFMxM1pYTjBMVEVuS1NCN1hHNGdJSEpsZEhWeWJpQnVaWGNnUVZkVExrVkRNaWg3Y21WbmFXOXVPaUJ5WldkcGIyNTlLVHRjYm4wN1hHNWNibXhsZENCeVpXZHBiMjVPWVcxbGN5QTlJSHRjYmlBZ0ozVnpMV1ZoYzNRdE1TYzZJRndpVlZNZ1JXRnpkQ0FvVGk0Z1ZtbHlaMmx1YVdFcFhDSXNYRzRnSUNkMWN5MTNaWE4wTFRJbk9pQmNJbFZUSUZkbGMzUWdLRTl5WldkdmJpbGNJaXhjYmlBZ0ozVnpMWGRsYzNRdE1TYzZJRndpVlZNZ1YyVnpkQ0FvVGk0Z1EyRnNhV1p2Y201cFlTbGNJaXhjYmlBZ0oyVjFMWGRsYzNRdE1TYzZJRndpUlZVZ0tFbHlaV3hoYm1RcFhDSXNYRzRnSUNkbGRTMWpaVzUwY21Gc0xURW5PaUJjSWtWVklDaEdjbUZ1YTJaMWNuUXBYQ0lzWEc0Z0lDZGhjQzF6YjNWMGFHVmhjM1F0TVNjNklGd2lRWE5wWVNCUVlXTnBabWxqSUNoVGFXNW5ZWEJ2Y21VcFhDSXNYRzRnSUNkaGNDMXViM0owYUdWaGMzUXRNU2M2SUZ3aVFYTnBZU0JRWVdOcFptbGpJQ2hVYjJ0NWJ5bGNJaXhjYmlBZ0oyRndMWE52ZFhSb1pXRnpkQzB5SnpvZ1hDSkJjMmxoSUZCaFkybG1hV01nS0ZONVpHNWxlU2xjSWl4Y2JpQWdKM05oTFdWaGMzUXRNU2M2SUZ3aVUyOTFkR2dnUVcxbGNtbGpZU0FvVThPamJ5QlFZWFZzYnlsY0lseHVmVHRjYmx4dWJHVjBJR1ZqTWtsdWMzUmhibU5sY3lBOUlIdGNiaUFnWm1WMFkyaEpibk4wWVc1alpYTTZJR1oxYm1OMGFXOXVLSEpsWjJsdmJpa2dlMXh1SUNBZ0lISmxkSFZ5YmlCdVpYY2dVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabEtTQjdYRzRnSUNBZ0lDQnNaWFFnWldNeUlEMGdaMlYwUldNeUtISmxaMmx2YmlrN1hHNGdJQ0FnSUNCbFl6SXVaR1Z6WTNKcFltVkpibk4wWVc1alpYTW9ablZ1WTNScGIyNG9aWEp5TENCa1lYUmhLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHUmhkR0VwTzF4dUlDQWdJQ0FnSUNCc1pYUWdhVzV6ZEdGdVkyVnpJRDBnWkdGMFlTNVNaWE5sY25aaGRHbHZibk11YldGd0tDaHBibk4wWVc1alpVOWlhbVZqZENrZ1BUNGdlMXh1SUNBZ0lDQWdJQ0FnSUd4bGRDQnBibk4wWVc1alpTQTlJR2x1YzNSaGJtTmxUMkpxWldOMExrbHVjM1JoYm1ObGMxc3dYVHRjYmlBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjM1JoZEhWek9pQnBibk4wWVc1alpTNVRkR0YwWlM1T1lXMWxMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2FXNXpkR0Z1WTJWVWVYQmxPaUJwYm5OMFlXNWpaUzVKYm5OMFlXNWpaVlI1Y0dVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JyWlhsT1lXMWxPaUJwYm5OMFlXNWpaUzVMWlhsT1lXMWxMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2RHRm5jem9nYVc1emRHRnVZMlV1VkdGbmN5NXRZWEFvS0hSaFp5a2dQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR3RsZVRvZ2RHRm5Ma3RsZVN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nZEdGbkxsWmhiSFZsWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSDA3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lIQjFZbXhwWTBsd1FXUmtjbVZ6Y3pvZ2FXNXpkR0Z1WTJVdVVIVmliR2xqU1hCQlpHUnlaWE56TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdhV1E2SUdsdWMzUmhibU5sTGtsdWMzUmhibU5sU1dSY2JpQWdJQ0FnSUNBZ0lDQjlPMXh1SUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUNBZ2NtVnpiMngyWlNocGJuTjBZVzVqWlhNcE8xeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNWNiaUFnWm1WMFkyaFNaV2RwYjI1ek9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRkJ5YjIxcGMyVW9ablZ1WTNScGIyNG9jbVZ6YjJ4MlpTa2dlMXh1SUNBZ0lDQWdiR1YwSUdWak1pQTlJR2RsZEVWak1pZ3BPMXh1SUNBZ0lDQWdaV015TG1SbGMyTnlhV0psVW1WbmFXOXVjeWhtZFc1amRHbHZiaWhsY25Jc0lHUmhkR0VwSUh0Y2JseHVJQ0FnSUNBZ0lDQnNaWFFnY21WbmFXOXVjeUE5SUdSaGRHRXVVbVZuYVc5dWN5NXRZWEFvWm5WdVkzUnBiMjRvY21WbmFXOXVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2JHVjBJSEpsWjJsdmJrNWhiV1VnUFNCeVpXZHBiMjR1VW1WbmFXOXVUbUZ0WlR0Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYTJWNU9pQnlaV2RwYjI1T1lXMWxMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2JtRnRaVG9nY21WbmFXOXVUbUZ0WlhOYmNtVm5hVzl1VG1GdFpWMGdmSHdnY21WbmFXOXVUbUZ0WlZ4dUlDQWdJQ0FnSUNBZ0lIMDdYRzRnSUNBZ0lDQWdJSDBwTzF4dVhHNGdJQ0FnSUNBZ0lISmxjMjlzZG1Vb2NtVm5hVzl1Y3lrN1hHNGdJQ0FnSUNCOUtUdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dWZUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdaV015U1c1emRHRnVZMlZ6T3lKZGZRPT0iXX0=
