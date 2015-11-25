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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvQWRkUmVnaW9uLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9FYzJJbnN0YW5jZXMuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1BhZ2VDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9SZWdpb25MaXN0LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9TaWRlYmFyLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZS5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZUhlYWRlci5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdy5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXIuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9tYWluLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7RUFDM0MsS0FBSyxFQUFFLElBQUk7QUFDYixDQUFDLENBQUMsQ0FBQzs7QUFFSCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsdUVBQXVFLENBQUMsQ0FBQzs7QUFFbkcsSUFBSSxZQUFZLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXZELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDOztBQUVsRixJQUFJLElBQUksR0FBRyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDREQUE0RCxDQUFDLENBQUM7O0FBRXhGLElBQUksWUFBWSxHQUFHLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV2RCxTQUFTLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdB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SSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRTtjQUNyQyxPQUFPO2dCQUNMLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDWixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7ZUFDakIsQ0FBQzthQUNILENBQUM7WUFDRixlQUFlLEVBQUUsUUFBUSxDQUFDLGVBQWU7WUFDekMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxVQUFVO1dBQ3hCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDcEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0FBQ1AsR0FBRzs7RUFFRCxZQUFZLEVBQUUsU0FBUyxZQUFZLEdBQUc7SUFDcEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtNQUNwQyxJQUFJLEdBQUcsR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUN6QixNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsVUFBVSxHQUFHLEVBQUUsSUFBSSxFQUFFOztRQUV2QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLE1BQU0sRUFBRTtVQUMvQyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1VBQ25DLE9BQU87WUFDTCxHQUFHLEVBQUUsVUFBVTtZQUNmLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVTtXQUM1QyxDQUFDO0FBQ1osU0FBUyxDQUFDLENBQUM7O1FBRUgsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2xCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKO0FBQ0gsQ0FBQyxDQUFDOztBQUVGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBQy9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTUgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfUmVnaW9uTGlzdCA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvUmVnaW9uTGlzdCcpO1xuXG52YXIgX1JlZ2lvbkxpc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUmVnaW9uTGlzdCk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgQWRkUmVnaW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0FkZFJlZ2lvbicsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpc3RWaXNpYmxlOiBmYWxzZSxcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgbG9hZGluZzogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uQWRkZWQnLCAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsaXN0VmlzaWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGFkZFJlZ2lvbjogZnVuY3Rpb24gYWRkUmVnaW9uKGUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuZGF0YS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBsaXN0VmlzaWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBfdGhpcztcbiAgICAgICAgX3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgbGlzdFZpc2libGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIF9lYzIuZGVmYXVsdC5mZXRjaFJlZ2lvbnMoKS50aGVuKGZ1bmN0aW9uIChyZWdpb25zKSB7XG4gICAgICAgICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgICAgICAgIGxpc3RWaXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogcmVnaW9ucyxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkoKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc3BhbicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3NwYW4nLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2FkZC1idXR0b24nLCBvbkNsaWNrOiB0aGlzLmFkZFJlZ2lvbiB9LFxuICAgICAgICAnKydcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9SZWdpb25MaXN0Mi5kZWZhdWx0LCB7IHZpc2libGU6IHRoaXMuc3RhdGUubGlzdFZpc2libGUsIHJlZ2lvbnM6IHRoaXMuc3RhdGUuZGF0YSwgbG9hZGluZzogdGhpcy5zdGF0ZS5sb2FkaW5nIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEFkZFJlZ2lvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa0ZrWkZKbFoybHZiaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPenM3T3p0QlFVbEJMRWxCUVVrc1UwRkJVeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOb1F5eHBRa0ZCWlN4RlFVRkZMREpDUVVGWE8wRkJRekZDTEZkQlFVODdRVUZEVEN4cFFrRkJWeXhGUVVGRkxFdEJRVXM3UVVGRGJFSXNWVUZCU1N4RlFVRkZMRVZCUVVVN1FVRkRVaXhoUVVGUExFVkJRVVVzUzBGQlN6dExRVU5tTEVOQlFVTTdSMEZEU0RzN1FVRkZSQ3h0UWtGQmFVSXNSVUZCUlN3MlFrRkJWenRCUVVNMVFpeDVRa0ZCVnl4UlFVRlJMRU5CUVVNc1lVRkJZU3hGUVVGRkxFTkJRVUVzVlVGQlV5eE5RVUZOTEVWQlFVVTdRVUZEYkVRc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdWQlFVOHNSVUZCUlN4TFFVRkxPMEZCUTJRc2JVSkJRVmNzUlVGQlJTeExRVUZMTzA5QlEyNUNMRU5CUVVNc1EwRkJRenRMUVVOS0xFTkJRVUVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVObU96dEJRVVZFTEZkQlFWTXNSVUZCUlN4dFFrRkJVeXhEUVVGRExFVkJRVVU3T3p0QlFVTnlRaXhSUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVNeFFpeFZRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTFvc2JVSkJRVmNzUlVGQlJTeEpRVUZKTzA5QlEyeENMRU5CUVVNc1EwRkJRenRMUVVOS0xFMUJRVTA3TzBGQlEwd3NXVUZCU1N4VFFVRlRMRkZCUVU4c1EwRkJRenRCUVVOeVFpeGpRVUZMTEZGQlFWRXNRMEZCUXp0QlFVTmFMR2xDUVVGUExFVkJRVVVzU1VGQlNUdEJRVU5pTEhGQ1FVRlhMRVZCUVVVc1NVRkJTVHRUUVVOc1FpeERRVUZETEVOQlFVTTdRVUZEU0N4eFFrRkJTU3haUVVGWkxFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVXl4UFFVRlBMRVZCUVVVN1FVRkRlRU1zYlVKQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRha0lzZFVKQlFWY3NSVUZCUlN4SlFVRkpPMEZCUTJwQ0xHZENRVUZKTEVWQlFVVXNUMEZCVHp0QlFVTmlMRzFDUVVGUExFVkJRVVVzUzBGQlN6dFhRVU5tTEVOQlFVTXNRMEZCUXp0VFFVTktMRU5CUVVNc1EwRkJRenM3UzBGRFNqdEhRVU5HT3p0QlFVVkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenM3VFVGRFJUczdWVUZCVFN4VFFVRlRMRVZCUVVNc1dVRkJXU3hGUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVXl4QlFVRkRPenRQUVVGVE8wMUJRemxFTERSRFFVRlpMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZkQlFWY3NRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4SFFVRkhPMHRCUTJwSExFTkJRMUE3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN2EwSkJSVmtzVTBGQlV5SXNJbVpwYkdVaU9pSkJaR1JTWldkcGIyNHVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRkpsWjJsdmJreHBjM1FnWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlTWldkcGIyNU1hWE4wSnp0Y2JtbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dVhHNXNaWFFnUVdSa1VtVm5hVzl1SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQnNhWE4wVm1semFXSnNaVG9nWm1Gc2MyVXNYRzRnSUNBZ0lDQmtZWFJoT2lCYlhTeGNiaUFnSUNBZ0lHeHZZV1JwYm1jNklHWmhiSE5sWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNibHh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ1pHbHpjR0YwWTJobGNpNXlaV2RwYzNSbGNpZ25jbVZuYVc5dVFXUmtaV1FuTENCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdJQ0JzYjJGa2FXNW5PaUJtWVd4elpTeGNiaUFnSUNBZ0lDQWdiR2x6ZEZacGMybGliR1U2SUdaaGJITmxYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlMRnh1WEc0Z0lHRmtaRkpsWjJsdmJqb2dablZ1WTNScGIyNG9aU2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbk4wWVhSbExtUmhkR0V1YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lDQWdiR2x6ZEZacGMybGliR1U2SUhSeWRXVmNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCc1pYUWdZMjl0Y0c5dVpXNTBJRDBnZEdocGN6dGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNCc2IyRmthVzVuT2lCMGNuVmxMRnh1SUNBZ0lDQWdJQ0JzYVhOMFZtbHphV0pzWlRvZ2RISjFaVnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0JsWXpJdVptVjBZMmhTWldkcGIyNXpLQ2t1ZEdobGJpaG1kVzVqZEdsdmJpaHlaV2RwYjI1ektTQjdYRzRnSUNBZ0lDQWdJR052YlhCdmJtVnVkQzV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0FnSUNBZ2JHbHpkRlpwYzJsaWJHVTZJSFJ5ZFdVc1hHNGdJQ0FnSUNBZ0lDQWdaR0YwWVRvZ2NtVm5hVzl1Y3l4Y2JpQWdJQ0FnSUNBZ0lDQnNiMkZrYVc1bk9pQm1ZV3h6WlZ4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMWNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThjM0JoYmo1Y2JpQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVlXUmtMV0oxZEhSdmJsd2lJRzl1UTJ4cFkyczllM1JvYVhNdVlXUmtVbVZuYVc5dWZUNHJQQzl6Y0dGdVBseHVJQ0FnSUNBZ0lDQThVbVZuYVc5dVRHbHpkQ0IyYVhOcFlteGxQWHQwYUdsekxuTjBZWFJsTG14cGMzUldhWE5wWW14bGZTQnlaV2RwYjI1elBYdDBhR2x6TG5OMFlYUmxMbVJoZEdGOUlHeHZZV1JwYm1jOWUzUm9hWE11YzNSaGRHVXViRzloWkdsdVozMGdMejVjYmlBZ0lDQWdJRHd2YzNCaGJqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdRV1JrVW1WbmFXOXVPeUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9UYWJsZSA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGUnKTtcblxudmFyIF9UYWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZSk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgdGFnID0gZnVuY3Rpb24gdGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50YWdzLmZpbHRlcihmdW5jdGlvbiAodGFnKSB7XG4gICAgICByZXR1cm4gdGFnLmtleSA9PT0gdGFnTmFtZTtcbiAgICB9KVswXS52YWx1ZTtcbiAgfTtcbn07XG5cbnZhciBFYzJJbnN0YW5jZXMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRWMySW5zdGFuY2VzJyxcblxuICBjb2x1bW5zOiBbeyBuYW1lOiBcIklkXCIsIGtleTogJ2lkJyB9LCB7IG5hbWU6IFwiTmFtZVwiLCBrZXk6IHRhZyhcIk5hbWVcIikgfSwgeyBuYW1lOiBcIktleSBuYW1lXCIsIGtleTogJ2tleU5hbWUnIH0sIHsgbmFtZTogXCJJbnN0YW5jZSB0eXBlXCIsIGtleTogJ2luc3RhbmNlVHlwZScgfSwgeyBuYW1lOiBcIlN0YXR1c1wiLCBrZXk6ICdzdGF0dXMnIH1dLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICByZWdpb246ICdldS13ZXN0LTEnXG4gICAgfTtcbiAgfSxcblxuICBmZXRjaEluc3RhbmNlczogZnVuY3Rpb24gZmV0Y2hJbnN0YW5jZXMocmVnaW9uKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcztcbiAgICBfZWMyLmRlZmF1bHQuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKS50aGVuKGZ1bmN0aW9uIChpbnN0YW5jZXMpIHtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIGRhdGE6IGluc3RhbmNlcyxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmZldGNoSW5zdGFuY2VzKHRoaXMuc3RhdGUucmVnaW9uKTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uJywgKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHRoaXMuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKTtcbiAgICB9KS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBjaGFuZ2VSZWdpb246IGZ1bmN0aW9uIGNoYW5nZVJlZ2lvbihlKSB7XG4gICAgdmFyIHJlZ2lvbiA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVnaW9uOiByZWdpb24sXG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSk7XG4gICAgdGhpcy5mZXRjaEluc3RhbmNlcyhyZWdpb24pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfVGFibGUyLmRlZmF1bHQsIHsgY29sdW1uczogdGhpcy5jb2x1bW5zLCBkYXRhOiB0aGlzLnN0YXRlLmRhdGEsIGxvYWRpbmc6IHRoaXMuc3RhdGUubG9hZGluZyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBFYzJJbnN0YW5jZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtWak1rbHVjM1JoYm1ObGN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN096czdPenRCUVVsQkxFbEJRVWtzUjBGQlJ5eEhRVUZITEZOQlFVNHNSMEZCUnl4RFFVRlpMRTlCUVU4c1JVRkJSVHRCUVVNeFFpeFRRVUZQTEZWQlFWTXNVVUZCVVN4RlFVRkZPMEZCUTNoQ0xGZEJRVThzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJReXhIUVVGSExFVkJRVXM3UVVGRGJrTXNZVUZCVHl4SFFVRkhMRU5CUVVNc1IwRkJSeXhMUVVGTExFOUJRVThzUTBGQlF6dExRVU0xUWl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETzBkQlEySXNRMEZCUXp0RFFVTklMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlEyNURMRk5CUVU4c1JVRkJSU3hEUVVOUUxFVkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlN4SFFVRkhMRVZCUVVVc1NVRkJTU3hGUVVGRExFVkJRM1pDTEVWQlFVTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1JVRkJSU3hIUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkRMRVZCUTJoRExFVkJRVU1zU1VGQlNTeEZRVUZGTEZWQlFWVXNSVUZCUlN4SFFVRkhMRVZCUVVVc1UwRkJVeXhGUVVGRExFVkJRMnhETEVWQlFVTXNTVUZCU1N4RlFVRkZMR1ZCUVdVc1JVRkJSU3hIUVVGSExFVkJRVVVzWTBGQll5eEZRVUZETEVWQlF6VkRMRVZCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeEhRVUZITEVWQlFVVXNVVUZCVVN4RlFVRkRMRU5CUTJoRE96dEJRVVZFTEdsQ1FVRmxMRVZCUVVVc01rSkJRVmM3UVVGRE1VSXNWMEZCVHp0QlFVTk1MRlZCUVVrc1JVRkJSU3hGUVVGRk8wRkJRMUlzWVVGQlR5eEZRVUZGTEVsQlFVazdRVUZEWWl4WlFVRk5MRVZCUVVVc1YwRkJWenRMUVVOd1FpeERRVUZETzBkQlEwZzdPMEZCUlVRc1owSkJRV01zUlVGQlJTeDNRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkRMMElzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR0ZCUVU4c1JVRkJSU3hKUVVGSk8wdEJRMlFzUTBGQlF5eERRVUZET3p0QlFVVklMRkZCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU55UWl4cFFrRkJTU3hqUVVGakxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVVNc1UwRkJVeXhGUVVGTE8wRkJRemRETEdWQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRha0lzV1VGQlNTeEZRVUZGTEZOQlFWTTdRVUZEWml4bFFVRlBMRVZCUVVVc1MwRkJTenRQUVVObUxFTkJRVU1zUTBGQlF6dExRVU5LTEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjJReXg1UWtGQlZ5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVFc1ZVRkJVeXhOUVVGTkxFVkJRVVU3UVVGRE4wTXNWVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dExRVU0zUWl4RFFVRkJMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEWmpzN1FVRkZSQ3hqUVVGWkxFVkJRVVVzYzBKQlFWTXNRMEZCUXl4RlFVRkZPMEZCUTNoQ0xGRkJRVWtzVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGQk8wRkJRek5DTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRXaXhaUVVGTkxFVkJRVVVzVFVGQlRUdEJRVU5rTEdGQlFVOHNSVUZCUlN4SlFVRkpPMHRCUTJRc1EwRkJReXhEUVVGRE8wRkJRMGdzVVVGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRIUVVNM1FqczdRVUZGUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN08wMUJRMFVzZFVOQlFVOHNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFRkJRVU1zUlVGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFRkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFRkJRVU1zUjBGQlJ6dExRVU5vUml4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmxCUVZraUxDSm1hV3hsSWpvaVJXTXlTVzV6ZEdGdVkyVnpMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWVdKc1pTQm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsSnp0Y2JtbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dVhHNXNaWFFnZEdGbklEMGdablZ1WTNScGIyNG9kR0ZuVG1GdFpTa2dlMXh1SUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRvYVc1emRHRnVZMlVwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdhVzV6ZEdGdVkyVXVkR0ZuY3k1bWFXeDBaWElvS0hSaFp5a2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJoWnk1clpYa2dQVDA5SUhSaFowNWhiV1U3WEc0Z0lDQWdmU2xiTUYwdWRtRnNkV1U3WEc0Z0lIMDdYRzU5TzF4dVhHNXNaWFFnUldNeVNXNXpkR0Z1WTJWeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCamIyeDFiVzV6T2lCYlhHNGdJQ0FnZTI1aGJXVTZJRndpU1dSY0lpd2dhMlY1T2lBbmFXUW5mU3hjYmlBZ0lDQjdibUZ0WlRvZ1hDSk9ZVzFsWENJc0lHdGxlVG9nZEdGbktGd2lUbUZ0WlZ3aUtYMHNYRzRnSUNBZ2UyNWhiV1U2SUZ3aVMyVjVJRzVoYldWY0lpd2dhMlY1T2lBbmEyVjVUbUZ0WlNkOUxGeHVJQ0FnSUh0dVlXMWxPaUJjSWtsdWMzUmhibU5sSUhSNWNHVmNJaXdnYTJWNU9pQW5hVzV6ZEdGdVkyVlVlWEJsSjMwc1hHNGdJQ0FnZTI1aGJXVTZJRndpVTNSaGRIVnpYQ0lzSUd0bGVUb2dKM04wWVhSMWN5ZDlMRnh1SUNCZExGeHVYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR1JoZEdFNklGdGRMRnh1SUNBZ0lDQWdiRzloWkdsdVp6b2dkSEoxWlN4Y2JpQWdJQ0FnSUhKbFoybHZiam9nSjJWMUxYZGxjM1F0TVNkY2JpQWdJQ0I5TzF4dUlDQjlMRnh1WEc0Z0lHWmxkR05vU1c1emRHRnVZMlZ6T2lCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lHeHZZV1JwYm1jNklIUnlkV1ZjYmlBZ0lDQjlLVHRjYmlBZ0lDQmNiaUFnSUNCc1pYUWdZMjl0Y0c5dVpXNTBJRDBnZEdocGN6dGNiaUFnSUNCbFl6SXVabVYwWTJoSmJuTjBZVzVqWlhNb2NtVm5hVzl1S1M1MGFHVnVLQ2hwYm5OMFlXNWpaWE1wSUQwK0lIdGNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQWdJR1JoZEdFNklHbHVjM1JoYm1ObGN5eGNiaUFnSUNBZ0lDQWdiRzloWkdsdVp6b2dabUZzYzJWY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJR052YlhCdmJtVnVkRVJwWkUxdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0IwYUdsekxtWmxkR05vU1c1emRHRnVZMlZ6S0hSb2FYTXVjM1JoZEdVdWNtVm5hVzl1S1R0Y2JpQWdJQ0JrYVhOd1lYUmphR1Z5TG5KbFoybHpkR1Z5S0NkeVpXZHBiMjRuTENCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVabVYwWTJoSmJuTjBZVzVqWlhNb2NtVm5hVzl1S1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dVhHNGdJR05vWVc1blpWSmxaMmx2YmpvZ1puVnVZM1JwYjI0b1pTa2dlMXh1SUNBZ0lHeGxkQ0J5WldkcGIyNGdQU0JsTG5SaGNtZGxkQzUyWVd4MVpWeHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdjbVZuYVc5dU9pQnlaV2RwYjI0c1hHNGdJQ0FnSUNCc2IyRmthVzVuT2lCMGNuVmxYRzRnSUNBZ2ZTazdYRzRnSUNBZ2RHaHBjeTVtWlhSamFFbHVjM1JoYm1ObGN5aHlaV2RwYjI0cE8xeHVJQ0I5TEZ4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFkrWEc0Z0lDQWdJQ0FnSUR4VVlXSnNaU0JqYjJ4MWJXNXpQWHQwYUdsekxtTnZiSFZ0Ym5OOUlHUmhkR0U5ZTNSb2FYTXVjM1JoZEdVdVpHRjBZWDBnYkc5aFpHbHVaejE3ZEdocGN5NXpkR0YwWlM1c2IyRmthVzVuZlNBdlBseHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVWak1rbHVjM1JoYm1ObGN6c2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX0VjMkluc3RhbmNlcyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvRWMySW5zdGFuY2VzJyk7XG5cbnZhciBfRWMySW5zdGFuY2VzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0VjMkluc3RhbmNlcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBQYWdlQ29udGVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdQYWdlQ29udGVudCcsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9FYzJJbnN0YW5jZXMyLmRlZmF1bHQsIG51bGwpXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFBhZ2VDb250ZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsQmhaMlZEYjI1MFpXNTBMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenM3T3p0QlFVVkJMRWxCUVVrc1YwRkJWeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOc1F5eFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdPMDFCUTBVc2FVUkJRV2RDTzB0QlExb3NRMEZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4WFFVRlhJaXdpWm1sc1pTSTZJbEJoWjJWRGIyNTBaVzUwTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCRll6Skpibk4wWVc1alpYTWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OUZZekpKYm5OMFlXNWpaWE1uTzF4dVhHNXNaWFFnVUdGblpVTnZiblJsYm5RZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZK1hHNGdJQ0FnSUNBZ0lEeEZZekpKYm5OMFlXNWpaWE1nTHo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JRWVdkbFEyOXVkR1Z1ZERzaVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFJlZ2lvbkxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnUmVnaW9uTGlzdCcsXG5cbiAgcmVnaW9uQ2hvc2VuOiBmdW5jdGlvbiByZWdpb25DaG9zZW4ocmVnaW9uKSB7XG4gICAgX2Rpc3BhdGNoZXIyLmRlZmF1bHQubm90aWZ5QWxsKCdyZWdpb25BZGRlZCcsIHJlZ2lvbik7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgbG9hZGluZyA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnbGknLFxuICAgICAgbnVsbCxcbiAgICAgICdMb2FkaW5nJ1xuICAgICk7XG4gICAgdmFyIHJlZ2lvbnMgPSB0aGlzLnByb3BzLnJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnbGknLFxuICAgICAgICB7IGtleTogcmVnaW9uLmtleSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdhJyxcbiAgICAgICAgICB7IG9uQ2xpY2s6IF90aGlzLnJlZ2lvbkNob3Nlbi5iaW5kKF90aGlzLCByZWdpb24pIH0sXG4gICAgICAgICAgcmVnaW9uLm5hbWVcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZhciBib2R5ID0gdGhpcy5wcm9wcy5sb2FkaW5nID8gbG9hZGluZyA6IHJlZ2lvbnM7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndWwnLFxuICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJyZWdpb25zLWxpc3RcIiwgdGhpcy5wcm9wcy52aXNpYmxlID8gJ3Zpc2libGUnIDogJycpIH0sXG4gICAgICBib2R5XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFJlZ2lvbkxpc3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxKbFoybHZia3hwYzNRdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPMEZCUTBFc1NVRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWMlF5eEpRVUZKTEZWQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZEYWtNc1kwRkJXU3hGUVVGRkxITkNRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTTNRaXg1UWtGQlZ5eFRRVUZUTEVOQlFVTXNZVUZCWVN4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wZEJRemRETzBGQlEwUXNVVUZCVFN4RlFVRkZMR3RDUVVGWE96czdRVUZEYWtJc1VVRkJTU3hQUVVGUExFZEJRMVE3T3pzN1MwRkJaMElzUVVGRGFrSXNRMEZCUXp0QlFVTkdMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExFMUJRVTBzUlVGQlN6dEJRVU12UXl4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4QlFVRkRPMUZCUTJ4Q096dFpRVUZITEU5QlFVOHNSVUZCUlN4TlFVRkxMRmxCUVZrc1EwRkJReXhKUVVGSkxGRkJRVThzVFVGQlRTeERRVUZETEVGQlFVTTdWVUZCUlN4TlFVRk5MRU5CUVVNc1NVRkJTVHRUUVVGTE8wOUJRMmhGTEVOQlEwdzdTMEZEU0N4RFFVRkRMRU5CUVVNN08wRkJSVWdzVVVGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXp0QlFVTnNSQ3hYUVVORk96dFJRVUZKTEZOQlFWTXNSVUZCUlN4VlFVRlZMRU5CUVVNc1kwRkJZeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4SFFVRkRMRk5CUVZNc1IwRkJReXhGUVVGRkxFTkJRVU1zUVVGQlF6dE5RVU40UlN4SlFVRkpPMHRCUTBZc1EwRkRURHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0clFrRkZXU3hWUVVGVklpd2labWxzWlNJNklsSmxaMmx2Ymt4cGMzUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJR1JwYzNCaGRHTm9aWElnWm5KdmJTQW5aR2x6Y0dGMFkyaGxjaWM3WEc1c1pYUWdZMnhoYzNOT1lXMWxjeUE5SUhKbGNYVnBjbVVvSjJOc1lYTnpibUZ0WlhNbktUdGNibHh1YkdWMElGSmxaMmx2Ymt4cGMzUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxaMmx2YmtOb2IzTmxiam9nWm5WdVkzUnBiMjRvY21WbmFXOXVLU0I3WEc0Z0lDQWdaR2x6Y0dGMFkyaGxjaTV1YjNScFpubEJiR3dvSjNKbFoybHZia0ZrWkdWa0p5d2djbVZuYVc5dUtUdGNiaUFnZlN4Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYkc5aFpHbHVaeUE5SUNBb1hHNGdJQ0FnSUNBOGJHaytURzloWkdsdVp6d3ZiR2srWEc0Z0lDQWdLVHRjYmlBZ0lDQnNaWFFnY21WbmFXOXVjeUE5SUhSb2FYTXVjSEp2Y0hNdWNtVm5hVzl1Y3k1dFlYQW9LSEpsWjJsdmJpa2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEd4cElHdGxlVDE3Y21WbmFXOXVMbXRsZVgwK1hHNGdJQ0FnSUNBZ0lDQWdQR0VnYjI1RGJHbGphejE3ZEdocGN5NXlaV2RwYjI1RGFHOXpaVzR1WW1sdVpDaDBhR2x6TENCeVpXZHBiMjRwZlQ1N2NtVm5hVzl1TG01aGJXVjlQQzloUGx4dUlDQWdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDQWdLVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJR3hsZENCaWIyUjVJRDBnZEdocGN5NXdjbTl3Y3k1c2IyRmthVzVuSUQ4Z2JHOWhaR2x1WnlBNklISmxaMmx2Ym5NN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOWUyTnNZWE56VG1GdFpYTW9YQ0p5WldkcGIyNXpMV3hwYzNSY0lpd2dkR2hwY3k1d2NtOXdjeTUyYVhOcFlteGxQeWQyYVhOcFlteGxKem9uSnlsOVBseHVJQ0FnSUNBZ0lDQjdZbTlrZVgxY2JpQWdJQ0FnSUR3dmRXdytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRkpsWjJsdmJreHBjM1E3SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kaXNwYXRjaGVyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvZGlzcGF0Y2hlcicpO1xuXG52YXIgX2Rpc3BhdGNoZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlzcGF0Y2hlcik7XG5cbnZhciBfQWRkUmVnaW9uID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9BZGRSZWdpb24nKTtcblxudmFyIF9BZGRSZWdpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQWRkUmVnaW9uKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciByZW1vdGUgPSBlbGVjdHJvblJlcXVpcmUoJ3JlbW90ZScpO1xudmFyIE1lbnUgPSByZW1vdGUuTWVudTtcbnZhciBNZW51SXRlbSA9IHJlbW90ZS5NZW51SXRlbTtcblxudmFyIFNpZGViYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2lkZWJhcicsXG5cbiAgY29udGV4dE1lbnU6IG51bGwsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZ2lvbjogJ2V1LXdlc3QtMScsXG4gICAgICByZWdpb25zOiBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVnaW9ucycpIHx8IFwiW11cIilcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uQWRkZWQnLCAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgdGhpcy5zdGF0ZS5yZWdpb25zLnB1c2gocmVnaW9uKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWdpb25zOiB0aGlzLnN0YXRlLnJlZ2lvbnNcbiAgICAgIH0pO1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWdpb25zJywgSlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5yZWdpb25zKSk7XG4gICAgfSkuYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgcmVnaW9uU2VsZWN0ZWQ6IGZ1bmN0aW9uIHJlZ2lvblNlbGVjdGVkKHJlZ2lvbikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVnaW9uOiByZWdpb25cbiAgICB9KTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5ub3RpZnlBbGwoJ3JlZ2lvbicsIHJlZ2lvbik7XG4gIH0sXG5cbiAgcmVtb3ZlUmVnaW9uOiBmdW5jdGlvbiByZW1vdmVSZWdpb24ocmVnaW9uKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5zdGF0ZS5yZWdpb25zLmluZGV4T2YocmVnaW9uKTtcbiAgICB0aGlzLnN0YXRlLnJlZ2lvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlZ2lvbnM6IHRoaXMuc3RhdGUucmVnaW9uc1xuICAgIH0pO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVnaW9ucycsIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucmVnaW9ucykpO1xuICB9LFxuXG4gIGlzQWN0aXZlOiBmdW5jdGlvbiBpc0FjdGl2ZShyZWdpb24pIHtcbiAgICBpZiAocmVnaW9uID09PSB0aGlzLnN0YXRlLnJlZ2lvbikge1xuICAgICAgcmV0dXJuIFwiYWN0aXZlXCI7XG4gICAgfTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcblxuICBvbkNvbnRleHRNZW51OiBmdW5jdGlvbiBvbkNvbnRleHRNZW51KHJlZ2lvbikge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzO1xuICAgIHZhciBtZW51ID0gbmV3IE1lbnUoKTtcbiAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oeyBsYWJlbDogJ1JlbW92ZScsIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgY29tcG9uZW50LnJlbW92ZVJlZ2lvbihyZWdpb24pO1xuICAgICAgfSB9KSk7XG4gICAgbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHJlZ2lvbnMgPSB0aGlzLnN0YXRlLnJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnbGknLFxuICAgICAgICB7IGtleTogcmVnaW9uLmtleSxcbiAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJsaXN0LWdyb3VwLWl0ZW1cIiwgXCJyZWdpb25cIiwgX3RoaXMuaXNBY3RpdmUocmVnaW9uLmtleSkpLFxuICAgICAgICAgIG9uQ29udGV4dE1lbnU6IF90aGlzLm9uQ29udGV4dE1lbnUuYmluZChfdGhpcywgcmVnaW9uKSxcbiAgICAgICAgICBvbkNsaWNrOiBfdGhpcy5yZWdpb25TZWxlY3RlZC5iaW5kKF90aGlzLCByZWdpb24ua2V5KSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbWcnLCB7IGNsYXNzTmFtZTogJ2ltZy1jaXJjbGUgbWVkaWEtb2JqZWN0IHB1bGwtbGVmdCcsIHNyYzogJ2h0dHA6Ly9tZWRpYS5hbWF6b253ZWJzZXJ2aWNlcy5jb20vYXdzX3NpbmdsZWJveF8wMS5wbmcnLCB3aWR0aDogJzMyJywgaGVpZ2h0OiAnMzInIH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbWVkaWEtYm9keScgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgcmVnaW9uLm5hbWVcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAncCcsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJzAgcnVubmluZydcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndWwnLFxuICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWdyb3VwJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2xpJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdsaXN0LWdyb3VwLWhlYWRlcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaDQnLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgJ1JlZ2lvbnMnXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX0FkZFJlZ2lvbjIuZGVmYXVsdCwgbnVsbClcbiAgICAgICksXG4gICAgICByZWdpb25zXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFNpZGViYXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxOcFpHVmlZWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3pzN096czdPenRCUVVWQkxFbEJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenM3UVVGRmRrTXNTVUZCVFN4TlFVRk5MRWRCUVVjc1pVRkJaU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzcERMRWxCUVUwc1NVRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZEZWtJc1NVRkJUU3hSUVVGUkxFZEJRVWNzVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXpzN1FVRkZha01zU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6bENMR0ZCUVZjc1JVRkJSU3hKUVVGSk96dEJRVVZxUWl4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4N1FVRkRUQ3haUVVGTkxFVkJRVVVzVjBGQlZ6dEJRVU51UWl4aFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTTdTMEZEY0VVc1EwRkJRenRIUVVOSU96dEJRVVZFTEcxQ1FVRnBRaXhGUVVGRkxEWkNRVUZYTzBGQlF6VkNMSGxDUVVGWExGRkJRVkVzUTBGQlF5eGhRVUZoTEVWQlFVVXNRMEZCUVN4VlFVRlRMRTFCUVUwc1JVRkJSVHRCUVVOc1JDeFZRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEYUVNc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdWQlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTg3VDBGRE5VSXNRMEZCUXl4RFFVRkRPMEZCUTBnc1dVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRelZGTEVOQlFVRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU5tT3p0QlFVVkVMR2RDUVVGakxFVkJRVVVzZDBKQlFWTXNUVUZCVFN4RlFVRkZPMEZCUXk5Q0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4WlFVRk5MRVZCUVVVc1RVRkJUVHRMUVVObUxFTkJRVU1zUTBGQlF6dEJRVU5JTEhsQ1FVRlhMRk5CUVZNc1EwRkJReXhSUVVGUkxFVkJRVVVzVFVGQlRTeERRVUZETEVOQlFVTTdSMEZEZUVNN08wRkJSVVFzWTBGQldTeEZRVUZGTEhOQ1FVRlRMRTFCUVUwc1JVRkJSVHRCUVVNM1FpeFJRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRMME1zVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTndReXhSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NZVUZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR6dExRVU0xUWl4RFFVRkRMRU5CUVVNN1FVRkRTQ3hWUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU03UjBGRE5VVTdPMEZCUlVRc1ZVRkJVU3hGUVVGRkxHdENRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTjZRaXhSUVVGSkxFMUJRVTBzUzBGQlN5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSVHRCUVVOb1F5eGhRVUZQTEZGQlFWRXNRMEZCUVR0TFFVTm9RaXhEUVVGRE8wRkJRMFlzVjBGQlR5eEZRVUZGTEVOQlFVTTdSMEZEV0RzN1FVRkZSQ3hsUVVGaExFVkJRVVVzZFVKQlFWTXNUVUZCVFN4RlFVRkZPMEZCUXpsQ0xGRkJRVWtzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnlRaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVsQlFVa3NSVUZCUlN4RFFVRkRPMEZCUTNSQ0xGRkJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4UlFVRlJMRU5CUVVNc1JVRkJSU3hMUVVGTExFVkJRVVVzVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUlN4cFFrRkJWenRCUVVNMVJDeHBRa0ZCVXl4RFFVRkRMRmxCUVZrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dFBRVU5vUXl4RlFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMHdzVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1owSkJRV2RDTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTNaRE96dEJRVVZFTEZGQlFVMHNSVUZCUlN4clFrRkJWenM3TzBGQlEycENMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExFMUJRVTBzUlVGQlN6dEJRVU12UXl4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4QlFVRkRPMEZCUTJoQ0xHMUNRVUZUTEVWQlFVVXNWVUZCVlN4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEZGQlFWRXNSVUZCUlN4TlFVRkxMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRVUZCUXp0QlFVTTVSU3gxUWtGQllTeEZRVUZGTEUxQlFVc3NZVUZCWVN4RFFVRkRMRWxCUVVrc1VVRkJUeXhOUVVGTkxFTkJRVU1zUVVGQlF6dEJRVU55UkN4cFFrRkJUeXhGUVVGRkxFMUJRVXNzWTBGQll5eERRVUZETEVsQlFVa3NVVUZCVHl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFRkJRVU03VVVGRGRFUXNOa0pCUVVzc1UwRkJVeXhGUVVGRExHMURRVUZ0UXl4RlFVRkRMRWRCUVVjc1JVRkJReXg1UkVGQmVVUXNSVUZCUXl4TFFVRkxMRVZCUVVNc1NVRkJTU3hGUVVGRExFMUJRVTBzUlVGQlF5eEpRVUZKTEVkQlFVYzdVVUZETVVrN08xbEJRVXNzVTBGQlV5eEZRVUZETEZsQlFWazdWVUZEZWtJN096dFpRVUZUTEUxQlFVMHNRMEZCUXl4SlFVRkpPMWRCUVZVN1ZVRkRPVUk3T3pzN1YwRkJaMEk3VTBGRFdqdFBRVU5JTEVOQlEwdzdTMEZEU0N4RFFVRkRMRU5CUVVNN1FVRkRTQ3hYUVVORk96dFJRVUZKTEZOQlFWTXNSVUZCUXl4WlFVRlpPMDFCUTNoQ096dFZRVUZKTEZOQlFWTXNSVUZCUXl4dFFrRkJiVUk3VVVGREwwSTdPenM3VTBGQlowSTdVVUZEYUVJc09FTkJRV0U3VDBGRFZqdE5RVU5LTEU5QlFVODdTMEZEVEN4RFFVTk1PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRTlCUVU4aUxDSm1hV3hsSWpvaVUybGtaV0poY2k1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdUwzTnlZeTlxY3k4aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1pHbHpjR0YwWTJobGNpQm1jbTl0SUNka2FYTndZWFJqYUdWeUp6dGNibWx0Y0c5eWRDQkJaR1JTWldkcGIyNGdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OUJaR1JTWldkcGIyNG5PMXh1YkdWMElHTnNZWE56VG1GdFpYTWdQU0J5WlhGMWFYSmxLQ2RqYkdGemMyNWhiV1Z6SnlrN1hHNWNibU52Ym5OMElISmxiVzkwWlNBOUlHVnNaV04wY205dVVtVnhkV2x5WlNnbmNtVnRiM1JsSnlrN1hHNWpiMjV6ZENCTlpXNTFJRDBnY21WdGIzUmxMazFsYm5VN1hHNWpiMjV6ZENCTlpXNTFTWFJsYlNBOUlISmxiVzkwWlM1TlpXNTFTWFJsYlR0Y2JseHViR1YwSUZOcFpHVmlZWElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJR052Ym5SbGVIUk5aVzUxT2lCdWRXeHNMRnh1WEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUhKbFoybHZiam9nSjJWMUxYZGxjM1F0TVNjc1hHNGdJQ0FnSUNCeVpXZHBiMjV6T2lCS1UwOU9MbkJoY25ObEtIZHBibVJ2ZHk1c2IyTmhiRk4wYjNKaFoyVXVaMlYwU1hSbGJTZ25jbVZuYVc5dWN5Y3BJSHg4SUZ3aVcxMWNJaWxjYmlBZ0lDQjlPMXh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEVScFpFMXZkVzUwT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCa2FYTndZWFJqYUdWeUxuSmxaMmx6ZEdWeUtDZHlaV2RwYjI1QlpHUmxaQ2NzSUdaMWJtTjBhVzl1S0hKbFoybHZiaWtnZTF4dUlDQWdJQ0FnZEdocGN5NXpkR0YwWlM1eVpXZHBiMjV6TG5CMWMyZ29jbVZuYVc5dUtUdGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNCeVpXZHBiMjV6T2lCMGFHbHpMbk4wWVhSbExuSmxaMmx2Ym5OY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ2QybHVaRzkzTG14dlkyRnNVM1J2Y21GblpTNXpaWFJKZEdWdEtDZHlaV2RwYjI1ekp5d2dTbE5QVGk1emRISnBibWRwWm5rb2RHaHBjeTV6ZEdGMFpTNXlaV2RwYjI1ektTazdYRzRnSUNBZ2ZTNWlhVzVrS0hSb2FYTXBLVHRjYmlBZ2ZTeGNibHh1SUNCeVpXZHBiMjVUWld4bFkzUmxaRG9nWm5WdVkzUnBiMjRvY21WbmFXOXVLU0I3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCeVpXZHBiMjQ2SUhKbFoybHZibHh1SUNBZ0lIMHBPMXh1SUNBZ0lHUnBjM0JoZEdOb1pYSXVibTkwYVdaNVFXeHNLQ2R5WldkcGIyNG5MQ0J5WldkcGIyNHBPMXh1SUNCOUxGeHVYRzRnSUhKbGJXOTJaVkpsWjJsdmJqb2dablZ1WTNScGIyNG9jbVZuYVc5dUtTQjdYRzRnSUNBZ2JHVjBJR2x1WkdWNElEMGdkR2hwY3k1emRHRjBaUzV5WldkcGIyNXpMbWx1WkdWNFQyWW9jbVZuYVc5dUtUdGNiaUFnSUNCMGFHbHpMbk4wWVhSbExuSmxaMmx2Ym5NdWMzQnNhV05sS0dsdVpHVjRMQ0F4S1R0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lISmxaMmx2Ym5NNklIUm9hWE11YzNSaGRHVXVjbVZuYVc5dWMxeHVJQ0FnSUgwcE8xeHVJQ0FnSUhkcGJtUnZkeTVzYjJOaGJGTjBiM0poWjJVdWMyVjBTWFJsYlNnbmNtVm5hVzl1Y3ljc0lFcFRUMDR1YzNSeWFXNW5hV1o1S0hSb2FYTXVjM1JoZEdVdWNtVm5hVzl1Y3lrcE8xeHVJQ0I5TEZ4dVhHNGdJR2x6UVdOMGFYWmxPaUJtZFc1amRHbHZiaWh5WldkcGIyNHBJSHRjYmlBZ0lDQnBaaUFvY21WbmFXOXVJRDA5UFNCMGFHbHpMbk4wWVhSbExuSmxaMmx2YmlrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUZ3aVlXTjBhWFpsWENKY2JpQWdJQ0I5TzF4dUlDQWdJSEpsZEhWeWJpQmNJbHdpTzF4dUlDQjlMRnh1WEc0Z0lHOXVRMjl1ZEdWNGRFMWxiblU2SUdaMWJtTjBhVzl1S0hKbFoybHZiaWtnZTF4dUlDQWdJR3hsZENCamIyMXdiMjVsYm5RZ1BTQjBhR2x6TzF4dUlDQWdJSFpoY2lCdFpXNTFJRDBnYm1WM0lFMWxiblVvS1R0Y2JpQWdJQ0J0Wlc1MUxtRndjR1Z1WkNodVpYY2dUV1Z1ZFVsMFpXMG9leUJzWVdKbGJEb2dKMUpsYlc5MlpTY3NJR05zYVdOck9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJR052YlhCdmJtVnVkQzV5WlcxdmRtVlNaV2RwYjI0b2NtVm5hVzl1S1R0Y2JpQWdJQ0I5ZlNrcE8xeHVJQ0FnSUcxbGJuVXVjRzl3ZFhBb2NtVnRiM1JsTG1kbGRFTjFjbkpsYm5SWGFXNWtiM2NvS1NrN1hHNGdJSDBzWEc1Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnY21WbmFXOXVjeUE5SUhSb2FYTXVjM1JoZEdVdWNtVm5hVzl1Y3k1dFlYQW9LSEpsWjJsdmJpa2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEd4cElHdGxlVDE3Y21WbmFXOXVMbXRsZVgxY2JpQWdJQ0FnSUNBZ0lDQWdJR05zWVhOelRtRnRaVDE3WTJ4aGMzTk9ZVzFsY3loY0lteHBjM1F0WjNKdmRYQXRhWFJsYlZ3aUxDQmNJbkpsWjJsdmJsd2lMQ0IwYUdsekxtbHpRV04wYVhabEtISmxaMmx2Ymk1clpYa3BLWDBnWEc0Z0lDQWdJQ0FnSUNBZ0lDQnZia052Ym5SbGVIUk5aVzUxUFh0MGFHbHpMbTl1UTI5dWRHVjRkRTFsYm5VdVltbHVaQ2gwYUdsekxDQnlaV2RwYjI0cGZWeHVJQ0FnSUNBZ0lDQWdJQ0FnYjI1RGJHbGphejE3ZEdocGN5NXlaV2RwYjI1VFpXeGxZM1JsWkM1aWFXNWtLSFJvYVhNc0lISmxaMmx2Ymk1clpYa3BmVDVjYmlBZ0lDQWdJQ0FnSUNBOGFXMW5JR05zWVhOelRtRnRaVDFjSW1sdFp5MWphWEpqYkdVZ2JXVmthV0V0YjJKcVpXTjBJSEIxYkd3dGJHVm1kRndpSUhOeVl6MWNJbWgwZEhBNkx5OXRaV1JwWVM1aGJXRjZiMjUzWldKelpYSjJhV05sY3k1amIyMHZZWGR6WDNOcGJtZHNaV0p2ZUY4d01TNXdibWRjSWlCM2FXUjBhRDFjSWpNeVhDSWdhR1ZwWjJoMFBWd2lNekpjSWlBdlBseHVJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2liV1ZrYVdFdFltOWtlVndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQSE4wY205dVp6NTdjbVZuYVc5dUxtNWhiV1Y5UEM5emRISnZibWMrWEc0Z0lDQWdJQ0FnSUNBZ0lDQThjRDR3SUhKMWJtNXBibWM4TDNBK1hHNGdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnSUNBZ0lEd3ZiR2srWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBwTzF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThkV3dnWTJ4aGMzTk9ZVzFsUFZ3aWJHbHpkQzFuY205MWNGd2lQbHh1SUNBZ0lDQWdJQ0E4YkdrZ1kyeGhjM05PWVcxbFBWd2liR2x6ZEMxbmNtOTFjQzFvWldGa1pYSmNJajVjYmlBZ0lDQWdJQ0FnSUNBOGFEUStVbVZuYVc5dWN6d3ZhRFErWEc0Z0lDQWdJQ0FnSUNBZ1BFRmtaRkpsWjJsdmJpQXZQbHh1SUNBZ0lDQWdJQ0E4TDJ4cFBseHVJQ0FnSUNBZ0lDQjdjbVZuYVc5dWMzMWNiaUFnSUNBZ0lEd3ZkV3crWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZOcFpHVmlZWEk3SWwxOSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9UYWJsZUhlYWRlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVIZWFkZXInKTtcblxudmFyIF9UYWJsZUhlYWRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZUhlYWRlcik7XG5cbnZhciBfVGFibGVDb250ZW50ID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZUNvbnRlbnQnKTtcblxudmFyIF9UYWJsZUNvbnRlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGVDb250ZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFRhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RhYmxlJyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICd0YWJsZScsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfVGFibGVIZWFkZXIyLmRlZmF1bHQsIHsgY29sdW1uczogdGhpcy5wcm9wcy5jb2x1bW5zIH0pLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfVGFibGVDb250ZW50Mi5kZWZhdWx0LCB7IGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgICAgY29sdW1uczogdGhpcy5wcm9wcy5jb2x1bW5zLFxuICAgICAgICBsb2FkaW5nOiB0aGlzLnByb3BzLmxvYWRpbmcgfSlcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxSaFlteGxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenM3T3pzN096czdRVUZIUVN4SlFVRkpMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkROVUlzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3T3p0TlFVTkZMRFpEUVVGaExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1FVRkJReXhIUVVGSE8wMUJRelZETERoRFFVRmpMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRVUZCUXp0QlFVTjBRaXhsUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRUZCUVVNN1FVRkROVUlzWlVGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhCUVVGRExFZEJRVVU3UzBGRGRFTXNRMEZEVWp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4TFFVRkxJaXdpWm1sc1pTSTZJbFJoWW14bExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVZV0pzWlVobFlXUmxjaUJtY205dElDZGpiMjF3YjI1bGJuUnpMMVJoWW14bFNHVmhaR1Z5Snp0Y2JtbHRjRzl5ZENCVVlXSnNaVU52Ym5SbGJuUWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OVVZV0pzWlVOdmJuUmxiblFuTzF4dVhHNXNaWFFnVkdGaWJHVWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MFlXSnNaVDVjYmlBZ0lDQWdJQ0FnUEZSaFlteGxTR1ZoWkdWeUlHTnZiSFZ0Ym5NOWUzUm9hWE11Y0hKdmNITXVZMjlzZFcxdWMzMGdMejVjYmlBZ0lDQWdJQ0FnUEZSaFlteGxRMjl1ZEdWdWRDQmtZWFJoUFh0MGFHbHpMbkJ5YjNCekxtUmhkR0Y5SUZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR052YkhWdGJuTTllM1JvYVhNdWNISnZjSE11WTI5c2RXMXVjMzFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNiMkZrYVc1blBYdDBhR2x6TG5CeWIzQnpMbXh2WVdScGJtZDlMejVjYmlBZ0lDQWdJRHd2ZEdGaWJHVStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRlJoWW14bE95SmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2VjID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyJyk7XG5cbnZhciBfZWMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZWMpO1xuXG52YXIgX1RhYmxlUm93ID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZVJvdycpO1xuXG52YXIgX1RhYmxlUm93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RhYmxlUm93KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFRhYmxlQ29udGVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUYWJsZUNvbnRlbnQnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgaW5zdGFuY2VzUm93cyA9IHRoaXMucHJvcHMuZGF0YS5tYXAoZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChfVGFibGVSb3cyLmRlZmF1bHQsIHsga2V5OiBpbnN0YW5jZS5pZCwgaW5zdGFuY2U6IGluc3RhbmNlLCBjb2x1bW5zOiBfdGhpcy5wcm9wcy5jb2x1bW5zIH0pO1xuICAgIH0pO1xuICAgIHZhciBlbXB0eVJvdyA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndHInLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICd0ZCcsXG4gICAgICAgIHsgY29sU3BhbjogJzQnIH0sXG4gICAgICAgICdObyByZXN1bHRzIHlldC4nXG4gICAgICApXG4gICAgKTtcbiAgICB2YXIgbG9hZGluZyA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndHInLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICd0ZCcsXG4gICAgICAgIHsgY29sU3BhbjogJzQnIH0sXG4gICAgICAgICdMb2FkaW5nLi4uJ1xuICAgICAgKVxuICAgICk7XG4gICAgdmFyIGJvZHkgPSB0aGlzLnByb3BzLmxvYWRpbmcgPyBsb2FkaW5nIDogaW5zdGFuY2VzUm93cy5sZW5ndGggPyBpbnN0YW5jZXNSb3dzIDogZW1wdHlSb3c7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndGJvZHknLFxuICAgICAgbnVsbCxcbiAgICAgIGJvZHlcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVDb250ZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsUTI5dWRHVnVkQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3T3pzN096czdPMEZCUjBFc1NVRkJTU3haUVVGWkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRMjVETEZGQlFVMHNSVUZCUlN4clFrRkJWenM3TzBGQlEycENMRkZCUVVrc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExGRkJRVkVzUlVGQlN6dEJRVU53UkN4aFFVTkZMREJEUVVGVkxFZEJRVWNzUlVGQlJTeFJRVUZSTEVOQlFVTXNSVUZCUlN4QlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRkxGRkJRVkVzUVVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUlN4TlFVRkxMRXRCUVVzc1EwRkJReXhQUVVGUExFRkJRVU1zUjBGQlJ5eERRVU12UlR0TFFVTklMRU5CUVVNc1EwRkJRenRCUVVOSUxGRkJRVWtzVVVGQlVTeEhRVU5XT3pzN1RVRkRSVHM3VlVGQlNTeFBRVUZQTEVWQlFVTXNSMEZCUnpzN1QwRkJjVUk3UzBGRGFrTXNRVUZEVGl4RFFVRkRPMEZCUTBZc1VVRkJTU3hQUVVGUExFZEJRMVE3T3p0TlFVTkZPenRWUVVGSkxFOUJRVThzUlVGQlF5eEhRVUZIT3p0UFFVRm5RanRMUVVNMVFpeEJRVU5PTEVOQlFVTTdRVUZEUml4UlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNSMEZCUnl4UFFVRlBMRWRCUVVjc1lVRkJZU3hEUVVGRExFMUJRVTBzUjBGQlJ5eGhRVUZoTEVkQlFVY3NVVUZCVVN4RFFVRkRPMEZCUXpGR0xGZEJRMFU3T3p0TlFVTkhMRWxCUVVrN1MwRkRReXhEUVVOU08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMnRDUVVWWkxGbEJRVmtpTENKbWFXeGxJam9pVkdGaWJHVkRiMjUwWlc1MExtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQmxZeklnWm5KdmJTQW5jMlZ5ZG1salpYTXZaV015Snp0Y2JtbHRjRzl5ZENCVVlXSnNaVkp2ZHlCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFSaFlteGxVbTkzSnp0Y2JseHViR1YwSUZSaFlteGxRMjl1ZEdWdWRDQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdhVzV6ZEdGdVkyVnpVbTkzY3lBOUlIUm9hWE11Y0hKdmNITXVaR0YwWVM1dFlYQW9LR2x1YzNSaGJtTmxLU0E5UGlCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnSUNBOFZHRmliR1ZTYjNjZ2EyVjVQWHRwYm5OMFlXNWpaUzVwWkgwZ2FXNXpkR0Z1WTJVOWUybHVjM1JoYm1ObGZTQmpiMngxYlc1elBYdDBhR2x6TG5CeWIzQnpMbU52YkhWdGJuTjlJQzgrWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBwTzF4dUlDQWdJR3hsZENCbGJYQjBlVkp2ZHlBOUlDaGNiaUFnSUNBZ0lEeDBjajVjYmlBZ0lDQWdJQ0FnUEhSa0lHTnZiRk53WVc0OVhDSTBYQ0krVG04Z2NtVnpkV3gwY3lCNVpYUXVQQzkwWkQ1Y2JpQWdJQ0FnSUR3dmRISStYRzRnSUNBZ0tUdGNiaUFnSUNCc1pYUWdiRzloWkdsdVp5QTlJQ2hjYmlBZ0lDQWdJRHgwY2o1Y2JpQWdJQ0FnSUNBZ1BIUmtJR052YkZOd1lXNDlYQ0kwWENJK1RHOWhaR2x1Wnk0dUxqd3ZkR1ErWEc0Z0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNrN1hHNGdJQ0FnYkdWMElHSnZaSGtnUFNCMGFHbHpMbkJ5YjNCekxteHZZV1JwYm1jZ1B5QnNiMkZrYVc1bklEb2dhVzV6ZEdGdVkyVnpVbTkzY3k1c1pXNW5kR2dnUHlCcGJuTjBZVzVqWlhOU2IzZHpJRG9nWlcxd2RIbFNiM2M3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBZbTlrZVQ1Y2JpQWdJQ0FnSUNBZ2UySnZaSGw5WEc0Z0lDQWdJQ0E4TDNSaWIyUjVQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JVWVdKc1pVTnZiblJsYm5RN1hHNGlYWDA9IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgVGFibGVIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiBcIlRhYmxlSGVhZGVyXCIsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB0aGlzLnByb3BzLmNvbHVtbnMubWFwKGZ1bmN0aW9uIChjb2x1bW4sIGluZGV4KSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgXCJ0aFwiLFxuICAgICAgICB7IGtleTogaW5kZXggfSxcbiAgICAgICAgY29sdW1uLm5hbWVcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBcInRoZWFkXCIsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgXCJ0clwiLFxuICAgICAgICBudWxsLFxuICAgICAgICBoZWFkZXJzXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlSGVhZGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsU0dWaFpHVnlMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJRVUVzU1VGQlNTeFhRVUZYTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlEyeERMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJReXhOUVVGTkxFVkJRVVVzUzBGQlN5eEZRVUZMTzBGQlEzUkVMR0ZCUTBVN08xVkJRVWtzUjBGQlJ5eEZRVUZGTEV0QlFVc3NRVUZCUXp0UlFVRkZMRTFCUVUwc1EwRkJReXhKUVVGSk8wOUJRVTBzUTBGRGJFTTdTMEZEU0N4RFFVRkRMRU5CUVVNN1FVRkRTQ3hYUVVORk96czdUVUZEUlRzN08xRkJRMGNzVDBGQlR6dFBRVU5NTzB0QlEwTXNRMEZEVWp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4WFFVRlhJaXdpWm1sc1pTSTZJbFJoWW14bFNHVmhaR1Z5TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklteGxkQ0JVWVdKc1pVaGxZV1JsY2lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JzWlhRZ2FHVmhaR1Z5Y3lBOUlIUm9hWE11Y0hKdmNITXVZMjlzZFcxdWN5NXRZWEFvS0dOdmJIVnRiaXdnYVc1a1pYZ3BJRDArSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4MGFDQnJaWGs5ZTJsdVpHVjRmVDU3WTI5c2RXMXVMbTVoYldWOVBDOTBhRDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU2s3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBhR1ZoWkQ1Y2JpQWdJQ0FnSUNBZ1BIUnlQbHh1SUNBZ0lDQWdJQ0FnSUh0b1pXRmtaWEp6ZlZ4dUlDQWdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDQWdQQzkwYUdWaFpENWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdWR0ZpYkdWSVpXRmtaWEk3SWwxOSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIFRhYmxlUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogXCJUYWJsZVJvd1wiLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBpbnN0YW5jZSA9IHRoaXMucHJvcHMuaW5zdGFuY2U7XG4gICAgdmFyIGNvbHVtbnMgPSB0aGlzLnByb3BzLmNvbHVtbnMubWFwKGZ1bmN0aW9uIChjb2x1bW4pIHtcbiAgICAgIHZhciBrZXkgPSBjb2x1bW4ua2V5O1xuICAgICAgdmFyIHZhbHVlID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5KGluc3RhbmNlKSA6IGluc3RhbmNlW2tleV07XG5cbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBcInRkXCIsXG4gICAgICAgIHsga2V5OiB2YWx1ZSB9LFxuICAgICAgICB2YWx1ZVxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFwidHJcIixcbiAgICAgIG51bGwsXG4gICAgICBjb2x1bW5zXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlUm93O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsVW05M0xtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzBGQlFVRXNTVUZCU1N4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUXk5Q0xGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhSUVVGSkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOdVF5eFJRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUXl4TlFVRk5MRVZCUVVzN1FVRkRMME1zVlVGQlNTeEhRVUZITEVkQlFVY3NUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJRenRCUVVOeVFpeFZRVUZKTEV0QlFVc3NSMEZCUnl4QlFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExGVkJRVlVzUjBGQlNTeEhRVUZITEVOQlFVTXNVVUZCVVN4RFFVRkRMRWRCUVVjc1VVRkJVU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVjRSU3hoUVVORk96dFZRVUZKTEVkQlFVY3NSVUZCUlN4TFFVRkxMRUZCUVVNN1VVRkJSU3hMUVVGTE8wOUJRVTBzUTBGRE5VSTdTMEZEU0N4RFFVRkRMRU5CUVVNN1FVRkRTQ3hYUVVORk96czdUVUZEUnl4UFFVRlBPMHRCUTB3c1EwRkRURHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0clFrRkZXU3hSUVVGUklpd2labWxzWlNJNklsUmhZbXhsVW05M0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbXhsZENCVVlXSnNaVkp2ZHlBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JzWlhRZ2FXNXpkR0Z1WTJVZ1BTQjBhR2x6TG5CeWIzQnpMbWx1YzNSaGJtTmxPMXh1SUNBZ0lHeGxkQ0JqYjJ4MWJXNXpJRDBnZEdocGN5NXdjbTl3Y3k1amIyeDFiVzV6TG0xaGNDZ29ZMjlzZFcxdUtTQTlQaUI3WEc0Z0lDQWdJQ0JzWlhRZ2EyVjVJRDBnWTI5c2RXMXVMbXRsZVR0Y2JpQWdJQ0FnSUd4bGRDQjJZV3gxWlNBOUlDaDBlWEJsYjJZZ2EyVjVJRDA5UFNCY0ltWjFibU4wYVc5dVhDSXBJRDhnYTJWNUtHbHVjM1JoYm1ObEtTQTZJR2x1YzNSaGJtTmxXMnRsZVYwN1hHNWNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeDBaQ0JyWlhrOWUzWmhiSFZsZlQ1N2RtRnNkV1Y5UEM5MFpENWNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZTazdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MGNqNWNiaUFnSUNBZ0lDQWdlMk52YkhWdGJuTjlYRzRnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCVVlXSnNaVkp2ZHpzaVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfU2lkZWJhciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvU2lkZWJhcicpO1xuXG52YXIgX1NpZGViYXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU2lkZWJhcik7XG5cbnZhciBfUGFnZUNvbnRlbnQgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1BhZ2VDb250ZW50Jyk7XG5cbnZhciBfUGFnZUNvbnRlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUGFnZUNvbnRlbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgV2luZG93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1dpbmRvdycsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAncGFuZS1ncm91cCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ3BhbmUtc20gc2lkZWJhcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfU2lkZWJhcjIuZGVmYXVsdCwgbnVsbClcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdwYW5lJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9QYWdlQ29udGVudDIuZGVmYXVsdCwgbnVsbClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gV2luZG93O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsZHBibVJ2ZHk1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3TzBGQlIwRXNTVUZCU1N4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUlRkQ0xGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhYUVVORk96dFJRVUZMTEZOQlFWTXNSVUZCUXl4WlFVRlpPMDFCUTNwQ096dFZRVUZMTEZOQlFWTXNSVUZCUXl4cFFrRkJhVUk3VVVGRE9VSXNORU5CUVZjN1QwRkRVRHROUVVOT096dFZRVUZMTEZOQlFWTXNSVUZCUXl4TlFVRk5PMUZCUTI1Q0xHZEVRVUZsTzA5QlExZzdTMEZEUml4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRTFCUVUwaUxDSm1hV3hsSWpvaVYybHVaRzkzTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCVGFXUmxZbUZ5SUdaeWIyMGdKMk52YlhCdmJtVnVkSE12VTJsa1pXSmhjaWM3WEc1cGJYQnZjblFnVUdGblpVTnZiblJsYm5RZ1puSnZiU0FuWTI5dGNHOXVaVzUwY3k5UVlXZGxRMjl1ZEdWdWRDYzdJRnh1WEc1c1pYUWdWMmx1Wkc5M0lEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY0dGdVpTMW5jbTkxY0Z3aVBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luQmhibVV0YzIwZ2MybGtaV0poY2x3aVBseHVJQ0FnSUNBZ0lDQWdJRHhUYVdSbFltRnlJQzgrWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJoYm1WY0lqNWNiaUFnSUNBZ0lDQWdJQ0E4VUdGblpVTnZiblJsYm5RZ0x6NWNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVjJsdVpHOTNPeUpkZlE9PSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIF9saXN0ZW5lcnMgPSB7fTtcblxudmFyIERpc3BhdGNoZXIgPSBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge307XG5EaXNwYXRjaGVyLnByb3RvdHlwZSA9IHtcblxuICByZWdpc3RlcjogZnVuY3Rpb24gcmVnaXN0ZXIoYWN0aW9uTmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIV9saXN0ZW5lcnNbYWN0aW9uTmFtZV0pIHtcbiAgICAgIF9saXN0ZW5lcnNbYWN0aW9uTmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICBfbGlzdGVuZXJzW2FjdGlvbk5hbWVdLnB1c2goY2FsbGJhY2spO1xuICB9LFxuXG4gIG5vdGlmeUFsbDogZnVuY3Rpb24gbm90aWZ5QWxsKGFjdGlvbk5hbWUpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBjYWxsYmFja3MgPSBfbGlzdGVuZXJzW2FjdGlvbk5hbWVdIHx8IFtdO1xuICAgIGNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2suY2FsbC5hcHBseShjYWxsYmFjaywgW2NhbGxiYWNrXS5jb25jYXQoYXJncykpO1xuICAgIH0pO1xuICB9XG59O1xuXG52YXIgYXBwRGlzcGFjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gYXBwRGlzcGFjaGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltUnBjM0JoZEdOb1pYSXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN1FVRkJRU3hKUVVGSkxGVkJRVlVzUjBGQlJ5eEZRVUZGTEVOQlFVTTdPMEZCUlhCQ0xFbEJRVWtzVlVGQlZTeEhRVUZITEZOQlFXSXNWVUZCVlN4SFFVRmpMRVZCUVVVc1EwRkJRenRCUVVNdlFpeFZRVUZWTEVOQlFVTXNVMEZCVXl4SFFVRkhPenRCUVVWeVFpeFZRVUZSTEVWQlFVVXNhMEpCUVZNc1ZVRkJWU3hGUVVGRkxGRkJRVkVzUlVGQlJUdEJRVU4yUXl4UlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eEZRVUZGTzBGQlF6TkNMR2RDUVVGVkxFTkJRVU1zVlVGQlZTeERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRPMHRCUXpkQ096dEJRVVZFTEdOQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdSMEZEZGtNN08wRkJSVVFzVjBGQlV5eEZRVUZGTEcxQ1FVRlRMRlZCUVZVc1JVRkJWenR6UTBGQlRpeEpRVUZKTzBGQlFVb3NWVUZCU1RzN08wRkJRM0pETEZGQlFVa3NVMEZCVXl4SFFVRkhMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZETjBNc1lVRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZETEZGQlFWRXNSVUZCU3p0QlFVTTVRaXhqUVVGUkxFTkJRVU1zU1VGQlNTeE5RVUZCTEVOQlFXSXNVVUZCVVN4SFFVRk5MRkZCUVZFc1UwRkJTeXhKUVVGSkxFVkJRVU1zUTBGQlF6dExRVU5zUXl4RFFVRkRMRU5CUVVNN1IwRkRTanREUVVOR0xFTkJRVU03TzBGQlJVWXNTVUZCU1N4WlFVRlpMRWRCUVVjc1NVRkJTU3hWUVVGVkxFVkJRVVVzUTBGQlF6czdhMEpCUlhKQ0xGbEJRVmtpTENKbWFXeGxJam9pWkdsemNHRjBZMmhsY2k1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdUwzTnlZeTlxY3k4aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnNaWFFnWDJ4cGMzUmxibVZ5Y3lBOUlIdDlPMXh1WEc1c1pYUWdSR2x6Y0dGMFkyaGxjaUE5SUdaMWJtTjBhVzl1S0NrZ2UzMDdYRzVFYVhOd1lYUmphR1Z5TG5CeWIzUnZkSGx3WlNBOUlIdGNiaUFnWEc0Z0lISmxaMmx6ZEdWeU9pQm1kVzVqZEdsdmJpaGhZM1JwYjI1T1lXMWxMQ0JqWVd4c1ltRmpheWtnZTF4dUlDQWdJR2xtSUNnaFgyeHBjM1JsYm1WeWMxdGhZM1JwYjI1T1lXMWxYU2tnZTF4dUlDQWdJQ0FnWDJ4cGMzUmxibVZ5YzF0aFkzUnBiMjVPWVcxbFhTQTlJRnRkTzF4dUlDQWdJSDFjYmx4dUlDQWdJRjlzYVhOMFpXNWxjbk5iWVdOMGFXOXVUbUZ0WlYwdWNIVnphQ2hqWVd4c1ltRmpheWs3WEc0Z0lIMHNYRzVjYmlBZ2JtOTBhV1o1UVd4c09pQm1kVzVqZEdsdmJpaGhZM1JwYjI1T1lXMWxMQ0F1TGk1aGNtZHpLU0I3WEc0Z0lDQWdiR1YwSUdOaGJHeGlZV05yY3lBOUlGOXNhWE4wWlc1bGNuTmJZV04wYVc5dVRtRnRaVjBnZkh3Z1cxMDdYRzRnSUNBZ1kyRnNiR0poWTJ0ekxtWnZja1ZoWTJnb0tHTmhiR3hpWVdOcktTQTlQaUI3WEc0Z0lDQWdJQ0JqWVd4c1ltRmpheTVqWVd4c0tHTmhiR3hpWVdOckxDQXVMaTVoY21kektUdGNiaUFnSUNCOUtUdGNiaUFnZlZ4dWZUdGNibHh1YkdWMElHRndjRVJwYzNCaFkyaGxjaUE5SUc1bGR5QkVhWE53WVhSamFHVnlLQ2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdGd2NFUnBjM0JoWTJobGNqc2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX1dpbmRvdyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvV2luZG93Jyk7XG5cbnZhciBfV2luZG93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1dpbmRvdyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KF9XaW5kb3cyLmRlZmF1bHQsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2luZG93LWNvbnRlbnQnKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW0xaGFXNHVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdRVUZGUVN4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVOaUxESkRRVUZWTEVWQlExWXNVVUZCVVN4RFFVRkRMR05CUVdNc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RFFVTXhReXhEUVVGRElpd2labWxzWlNJNkltMWhhVzR1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTGk5emNtTXZhbk12SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZkcGJtUnZkeUJtY205dElDZGpiMjF3YjI1bGJuUnpMMWRwYm1SdmR5YzdYRzVjYmxKbFlXTjBSRTlOTG5KbGJtUmxjaWhjYmlBZ1BGZHBibVJ2ZHlBdlBpeGNiaUFnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9KM2RwYm1SdmR5MWpiMjUwWlc1MEp5bGNiaWs3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgYXdzID0gZWxlY3Ryb25SZXF1aXJlKCcuL2F3cy1jb25maWcuanNvbicpO1xuXG52YXIgQVdTID0gZWxlY3Ryb25SZXF1aXJlKCdhd3Mtc2RrJyk7XG5BV1MuY29uZmlnLnVwZGF0ZShhd3MpO1xuXG52YXIgZ2V0RWMyID0gZnVuY3Rpb24gZ2V0RWMyKCkge1xuICB2YXIgcmVnaW9uID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gJ2V1LXdlc3QtMScgOiBhcmd1bWVudHNbMF07XG5cbiAgcmV0dXJuIG5ldyBBV1MuRUMyKHsgcmVnaW9uOiByZWdpb24gfSk7XG59O1xuXG52YXIgcmVnaW9uTmFtZXMgPSB7XG4gICd1cy1lYXN0LTEnOiBcIlVTIEVhc3QgKE4uIFZpcmdpbmlhKVwiLFxuICAndXMtd2VzdC0yJzogXCJVUyBXZXN0IChPcmVnb24pXCIsXG4gICd1cy13ZXN0LTEnOiBcIlVTIFdlc3QgKE4uIENhbGlmb3JuaWEpXCIsXG4gICdldS13ZXN0LTEnOiBcIkVVIChJcmVsYW5kKVwiLFxuICAnZXUtY2VudHJhbC0xJzogXCJFVSAoRnJhbmtmdXJ0KVwiLFxuICAnYXAtc291dGhlYXN0LTEnOiBcIkFzaWEgUGFjaWZpYyAoU2luZ2Fwb3JlKVwiLFxuICAnYXAtbm9ydGhlYXN0LTEnOiBcIkFzaWEgUGFjaWZpYyAoVG9reW8pXCIsXG4gICdhcC1zb3V0aGVhc3QtMic6IFwiQXNpYSBQYWNpZmljIChTeWRuZXkpXCIsXG4gICdzYS1lYXN0LTEnOiBcIlNvdXRoIEFtZXJpY2EgKFPDo28gUGF1bG8pXCJcbn07XG5cbnZhciBlYzJJbnN0YW5jZXMgPSB7XG4gIGZldGNoSW5zdGFuY2VzOiBmdW5jdGlvbiBmZXRjaEluc3RhbmNlcyhyZWdpb24pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgIHZhciBlYzIgPSBnZXRFYzIocmVnaW9uKTtcbiAgICAgIGVjMi5kZXNjcmliZUluc3RhbmNlcyhmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB2YXIgaW5zdGFuY2VzID0gZGF0YS5SZXNlcnZhdGlvbnMubWFwKGZ1bmN0aW9uIChpbnN0YW5jZU9iamVjdCkge1xuICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGluc3RhbmNlT2JqZWN0Lkluc3RhbmNlc1swXTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiBpbnN0YW5jZS5TdGF0ZS5OYW1lLFxuICAgICAgICAgICAgaW5zdGFuY2VUeXBlOiBpbnN0YW5jZS5JbnN0YW5jZVR5cGUsXG4gICAgICAgICAgICBrZXlOYW1lOiBpbnN0YW5jZS5LZXlOYW1lLFxuICAgICAgICAgICAgdGFnczogaW5zdGFuY2UuVGFncy5tYXAoZnVuY3Rpb24gKHRhZykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleTogdGFnLktleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGFnLlZhbHVlXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHB1YmxpY0lwQWRkcmVzczogaW5zdGFuY2UuUHVibGljSXBBZGRyZXNzLFxuICAgICAgICAgICAgaWQ6IGluc3RhbmNlLkluc3RhbmNlSWRcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzb2x2ZShpbnN0YW5jZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgZmV0Y2hSZWdpb25zOiBmdW5jdGlvbiBmZXRjaFJlZ2lvbnMoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICB2YXIgZWMyID0gZ2V0RWMyKCk7XG4gICAgICBlYzIuZGVzY3JpYmVSZWdpb25zKGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcblxuICAgICAgICB2YXIgcmVnaW9ucyA9IGRhdGEuUmVnaW9ucy5tYXAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgICAgIHZhciByZWdpb25OYW1lID0gcmVnaW9uLlJlZ2lvbk5hbWU7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogcmVnaW9uTmFtZSxcbiAgICAgICAgICAgIG5hbWU6IHJlZ2lvbk5hbWVzW3JlZ2lvbk5hbWVdIHx8IHJlZ2lvbk5hbWVcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlKHJlZ2lvbnMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGVjMkluc3RhbmNlcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVZqTWk1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenRCUVVGQkxFbEJRVWtzUjBGQlJ5eEhRVUZITEdWQlFXVXNRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eERRVUZET3p0QlFVVXZReXhKUVVGSkxFZEJRVWNzUjBGQlJ5eGxRVUZsTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRja01zUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03TzBGQlJYWkNMRWxCUVVrc1RVRkJUU3hIUVVGSExGTkJRVlFzVFVGQlRTeEhRVUZuUXp0TlFVRndRaXhOUVVGTkxIbEVRVUZETEZkQlFWYzdPMEZCUTNSRExGTkJRVThzU1VGQlNTeEhRVUZITEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFMUJRVTBzUlVGQlF5eERRVUZETEVOQlFVTTdRMEZEZEVNc1EwRkJRVHM3UVVGRlJDeEpRVUZKTEZkQlFWY3NSMEZCUnp0QlFVTm9RaXhoUVVGWExFVkJRVVVzZFVKQlFYVkNPMEZCUTNCRExHRkJRVmNzUlVGQlJTeHJRa0ZCYTBJN1FVRkRMMElzWVVGQlZ5eEZRVUZGTEhsQ1FVRjVRanRCUVVOMFF5eGhRVUZYTEVWQlFVVXNZMEZCWXp0QlFVTXpRaXhuUWtGQll5eEZRVUZGTEdkQ1FVRm5RanRCUVVOb1F5eHJRa0ZCWjBJc1JVRkJSU3d3UWtGQk1FSTdRVUZETlVNc2EwSkJRV2RDTEVWQlFVVXNjMEpCUVhOQ08wRkJRM2hETEd0Q1FVRm5RaXhGUVVGRkxIVkNRVUYxUWp0QlFVTjZReXhoUVVGWExFVkJRVVVzTWtKQlFUSkNPME5CUTNwRExFTkJRVU03TzBGQlJVWXNTVUZCU1N4WlFVRlpMRWRCUVVjN1FVRkRha0lzWjBKQlFXTXNSVUZCUlN4M1FrRkJVeXhOUVVGTkxFVkJRVVU3UVVGREwwSXNWMEZCVHl4SlFVRkpMRTlCUVU4c1EwRkJReXhWUVVGVExFOUJRVThzUlVGQlJUdEJRVU51UXl4VlFVRkpMRWRCUVVjc1IwRkJSeXhOUVVGTkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEZWtJc1UwRkJSeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRlZCUVZNc1IwRkJSeXhGUVVGRkxFbEJRVWtzUlVGQlJUdEJRVU40UXl4bFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEyeENMRmxCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVNc1kwRkJZeXhGUVVGTE8wRkJRM2hFTEdOQlFVa3NVVUZCVVN4SFFVRkhMR05CUVdNc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZETTBNc2FVSkJRVTg3UVVGRFRDeHJRa0ZCVFN4RlFVRkZMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNUdEJRVU16UWl4M1FrRkJXU3hGUVVGRkxGRkJRVkVzUTBGQlF5eFpRVUZaTzBGQlEyNURMRzFDUVVGUExFVkJRVVVzVVVGQlVTeERRVUZETEU5QlFVODdRVUZEZWtJc1owSkJRVWtzUlVGQlJTeFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExFZEJRVWNzUlVGQlN6dEJRVU12UWl4eFFrRkJUenRCUVVOTUxHMUNRVUZITEVWQlFVVXNSMEZCUnl4RFFVRkRMRWRCUVVjN1FVRkRXaXh4UWtGQlN5eEZRVUZGTEVkQlFVY3NRMEZCUXl4TFFVRkxPMlZCUTJwQ0xFTkJRVU03WVVGRFNDeERRVUZETzBGQlEwWXNNa0pCUVdVc1JVRkJSU3hSUVVGUkxFTkJRVU1zWlVGQlpUdEJRVU42UXl4alFVRkZMRVZCUVVVc1VVRkJVU3hEUVVGRExGVkJRVlU3VjBGRGVFSXNRMEZCUVR0VFFVTkdMRU5CUVVNc1EwRkJRenRCUVVOSUxHVkJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0UFFVTndRaXhEUVVGRExFTkJRVU03UzBGRFNpeERRVUZETEVOQlFVTTdSMEZEU2pzN1FVRkZSQ3hqUVVGWkxFVkJRVVVzZDBKQlFWYzdRVUZEZGtJc1YwRkJUeXhKUVVGSkxFOUJRVThzUTBGQlF5eFZRVUZUTEU5QlFVOHNSVUZCUlR0QlFVTnVReXhWUVVGSkxFZEJRVWNzUjBGQlJ5eE5RVUZOTEVWQlFVVXNRMEZCUXp0QlFVTnVRaXhUUVVGSExFTkJRVU1zWlVGQlpTeERRVUZETEZWQlFWTXNSMEZCUnl4RlFVRkZMRWxCUVVrc1JVRkJSVHM3UVVGRmRFTXNXVUZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVXl4TlFVRk5MRVZCUVVVN1FVRkRPVU1zWTBGQlNTeFZRVUZWTEVkQlFVY3NUVUZCVFN4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVOdVF5eHBRa0ZCVHp0QlFVTk1MR1ZCUVVjc1JVRkJSU3hWUVVGVk8wRkJRMllzWjBKQlFVa3NSVUZCUlN4WFFVRlhMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzVlVGQlZUdFhRVU0xUXl4RFFVRkRPMU5CUTBnc1EwRkJReXhEUVVGRE96dEJRVVZJTEdWQlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRQUVVOc1FpeERRVUZETEVOQlFVTTdTMEZEU2l4RFFVRkRMRU5CUVVNN1IwRkRTanREUVVOR0xFTkJRVU03TzJ0Q1FVVmhMRmxCUVZraUxDSm1hV3hsSWpvaVpXTXlMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW14bGRDQmhkM01nUFNCbGJHVmpkSEp2YmxKbGNYVnBjbVVvSnk0dllYZHpMV052Ym1acFp5NXFjMjl1SnlrN1hHNWNibXhsZENCQlYxTWdQU0JsYkdWamRISnZibEpsY1hWcGNtVW9KMkYzY3kxelpHc25LVHNnWEc1QlYxTXVZMjl1Wm1sbkxuVndaR0YwWlNoaGQzTXBPMXh1WEc1c1pYUWdaMlYwUldNeUlEMGdablZ1WTNScGIyNG9jbVZuYVc5dVBTZGxkUzEzWlhOMExURW5LU0I3WEc0Z0lISmxkSFZ5YmlCdVpYY2dRVmRUTGtWRE1paDdjbVZuYVc5dU9pQnlaV2RwYjI1OUtUdGNibjFjYmx4dWJHVjBJSEpsWjJsdmJrNWhiV1Z6SUQwZ2UxeHVJQ0FuZFhNdFpXRnpkQzB4SnpvZ1hDSlZVeUJGWVhOMElDaE9MaUJXYVhKbmFXNXBZU2xjSWl4Y2JpQWdKM1Z6TFhkbGMzUXRNaWM2SUZ3aVZWTWdWMlZ6ZENBb1QzSmxaMjl1S1Z3aUxGeHVJQ0FuZFhNdGQyVnpkQzB4SnpvZ1hDSlZVeUJYWlhOMElDaE9MaUJEWVd4cFptOXlibWxoS1Z3aUxGeHVJQ0FuWlhVdGQyVnpkQzB4SnpvZ1hDSkZWU0FvU1hKbGJHRnVaQ2xjSWl4Y2JpQWdKMlYxTFdObGJuUnlZV3d0TVNjNklGd2lSVlVnS0VaeVlXNXJablZ5ZENsY0lpeGNiaUFnSjJGd0xYTnZkWFJvWldGemRDMHhKem9nWENKQmMybGhJRkJoWTJsbWFXTWdLRk5wYm1kaGNHOXlaU2xjSWl4Y2JpQWdKMkZ3TFc1dmNuUm9aV0Z6ZEMweEp6b2dYQ0pCYzJsaElGQmhZMmxtYVdNZ0tGUnZhM2x2S1Z3aUxGeHVJQ0FuWVhBdGMyOTFkR2hsWVhOMExUSW5PaUJjSWtGemFXRWdVR0ZqYVdacFl5QW9VM2xrYm1WNUtWd2lMRnh1SUNBbmMyRXRaV0Z6ZEMweEp6b2dYQ0pUYjNWMGFDQkJiV1Z5YVdOaElDaFR3Nk52SUZCaGRXeHZLVndpWEc1OU8xeHVYRzVzWlhRZ1pXTXlTVzV6ZEdGdVkyVnpJRDBnZTF4dUlDQm1aWFJqYUVsdWMzUmhibU5sY3pvZ1puVnVZM1JwYjI0b2NtVm5hVzl1S1NCN1hHNGdJQ0FnY21WMGRYSnVJRzVsZHlCUWNtOXRhWE5sS0daMWJtTjBhVzl1S0hKbGMyOXNkbVVwSUh0Y2JpQWdJQ0FnSUd4bGRDQmxZeklnUFNCblpYUkZZeklvY21WbmFXOXVLVHRjYmlBZ0lDQWdJR1ZqTWk1a1pYTmpjbWxpWlVsdWMzUmhibU5sY3lobWRXNWpkR2x2YmlobGNuSXNJR1JoZEdFcElIdGNiaUFnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvWkdGMFlTazdYRzRnSUNBZ0lDQWdJR3hsZENCcGJuTjBZVzVqWlhNZ1BTQmtZWFJoTGxKbGMyVnlkbUYwYVc5dWN5NXRZWEFvS0dsdWMzUmhibU5sVDJKcVpXTjBLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdiR1YwSUdsdWMzUmhibU5sSUQwZ2FXNXpkR0Z1WTJWUFltcGxZM1F1U1c1emRHRnVZMlZ6V3pCZE8xeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCemRHRjBkWE02SUdsdWMzUmhibU5sTGxOMFlYUmxMazVoYldVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwYm5OMFlXNWpaVlI1Y0dVNklHbHVjM1JoYm1ObExrbHVjM1JoYm1ObFZIbHdaU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lHdGxlVTVoYldVNklHbHVjM1JoYm1ObExrdGxlVTVoYldVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwWVdkek9pQnBibk4wWVc1alpTNVVZV2R6TG0xaGNDZ29kR0ZuS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2EyVjVPaUIwWVdjdVMyVjVMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbE9pQjBZV2N1Vm1Gc2RXVmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2ZUdGNiaUFnSUNBZ0lDQWdJQ0FnSUgwcExGeHVJQ0FnSUNBZ0lDQWdJQ0FnY0hWaWJHbGpTWEJCWkdSeVpYTnpPaUJwYm5OMFlXNWpaUzVRZFdKc2FXTkpjRUZrWkhKbGMzTXNYRzRnSUNBZ0lDQWdJQ0FnSUNCcFpEb2dhVzV6ZEdGdVkyVXVTVzV6ZEdGdVkyVkpaRnh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJSEpsYzI5c2RtVW9hVzV6ZEdGdVkyVnpLVHRjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDBwTzF4dUlDQjlMRnh1WEc0Z0lHWmxkR05vVW1WbmFXOXVjem9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJRzVsZHlCUWNtOXRhWE5sS0daMWJtTjBhVzl1S0hKbGMyOXNkbVVwSUh0Y2JpQWdJQ0FnSUd4bGRDQmxZeklnUFNCblpYUkZZeklvS1R0Y2JpQWdJQ0FnSUdWak1pNWtaWE5qY21saVpWSmxaMmx2Ym5Nb1puVnVZM1JwYjI0b1pYSnlMQ0JrWVhSaEtTQjdYRzVjYmlBZ0lDQWdJQ0FnYkdWMElISmxaMmx2Ym5NZ1BTQmtZWFJoTGxKbFoybHZibk11YldGd0tHWjFibU4wYVc5dUtISmxaMmx2YmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR3hsZENCeVpXZHBiMjVPWVcxbElEMGdjbVZuYVc5dUxsSmxaMmx2Yms1aGJXVTdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHdGxlVG9nY21WbmFXOXVUbUZ0WlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJRzVoYldVNklISmxaMmx2Yms1aGJXVnpXM0psWjJsdmJrNWhiV1ZkSUh4OElISmxaMmx2Yms1aGJXVmNiaUFnSUNBZ0lDQWdJQ0I5TzF4dUlDQWdJQ0FnSUNCOUtUdGNibHh1SUNBZ0lDQWdJQ0J5WlhOdmJIWmxLSEpsWjJsdmJuTXBPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU2s3WEc0Z0lIMWNibjA3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdWak1rbHVjM1JoYm1ObGN6c2lYWDA9Il19
