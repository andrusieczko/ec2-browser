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
    var _this = this;

    _dispatcher2.default.register('regionAdded', function (region) {
      _this.setState({
        loading: false,
        listVisible: false
      });
    });
  },
  addRegion: function addRegion(e) {
    var _this2 = this;

    if (this.state.data.length) {
      this.setState({
        listVisible: true
      });
    } else {
      this.setState({
        loading: true,
        listVisible: true
      });
      _ec2.default.fetchRegions().then(function (regions) {
        _this2.setState({
          listVisible: true,
          data: regions,
          loading: false
        });
      });
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
    var _this = this;

    this.fetchInstances(this.state.region);
    _dispatcher2.default.register('region', function (region) {
      _this.fetchInstances(region);
    });
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

var _promisify = require('/Users/karol/workspace/karol/ec2-browser/src/js/utils/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _regions = require('/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/regions');

var _regions2 = _interopRequireDefault(_regions);

var _instances = require('/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/instances');

var _instances2 = _interopRequireDefault(_instances);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var aws = electronRequire('./aws-config.json');
var AWS = electronRequire('aws-sdk');
AWS.config.update(aws);

var getEc2 = function getEc2() {
  var region = arguments.length <= 0 || arguments[0] === undefined ? 'eu-west-1' : arguments[0];

  var ec2 = new AWS.EC2({ region: region });
  return (0, _promisify2.default)(ec2, ['describeInstances', 'describeRegions']);
};

var ec2Instances = {
  fetchInstances: function fetchInstances(region) {
    var ec2 = getEc2(region);
    return ec2.describeInstances().then(_instances2.default).catch(function (err) {
      return console.error("Error in fetching instances!", err);
    });
  },
  fetchRegions: function fetchRegions() {
    var ec2 = getEc2();
    return ec2.describeRegions().then(_regions2.default).catch(function (err) {
      return console.error("Error in fetching regions!", err);
    });
  }
};

exports.default = ec2Instances;


},{"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/instances":"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/instances.js","/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/regions":"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/regions.js","/Users/karol/workspace/karol/ec2-browser/src/js/utils/promisify":"/Users/karol/workspace/karol/ec2-browser/src/js/utils/promisify.js"}],"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/instances.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var serializeInstances = function serializeInstances(instances) {
  return instances.Reservations.map(function (instanceObject) {
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
};

exports.default = serializeInstances;


},{}],"/Users/karol/workspace/karol/ec2-browser/src/js/services/ec2/regions.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var regionNames = {
  'us-east-1': "US East (N. Virginia)",
  'us-east-2': "US East (Ohio)",
  'us-west-1': "US West (N. California)",
  'us-west-2': "US West (Oregon)",
  'ap-south-1': "Asia Pacific (Mumbai)",
  'ap-northeast-2': "Asia Pacific (Seoul)",
  'ap-southeast-1': "Asia Pacific (Singapore)",
  'ap-southeast-2': "Asia Pacific (Sydney)",
  'ap-northeast-1': "Asia Pacific (Tokyo)",
  'eu-central-1': "EU (Frankfurt)",
  'eu-west-1': "EU (Ireland)",
  'sa-east-1': "South America (São Paulo)"
};

var serializeRegions = function serializeRegions(regions) {
  return regions.Regions.map(function (region) {
    var regionName = region.RegionName;
    return {
      key: regionName,
      name: regionNames[regionName] || regionName
    };
  });
};

exports.default = serializeRegions;


},{}],"/Users/karol/workspace/karol/ec2-browser/src/js/utils/promisify.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var promisifyMethods = function promisifyMethods(object, methodNames) {
  return methodNames.reduce(function (promisified, methodName) {
    promisified[methodName] = function () {
      return new Promise(function (resolve, reject) {
        object[methodName](function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };
    return promisified;
  }, {});
};

exports.default = promisifyMethods;


},{}]},{},["/Users/karol/workspace/karol/ec2-browser/src/js/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvQWRkUmVnaW9uLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9FYzJJbnN0YW5jZXMuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1BhZ2VDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9SZWdpb25MaXN0LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9TaWRlYmFyLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZS5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZUhlYWRlci5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdy5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXIuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9tYWluLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyL2luc3RhbmNlcy5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMi9yZWdpb25zLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvdXRpbHMvcHJvbWlzaWZ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7RUFDM0MsS0FBSyxFQUFFLElBQUk7QUFDYixDQUFDLENBQUMsQ0FBQzs7QUFFSCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsdUVBQXVFLENBQUMsQ0FBQzs7QUFFbkcsSUFBSSxZQUFZLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXZELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDOztBQUVsRixJQUFJLElBQUksR0FBRyxzQkFBc0Is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O0FBQ25DOzs7QUMvQkEsWUFBWSxDQUFDOztBQUViLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRTtFQUMzQyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUMsQ0FBQztBQUNILElBQUksZ0JBQWdCLEdBQUcsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO0VBQ3BFLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLFdBQVcsRUFBRSxVQUFVLEVBQUU7SUFDM0QsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFlBQVk7TUFDcEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7UUFDNUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRTtVQUN0QyxJQUFJLEdBQUcsRUFBRTtZQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNiLE1BQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDZjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUM7SUFDRixPQUFPLFdBQVcsQ0FBQztHQUNwQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQyxDQUFDOztBQUVGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7QUFDbkMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNSBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBhcmc7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsga2V5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9SZWdpb25MaXN0ID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9SZWdpb25MaXN0Jyk7XG5cbnZhciBfUmVnaW9uTGlzdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SZWdpb25MaXN0KTtcblxudmFyIF9lYyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMicpO1xuXG52YXIgX2VjMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VjKTtcblxudmFyIF9kaXNwYXRjaGVyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvZGlzcGF0Y2hlcicpO1xuXG52YXIgX2Rpc3BhdGNoZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlzcGF0Y2hlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBBZGRSZWdpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQWRkUmVnaW9uJyxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpc3RWaXNpYmxlOiBmYWxzZSxcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgbG9hZGluZzogZmFsc2VcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9kaXNwYXRjaGVyMi5kZWZhdWx0LnJlZ2lzdGVyKCdyZWdpb25BZGRlZCcsIGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIF90aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxpc3RWaXNpYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGFkZFJlZ2lvbjogZnVuY3Rpb24gYWRkUmVnaW9uKGUpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICh0aGlzLnN0YXRlLmRhdGEubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGlzdFZpc2libGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgbGlzdFZpc2libGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgX2VjMi5kZWZhdWx0LmZldGNoUmVnaW9ucygpLnRoZW4oZnVuY3Rpb24gKHJlZ2lvbnMpIHtcbiAgICAgICAgX3RoaXMyLnNldFN0YXRlKHtcbiAgICAgICAgICBsaXN0VmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICBkYXRhOiByZWdpb25zLFxuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzcGFuJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnc3BhbicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnYWRkLWJ1dHRvbicsIG9uQ2xpY2s6IHRoaXMuYWRkUmVnaW9uIH0sXG4gICAgICAgICcrJ1xuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1JlZ2lvbkxpc3QyLmRlZmF1bHQsIHsgdmlzaWJsZTogdGhpcy5zdGF0ZS5saXN0VmlzaWJsZSwgcmVnaW9uczogdGhpcy5zdGF0ZS5kYXRhLCBsb2FkaW5nOiB0aGlzLnN0YXRlLmxvYWRpbmcgfSlcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gQWRkUmVnaW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrRmtaRkpsWjJsdmJpNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN096czdPenRCUVVsQkxFbEJRVWtzVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN08wRkJRMmhETEdsQ1FVRmxMRFpDUVVGSE8wRkJRMmhDTEZkQlFVODdRVUZEVEN4cFFrRkJWeXhGUVVGRkxFdEJRVXM3UVVGRGJFSXNWVUZCU1N4RlFVRkZMRVZCUVVVN1FVRkRVaXhoUVVGUExFVkJRVVVzUzBGQlN6dExRVU5tTEVOQlFVTTdSMEZEU0R0QlFVVkVMRzFDUVVGcFFpd3JRa0ZCUnpzN08wRkJRMnhDTEhsQ1FVRlhMRkZCUVZFc1EwRkJReXhoUVVGaExFVkJRVVVzVlVGQlFTeE5RVUZOTEVWQlFVazdRVUZETTBNc1dVRkJTeXhSUVVGUkxFTkJRVU03UVVGRFdpeGxRVUZQTEVWQlFVVXNTMEZCU3p0QlFVTmtMRzFDUVVGWExFVkJRVVVzUzBGQlN6dFBRVU51UWl4RFFVRkRMRU5CUVVNN1MwRkRTaXhEUVVGRExFTkJRVU03UjBGRFNqdEJRVVZFTEZkQlFWTXNjVUpCUVVNc1EwRkJReXhGUVVGRk96czdRVUZEV0N4UlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTXhRaXhWUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NiVUpCUVZjc1JVRkJSU3hKUVVGSk8wOUJRMnhDTEVOQlFVTXNRMEZCUXp0TFFVTktMRTFCUVUwN1FVRkRUQ3hWUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NaVUZCVHl4RlFVRkZMRWxCUVVrN1FVRkRZaXh0UWtGQlZ5eEZRVUZGTEVsQlFVazdUMEZEYkVJc1EwRkJReXhEUVVGRE8wRkJRMGdzYlVKQlFVa3NXVUZCV1N4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVUVzVDBGQlR5eEZRVUZKTzBGQlEycERMR1ZCUVVzc1VVRkJVU3hEUVVGRE8wRkJRMW9zY1VKQlFWY3NSVUZCUlN4SlFVRkpPMEZCUTJwQ0xHTkJRVWtzUlVGQlJTeFBRVUZQTzBGQlEySXNhVUpCUVU4c1JVRkJSU3hMUVVGTE8xTkJRMllzUTBGQlF5eERRVUZETzA5QlEwb3NRMEZCUXl4RFFVRkRPMHRCUTBvN1IwRkRSanRCUVVWRUxGRkJRVTBzYjBKQlFVYzdRVUZEVUN4WFFVTkZPenM3VFVGRFJUczdWVUZCVFN4VFFVRlRMRVZCUVVNc1dVRkJXU3hGUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4QlFVRkRPenRQUVVGVE8wMUJRemxFTERSRFFVRlpMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZkQlFWY3NRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4SFFVRkhPMHRCUTJwSExFTkJRMUE3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN2EwSkJSVmtzVTBGQlV5SXNJbVpwYkdVaU9pSkJaR1JTWldkcGIyNHVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRkpsWjJsdmJreHBjM1FnWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlTWldkcGIyNU1hWE4wSnp0Y2JtbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dVhHNXNaWFFnUVdSa1VtVm5hVzl1SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHeHBjM1JXYVhOcFlteGxPaUJtWVd4elpTeGNiaUFnSUNBZ0lHUmhkR0U2SUZ0ZExGeHVJQ0FnSUNBZ2JHOWhaR2x1WnpvZ1ptRnNjMlZjYmlBZ0lDQjlPMXh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEVScFpFMXZkVzUwS0NrZ2UxeHVJQ0FnSUdScGMzQmhkR05vWlhJdWNtVm5hWE4wWlhJb0ozSmxaMmx2YmtGa1pHVmtKeXdnY21WbmFXOXVJRDArSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdJQ0JzYjJGa2FXNW5PaUJtWVd4elpTeGNiaUFnSUNBZ0lDQWdiR2x6ZEZacGMybGliR1U2SUdaaGJITmxYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNibHh1SUNCaFpHUlNaV2RwYjI0b1pTa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxuTjBZWFJsTG1SaGRHRXViR1Z1WjNSb0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUNBZ2JHbHpkRlpwYzJsaWJHVTZJSFJ5ZFdWY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lDQWdiRzloWkdsdVp6b2dkSEoxWlN4Y2JpQWdJQ0FnSUNBZ2JHbHpkRlpwYzJsaWJHVTZJSFJ5ZFdWY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ1pXTXlMbVpsZEdOb1VtVm5hVzl1Y3lncExuUm9aVzRvY21WbmFXOXVjeUE5UGlCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNBZ0lHeHBjM1JXYVhOcFlteGxPaUIwY25WbExGeHVJQ0FnSUNBZ0lDQWdJR1JoZEdFNklISmxaMmx2Ym5Nc1hHNGdJQ0FnSUNBZ0lDQWdiRzloWkdsdVp6b2dabUZzYzJWY2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlYRzRnSUgwc1hHNWNiaUFnY21WdVpHVnlLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThjM0JoYmo1Y2JpQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVlXUmtMV0oxZEhSdmJsd2lJRzl1UTJ4cFkyczllM1JvYVhNdVlXUmtVbVZuYVc5dWZUNHJQQzl6Y0dGdVBseHVJQ0FnSUNBZ0lDQThVbVZuYVc5dVRHbHpkQ0IyYVhOcFlteGxQWHQwYUdsekxuTjBZWFJsTG14cGMzUldhWE5wWW14bGZTQnlaV2RwYjI1elBYdDBhR2x6TG5OMFlYUmxMbVJoZEdGOUlHeHZZV1JwYm1jOWUzUm9hWE11YzNSaGRHVXViRzloWkdsdVozMGdMejVjYmlBZ0lDQWdJRHd2YzNCaGJqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdRV1JrVW1WbmFXOXVPeUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9UYWJsZSA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGUnKTtcblxudmFyIF9UYWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZSk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgdGFnID0gZnVuY3Rpb24gdGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50YWdzLmZpbHRlcihmdW5jdGlvbiAodGFnKSB7XG4gICAgICByZXR1cm4gdGFnLmtleSA9PT0gdGFnTmFtZTtcbiAgICB9KVswXS52YWx1ZTtcbiAgfTtcbn07XG5cbnZhciBFYzJJbnN0YW5jZXMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRWMySW5zdGFuY2VzJyxcblxuICBjb2x1bW5zOiBbeyBuYW1lOiBcIklkXCIsIGtleTogJ2lkJyB9LCB7IG5hbWU6IFwiTmFtZVwiLCBrZXk6IHRhZyhcIk5hbWVcIikgfSwgeyBuYW1lOiBcIktleSBuYW1lXCIsIGtleTogJ2tleU5hbWUnIH0sIHsgbmFtZTogXCJJbnN0YW5jZSB0eXBlXCIsIGtleTogJ2luc3RhbmNlVHlwZScgfSwgeyBuYW1lOiBcIlN0YXR1c1wiLCBrZXk6ICdzdGF0dXMnIH1dLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICByZWdpb246ICdldS13ZXN0LTEnXG4gICAgfTtcbiAgfSxcbiAgZmV0Y2hJbnN0YW5jZXM6IGZ1bmN0aW9uIGZldGNoSW5zdGFuY2VzKHJlZ2lvbikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXM7XG4gICAgX2VjMi5kZWZhdWx0LmZldGNoSW5zdGFuY2VzKHJlZ2lvbikudGhlbihmdW5jdGlvbiAoaW5zdGFuY2VzKSB7XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoe1xuICAgICAgICBkYXRhOiBpbnN0YW5jZXMsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLmZldGNoSW5zdGFuY2VzKHRoaXMuc3RhdGUucmVnaW9uKTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uJywgZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgX3RoaXMuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKTtcbiAgICB9KTtcbiAgfSxcbiAgY2hhbmdlUmVnaW9uOiBmdW5jdGlvbiBjaGFuZ2VSZWdpb24oZSkge1xuICAgIHZhciByZWdpb24gPSBlLnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlZ2lvbjogcmVnaW9uLFxuICAgICAgbG9hZGluZzogdHJ1ZVxuICAgIH0pO1xuICAgIHRoaXMuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9UYWJsZTIuZGVmYXVsdCwgeyBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSwgbG9hZGluZzogdGhpcy5zdGF0ZS5sb2FkaW5nIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEVjMkluc3RhbmNlcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa1ZqTWtsdWMzUmhibU5sY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3T3pzN096dEJRVWxCTEVsQlFVa3NSMEZCUnl4SFFVRkhMRk5CUVU0c1IwRkJSeXhEUVVGWkxFOUJRVThzUlVGQlJUdEJRVU14UWl4VFFVRlBMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJRM2hDTEZkQlFVOHNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlF5eEhRVUZITEVWQlFVczdRVUZEYmtNc1lVRkJUeXhIUVVGSExFTkJRVU1zUjBGQlJ5eExRVUZMTEU5QlFVOHNRMEZCUXp0TFFVTTFRaXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPMGRCUTJJc1EwRkJRenREUVVOSUxFTkJRVU03TzBGQlJVWXNTVUZCU1N4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTI1RExGTkJRVThzUlVGQlJTeERRVU5RTEVWQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSU3hIUVVGSExFVkJRVVVzU1VGQlNTeEZRVUZETEVWQlEzWkNMRVZCUVVNc1NVRkJTU3hGUVVGRkxFMUJRVTBzUlVGQlJTeEhRVUZITEVWQlFVVXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRExFVkJRMmhETEVWQlFVTXNTVUZCU1N4RlFVRkZMRlZCUVZVc1JVRkJSU3hIUVVGSExFVkJRVVVzVTBGQlV5eEZRVUZETEVWQlEyeERMRVZCUVVNc1NVRkJTU3hGUVVGRkxHVkJRV1VzUlVGQlJTeEhRVUZITEVWQlFVVXNZMEZCWXl4RlFVRkRMRVZCUXpWRExFVkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4SFFVRkhMRVZCUVVVc1VVRkJVU3hGUVVGRExFTkJRMmhET3p0QlFVVkVMR2xDUVVGbExEWkNRVUZITzBGQlEyaENMRmRCUVU4N1FVRkRUQ3hWUVVGSkxFVkJRVVVzUlVGQlJUdEJRVU5TTEdGQlFVOHNSVUZCUlN4SlFVRkpPMEZCUTJJc1dVRkJUU3hGUVVGRkxGZEJRVmM3UzBGRGNFSXNRMEZCUXp0SFFVTklPMEZCUlVRc1owSkJRV01zTUVKQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNKQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4aFFVRlBMRVZCUVVVc1NVRkJTVHRMUVVOa0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4UlFVRkpMRk5CUVZNc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRGNrSXNhVUpCUVVrc1kwRkJZeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRkJMRk5CUVZNc1JVRkJTVHRCUVVNelF5eGxRVUZUTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTJwQ0xGbEJRVWtzUlVGQlJTeFRRVUZUTzBGQlEyWXNaVUZCVHl4RlFVRkZMRXRCUVVzN1QwRkRaaXhEUVVGRExFTkJRVU03UzBGRFNpeERRVUZETEVOQlFVTTdSMEZEU2p0QlFVVkVMRzFDUVVGcFFpd3JRa0ZCUnpzN08wRkJRMnhDTEZGQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjJReXg1UWtGQlZ5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRlZCUVVFc1RVRkJUU3hGUVVGSk8wRkJRM1JETEZsQlFVc3NZMEZCWXl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wdEJRemRDTEVOQlFVTXNRMEZCUXp0SFFVTktPMEZCUlVRc1kwRkJXU3gzUWtGQlF5eERRVUZETEVWQlFVVTdRVUZEWkN4UlFVRkpMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXp0QlFVTTFRaXhSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NXVUZCVFN4RlFVRkZMRTFCUVUwN1FVRkRaQ3hoUVVGUExFVkJRVVVzU1VGQlNUdExRVU5rTEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdSMEZETjBJN1FVRkZSQ3hSUVVGTkxHOUNRVUZITzBGQlExQXNWMEZEUlRzN08wMUJRMFVzZFVOQlFVOHNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFRkJRVU1zUlVGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFRkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFRkJRVU1zUjBGQlJ6dExRVU5vUml4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmxCUVZraUxDSm1hV3hsSWpvaVJXTXlTVzV6ZEdGdVkyVnpMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWVdKc1pTQm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsSnp0Y2JtbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dVhHNXNaWFFnZEdGbklEMGdablZ1WTNScGIyNG9kR0ZuVG1GdFpTa2dlMXh1SUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRvYVc1emRHRnVZMlVwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdhVzV6ZEdGdVkyVXVkR0ZuY3k1bWFXeDBaWElvS0hSaFp5a2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJoWnk1clpYa2dQVDA5SUhSaFowNWhiV1U3WEc0Z0lDQWdmU2xiTUYwdWRtRnNkV1U3WEc0Z0lIMDdYRzU5TzF4dVhHNXNaWFFnUldNeVNXNXpkR0Z1WTJWeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCamIyeDFiVzV6T2lCYlhHNGdJQ0FnZTI1aGJXVTZJRndpU1dSY0lpd2dhMlY1T2lBbmFXUW5mU3hjYmlBZ0lDQjdibUZ0WlRvZ1hDSk9ZVzFsWENJc0lHdGxlVG9nZEdGbktGd2lUbUZ0WlZ3aUtYMHNYRzRnSUNBZ2UyNWhiV1U2SUZ3aVMyVjVJRzVoYldWY0lpd2dhMlY1T2lBbmEyVjVUbUZ0WlNkOUxGeHVJQ0FnSUh0dVlXMWxPaUJjSWtsdWMzUmhibU5sSUhSNWNHVmNJaXdnYTJWNU9pQW5hVzV6ZEdGdVkyVlVlWEJsSjMwc1hHNGdJQ0FnZTI1aGJXVTZJRndpVTNSaGRIVnpYQ0lzSUd0bGVUb2dKM04wWVhSMWN5ZDlMRnh1SUNCZExGeHVYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaU2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdaR0YwWVRvZ1cxMHNYRzRnSUNBZ0lDQnNiMkZrYVc1bk9pQjBjblZsTEZ4dUlDQWdJQ0FnY21WbmFXOXVPaUFuWlhVdGQyVnpkQzB4SjF4dUlDQWdJSDA3WEc0Z0lIMHNYRzVjYmlBZ1ptVjBZMmhKYm5OMFlXNWpaWE1vY21WbmFXOXVLU0I3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCc2IyRmthVzVuT2lCMGNuVmxYRzRnSUNBZ2ZTazdYRzRnSUNBZ1hHNGdJQ0FnYkdWMElHTnZiWEJ2Ym1WdWRDQTlJSFJvYVhNN1hHNGdJQ0FnWldNeUxtWmxkR05vU1c1emRHRnVZMlZ6S0hKbFoybHZiaWt1ZEdobGJpaHBibk4wWVc1alpYTWdQVDRnZTF4dUlDQWdJQ0FnWTI5dGNHOXVaVzUwTG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUNBZ1pHRjBZVG9nYVc1emRHRnVZMlZ6TEZ4dUlDQWdJQ0FnSUNCc2IyRmthVzVuT2lCbVlXeHpaVnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU2s3WEc0Z0lIMHNYRzVjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtUVzkxYm5Rb0tTQjdYRzRnSUNBZ2RHaHBjeTVtWlhSamFFbHVjM1JoYm1ObGN5aDBhR2x6TG5OMFlYUmxMbkpsWjJsdmJpazdYRzRnSUNBZ1pHbHpjR0YwWTJobGNpNXlaV2RwYzNSbGNpZ25jbVZuYVc5dUp5d2djbVZuYVc5dUlEMCtJSHRjYmlBZ0lDQWdJSFJvYVhNdVptVjBZMmhKYm5OMFlXNWpaWE1vY21WbmFXOXVLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNibHh1SUNCamFHRnVaMlZTWldkcGIyNG9aU2tnZTF4dUlDQWdJR3hsZENCeVpXZHBiMjRnUFNCbExuUmhjbWRsZEM1MllXeDFaVHRjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUhKbFoybHZiam9nY21WbmFXOXVMRnh1SUNBZ0lDQWdiRzloWkdsdVp6b2dkSEoxWlZ4dUlDQWdJSDBwTzF4dUlDQWdJSFJvYVhNdVptVjBZMmhKYm5OMFlXNWpaWE1vY21WbmFXOXVLVHRjYmlBZ2ZTeGNibHh1SUNCeVpXNWtaWElvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZK1hHNGdJQ0FnSUNBZ0lEeFVZV0pzWlNCamIyeDFiVzV6UFh0MGFHbHpMbU52YkhWdGJuTjlJR1JoZEdFOWUzUm9hWE11YzNSaGRHVXVaR0YwWVgwZ2JHOWhaR2x1WnoxN2RHaHBjeTV6ZEdGMFpTNXNiMkZrYVc1bmZTQXZQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElFVmpNa2x1YzNSaGJtTmxjenNpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9FYzJJbnN0YW5jZXMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL0VjMkluc3RhbmNlcycpO1xuXG52YXIgX0VjMkluc3RhbmNlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9FYzJJbnN0YW5jZXMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgUGFnZUNvbnRlbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUGFnZUNvbnRlbnQnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfRWMySW5zdGFuY2VzMi5kZWZhdWx0LCBudWxsKVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBQYWdlQ29udGVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbEJoWjJWRGIyNTBaVzUwTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096dEJRVVZCTEVsQlFVa3NWMEZCVnl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTnNReXhSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3TzAxQlEwVXNhVVJCUVdkQ08wdEJRMW9zUTBGRFRqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeFhRVUZYSWl3aVptbHNaU0k2SWxCaFoyVkRiMjUwWlc1MExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQkZZekpKYm5OMFlXNWpaWE1nWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlGWXpKSmJuTjBZVzVqWlhNbk8xeHVYRzVzWlhRZ1VHRm5aVU52Ym5SbGJuUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWStYRzRnSUNBZ0lDQWdJRHhGWXpKSmJuTjBZVzVqWlhNZ0x6NWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCUVlXZGxRMjl1ZEdWdWREc2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2Rpc3BhdGNoZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9kaXNwYXRjaGVyJyk7XG5cbnZhciBfZGlzcGF0Y2hlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXNwYXRjaGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBSZWdpb25MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1JlZ2lvbkxpc3QnLFxuICByZWdpb25DaG9zZW46IGZ1bmN0aW9uIHJlZ2lvbkNob3NlbihyZWdpb24pIHtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5ub3RpZnlBbGwoJ3JlZ2lvbkFkZGVkJywgcmVnaW9uKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBsb2FkaW5nID0gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdsaScsXG4gICAgICBudWxsLFxuICAgICAgJ0xvYWRpbmcnXG4gICAgKTtcbiAgICB2YXIgcmVnaW9ucyA9IHRoaXMucHJvcHMucmVnaW9ucy5tYXAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsaScsXG4gICAgICAgIHsga2V5OiByZWdpb24ua2V5IH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2EnLFxuICAgICAgICAgIHsgb25DbGljazogX3RoaXMucmVnaW9uQ2hvc2VuLmJpbmQoX3RoaXMsIHJlZ2lvbikgfSxcbiAgICAgICAgICByZWdpb24ubmFtZVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdmFyIGJvZHkgPSB0aGlzLnByb3BzLmxvYWRpbmcgPyBsb2FkaW5nIDogcmVnaW9ucztcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICd1bCcsXG4gICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lcyhcInJlZ2lvbnMtbGlzdFwiLCB0aGlzLnByb3BzLnZpc2libGUgPyAndmlzaWJsZScgOiAnJykgfSxcbiAgICAgIGJvZHlcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUmVnaW9uTGlzdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbEpsWjJsdmJreHBjM1F1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3pzN08wRkJRMEVzU1VGQlNTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE96dEJRVVYyUXl4SlFVRkpMRlZCUVZVc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3p0QlFVTnFReXhqUVVGWkxIZENRVUZETEUxQlFVMHNSVUZCUlR0QlFVTnVRaXg1UWtGQlZ5eFRRVUZUTEVOQlFVTXNZVUZCWVN4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wZEJRemRETzBGQlEwUXNVVUZCVFN4dlFrRkJSenM3TzBGQlExQXNVVUZCU1N4UFFVRlBMRWRCUTFRN096czdTMEZCWjBJc1FVRkRha0lzUTBGQlF6dEJRVU5HTEZGQlFVa3NUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkJMRTFCUVUwc1JVRkJTVHRCUVVNM1F5eGhRVU5GT3p0VlFVRkpMRWRCUVVjc1JVRkJSU3hOUVVGTkxFTkJRVU1zUjBGQlJ5eEJRVUZETzFGQlEyeENPenRaUVVGSExFOUJRVThzUlVGQlJTeE5RVUZMTEZsQlFWa3NRMEZCUXl4SlFVRkpMRkZCUVU4c1RVRkJUU3hEUVVGRExFRkJRVU03VlVGQlJTeE5RVUZOTEVOQlFVTXNTVUZCU1R0VFFVRkxPMDlCUTJoRkxFTkJRMHc3UzBGRFNDeERRVUZETEVOQlFVTTdPMEZCUlVnc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRWRCUVVjc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF6dEJRVU5zUkN4WFFVTkZPenRSUVVGSkxGTkJRVk1zUlVGQlJTeFZRVUZWTEVOQlFVTXNZMEZCWXl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEhRVUZETEZOQlFWTXNSMEZCUXl4RlFVRkZMRU5CUVVNc1FVRkJRenROUVVONFJTeEpRVUZKTzB0QlEwWXNRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4VlFVRlZJaXdpWm1sc1pTSTZJbEpsWjJsdmJreHBjM1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTGk5emNtTXZhbk12SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUdScGMzQmhkR05vWlhJZ1puSnZiU0FuWkdsemNHRjBZMmhsY2ljN1hHNXNaWFFnWTJ4aGMzTk9ZVzFsY3lBOUlISmxjWFZwY21Vb0oyTnNZWE56Ym1GdFpYTW5LVHRjYmx4dWJHVjBJRkpsWjJsdmJreHBjM1FnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsWjJsdmJrTm9iM05sYmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0JrYVhOd1lYUmphR1Z5TG01dmRHbG1lVUZzYkNnbmNtVm5hVzl1UVdSa1pXUW5MQ0J5WldkcGIyNHBPMXh1SUNCOUxGeHVJQ0J5Wlc1a1pYSW9LU0I3WEc0Z0lDQWdiR1YwSUd4dllXUnBibWNnUFNBZ0tGeHVJQ0FnSUNBZ1BHeHBQa3h2WVdScGJtYzhMMnhwUGx4dUlDQWdJQ2s3WEc0Z0lDQWdiR1YwSUhKbFoybHZibk1nUFNCMGFHbHpMbkJ5YjNCekxuSmxaMmx2Ym5NdWJXRndLSEpsWjJsdmJpQTlQaUI3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdJQ0E4YkdrZ2EyVjVQWHR5WldkcGIyNHVhMlY1ZlQ1Y2JpQWdJQ0FnSUNBZ0lDQThZU0J2YmtOc2FXTnJQWHQwYUdsekxuSmxaMmx2YmtOb2IzTmxiaTVpYVc1a0tIUm9hWE1zSUhKbFoybHZiaWw5UG50eVpXZHBiMjR1Ym1GdFpYMDhMMkUrWEc0Z0lDQWdJQ0FnSUR3dmJHaytYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMHBPMXh1WEc0Z0lDQWdiR1YwSUdKdlpIa2dQU0IwYUdsekxuQnliM0J6TG14dllXUnBibWNnUHlCc2IyRmthVzVuSURvZ2NtVm5hVzl1Y3p0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxN1kyeGhjM05PWVcxbGN5aGNJbkpsWjJsdmJuTXRiR2x6ZEZ3aUxDQjBhR2x6TG5CeWIzQnpMblpwYzJsaWJHVS9KM1pwYzJsaWJHVW5PaWNuS1gwK1hHNGdJQ0FnSUNBZ0lIdGliMlI1ZlZ4dUlDQWdJQ0FnUEM5MWJENWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdVbVZuYVc5dVRHbHpkRHNpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kaXNwYXRjaGVyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvZGlzcGF0Y2hlcicpO1xuXG52YXIgX2Rpc3BhdGNoZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlzcGF0Y2hlcik7XG5cbnZhciBfQWRkUmVnaW9uID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9BZGRSZWdpb24nKTtcblxudmFyIF9BZGRSZWdpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQWRkUmVnaW9uKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciByZW1vdGUgPSBlbGVjdHJvblJlcXVpcmUoJ3JlbW90ZScpO1xudmFyIE1lbnUgPSByZW1vdGUuTWVudTtcbnZhciBNZW51SXRlbSA9IHJlbW90ZS5NZW51SXRlbTtcblxudmFyIFNpZGViYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2lkZWJhcicsXG5cbiAgY29udGV4dE1lbnU6IG51bGwsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZ2lvbjogJ2V1LXdlc3QtMScsXG4gICAgICByZWdpb25zOiBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVnaW9ucycpIHx8IFwiW11cIilcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgX2Rpc3BhdGNoZXIyLmRlZmF1bHQucmVnaXN0ZXIoJ3JlZ2lvbkFkZGVkJywgKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHRoaXMuc3RhdGUucmVnaW9ucy5wdXNoKHJlZ2lvbik7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVnaW9uczogdGhpcy5zdGF0ZS5yZWdpb25zXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVnaW9ucycsIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucmVnaW9ucykpO1xuICAgIH0pLmJpbmQodGhpcykpO1xuICB9LFxuICByZWdpb25TZWxlY3RlZDogZnVuY3Rpb24gcmVnaW9uU2VsZWN0ZWQocmVnaW9uKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWdpb246IHJlZ2lvblxuICAgIH0pO1xuICAgIF9kaXNwYXRjaGVyMi5kZWZhdWx0Lm5vdGlmeUFsbCgncmVnaW9uJywgcmVnaW9uKTtcbiAgfSxcbiAgcmVtb3ZlUmVnaW9uOiBmdW5jdGlvbiByZW1vdmVSZWdpb24ocmVnaW9uKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS5yZWdpb25zLmluZGV4T2YocmVnaW9uKTtcbiAgICB0aGlzLnN0YXRlLnJlZ2lvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlZ2lvbnM6IHRoaXMuc3RhdGUucmVnaW9uc1xuICAgIH0pO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVnaW9ucycsIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucmVnaW9ucykpO1xuICB9LFxuICBpc0FjdGl2ZTogZnVuY3Rpb24gaXNBY3RpdmUocmVnaW9uKSB7XG4gICAgaWYgKHJlZ2lvbiA9PT0gdGhpcy5zdGF0ZS5yZWdpb24pIHtcbiAgICAgIHJldHVybiBcImFjdGl2ZVwiO1xuICAgIH07XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIG9uQ29udGV4dE1lbnU6IGZ1bmN0aW9uIG9uQ29udGV4dE1lbnUocmVnaW9uKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXM7XG4gICAgdmFyIG1lbnUgPSBuZXcgTWVudSgpO1xuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7IGxhYmVsOiAnUmVtb3ZlJywgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICBjb21wb25lbnQucmVtb3ZlUmVnaW9uKHJlZ2lvbik7XG4gICAgICB9IH0pKTtcbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHJlZ2lvbnMgPSB0aGlzLnN0YXRlLnJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnbGknLFxuICAgICAgICB7IGtleTogcmVnaW9uLmtleSxcbiAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJsaXN0LWdyb3VwLWl0ZW1cIiwgXCJyZWdpb25cIiwgX3RoaXMuaXNBY3RpdmUocmVnaW9uLmtleSkpLFxuICAgICAgICAgIG9uQ29udGV4dE1lbnU6IF90aGlzLm9uQ29udGV4dE1lbnUuYmluZChfdGhpcywgcmVnaW9uKSxcbiAgICAgICAgICBvbkNsaWNrOiBfdGhpcy5yZWdpb25TZWxlY3RlZC5iaW5kKF90aGlzLCByZWdpb24ua2V5KSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbWcnLCB7IGNsYXNzTmFtZTogJ2ltZy1jaXJjbGUgbWVkaWEtb2JqZWN0IHB1bGwtbGVmdCcsIHNyYzogJ2h0dHA6Ly9tZWRpYS5hbWF6b253ZWJzZXJ2aWNlcy5jb20vYXdzX3NpbmdsZWJveF8wMS5wbmcnLCB3aWR0aDogJzMyJywgaGVpZ2h0OiAnMzInIH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbWVkaWEtYm9keScgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgcmVnaW9uLm5hbWVcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAncCcsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJzAgcnVubmluZydcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndWwnLFxuICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWdyb3VwJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2xpJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWdyb3VwLWhlYWRlcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaDQnLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgJ1JlZ2lvbnMnXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX0FkZFJlZ2lvbjIuZGVmYXVsdCwgbnVsbClcbiAgICAgICksXG4gICAgICByZWdpb25zXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFNpZGViYXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxOcFpHVmlZWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3pzN096czdPenRCUVVWQkxFbEJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenM3UVVGRmRrTXNTVUZCVFN4TlFVRk5MRWRCUVVjc1pVRkJaU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzcERMRWxCUVUwc1NVRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZEZWtJc1NVRkJUU3hSUVVGUkxFZEJRVWNzVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXpzN1FVRkZha01zU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6bENMR0ZCUVZjc1JVRkJSU3hKUVVGSk96dEJRVVZxUWl4cFFrRkJaU3cyUWtGQlJ6dEJRVU5vUWl4WFFVRlBPMEZCUTB3c1dVRkJUU3hGUVVGRkxGZEJRVmM3UVVGRGJrSXNZVUZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETzB0QlEzQkZMRU5CUVVNN1IwRkRTRHRCUVVWRUxHMUNRVUZwUWl3clFrRkJSenRCUVVOc1FpeDVRa0ZCVnl4UlFVRlJMRU5CUVVNc1lVRkJZU3hGUVVGRkxFTkJRVUVzVlVGQlV5eE5RVUZOTEVWQlFVVTdRVUZEYkVRc1ZVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRMmhETEZWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRXaXhsUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBPMDlCUXpWQ0xFTkJRVU1zUTBGQlF6dEJRVU5JTEZsQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTTFSU3hEUVVGQkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRaanRCUVVWRUxHZENRVUZqTERCQ1FVRkRMRTFCUVUwc1JVRkJSVHRCUVVOeVFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTFvc1dVRkJUU3hGUVVGRkxFMUJRVTA3UzBGRFppeERRVUZETEVOQlFVTTdRVUZEU0N4NVFrRkJWeXhUUVVGVExFTkJRVU1zVVVGQlVTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMGRCUTNoRE8wRkJSVVFzWTBGQldTeDNRa0ZCUXl4TlFVRk5MRVZCUVVVN1FVRkRia0lzVVVGQlNTeExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXk5RExGRkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY0VNc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdGQlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTg3UzBGRE5VSXNRMEZCUXl4RFFVRkRPMEZCUTBnc1ZVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRelZGTzBGQlJVUXNWVUZCVVN4dlFrRkJReXhOUVVGTkxFVkJRVVU3UVVGRFppeFJRVUZKTEUxQlFVMHNTMEZCU3l4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU5vUXl4aFFVRlBMRkZCUVZFc1EwRkJRenRMUVVOcVFpeERRVUZETzBGQlEwWXNWMEZCVHl4RlFVRkZMRU5CUVVNN1IwRkRXRHRCUVVWRUxHVkJRV0VzZVVKQlFVTXNUVUZCVFN4RlFVRkZPMEZCUTNCQ0xGRkJRVWtzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnlRaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NSVUZCUlN4RFFVRkRPMEZCUTNSQ0xGRkJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4UlFVRlJMRU5CUVVNc1JVRkJSU3hMUVVGTExFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlN4cFFrRkJWenRCUVVNMVJDeHBRa0ZCVXl4RFFVRkRMRmxCUVZrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFBRVU5vUXl4RlFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMHdzVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTNaRE8wRkJSVVFzVVVGQlRTeHZRa0ZCUnpzN08wRkJRMUFzVVVGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVRXNUVUZCVFN4RlFVRkpPMEZCUXpkRExHRkJRMFU3TzFWQlFVa3NSMEZCUnl4RlFVRkZMRTFCUVUwc1EwRkJReXhIUVVGSExFRkJRVU03UVVGRGFFSXNiVUpCUVZNc1JVRkJSU3hWUVVGVkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1VVRkJVU3hGUVVGRkxFMUJRVXNzVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhCUVVGRE8wRkJRemxGTEhWQ1FVRmhMRVZCUVVVc1RVRkJTeXhoUVVGaExFTkJRVU1zU1VGQlNTeFJRVUZQTEUxQlFVMHNRMEZCUXl4QlFVRkRPMEZCUTNKRUxHbENRVUZQTEVWQlFVVXNUVUZCU3l4alFVRmpMRU5CUVVNc1NVRkJTU3hSUVVGUExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRVUZCUXp0UlFVTjBSQ3cyUWtGQlN5eFRRVUZUTEVWQlFVTXNiVU5CUVcxRExFVkJRVU1zUjBGQlJ5eEZRVUZETEhsRVFVRjVSQ3hGUVVGRExFdEJRVXNzUlVGQlF5eEpRVUZKTEVWQlFVTXNUVUZCVFN4RlFVRkRMRWxCUVVrc1IwRkJSenRSUVVNeFNUczdXVUZCU3l4VFFVRlRMRVZCUVVNc1dVRkJXVHRWUVVONlFqczdPMWxCUVZNc1RVRkJUU3hEUVVGRExFbEJRVWs3VjBGQlZUdFZRVU01UWpzN096dFhRVUZuUWp0VFFVTmFPMDlCUTBnc1EwRkRURHRMUVVOSUxFTkJRVU1zUTBGQlF6dEJRVU5JTEZkQlEwVTdPMUZCUVVrc1UwRkJVeXhGUVVGRExGbEJRVms3VFVGRGVFSTdPMVZCUVVrc1UwRkJVeXhGUVVGRExHMUNRVUZ0UWp0UlFVTXZRanM3T3p0VFFVRm5RanRSUVVOb1FpdzRRMEZCWVR0UFFVTldPMDFCUTBvc1QwRkJUenRMUVVOTUxFTkJRMHc3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN2EwSkJSVmtzVDBGQlR5SXNJbVpwYkdVaU9pSlRhV1JsWW1GeUxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQmthWE53WVhSamFHVnlJR1p5YjIwZ0oyUnBjM0JoZEdOb1pYSW5PMXh1YVcxd2IzSjBJRUZrWkZKbFoybHZiaUJtY205dElDZGpiMjF3YjI1bGJuUnpMMEZrWkZKbFoybHZiaWM3WEc1c1pYUWdZMnhoYzNOT1lXMWxjeUE5SUhKbGNYVnBjbVVvSjJOc1lYTnpibUZ0WlhNbktUdGNibHh1WTI5dWMzUWdjbVZ0YjNSbElEMGdaV3hsWTNSeWIyNVNaWEYxYVhKbEtDZHlaVzF2ZEdVbktUdGNibU52Ym5OMElFMWxiblVnUFNCeVpXMXZkR1V1VFdWdWRUdGNibU52Ym5OMElFMWxiblZKZEdWdElEMGdjbVZ0YjNSbExrMWxiblZKZEdWdE8xeHVYRzVzWlhRZ1UybGtaV0poY2lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnWTI5dWRHVjRkRTFsYm5VNklHNTFiR3dzWEc1Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbEtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNCeVpXZHBiMjQ2SUNkbGRTMTNaWE4wTFRFbkxGeHVJQ0FnSUNBZ2NtVm5hVzl1Y3pvZ1NsTlBUaTV3WVhKelpTaDNhVzVrYjNjdWJHOWpZV3hUZEc5eVlXZGxMbWRsZEVsMFpXMG9KM0psWjJsdmJuTW5LU0I4ZkNCY0lsdGRYQ0lwWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNibHh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZENncElIdGNiaUFnSUNCa2FYTndZWFJqYUdWeUxuSmxaMmx6ZEdWeUtDZHlaV2RwYjI1QlpHUmxaQ2NzSUdaMWJtTjBhVzl1S0hKbFoybHZiaWtnZTF4dUlDQWdJQ0FnZEdocGN5NXpkR0YwWlM1eVpXZHBiMjV6TG5CMWMyZ29jbVZuYVc5dUtUdGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNCeVpXZHBiMjV6T2lCMGFHbHpMbk4wWVhSbExuSmxaMmx2Ym5OY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ2QybHVaRzkzTG14dlkyRnNVM1J2Y21GblpTNXpaWFJKZEdWdEtDZHlaV2RwYjI1ekp5d2dTbE5QVGk1emRISnBibWRwWm5rb2RHaHBjeTV6ZEdGMFpTNXlaV2RwYjI1ektTazdYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBLVHRjYmlBZ2ZTeGNibHh1SUNCeVpXZHBiMjVUWld4bFkzUmxaQ2h5WldkcGIyNHBJSHRjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUhKbFoybHZiam9nY21WbmFXOXVYRzRnSUNBZ2ZTazdYRzRnSUNBZ1pHbHpjR0YwWTJobGNpNXViM1JwWm5sQmJHd29KM0psWjJsdmJpY3NJSEpsWjJsdmJpazdYRzRnSUgwc1hHNWNiaUFnY21WdGIzWmxVbVZuYVc5dUtISmxaMmx2YmlrZ2UxeHVJQ0FnSUd4bGRDQnBibVJsZUNBOUlIUm9hWE11YzNSaGRHVXVjbVZuYVc5dWN5NXBibVJsZUU5bUtISmxaMmx2YmlrN1hHNGdJQ0FnZEdocGN5NXpkR0YwWlM1eVpXZHBiMjV6TG5Od2JHbGpaU2hwYm1SbGVDd2dNU2s3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCeVpXZHBiMjV6T2lCMGFHbHpMbk4wWVhSbExuSmxaMmx2Ym5OY2JpQWdJQ0I5S1R0Y2JpQWdJQ0IzYVc1a2IzY3ViRzlqWVd4VGRHOXlZV2RsTG5ObGRFbDBaVzBvSjNKbFoybHZibk1uTENCS1UwOU9Mbk4wY21sdVoybG1lU2gwYUdsekxuTjBZWFJsTG5KbFoybHZibk1wS1R0Y2JpQWdmU3hjYmx4dUlDQnBjMEZqZEdsMlpTaHlaV2RwYjI0cElIdGNiaUFnSUNCcFppQW9jbVZuYVc5dUlEMDlQU0IwYUdsekxuTjBZWFJsTG5KbFoybHZiaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRndpWVdOMGFYWmxYQ0k3WEc0Z0lDQWdmVHRjYmlBZ0lDQnlaWFIxY200Z1hDSmNJanRjYmlBZ2ZTeGNibHh1SUNCdmJrTnZiblJsZUhSTlpXNTFLSEpsWjJsdmJpa2dlMXh1SUNBZ0lHeGxkQ0JqYjIxd2IyNWxiblFnUFNCMGFHbHpPMXh1SUNBZ0lIWmhjaUJ0Wlc1MUlEMGdibVYzSUUxbGJuVW9LVHRjYmlBZ0lDQnRaVzUxTG1Gd2NHVnVaQ2h1WlhjZ1RXVnVkVWwwWlcwb2V5QnNZV0psYkRvZ0oxSmxiVzkyWlNjc0lHTnNhV05yT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXlaVzF2ZG1WU1pXZHBiMjRvY21WbmFXOXVLVHRjYmlBZ0lDQjlmU2twTzF4dUlDQWdJRzFsYm5VdWNHOXdkWEFvY21WdGIzUmxMbWRsZEVOMWNuSmxiblJYYVc1a2IzY29LU2s3WEc0Z0lIMHNYRzVjYmlBZ2NtVnVaR1Z5S0NrZ2UxeHVJQ0FnSUd4bGRDQnlaV2RwYjI1eklEMGdkR2hwY3k1emRHRjBaUzV5WldkcGIyNXpMbTFoY0NoeVpXZHBiMjRnUFQ0Z2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUNBZ1BHeHBJR3RsZVQxN2NtVm5hVzl1TG10bGVYMWNiaUFnSUNBZ0lDQWdJQ0FnSUdOc1lYTnpUbUZ0WlQxN1kyeGhjM05PWVcxbGN5aGNJbXhwYzNRdFozSnZkWEF0YVhSbGJWd2lMQ0JjSW5KbFoybHZibHdpTENCMGFHbHpMbWx6UVdOMGFYWmxLSEpsWjJsdmJpNXJaWGtwS1gwZ1hHNGdJQ0FnSUNBZ0lDQWdJQ0J2YmtOdmJuUmxlSFJOWlc1MVBYdDBhR2x6TG05dVEyOXVkR1Y0ZEUxbGJuVXVZbWx1WkNoMGFHbHpMQ0J5WldkcGIyNHBmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2IyNURiR2xqYXoxN2RHaHBjeTV5WldkcGIyNVRaV3hsWTNSbFpDNWlhVzVrS0hSb2FYTXNJSEpsWjJsdmJpNXJaWGtwZlQ1Y2JpQWdJQ0FnSUNBZ0lDQThhVzFuSUdOc1lYTnpUbUZ0WlQxY0ltbHRaeTFqYVhKamJHVWdiV1ZrYVdFdGIySnFaV04wSUhCMWJHd3RiR1ZtZEZ3aUlITnlZejFjSW1oMGRIQTZMeTl0WldScFlTNWhiV0Y2YjI1M1pXSnpaWEoyYVdObGN5NWpiMjB2WVhkelgzTnBibWRzWldKdmVGOHdNUzV3Ym1kY0lpQjNhV1IwYUQxY0lqTXlYQ0lnYUdWcFoyaDBQVndpTXpKY0lpQXZQbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYldWa2FXRXRZbTlrZVZ3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEhOMGNtOXVaejU3Y21WbmFXOXVMbTVoYldWOVBDOXpkSEp2Ym1jK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4Y0Q0d0lISjFibTVwYm1jOEwzQStYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHd2YkdrK1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZFd3Z1kyeGhjM05PWVcxbFBWd2liR2x6ZEMxbmNtOTFjRndpUGx4dUlDQWdJQ0FnSUNBOGJHa2dZMnhoYzNOT1lXMWxQVndpYkdsemRDMW5jbTkxY0Mxb1pXRmtaWEpjSWo1Y2JpQWdJQ0FnSUNBZ0lDQThhRFErVW1WbmFXOXVjend2YURRK1hHNGdJQ0FnSUNBZ0lDQWdQRUZrWkZKbFoybHZiaUF2UGx4dUlDQWdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDQWdJQ0I3Y21WbmFXOXVjMzFjYmlBZ0lDQWdJRHd2ZFd3K1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElGTnBaR1ZpWVhJN0lsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfVGFibGVIZWFkZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlSGVhZGVyJyk7XG5cbnZhciBfVGFibGVIZWFkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGVIZWFkZXIpO1xuXG52YXIgX1RhYmxlQ29udGVudCA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50Jyk7XG5cbnZhciBfVGFibGVDb250ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RhYmxlQ29udGVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUYWJsZScsXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RhYmxlJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9UYWJsZUhlYWRlcjIuZGVmYXVsdCwgeyBjb2x1bW5zOiB0aGlzLnByb3BzLmNvbHVtbnMgfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9UYWJsZUNvbnRlbnQyLmRlZmF1bHQsIHsgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgICBjb2x1bW5zOiB0aGlzLnByb3BzLmNvbHVtbnMsXG4gICAgICAgIGxvYWRpbmc6IHRoaXMucHJvcHMubG9hZGluZyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096czdPenM3T3pzN1FVRkhRU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenRCUVVNMVFpeFJRVUZOTEc5Q1FVRkhPMEZCUTFBc1YwRkRSVHM3TzAxQlEwVXNOa05CUVdFc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4QlFVRkRMRWRCUVVjN1RVRkROVU1zT0VOQlFXTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEJRVUZETzBGQlEzUkNMR1ZCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXp0QlFVTTFRaXhsUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRUZCUVVNc1IwRkJSVHRMUVVOMFF5eERRVU5TTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08ydENRVVZaTEV0QlFVc2lMQ0ptYVd4bElqb2lWR0ZpYkdVdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUxpOXpjbU12YW5Ndklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGUmhZbXhsU0dWaFpHVnlJR1p5YjIwZ0oyTnZiWEJ2Ym1WdWRITXZWR0ZpYkdWSVpXRmtaWEluTzF4dWFXMXdiM0owSUZSaFlteGxRMjl1ZEdWdWRDQm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsUTI5dWRHVnVkQ2M3WEc1Y2JteGxkQ0JVWVdKc1pTQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZEdGaWJHVStYRzRnSUNBZ0lDQWdJRHhVWVdKc1pVaGxZV1JsY2lCamIyeDFiVzV6UFh0MGFHbHpMbkJ5YjNCekxtTnZiSFZ0Ym5OOUlDOCtYRzRnSUNBZ0lDQWdJRHhVWVdKc1pVTnZiblJsYm5RZ1pHRjBZVDE3ZEdocGN5NXdjbTl3Y3k1a1lYUmhmU0JjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiMngxYlc1elBYdDBhR2x6TG5CeWIzQnpMbU52YkhWdGJuTjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JHOWhaR2x1WnoxN2RHaHBjeTV3Y205d2N5NXNiMkZrYVc1bmZTOCtYRzRnSUNBZ0lDQThMM1JoWW14bFBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlVZV0pzWlRzaVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfVGFibGVSb3cgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlUm93Jyk7XG5cbnZhciBfVGFibGVSb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGVSb3cpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgVGFibGVDb250ZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RhYmxlQ29udGVudCcsXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgaW5zdGFuY2VzUm93cyA9IHRoaXMucHJvcHMuZGF0YS5tYXAoZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChfVGFibGVSb3cyLmRlZmF1bHQsIHsga2V5OiBpbnN0YW5jZS5pZCwgaW5zdGFuY2U6IGluc3RhbmNlLCBjb2x1bW5zOiBfdGhpcy5wcm9wcy5jb2x1bW5zIH0pO1xuICAgIH0pO1xuICAgIHZhciBlbXB0eVJvdyA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndHInLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICd0ZCcsXG4gICAgICAgIHsgY29sU3BhbjogJzQnIH0sXG4gICAgICAgICdObyByZXN1bHRzIHlldC4nXG4gICAgICApXG4gICAgKTtcbiAgICB2YXIgbG9hZGluZyA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndHInLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICd0ZCcsXG4gICAgICAgIHsgY29sU3BhbjogJzQnIH0sXG4gICAgICAgICdMb2FkaW5nLi4uJ1xuICAgICAgKVxuICAgICk7XG4gICAgdmFyIGJvZHkgPSB0aGlzLnByb3BzLmxvYWRpbmcgPyBsb2FkaW5nIDogaW5zdGFuY2VzUm93cy5sZW5ndGggPyBpbnN0YW5jZXNSb3dzIDogZW1wdHlSb3c7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndGJvZHknLFxuICAgICAgbnVsbCxcbiAgICAgIGJvZHlcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVDb250ZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsUTI5dWRHVnVkQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPMEZCUjBFc1NVRkJTU3haUVVGWkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN1FVRkRia01zVVVGQlRTeHZRa0ZCUnpzN08wRkJRMUFzVVVGQlNTeGhRVUZoTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVRXNVVUZCVVN4RlFVRkpPMEZCUTJ4RUxHRkJRMFVzTUVOQlFWVXNSMEZCUnl4RlFVRkZMRkZCUVZFc1EwRkJReXhGUVVGRkxFRkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVVXNVVUZCVVN4QlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRkxFMUJRVXNzUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4SFFVRkhMRU5CUXk5Rk8wdEJRMGdzUTBGQlF5eERRVUZETzBGQlEwZ3NVVUZCU1N4UlFVRlJMRWRCUTFZN096dE5RVU5GT3p0VlFVRkpMRTlCUVU4c1JVRkJReXhIUVVGSE96dFBRVUZ4UWp0TFFVTnFReXhCUVVOT0xFTkJRVU03UVVGRFJpeFJRVUZKTEU5QlFVOHNSMEZEVkRzN08wMUJRMFU3TzFWQlFVa3NUMEZCVHl4RlFVRkRMRWRCUVVjN08wOUJRV2RDTzB0QlF6VkNMRUZCUTA0c1EwRkJRenRCUVVOR0xGRkJRVWtzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhIUVVGSExFOUJRVThzUjBGQlJ5eGhRVUZoTEVOQlFVTXNUVUZCVFN4SFFVRkhMR0ZCUVdFc1IwRkJSeXhSUVVGUkxFTkJRVU03UVVGRE1VWXNWMEZEUlRzN08wMUJRMGNzU1VGQlNUdExRVU5ETEVOQlExSTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3YTBKQlJWa3NXVUZCV1NJc0ltWnBiR1VpT2lKVVlXSnNaVU52Ym5SbGJuUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJR1ZqTWlCbWNtOXRJQ2R6WlhKMmFXTmxjeTlsWXpJbk8xeHVhVzF3YjNKMElGUmhZbXhsVW05M0lHWnliMjBnSjJOdmJYQnZibVZ1ZEhNdlZHRmliR1ZTYjNjbk8xeHVYRzVzWlhRZ1ZHRmliR1ZEYjI1MFpXNTBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJb0tTQjdYRzRnSUNBZ2JHVjBJR2x1YzNSaGJtTmxjMUp2ZDNNZ1BTQjBhR2x6TG5CeWIzQnpMbVJoZEdFdWJXRndLR2x1YzNSaGJtTmxJRDArSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4VVlXSnNaVkp2ZHlCclpYazllMmx1YzNSaGJtTmxMbWxrZlNCcGJuTjBZVzVqWlQxN2FXNXpkR0Z1WTJWOUlHTnZiSFZ0Ym5NOWUzUm9hWE11Y0hKdmNITXVZMjlzZFcxdWMzMGdMejVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU2s3WEc0Z0lDQWdiR1YwSUdWdGNIUjVVbTkzSUQwZ0tGeHVJQ0FnSUNBZ1BIUnlQbHh1SUNBZ0lDQWdJQ0E4ZEdRZ1kyOXNVM0JoYmoxY0lqUmNJajVPYnlCeVpYTjFiSFJ6SUhsbGRDNDhMM1JrUGx4dUlDQWdJQ0FnUEM5MGNqNWNiaUFnSUNBcE8xeHVJQ0FnSUd4bGRDQnNiMkZrYVc1bklEMGdLRnh1SUNBZ0lDQWdQSFJ5UGx4dUlDQWdJQ0FnSUNBOGRHUWdZMjlzVTNCaGJqMWNJalJjSWo1TWIyRmthVzVuTGk0dVBDOTBaRDVjYmlBZ0lDQWdJRHd2ZEhJK1hHNGdJQ0FnS1R0Y2JpQWdJQ0JzWlhRZ1ltOWtlU0E5SUhSb2FYTXVjSEp2Y0hNdWJHOWhaR2x1WnlBL0lHeHZZV1JwYm1jZ09pQnBibk4wWVc1alpYTlNiM2R6TG14bGJtZDBhQ0EvSUdsdWMzUmhibU5sYzFKdmQzTWdPaUJsYlhCMGVWSnZkenRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BIUmliMlI1UGx4dUlDQWdJQ0FnSUNCN1ltOWtlWDFjYmlBZ0lDQWdJRHd2ZEdKdlpIaytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRlJoWW14bFEyOXVkR1Z1ZER0Y2JpSmRmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgVGFibGVIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiBcIlRhYmxlSGVhZGVyXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBoZWFkZXJzID0gdGhpcy5wcm9wcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoY29sdW1uLCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidGhcIixcbiAgICAgICAgeyBrZXk6IGluZGV4IH0sXG4gICAgICAgIGNvbHVtbi5uYW1lXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgXCJ0aGVhZFwiLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidHJcIixcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaGVhZGVyc1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZUhlYWRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFNHVmhaR1Z5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUVVFc1NVRkJTU3hYUVVGWExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN1FVRkRiRU1zVVVGQlRTeHZRa0ZCUnp0QlFVTlFMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExFMUJRVTBzUlVGQlJTeExRVUZMTEVWQlFVczdRVUZEZEVRc1lVRkRSVHM3VlVGQlNTeEhRVUZITEVWQlFVVXNTMEZCU3l4QlFVRkRPMUZCUVVVc1RVRkJUU3hEUVVGRExFbEJRVWs3VDBGQlRTeERRVU5zUXp0TFFVTklMRU5CUVVNc1EwRkJRenRCUVVOSUxGZEJRMFU3T3p0TlFVTkZPenM3VVVGRFJ5eFBRVUZQTzA5QlEwdzdTMEZEUXl4RFFVTlNPMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmRCUVZjaUxDSm1hV3hsSWpvaVZHRmliR1ZJWldGa1pYSXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYkdWMElGUmhZbXhsU0dWaFpHVnlJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJb0tTQjdYRzRnSUNBZ2JHVjBJR2hsWVdSbGNuTWdQU0IwYUdsekxuQnliM0J6TG1OdmJIVnRibk11YldGd0tDaGpiMngxYlc0c0lHbHVaR1Y0S1NBOVBpQjdYRzRnSUNBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0lDQThkR2dnYTJWNVBYdHBibVJsZUgwK2UyTnZiSFZ0Ymk1dVlXMWxmVHd2ZEdnK1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZEdobFlXUStYRzRnSUNBZ0lDQWdJRHgwY2o1Y2JpQWdJQ0FnSUNBZ0lDQjdhR1ZoWkdWeWMzMWNiaUFnSUNBZ0lDQWdQQzkwY2o1Y2JpQWdJQ0FnSUR3dmRHaGxZV1ErWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZSaFlteGxTR1ZoWkdWeU95SmRmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgVGFibGVSb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiBcIlRhYmxlUm93XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBpbnN0YW5jZSA9IHRoaXMucHJvcHMuaW5zdGFuY2U7XG4gICAgdmFyIGNvbHVtbnMgPSB0aGlzLnByb3BzLmNvbHVtbnMubWFwKGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgIHZhciBrZXkgPSBjb2x1bW4ua2V5O1xuICAgICAgdmFyIHZhbHVlID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5KGluc3RhbmNlKSA6IGluc3RhbmNlW2tleV07XG5cbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBcInRkXCIsXG4gICAgICAgIHsga2V5OiB2YWx1ZSB9LFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFwidHJcIixcbiAgICAgIG51bGwsXG4gICAgICBjb2x1bW5zXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlUm93O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsVW05M0xtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzBGQlFVRXNTVUZCU1N4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdRVUZETDBJc1VVRkJUU3h2UWtGQlJ6dEJRVU5RTEZGQlFVa3NVVUZCVVN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVVVGQlVTeERRVUZETzBGQlEyNURMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGQkxFMUJRVTBzUlVGQlNUdEJRVU0zUXl4VlFVRkpMRWRCUVVjc1IwRkJSeXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETzBGQlEzSkNMRlZCUVVrc1MwRkJTeXhIUVVGSExFRkJRVU1zVDBGQlR5eEhRVUZITEV0QlFVc3NWVUZCVlN4SFFVRkpMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eFJRVUZSTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWGhGTEdGQlEwVTdPMVZCUVVrc1IwRkJSeXhGUVVGRkxFdEJRVXNzUVVGQlF6dFJRVUZGTEV0QlFVczdUMEZCVFN4RFFVTTFRanRMUVVOSUxFTkJRVU1zUTBGQlF6dEJRVU5JTEZkQlEwVTdPenROUVVOSExFOUJRVTg3UzBGRFRDeERRVU5NTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08ydENRVVZaTEZGQlFWRWlMQ0ptYVd4bElqb2lWR0ZpYkdWU2IzY3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYkdWMElGUmhZbXhsVW05M0lEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCeVpXNWtaWElvS1NCN1hHNGdJQ0FnYkdWMElHbHVjM1JoYm1ObElEMGdkR2hwY3k1d2NtOXdjeTVwYm5OMFlXNWpaVHRjYmlBZ0lDQnNaWFFnWTI5c2RXMXVjeUE5SUhSb2FYTXVjSEp2Y0hNdVkyOXNkVzF1Y3k1dFlYQW9ZMjlzZFcxdUlEMCtJSHRjYmlBZ0lDQWdJR3hsZENCclpYa2dQU0JqYjJ4MWJXNHVhMlY1TzF4dUlDQWdJQ0FnYkdWMElIWmhiSFZsSUQwZ0tIUjVjR1Z2WmlCclpYa2dQVDA5SUZ3aVpuVnVZM1JwYjI1Y0lpa2dQeUJyWlhrb2FXNXpkR0Z1WTJVcElEb2dhVzV6ZEdGdVkyVmJhMlY1WFR0Y2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUNBZ1BIUmtJR3RsZVQxN2RtRnNkV1Y5UG50MllXeDFaWDA4TDNSa1BseHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOUtUdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhSeVBseHVJQ0FnSUNBZ0lDQjdZMjlzZFcxdWMzMWNiaUFnSUNBZ0lEd3ZkSEkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZSaFlteGxVbTkzT3lKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfU2lkZWJhciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvU2lkZWJhcicpO1xuXG52YXIgX1NpZGViYXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU2lkZWJhcik7XG5cbnZhciBfUGFnZUNvbnRlbnQgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1BhZ2VDb250ZW50Jyk7XG5cbnZhciBfUGFnZUNvbnRlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUGFnZUNvbnRlbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgV2luZG93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1dpbmRvdycsXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ3BhbmUtZ3JvdXAnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdwYW5lLXNtIHNpZGViYXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1NpZGViYXIyLmRlZmF1bHQsIG51bGwpXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZScgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfUGFnZUNvbnRlbnQyLmRlZmF1bHQsIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFdpbmRvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbGRwYm1SdmR5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN08wRkJSMEVzU1VGQlNTeE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3UVVGRk4wSXNVVUZCVFN4dlFrRkJSenRCUVVOUUxGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMRmxCUVZrN1RVRkRla0k3TzFWQlFVc3NVMEZCVXl4RlFVRkRMR2xDUVVGcFFqdFJRVU01UWl3MFEwRkJWenRQUVVOUU8wMUJRMDQ3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRTFCUVUwN1VVRkRia0lzWjBSQlFXVTdUMEZEV0R0TFFVTkdMRU5CUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdhMEpCUlZrc1RVRkJUU0lzSW1acGJHVWlPaUpYYVc1a2IzY3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRk5wWkdWaVlYSWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OVRhV1JsWW1GeUp6dGNibWx0Y0c5eWRDQlFZV2RsUTI5dWRHVnVkQ0JtY205dElDZGpiMjF3YjI1bGJuUnpMMUJoWjJWRGIyNTBaVzUwSnpzZ1hHNWNibXhsZENCWGFXNWtiM2NnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNWNiaUFnY21WdVpHVnlLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luQmhibVV0WjNKdmRYQmNJajVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p3WVc1bExYTnRJSE5wWkdWaVlYSmNJajVjYmlBZ0lDQWdJQ0FnSUNBOFUybGtaV0poY2lBdlBseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKd1lXNWxYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BGQmhaMlZEYjI1MFpXNTBJQzgrWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElGZHBibVJ2ZHpzaVhYMD0iLCIndXNlIHN0cmljdCc7XG4ndXNlIHNjcmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgX2xpc3RlbmVycyA9IHt9O1xuXG52YXIgRGlzcGF0Y2hlciA9IGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7fTtcbkRpc3BhdGNoZXIucHJvdG90eXBlID0ge1xuICByZWdpc3RlcjogZnVuY3Rpb24gcmVnaXN0ZXIoYWN0aW9uTmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIV9saXN0ZW5lcnNbYWN0aW9uTmFtZV0pIHtcbiAgICAgIF9saXN0ZW5lcnNbYWN0aW9uTmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICBfbGlzdGVuZXJzW2FjdGlvbk5hbWVdLnB1c2goY2FsbGJhY2spO1xuICB9LFxuICBub3RpZnlBbGw6IGZ1bmN0aW9uIG5vdGlmeUFsbChhY3Rpb25OYW1lKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgY2FsbGJhY2tzID0gX2xpc3RlbmVyc1thY3Rpb25OYW1lXSB8fCBbXTtcbiAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwuYXBwbHkoY2FsbGJhY2ssIFtjYWxsYmFja10uY29uY2F0KGFyZ3MpKTtcbiAgICB9KTtcbiAgfVxufTtcblxudmFyIGFwcERpc3BhY2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGFwcERpc3BhY2hlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVJwYzNCaGRHTm9aWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJMRmxCUVZrc1EwRkJRenM3T3pzN1FVRkZZaXhKUVVGSkxGVkJRVlVzUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUlhCQ0xFbEJRVWtzVlVGQlZTeEhRVUZITEZOQlFXSXNWVUZCVlN4SFFVRmpMRVZCUVVVc1EwRkJRenRCUVVNdlFpeFZRVUZWTEVOQlFVTXNVMEZCVXl4SFFVRkhPMEZCUlhKQ0xGVkJRVkVzYjBKQlFVTXNWVUZCVlN4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVNM1FpeFJRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhGUVVGRk8wRkJRek5DTEdkQ1FVRlZMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzB0QlF6ZENPenRCUVVWRUxHTkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UjBGRGRrTTdRVUZGUkN4WFFVRlRMSEZDUVVGRExGVkJRVlVzUlVGQlZ6dHpRMEZCVGl4SlFVRkpPMEZCUVVvc1ZVRkJTVHM3TzBGQlF6TkNMRkZCUVVrc1UwRkJVeXhIUVVGSExGVkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNN1FVRkROME1zWVVGQlV5eERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRkJMRkZCUVZFc1JVRkJTVHRCUVVNMVFpeGpRVUZSTEVOQlFVTXNTVUZCU1N4TlFVRkJMRU5CUVdJc1VVRkJVU3hIUVVGTkxGRkJRVkVzVTBGQlN5eEpRVUZKTEVWQlFVTXNRMEZCUXp0TFFVTnNReXhEUVVGRExFTkJRVU03UjBGRFNqdERRVU5HTEVOQlFVTTdPMEZCUlVZc1NVRkJTU3haUVVGWkxFZEJRVWNzU1VGQlNTeFZRVUZWTEVWQlFVVXNRMEZCUXpzN2EwSkJSWEpDTEZsQlFWa2lMQ0ptYVd4bElqb2laR2x6Y0dGMFkyaGxjaTVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUl1TDNOeVl5OXFjeThpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJbmRYTmxJSE5qY21samRDYzdYRzVjYm14bGRDQmZiR2x6ZEdWdVpYSnpJRDBnZTMwN1hHNWNibXhsZENCRWFYTndZWFJqYUdWeUlEMGdablZ1WTNScGIyNG9LU0I3ZlR0Y2JrUnBjM0JoZEdOb1pYSXVjSEp2ZEc5MGVYQmxJRDBnZTF4dUlDQmNiaUFnY21WbmFYTjBaWElvWVdOMGFXOXVUbUZ0WlN3Z1kyRnNiR0poWTJzcElIdGNiaUFnSUNCcFppQW9JVjlzYVhOMFpXNWxjbk5iWVdOMGFXOXVUbUZ0WlYwcElIdGNiaUFnSUNBZ0lGOXNhWE4wWlc1bGNuTmJZV04wYVc5dVRtRnRaVjBnUFNCYlhUdGNiaUFnSUNCOVhHNWNiaUFnSUNCZmJHbHpkR1Z1WlhKelcyRmpkR2x2Yms1aGJXVmRMbkIxYzJnb1kyRnNiR0poWTJzcE8xeHVJQ0I5TEZ4dVhHNGdJRzV2ZEdsbWVVRnNiQ2hoWTNScGIyNU9ZVzFsTENBdUxpNWhjbWR6S1NCN1hHNGdJQ0FnYkdWMElHTmhiR3hpWVdOcmN5QTlJRjlzYVhOMFpXNWxjbk5iWVdOMGFXOXVUbUZ0WlYwZ2ZId2dXMTA3WEc0Z0lDQWdZMkZzYkdKaFkydHpMbVp2Y2tWaFkyZ29ZMkZzYkdKaFkyc2dQVDRnZTF4dUlDQWdJQ0FnWTJGc2JHSmhZMnN1WTJGc2JDaGpZV3hzWW1GamF5d2dMaTR1WVhKbmN5azdYRzRnSUNBZ2ZTazdYRzRnSUgxY2JuMDdYRzVjYm14bGRDQmhjSEJFYVhOd1lXTm9aWElnUFNCdVpYY2dSR2x6Y0dGMFkyaGxjaWdwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCaGNIQkVhWE53WVdOb1pYSTdJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX1dpbmRvdyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvV2luZG93Jyk7XG5cbnZhciBfV2luZG93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1dpbmRvdyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KF9XaW5kb3cyLmRlZmF1bHQsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2luZG93LWNvbnRlbnQnKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW0xaGFXNHVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdRVUZGUVN4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVOaUxESkRRVUZWTEVWQlExWXNVVUZCVVN4RFFVRkRMR05CUVdNc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RFFVTXhReXhEUVVGRElpd2labWxzWlNJNkltMWhhVzR1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTGk5emNtTXZhbk12SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZkcGJtUnZkeUJtY205dElDZGpiMjF3YjI1bGJuUnpMMWRwYm1SdmR5YzdYRzVjYmxKbFlXTjBSRTlOTG5KbGJtUmxjaWhjYmlBZ1BGZHBibVJ2ZHlBdlBpeGNiaUFnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9KM2RwYm1SdmR5MWpiMjUwWlc1MEp5bGNiaWs3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcHJvbWlzaWZ5ID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvdXRpbHMvcHJvbWlzaWZ5Jyk7XG5cbnZhciBfcHJvbWlzaWZ5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Byb21pc2lmeSk7XG5cbnZhciBfcmVnaW9ucyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMi9yZWdpb25zJyk7XG5cbnZhciBfcmVnaW9uczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWdpb25zKTtcblxudmFyIF9pbnN0YW5jZXMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzIvaW5zdGFuY2VzJyk7XG5cbnZhciBfaW5zdGFuY2VzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luc3RhbmNlcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBhd3MgPSBlbGVjdHJvblJlcXVpcmUoJy4vYXdzLWNvbmZpZy5qc29uJyk7XG52YXIgQVdTID0gZWxlY3Ryb25SZXF1aXJlKCdhd3Mtc2RrJyk7XG5BV1MuY29uZmlnLnVwZGF0ZShhd3MpO1xuXG52YXIgZ2V0RWMyID0gZnVuY3Rpb24gZ2V0RWMyKCkge1xuICB2YXIgcmVnaW9uID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gJ2V1LXdlc3QtMScgOiBhcmd1bWVudHNbMF07XG5cbiAgdmFyIGVjMiA9IG5ldyBBV1MuRUMyKHsgcmVnaW9uOiByZWdpb24gfSk7XG4gIHJldHVybiAoMCwgX3Byb21pc2lmeTIuZGVmYXVsdCkoZWMyLCBbJ2Rlc2NyaWJlSW5zdGFuY2VzJywgJ2Rlc2NyaWJlUmVnaW9ucyddKTtcbn07XG5cbnZhciBlYzJJbnN0YW5jZXMgPSB7XG4gIGZldGNoSW5zdGFuY2VzOiBmdW5jdGlvbiBmZXRjaEluc3RhbmNlcyhyZWdpb24pIHtcbiAgICB2YXIgZWMyID0gZ2V0RWMyKHJlZ2lvbik7XG4gICAgcmV0dXJuIGVjMi5kZXNjcmliZUluc3RhbmNlcygpLnRoZW4oX2luc3RhbmNlczIuZGVmYXVsdCkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbiBmZXRjaGluZyBpbnN0YW5jZXMhXCIsIGVycik7XG4gICAgfSk7XG4gIH0sXG4gIGZldGNoUmVnaW9uczogZnVuY3Rpb24gZmV0Y2hSZWdpb25zKCkge1xuICAgIHZhciBlYzIgPSBnZXRFYzIoKTtcbiAgICByZXR1cm4gZWMyLmRlc2NyaWJlUmVnaW9ucygpLnRoZW4oX3JlZ2lvbnMyLmRlZmF1bHQpLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFwiRXJyb3IgaW4gZmV0Y2hpbmcgcmVnaW9ucyFcIiwgZXJyKTtcbiAgICB9KTtcbiAgfVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZWMySW5zdGFuY2VzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVmpNaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPenM3T3p0QlFVbEJMRWxCUVVrc1IwRkJSeXhIUVVGSExHVkJRV1VzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE8wRkJReTlETEVsQlFVa3NSMEZCUnl4SFFVRkhMR1ZCUVdVc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU55UXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZka0lzU1VGQlNTeE5RVUZOTEVkQlFVY3NVMEZCVkN4TlFVRk5MRWRCUVdkRE8wMUJRWEJDTEUxQlFVMHNlVVJCUVVNc1YwRkJWenM3UVVGRGRFTXNUVUZCU1N4SFFVRkhMRWRCUVVjc1NVRkJTU3hIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkZMRTFCUVUwc1JVRkJReXhEUVVGRExFTkJRVU03UVVGRGVFTXNVMEZCVHl4NVFrRkJhVUlzUjBGQlJ5eEZRVUZGTEVOQlFVTXNiVUpCUVcxQ0xFVkJRVVVzYVVKQlFXbENMRU5CUVVNc1EwRkJReXhEUVVGRE8wTkJRM2hGTEVOQlFVTTdPMEZCUlVZc1NVRkJTU3haUVVGWkxFZEJRVWM3UVVGRGFrSXNaMEpCUVdNc01FSkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEzSkNMRkZCUVVrc1IwRkJSeXhIUVVGSExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjZRaXhYUVVGUExFZEJRVWNzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSU3hEUVVNelFpeEpRVUZKTEhGQ1FVRnZRaXhEUVVONFFpeExRVUZMTEVOQlFVTXNWVUZCUXl4SFFVRkhPMkZCUVVzc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5dzRRa0ZCT0VJc1JVRkJSU3hIUVVGSExFTkJRVU03UzBGQlFTeERRVUZETEVOQlFVTTdSMEZEZGtVN1FVRkZSQ3hqUVVGWkxEQkNRVUZITzBGQlEySXNVVUZCU1N4SFFVRkhMRWRCUVVjc1RVRkJUU3hGUVVGRkxFTkJRVU03UVVGRGJrSXNWMEZCVHl4SFFVRkhMRU5CUVVNc1pVRkJaU3hGUVVGRkxFTkJRM3BDTEVsQlFVa3NiVUpCUVd0Q0xFTkJRM1JDTEV0QlFVc3NRMEZCUXl4VlFVRkRMRWRCUVVjN1lVRkJTeXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETERSQ1FVRTBRaXhGUVVGRkxFZEJRVWNzUTBGQlF6dExRVUZCTEVOQlFVTXNRMEZCUXp0SFFVTnlSVHREUVVOR0xFTkJRVU03TzJ0Q1FVVmhMRmxCUVZraUxDSm1hV3hsSWpvaVpXTXlMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0J3Y205dGFYTnBabmxOWlhSb2IyUnpJR1p5YjIwZ0ozVjBhV3h6TDNCeWIyMXBjMmxtZVNjN1hHNXBiWEJ2Y25RZ2MyVnlhV0ZzYVhwbFVtVm5hVzl1Y3lCbWNtOXRJQ2R6WlhKMmFXTmxjeTlsWXpJdmNtVm5hVzl1Y3ljN1hHNXBiWEJ2Y25RZ2MyVnlhV0ZzYVhwbFNXNXpkR0Z1WTJWeklHWnliMjBnSjNObGNuWnBZMlZ6TDJWak1pOXBibk4wWVc1alpYTW5PMXh1WEc1c1pYUWdZWGR6SUQwZ1pXeGxZM1J5YjI1U1pYRjFhWEpsS0NjdUwyRjNjeTFqYjI1bWFXY3Vhbk52YmljcE8xeHViR1YwSUVGWFV5QTlJR1ZzWldOMGNtOXVVbVZ4ZFdseVpTZ25ZWGR6TFhOa2F5Y3BPeUJjYmtGWFV5NWpiMjVtYVdjdWRYQmtZWFJsS0dGM2N5azdYRzVjYm14bGRDQm5aWFJGWXpJZ1BTQm1kVzVqZEdsdmJpaHlaV2RwYjI0OUoyVjFMWGRsYzNRdE1TY3BJSHRjYmlBZ2JHVjBJR1ZqTWlBOUlHNWxkeUJCVjFNdVJVTXlLSHR5WldkcGIyNDZJSEpsWjJsdmJuMHBPMXh1SUNCeVpYUjFjbTRnY0hKdmJXbHphV1o1VFdWMGFHOWtjeWhsWXpJc0lGc25aR1Z6WTNKcFltVkpibk4wWVc1alpYTW5MQ0FuWkdWelkzSnBZbVZTWldkcGIyNXpKMTBwTzF4dWZUdGNibHh1YkdWMElHVmpNa2x1YzNSaGJtTmxjeUE5SUh0Y2JpQWdabVYwWTJoSmJuTjBZVzVqWlhNb2NtVm5hVzl1S1NCN1hHNGdJQ0FnYkdWMElHVmpNaUE5SUdkbGRFVmpNaWh5WldkcGIyNHBPMXh1SUNBZ0lISmxkSFZ5YmlCbFl6SXVaR1Z6WTNKcFltVkpibk4wWVc1alpYTW9LVnh1SUNBZ0lDQWdMblJvWlc0b2MyVnlhV0ZzYVhwbFNXNXpkR0Z1WTJWektWeHVJQ0FnSUNBZ0xtTmhkR05vS0NobGNuSXBJRDArSUdOdmJuTnZiR1V1WlhKeWIzSW9YQ0pGY25KdmNpQnBiaUJtWlhSamFHbHVaeUJwYm5OMFlXNWpaWE1oWENJc0lHVnljaWtwTzF4dUlDQjlMRnh1WEc0Z0lHWmxkR05vVW1WbmFXOXVjeWdwSUh0Y2JpQWdJQ0JzWlhRZ1pXTXlJRDBnWjJWMFJXTXlLQ2s3WEc0Z0lDQWdjbVYwZFhKdUlHVmpNaTVrWlhOamNtbGlaVkpsWjJsdmJuTW9LVnh1SUNBZ0lDQWdMblJvWlc0b2MyVnlhV0ZzYVhwbFVtVm5hVzl1Y3lsY2JpQWdJQ0FnSUM1allYUmphQ2dvWlhKeUtTQTlQaUJqYjI1emIyeGxMbVZ5Y205eUtGd2lSWEp5YjNJZ2FXNGdabVYwWTJocGJtY2djbVZuYVc5dWN5RmNJaXdnWlhKeUtTazdYRzRnSUgxY2JuMDdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJR1ZqTWtsdWMzUmhibU5sY3pzaVhYMD0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBzZXJpYWxpemVJbnN0YW5jZXMgPSBmdW5jdGlvbiBzZXJpYWxpemVJbnN0YW5jZXMoaW5zdGFuY2VzKSB7XG4gIHJldHVybiBpbnN0YW5jZXMuUmVzZXJ2YXRpb25zLm1hcChmdW5jdGlvbiAoaW5zdGFuY2VPYmplY3QpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZU9iamVjdC5JbnN0YW5jZXNbMF07XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1czogaW5zdGFuY2UuU3RhdGUuTmFtZSxcbiAgICAgIGluc3RhbmNlVHlwZTogaW5zdGFuY2UuSW5zdGFuY2VUeXBlLFxuICAgICAga2V5TmFtZTogaW5zdGFuY2UuS2V5TmFtZSxcbiAgICAgIHRhZ3M6IGluc3RhbmNlLlRhZ3MubWFwKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IHRhZy5LZXksXG4gICAgICAgICAgdmFsdWU6IHRhZy5WYWx1ZVxuICAgICAgICB9O1xuICAgICAgfSksXG4gICAgICBwdWJsaWNJcEFkZHJlc3M6IGluc3RhbmNlLlB1YmxpY0lwQWRkcmVzcyxcbiAgICAgIGlkOiBpbnN0YW5jZS5JbnN0YW5jZUlkXG4gICAgfTtcbiAgfSk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBzZXJpYWxpemVJbnN0YW5jZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1sdWMzUmhibU5sY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenRCUVVGQkxFbEJRVWtzYTBKQlFXdENMRWRCUVVjc1UwRkJja0lzYTBKQlFXdENMRU5CUVZrc1UwRkJVeXhGUVVGRk8wRkJRek5ETEZOQlFVOHNVMEZCVXl4RFFVRkRMRmxCUVZrc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlFTeGpRVUZqTEVWQlFVazdRVUZEYkVRc1VVRkJTU3hSUVVGUkxFZEJRVWNzWTBGQll5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNelF5eFhRVUZQTzBGQlEwd3NXVUZCVFN4RlFVRkZMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNUdEJRVU16UWl4clFrRkJXU3hGUVVGRkxGRkJRVkVzUTBGQlF5eFpRVUZaTzBGQlEyNURMR0ZCUVU4c1JVRkJSU3hSUVVGUkxFTkJRVU1zVDBGQlR6dEJRVU42UWl4VlFVRkpMRVZCUVVVc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUXl4SFFVRkhMRVZCUVVzN1FVRkRMMElzWlVGQlR6dEJRVU5NTEdGQlFVY3NSVUZCUlN4SFFVRkhMRU5CUVVNc1IwRkJSenRCUVVOYUxHVkJRVXNzUlVGQlJTeEhRVUZITEVOQlFVTXNTMEZCU3p0VFFVTnFRaXhEUVVGRE8wOUJRMGdzUTBGQlF6dEJRVU5HTEhGQ1FVRmxMRVZCUVVVc1VVRkJVU3hEUVVGRExHVkJRV1U3UVVGRGVrTXNVVUZCUlN4RlFVRkZMRkZCUVZFc1EwRkJReXhWUVVGVk8wdEJRM2hDTEVOQlFVTTdSMEZEU0N4RFFVRkRMRU5CUVVNN1EwRkRTaXhEUVVGRE96dHJRa0ZGWVN4clFrRkJhMElpTENKbWFXeGxJam9pYVc1emRHRnVZMlZ6TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklteGxkQ0J6WlhKcFlXeHBlbVZKYm5OMFlXNWpaWE1nUFNCbWRXNWpkR2x2YmlocGJuTjBZVzVqWlhNcElIdGNiaUFnY21WMGRYSnVJR2x1YzNSaGJtTmxjeTVTWlhObGNuWmhkR2x2Ym5NdWJXRndLR2x1YzNSaGJtTmxUMkpxWldOMElEMCtJSHRjYmlBZ0lDQnNaWFFnYVc1emRHRnVZMlVnUFNCcGJuTjBZVzVqWlU5aWFtVmpkQzVKYm5OMFlXNWpaWE5iTUYwN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJSE4wWVhSMWN6b2dhVzV6ZEdGdVkyVXVVM1JoZEdVdVRtRnRaU3hjYmlBZ0lDQWdJR2x1YzNSaGJtTmxWSGx3WlRvZ2FXNXpkR0Z1WTJVdVNXNXpkR0Z1WTJWVWVYQmxMRnh1SUNBZ0lDQWdhMlY1VG1GdFpUb2dhVzV6ZEdGdVkyVXVTMlY1VG1GdFpTeGNiaUFnSUNBZ0lIUmhaM002SUdsdWMzUmhibU5sTGxSaFozTXViV0Z3S0NoMFlXY3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUNBZ0lDQnJaWGs2SUhSaFp5NUxaWGtzWEc0Z0lDQWdJQ0FnSUNBZ2RtRnNkV1U2SUhSaFp5NVdZV3gxWlZ4dUlDQWdJQ0FnSUNCOU8xeHVJQ0FnSUNBZ2ZTa3NYRzRnSUNBZ0lDQndkV0pzYVdOSmNFRmtaSEpsYzNNNklHbHVjM1JoYm1ObExsQjFZbXhwWTBsd1FXUmtjbVZ6Y3l4Y2JpQWdJQ0FnSUdsa09pQnBibk4wWVc1alpTNUpibk4wWVc1alpVbGtYRzRnSUNBZ2ZUdGNiaUFnZlNrN1hHNTlPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0J6WlhKcFlXeHBlbVZKYm5OMFlXNWpaWE03SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciByZWdpb25OYW1lcyA9IHtcbiAgJ3VzLWVhc3QtMSc6IFwiVVMgRWFzdCAoTi4gVmlyZ2luaWEpXCIsXG4gICd1cy1lYXN0LTInOiBcIlVTIEVhc3QgKE9oaW8pXCIsXG4gICd1cy13ZXN0LTEnOiBcIlVTIFdlc3QgKE4uIENhbGlmb3JuaWEpXCIsXG4gICd1cy13ZXN0LTInOiBcIlVTIFdlc3QgKE9yZWdvbilcIixcbiAgJ2FwLXNvdXRoLTEnOiBcIkFzaWEgUGFjaWZpYyAoTXVtYmFpKVwiLFxuICAnYXAtbm9ydGhlYXN0LTInOiBcIkFzaWEgUGFjaWZpYyAoU2VvdWwpXCIsXG4gICdhcC1zb3V0aGVhc3QtMSc6IFwiQXNpYSBQYWNpZmljIChTaW5nYXBvcmUpXCIsXG4gICdhcC1zb3V0aGVhc3QtMic6IFwiQXNpYSBQYWNpZmljIChTeWRuZXkpXCIsXG4gICdhcC1ub3J0aGVhc3QtMSc6IFwiQXNpYSBQYWNpZmljIChUb2t5bylcIixcbiAgJ2V1LWNlbnRyYWwtMSc6IFwiRVUgKEZyYW5rZnVydClcIixcbiAgJ2V1LXdlc3QtMSc6IFwiRVUgKElyZWxhbmQpXCIsXG4gICdzYS1lYXN0LTEnOiBcIlNvdXRoIEFtZXJpY2EgKFPDo28gUGF1bG8pXCJcbn07XG5cbnZhciBzZXJpYWxpemVSZWdpb25zID0gZnVuY3Rpb24gc2VyaWFsaXplUmVnaW9ucyhyZWdpb25zKSB7XG4gIHJldHVybiByZWdpb25zLlJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICB2YXIgcmVnaW9uTmFtZSA9IHJlZ2lvbi5SZWdpb25OYW1lO1xuICAgIHJldHVybiB7XG4gICAgICBrZXk6IHJlZ2lvbk5hbWUsXG4gICAgICBuYW1lOiByZWdpb25OYW1lc1tyZWdpb25OYW1lXSB8fCByZWdpb25OYW1lXG4gICAgfTtcbiAgfSk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBzZXJpYWxpemVSZWdpb25zO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluSmxaMmx2Ym5NdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3UVVGQlFTeEpRVUZKTEZkQlFWY3NSMEZCUnp0QlFVTm9RaXhoUVVGWExFVkJRVVVzZFVKQlFYVkNPMEZCUTNCRExHRkJRVmNzUlVGQlJTeG5Ra0ZCWjBJN1FVRkROMElzWVVGQlZ5eEZRVUZGTEhsQ1FVRjVRanRCUVVOMFF5eGhRVUZYTEVWQlFVVXNhMEpCUVd0Q08wRkJReTlDTEdOQlFWa3NSVUZCUlN4MVFrRkJkVUk3UVVGRGNrTXNhMEpCUVdkQ0xFVkJRVVVzYzBKQlFYTkNPMEZCUTNoRExHdENRVUZuUWl4RlFVRkZMREJDUVVFd1FqdEJRVU0xUXl4clFrRkJaMElzUlVGQlJTeDFRa0ZCZFVJN1FVRkRla01zYTBKQlFXZENMRVZCUVVVc2MwSkJRWE5DTzBGQlEzaERMR2RDUVVGakxFVkJRVVVzWjBKQlFXZENPMEZCUTJoRExHRkJRVmNzUlVGQlJTeGpRVUZqTzBGQlF6TkNMR0ZCUVZjc1JVRkJSU3d5UWtGQk1rSTdRMEZEZWtNc1EwRkJRenM3UVVGRlJpeEpRVUZKTEdkQ1FVRm5RaXhIUVVGSExGTkJRVzVDTEdkQ1FVRm5RaXhEUVVGWkxFOUJRVThzUlVGQlJUdEJRVU4yUXl4VFFVRlBMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVRXNUVUZCVFN4RlFVRkpPMEZCUTI1RExGRkJRVWtzVlVGQlZTeEhRVUZITEUxQlFVMHNRMEZCUXl4VlFVRlZMRU5CUVVNN1FVRkRia01zVjBGQlR6dEJRVU5NTEZOQlFVY3NSVUZCUlN4VlFVRlZPMEZCUTJZc1ZVRkJTU3hGUVVGRkxGZEJRVmNzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4VlFVRlZPMHRCUXpWRExFTkJRVU03UjBGRFNDeERRVUZETEVOQlFVTTdRMEZEU2l4RFFVRkRPenRyUWtGRllTeG5Ra0ZCWjBJaUxDSm1hV3hsSWpvaWNtVm5hVzl1Y3k1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdUwzTnlZeTlxY3k4aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnNaWFFnY21WbmFXOXVUbUZ0WlhNZ1BTQjdYRzRnSUNkMWN5MWxZWE4wTFRFbk9pQmNJbFZUSUVWaGMzUWdLRTR1SUZacGNtZHBibWxoS1Z3aUxGeHVJQ0FuZFhNdFpXRnpkQzB5SnpvZ1hDSlZVeUJGWVhOMElDaFBhR2x2S1Z3aUxGeHVJQ0FuZFhNdGQyVnpkQzB4SnpvZ1hDSlZVeUJYWlhOMElDaE9MaUJEWVd4cFptOXlibWxoS1Z3aUxGeHVJQ0FuZFhNdGQyVnpkQzB5SnpvZ1hDSlZVeUJYWlhOMElDaFBjbVZuYjI0cFhDSXNYRzRnSUNkaGNDMXpiM1YwYUMweEp6b2dYQ0pCYzJsaElGQmhZMmxtYVdNZ0tFMTFiV0poYVNsY0lpeGNiaUFnSjJGd0xXNXZjblJvWldGemRDMHlKem9nWENKQmMybGhJRkJoWTJsbWFXTWdLRk5sYjNWc0tWd2lMRnh1SUNBbllYQXRjMjkxZEdobFlYTjBMVEVuT2lCY0lrRnphV0VnVUdGamFXWnBZeUFvVTJsdVoyRndiM0psS1Z3aUxGeHVJQ0FuWVhBdGMyOTFkR2hsWVhOMExUSW5PaUJjSWtGemFXRWdVR0ZqYVdacFl5QW9VM2xrYm1WNUtWd2lMRnh1SUNBbllYQXRibTl5ZEdobFlYTjBMVEVuT2lCY0lrRnphV0VnVUdGamFXWnBZeUFvVkc5cmVXOHBYQ0lzWEc0Z0lDZGxkUzFqWlc1MGNtRnNMVEVuT2lCY0lrVlZJQ2hHY21GdWEyWjFjblFwWENJc1hHNGdJQ2RsZFMxM1pYTjBMVEVuT2lCY0lrVlZJQ2hKY21Wc1lXNWtLVndpTEZ4dUlDQW5jMkV0WldGemRDMHhKem9nWENKVGIzVjBhQ0JCYldWeWFXTmhJQ2hUdzZOdklGQmhkV3h2S1Z3aVhHNTlPMXh1WEc1c1pYUWdjMlZ5YVdGc2FYcGxVbVZuYVc5dWN5QTlJR1oxYm1OMGFXOXVLSEpsWjJsdmJuTXBJSHRjYmlBZ2NtVjBkWEp1SUhKbFoybHZibk11VW1WbmFXOXVjeTV0WVhBb2NtVm5hVzl1SUQwK0lIdGNiaUFnSUNCc1pYUWdjbVZuYVc5dVRtRnRaU0E5SUhKbFoybHZiaTVTWldkcGIyNU9ZVzFsTzF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQnJaWGs2SUhKbFoybHZiazVoYldVc1hHNGdJQ0FnSUNCdVlXMWxPaUJ5WldkcGIyNU9ZVzFsYzF0eVpXZHBiMjVPWVcxbFhTQjhmQ0J5WldkcGIyNU9ZVzFsWEc0Z0lDQWdmVHRjYmlBZ2ZTazdYRzU5TzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCelpYSnBZV3hwZW1WU1pXZHBiMjV6T3lKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBwcm9taXNpZnlNZXRob2RzID0gZnVuY3Rpb24gcHJvbWlzaWZ5TWV0aG9kcyhvYmplY3QsIG1ldGhvZE5hbWVzKSB7XG4gIHJldHVybiBtZXRob2ROYW1lcy5yZWR1Y2UoZnVuY3Rpb24gKHByb21pc2lmaWVkLCBtZXRob2ROYW1lKSB7XG4gICAgcHJvbWlzaWZpZWRbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBvYmplY3RbbWV0aG9kTmFtZV0oZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBwcm9taXNpZmllZDtcbiAgfSwge30pO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gcHJvbWlzaWZ5TWV0aG9kcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbkJ5YjIxcGMybG1lUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096dEJRVUZCTEVsQlFVa3NaMEpCUVdkQ0xFZEJRVWNzVTBGQmJrSXNaMEpCUVdkQ0xFTkJRVmtzVFVGQlRTeEZRVUZGTEZkQlFWY3NSVUZCUlR0QlFVTnVSQ3hUUVVGUExGZEJRVmNzUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCUXl4WFFVRlhMRVZCUVVVc1ZVRkJWU3hGUVVGTE8wRkJRM0pFTEdWQlFWY3NRMEZCUXl4VlFVRlZMRU5CUVVNc1IwRkJSeXhaUVVGWE8wRkJRMjVETEdGQlFVOHNTVUZCU1N4UFFVRlBMRU5CUVVNc1ZVRkJReXhQUVVGUExFVkJRVVVzVFVGQlRTeEZRVUZMTzBGQlEzUkRMR05CUVUwc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eFZRVUZETEVkQlFVY3NSVUZCUlN4SlFVRkpMRVZCUVVzN1FVRkRhRU1zWTBGQlNTeEhRVUZITEVWQlFVVTdRVUZEVUN4clFrRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzFkQlEySXNUVUZCVFR0QlFVTk1MRzFDUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdWMEZEWmp0VFFVTkdMRU5CUVVNc1EwRkJRVHRQUVVOSUxFTkJRVU1zUTBGQlF6dExRVU5LTEVOQlFVTTdRVUZEUml4WFFVRlBMRmRCUVZjc1EwRkJRenRIUVVOd1FpeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPME5CUTFJc1EwRkJRenM3YTBKQlJXRXNaMEpCUVdkQ0lpd2labWxzWlNJNkluQnliMjFwYzJsbWVTNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSXVMM055WXk5cWN5OGlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpzWlhRZ2NISnZiV2x6YVdaNVRXVjBhRzlrY3lBOUlHWjFibU4wYVc5dUtHOWlhbVZqZEN3Z2JXVjBhRzlrVG1GdFpYTXBJSHRjYmlBZ2NtVjBkWEp1SUcxbGRHaHZaRTVoYldWekxuSmxaSFZqWlNnb2NISnZiV2x6YVdacFpXUXNJRzFsZEdodlpFNWhiV1VwSUQwK0lIdGNiaUFnSUNCd2NtOXRhWE5wWm1sbFpGdHRaWFJvYjJST1lXMWxYU0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUc1bGR5QlFjbTl0YVhObEtDaHlaWE52YkhabExDQnlaV3BsWTNRcElEMCtJSHRjYmlBZ0lDQWdJQ0FnYjJKcVpXTjBXMjFsZEdodlpFNWhiV1ZkS0NobGNuSXNJR1JoZEdFcElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9aWEp5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WldwbFkzUW9aWEp5S1R0Y2JpQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnY21WemIyeDJaU2hrWVhSaEtUdGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNCOUtUdGNiaUFnSUNCOU8xeHVJQ0FnSUhKbGRIVnliaUJ3Y205dGFYTnBabWxsWkR0Y2JpQWdmU3dnZTMwcE8xeHVmVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnY0hKdmJXbHphV1o1VFdWMGFHOWtjenNpWFgwPSJdfQ==
