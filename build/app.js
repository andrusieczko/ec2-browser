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
    var component = this;
    this.setState({
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
          { onClick: _this.regionChosen.bind(_this, region.key) },
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

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  regions: [{
    key: 'eu-west-1',
    name: "EU (Ireland)"
  }, {
    key: 'us-west-2',
    name: "US West (N. Carolina)"
  }],

  getInitialState: function getInitialState() {
    return {
      region: 'eu-west-1'
    };
  },

  componentDidMount: function componentDidMount() {
    _dispatcher2.default.register('regionAdded', (function (region) {
      this.regionSelected(region);
    }).bind(this));
  },

  regionSelected: function regionSelected(region) {
    this.setState({
      region: region
    });
    _dispatcher2.default.notifyAll('region', region);
  },

  isActive: function isActive(region) {
    if (region === this.state.region) {
      return "active";
    };
    return "";
  },

  render: function render() {
    var _this = this;

    var regions = this.regions.map(function (region) {
      return React.createElement(
        'li',
        { key: region.key,
          className: classNames("list-group-item", _this.isActive(region.key)),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvQWRkUmVnaW9uLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9FYzJJbnN0YW5jZXMuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1BhZ2VDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9SZWdpb25MaXN0LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9TaWRlYmFyLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZS5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50LmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZUhlYWRlci5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdy5qcyIsIi9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXIuanMiLCIvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9tYWluLmpzIiwiL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvc2VydmljZXMvZWMyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUU7RUFDM0MsS0FBSyxFQUFFLElBQUk7QUFDYixDQUFDLENBQUMsQ0FBQzs7QUFFSCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsdUVBQXVFLENBQUMsQ0FBQzs7QUFFbkcsSUFBSSxZQUFZLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXZELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyw4REFBOEQsQ0FBQyxDQUFDOztBQUVsRixJQUFJLElBQUksR0FBRyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDREQUE0RCxDQUFDLENBQUM7O0FBRXhGLElBQUksWUFBWSxHQUFHLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV2RCxTQUFTLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdB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LENBQUMsVUFBVSxHQUFHLEVBQUUsSUFBSSxFQUFFOztRQUV2QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLE1BQU0sRUFBRTtVQUMvQyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1VBQ25DLE9BQU87WUFDTCxHQUFHLEVBQUUsVUFBVTtZQUNmLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVTtXQUM1QyxDQUFDO0FBQ1osU0FBUyxDQUFDLENBQUM7O1FBRUgsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2xCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKO0FBQ0gsQ0FBQyxDQUFDOztBQUVGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBQy9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTUgSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzICgpIHtcblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBhcmcpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHRpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2xhc3NOYW1lcztcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXM7XG5cdH1cbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfUmVnaW9uTGlzdCA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvUmVnaW9uTGlzdCcpO1xuXG52YXIgX1JlZ2lvbkxpc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUmVnaW9uTGlzdCk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgQWRkUmVnaW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0FkZFJlZ2lvbicsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpc3RWaXNpYmxlOiBmYWxzZSxcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgbG9hZGluZzogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uQWRkZWQnLCAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsaXN0VmlzaWJsZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGFkZFJlZ2lvbjogZnVuY3Rpb24gYWRkUmVnaW9uKGUpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcztcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsaXN0VmlzaWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIF9lYzIuZGVmYXVsdC5mZXRjaFJlZ2lvbnMoKS50aGVuKGZ1bmN0aW9uIChyZWdpb25zKSB7XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoe1xuICAgICAgICBsaXN0VmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgZGF0YTogcmVnaW9ucyxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NwYW4nLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdzcGFuJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdhZGQtYnV0dG9uJywgb25DbGljazogdGhpcy5hZGRSZWdpb24gfSxcbiAgICAgICAgJysnXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfUmVnaW9uTGlzdDIuZGVmYXVsdCwgeyB2aXNpYmxlOiB0aGlzLnN0YXRlLmxpc3RWaXNpYmxlLCByZWdpb25zOiB0aGlzLnN0YXRlLmRhdGEsIGxvYWRpbmc6IHRoaXMuc3RhdGUubG9hZGluZyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBBZGRSZWdpb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtGa1pGSmxaMmx2Ymk1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3T3pzN096dEJRVWxCTEVsQlFVa3NVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTm9ReXhwUWtGQlpTeEZRVUZGTERKQ1FVRlhPMEZCUXpGQ0xGZEJRVTg3UVVGRFRDeHBRa0ZCVnl4RlFVRkZMRXRCUVVzN1FVRkRiRUlzVlVGQlNTeEZRVUZGTEVWQlFVVTdRVUZEVWl4aFFVRlBMRVZCUVVVc1MwRkJTenRMUVVObUxFTkJRVU03UjBGRFNEczdRVUZGUkN4dFFrRkJhVUlzUlVGQlJTdzJRa0ZCVnp0QlFVTTFRaXg1UWtGQlZ5eFJRVUZSTEVOQlFVTXNZVUZCWVN4RlFVRkZMRU5CUVVFc1ZVRkJVeXhOUVVGTkxFVkJRVVU3UVVGRGJFUXNWVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOYUxHVkJRVThzUlVGQlJTeExRVUZMTzBGQlEyUXNiVUpCUVZjc1JVRkJSU3hMUVVGTE8wOUJRMjVDTEVOQlFVTXNRMEZCUXp0TFFVTktMRU5CUVVFc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0SFFVTm1PenRCUVVWRUxGZEJRVk1zUlVGQlJTeHRRa0ZCVXl4RFFVRkRMRVZCUVVVN1FVRkRja0lzVVVGQlNTeFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNKQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4aFFVRlBMRVZCUVVVc1NVRkJTVHRCUVVOaUxHbENRVUZYTEVWQlFVVXNTVUZCU1R0TFFVTnNRaXhEUVVGRExFTkJRVU03UVVGRFNDeHBRa0ZCU1N4WlFVRlpMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlV5eFBRVUZQTEVWQlFVVTdRVUZEZUVNc1pVRkJVeXhEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5xUWl4dFFrRkJWeXhGUVVGRkxFbEJRVWs3UVVGRGFrSXNXVUZCU1N4RlFVRkZMRTlCUVU4N1FVRkRZaXhsUVVGUExFVkJRVVVzUzBGQlN6dFBRVU5tTEVOQlFVTXNRMEZCUXp0TFFVTktMRU5CUVVNc1EwRkJRenRIUVVOS096dEJRVVZFTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3pzN1RVRkRSVHM3VlVGQlRTeFRRVUZUTEVWQlFVTXNXVUZCV1N4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEJRVUZET3p0UFFVRlRPMDFCUXpsRUxEUkRRVUZaTEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGZEJRVmNzUVVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUVVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUVVGQlF5eEhRVUZITzB0QlEycEhMRU5CUTFBN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdhMEpCUlZrc1UwRkJVeUlzSW1acGJHVWlPaUpCWkdSU1pXZHBiMjR1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTGk5emNtTXZhbk12SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUZKbFoybHZia3hwYzNRZ1puSnZiU0FuWTI5dGNHOXVaVzUwY3k5U1pXZHBiMjVNYVhOMEp6dGNibWx0Y0c5eWRDQmxZeklnWm5KdmJTQW5jMlZ5ZG1salpYTXZaV015Snp0Y2JtbHRjRzl5ZENCa2FYTndZWFJqYUdWeUlHWnliMjBnSjJScGMzQmhkR05vWlhJbk8xeHVYRzVzWlhRZ1FXUmtVbVZuYVc5dUlEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0JzYVhOMFZtbHphV0pzWlRvZ1ptRnNjMlVzWEc0Z0lDQWdJQ0JrWVhSaE9pQmJYU3hjYmlBZ0lDQWdJR3h2WVdScGJtYzZJR1poYkhObFhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmx4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdaR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWduY21WbmFXOXVRV1JrWldRbkxDQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnSUNCc2IyRmthVzVuT2lCbVlXeHpaU3hjYmlBZ0lDQWdJQ0FnYkdsemRGWnBjMmxpYkdVNklHWmhiSE5sWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dVhHNGdJR0ZrWkZKbFoybHZiam9nWm5WdVkzUnBiMjRvWlNrZ2UxeHVJQ0FnSUd4bGRDQmpiMjF3YjI1bGJuUWdQU0IwYUdsek8xeHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdiRzloWkdsdVp6b2dkSEoxWlN4Y2JpQWdJQ0FnSUd4cGMzUldhWE5wWW14bE9pQjBjblZsWEc0Z0lDQWdmU2s3WEc0Z0lDQWdaV015TG1abGRHTm9VbVZuYVc5dWN5Z3BMblJvWlc0b1puVnVZM1JwYjI0b2NtVm5hVzl1Y3lrZ2UxeHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MExuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lDQWdiR2x6ZEZacGMybGliR1U2SUhSeWRXVXNYRzRnSUNBZ0lDQWdJR1JoZEdFNklISmxaMmx2Ym5Nc1hHNGdJQ0FnSUNBZ0lHeHZZV1JwYm1jNklHWmhiSE5sWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5S1R0Y2JpQWdmU3hjYmx4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGMzQmhiajVjYmlBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWVdSa0xXSjFkSFJ2Ymx3aUlHOXVRMnhwWTJzOWUzUm9hWE11WVdSa1VtVm5hVzl1ZlQ0clBDOXpjR0Z1UGx4dUlDQWdJQ0FnSUNBOFVtVm5hVzl1VEdsemRDQjJhWE5wWW14bFBYdDBhR2x6TG5OMFlYUmxMbXhwYzNSV2FYTnBZbXhsZlNCeVpXZHBiMjV6UFh0MGFHbHpMbk4wWVhSbExtUmhkR0Y5SUd4dllXUnBibWM5ZTNSb2FYTXVjM1JoZEdVdWJHOWhaR2x1WjMwZ0x6NWNiaUFnSUNBZ0lEd3ZjM0JoYmo1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1FXUmtVbVZuYVc5dU95SmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1RhYmxlID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9UYWJsZScpO1xuXG52YXIgX1RhYmxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RhYmxlKTtcblxudmFyIF9lYyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMicpO1xuXG52YXIgX2VjMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VjKTtcblxudmFyIF9kaXNwYXRjaGVyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvZGlzcGF0Y2hlcicpO1xuXG52YXIgX2Rpc3BhdGNoZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlzcGF0Y2hlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciB0YWcgPSBmdW5jdGlvbiB0YWcodGFnTmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLnRhZ3MuZmlsdGVyKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgIHJldHVybiB0YWcua2V5ID09PSB0YWdOYW1lO1xuICAgIH0pWzBdLnZhbHVlO1xuICB9O1xufTtcblxudmFyIEVjMkluc3RhbmNlcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdFYzJJbnN0YW5jZXMnLFxuXG4gIGNvbHVtbnM6IFt7IG5hbWU6IFwiSWRcIiwga2V5OiAnaWQnIH0sIHsgbmFtZTogXCJOYW1lXCIsIGtleTogdGFnKFwiTmFtZVwiKSB9LCB7IG5hbWU6IFwiS2V5IG5hbWVcIiwga2V5OiAna2V5TmFtZScgfSwgeyBuYW1lOiBcIkluc3RhbmNlIHR5cGVcIiwga2V5OiAnaW5zdGFuY2VUeXBlJyB9LCB7IG5hbWU6IFwiU3RhdHVzXCIsIGtleTogJ3N0YXR1cycgfV0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIHJlZ2lvbjogJ2V1LXdlc3QtMSdcbiAgICB9O1xuICB9LFxuXG4gIGZldGNoSW5zdGFuY2VzOiBmdW5jdGlvbiBmZXRjaEluc3RhbmNlcyhyZWdpb24pIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGxvYWRpbmc6IHRydWVcbiAgICB9KTtcblxuICAgIHZhciBjb21wb25lbnQgPSB0aGlzO1xuICAgIF9lYzIuZGVmYXVsdC5mZXRjaEluc3RhbmNlcyhyZWdpb24pLnRoZW4oZnVuY3Rpb24gKGluc3RhbmNlcykge1xuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgICAgZGF0YTogaW5zdGFuY2VzLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZmV0Y2hJbnN0YW5jZXModGhpcy5zdGF0ZS5yZWdpb24pO1xuICAgIF9kaXNwYXRjaGVyMi5kZWZhdWx0LnJlZ2lzdGVyKCdyZWdpb24nLCAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgdGhpcy5mZXRjaEluc3RhbmNlcyhyZWdpb24pO1xuICAgIH0pLmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGNoYW5nZVJlZ2lvbjogZnVuY3Rpb24gY2hhbmdlUmVnaW9uKGUpIHtcbiAgICB2YXIgcmVnaW9uID0gZS50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWdpb246IHJlZ2lvbixcbiAgICAgIGxvYWRpbmc6IHRydWVcbiAgICB9KTtcbiAgICB0aGlzLmZldGNoSW5zdGFuY2VzKHJlZ2lvbik7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9UYWJsZTIuZGVmYXVsdCwgeyBjb2x1bW5zOiB0aGlzLmNvbHVtbnMsIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSwgbG9hZGluZzogdGhpcy5zdGF0ZS5sb2FkaW5nIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEVjMkluc3RhbmNlcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa1ZqTWtsdWMzUmhibU5sY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3T3pzN096dEJRVWxCTEVsQlFVa3NSMEZCUnl4SFFVRkhMRk5CUVU0c1IwRkJSeXhEUVVGWkxFOUJRVThzUlVGQlJUdEJRVU14UWl4VFFVRlBMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJRM2hDTEZkQlFVOHNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlF5eEhRVUZITEVWQlFVczdRVUZEYmtNc1lVRkJUeXhIUVVGSExFTkJRVU1zUjBGQlJ5eExRVUZMTEU5QlFVOHNRMEZCUXp0TFFVTTFRaXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPMGRCUTJJc1EwRkJRenREUVVOSUxFTkJRVU03TzBGQlJVWXNTVUZCU1N4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTI1RExGTkJRVThzUlVGQlJTeERRVU5RTEVWQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1JVRkJSU3hIUVVGSExFVkJRVVVzU1VGQlNTeEZRVUZETEVWQlEzWkNMRVZCUVVNc1NVRkJTU3hGUVVGRkxFMUJRVTBzUlVGQlJTeEhRVUZITEVWQlFVVXNSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRExFVkJRMmhETEVWQlFVTXNTVUZCU1N4RlFVRkZMRlZCUVZVc1JVRkJSU3hIUVVGSExFVkJRVVVzVTBGQlV5eEZRVUZETEVWQlEyeERMRVZCUVVNc1NVRkJTU3hGUVVGRkxHVkJRV1VzUlVGQlJTeEhRVUZITEVWQlFVVXNZMEZCWXl4RlFVRkRMRVZCUXpWRExFVkJRVU1zU1VGQlNTeEZRVUZGTEZGQlFWRXNSVUZCUlN4SFFVRkhMRVZCUVVVc1VVRkJVU3hGUVVGRExFTkJRMmhET3p0QlFVVkVMR2xDUVVGbExFVkJRVVVzTWtKQlFWYzdRVUZETVVJc1YwRkJUenRCUVVOTUxGVkJRVWtzUlVGQlJTeEZRVUZGTzBGQlExSXNZVUZCVHl4RlFVRkZMRWxCUVVrN1FVRkRZaXhaUVVGTkxFVkJRVVVzVjBGQlZ6dExRVU53UWl4RFFVRkRPMGRCUTBnN08wRkJSVVFzWjBKQlFXTXNSVUZCUlN4M1FrRkJVeXhOUVVGTkxFVkJRVVU3UVVGREwwSXNVVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOYUxHRkJRVThzUlVGQlJTeEpRVUZKTzB0QlEyUXNRMEZCUXl4RFFVRkRPenRCUVVWSUxGRkJRVWtzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnlRaXhwUWtGQlNTeGpRVUZqTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVU1zVTBGQlV5eEZRVUZMTzBGQlF6ZERMR1ZCUVZNc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRGFrSXNXVUZCU1N4RlFVRkZMRk5CUVZNN1FVRkRaaXhsUVVGUExFVkJRVVVzUzBGQlN6dFBRVU5tTEVOQlFVTXNRMEZCUXp0TFFVTktMRU5CUVVNc1EwRkJRenRIUVVOS096dEJRVVZFTEcxQ1FVRnBRaXhGUVVGRkxEWkNRVUZYTzBGQlF6VkNMRkZCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVOMlF5eDVRa0ZCVnl4UlFVRlJMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVUVzVlVGQlV5eE5RVUZOTEVWQlFVVTdRVUZETjBNc1ZVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0TFFVTTNRaXhEUVVGQkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1IwRkRaanM3UVVGRlJDeGpRVUZaTEVWQlFVVXNjMEpCUVZNc1EwRkJReXhGUVVGRk8wRkJRM2hDTEZGQlFVa3NUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZCTzBGQlF6TkNMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeFpRVUZOTEVWQlFVVXNUVUZCVFR0QlFVTmtMR0ZCUVU4c1JVRkJSU3hKUVVGSk8wdEJRMlFzUTBGQlF5eERRVUZETzBGQlEwZ3NVVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEhRVU0zUWpzN1FVRkZSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3TzAxQlEwVXNkVU5CUVU4c1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVGQlFVTXNSVUZCUXl4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVGQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVGQlFVTXNSMEZCUnp0TFFVTm9SaXhEUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMnRDUVVWWkxGbEJRVmtpTENKbWFXeGxJam9pUldNeVNXNXpkR0Z1WTJWekxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlVZV0pzWlNCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFSaFlteGxKenRjYm1sdGNHOXlkQ0JsWXpJZ1puSnZiU0FuYzJWeWRtbGpaWE12WldNeUp6dGNibWx0Y0c5eWRDQmthWE53WVhSamFHVnlJR1p5YjIwZ0oyUnBjM0JoZEdOb1pYSW5PMXh1WEc1c1pYUWdkR0ZuSUQwZ1puVnVZM1JwYjI0b2RHRm5UbUZ0WlNrZ2UxeHVJQ0J5WlhSMWNtNGdablZ1WTNScGIyNG9hVzV6ZEdGdVkyVXBJSHRjYmlBZ0lDQnlaWFIxY200Z2FXNXpkR0Z1WTJVdWRHRm5jeTVtYVd4MFpYSW9LSFJoWnlrZ1BUNGdlMXh1SUNBZ0lDQWdjbVYwZFhKdUlIUmhaeTVyWlhrZ1BUMDlJSFJoWjA1aGJXVTdYRzRnSUNBZ2ZTbGJNRjB1ZG1Gc2RXVTdYRzRnSUgwN1hHNTlPMXh1WEc1c1pYUWdSV015U1c1emRHRnVZMlZ6SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0JqYjJ4MWJXNXpPaUJiWEc0Z0lDQWdlMjVoYldVNklGd2lTV1JjSWl3Z2EyVjVPaUFuYVdRbmZTeGNiaUFnSUNCN2JtRnRaVG9nWENKT1lXMWxYQ0lzSUd0bGVUb2dkR0ZuS0Z3aVRtRnRaVndpS1gwc1hHNGdJQ0FnZTI1aGJXVTZJRndpUzJWNUlHNWhiV1ZjSWl3Z2EyVjVPaUFuYTJWNVRtRnRaU2Q5TEZ4dUlDQWdJSHR1WVcxbE9pQmNJa2x1YzNSaGJtTmxJSFI1Y0dWY0lpd2dhMlY1T2lBbmFXNXpkR0Z1WTJWVWVYQmxKMzBzWEc0Z0lDQWdlMjVoYldVNklGd2lVM1JoZEhWelhDSXNJR3RsZVRvZ0ozTjBZWFIxY3lkOUxGeHVJQ0JkTEZ4dVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHUmhkR0U2SUZ0ZExGeHVJQ0FnSUNBZ2JHOWhaR2x1WnpvZ2RISjFaU3hjYmlBZ0lDQWdJSEpsWjJsdmJqb2dKMlYxTFhkbGMzUXRNU2RjYmlBZ0lDQjlPMXh1SUNCOUxGeHVYRzRnSUdabGRHTm9TVzV6ZEdGdVkyVnpPaUJtZFc1amRHbHZiaWh5WldkcGIyNHBJSHRjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUd4dllXUnBibWM2SUhSeWRXVmNiaUFnSUNCOUtUdGNiaUFnSUNCY2JpQWdJQ0JzWlhRZ1kyOXRjRzl1Wlc1MElEMGdkR2hwY3p0Y2JpQWdJQ0JsWXpJdVptVjBZMmhKYm5OMFlXNWpaWE1vY21WbmFXOXVLUzUwYUdWdUtDaHBibk4wWVc1alpYTXBJRDArSUh0Y2JpQWdJQ0FnSUdOdmJYQnZibVZ1ZEM1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNBZ0lHUmhkR0U2SUdsdWMzUmhibU5sY3l4Y2JpQWdJQ0FnSUNBZ2JHOWhaR2x1WnpvZ1ptRnNjMlZjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDBwTzF4dUlDQjlMRnh1WEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRTF2ZFc1ME9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQjBhR2x6TG1abGRHTm9TVzV6ZEdGdVkyVnpLSFJvYVhNdWMzUmhkR1V1Y21WbmFXOXVLVHRjYmlBZ0lDQmthWE53WVhSamFHVnlMbkpsWjJsemRHVnlLQ2R5WldkcGIyNG5MQ0JtZFc1amRHbHZiaWh5WldkcGIyNHBJSHRjYmlBZ0lDQWdJSFJvYVhNdVptVjBZMmhKYm5OMFlXNWpaWE1vY21WbmFXOXVLVHRjYmlBZ0lDQjlMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlMRnh1WEc0Z0lHTm9ZVzVuWlZKbFoybHZiam9nWm5WdVkzUnBiMjRvWlNrZ2UxeHVJQ0FnSUd4bGRDQnlaV2RwYjI0Z1BTQmxMblJoY21kbGRDNTJZV3gxWlZ4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UxeHVJQ0FnSUNBZ2NtVm5hVzl1T2lCeVpXZHBiMjRzWEc0Z0lDQWdJQ0JzYjJGa2FXNW5PaUIwY25WbFhHNGdJQ0FnZlNrN1hHNGdJQ0FnZEdocGN5NW1aWFJqYUVsdWMzUmhibU5sY3loeVpXZHBiMjRwTzF4dUlDQjlMRnh1WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWStYRzRnSUNBZ0lDQWdJRHhVWVdKc1pTQmpiMngxYlc1elBYdDBhR2x6TG1OdmJIVnRibk45SUdSaGRHRTllM1JvYVhNdWMzUmhkR1V1WkdGMFlYMGdiRzloWkdsdVp6MTdkR2hwY3k1emRHRjBaUzVzYjJGa2FXNW5mU0F2UGx4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRVZqTWtsdWMzUmhibU5sY3pzaVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfRWMySW5zdGFuY2VzID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9FYzJJbnN0YW5jZXMnKTtcblxudmFyIF9FYzJJbnN0YW5jZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRWMySW5zdGFuY2VzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFBhZ2VDb250ZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1BhZ2VDb250ZW50JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX0VjMkluc3RhbmNlczIuZGVmYXVsdCwgbnVsbClcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gUGFnZUNvbnRlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxCaFoyVkRiMjUwWlc1MExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096czdPenRCUVVWQkxFbEJRVWtzVjBGQlZ5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU5zUXl4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN08wMUJRMFVzYVVSQlFXZENPMHRCUTFvc1EwRkRUanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0clFrRkZXU3hYUVVGWElpd2labWxzWlNJNklsQmhaMlZEYjI1MFpXNTBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JGWXpKSmJuTjBZVzVqWlhNZ1puSnZiU0FuWTI5dGNHOXVaVzUwY3k5Rll6Skpibk4wWVc1alpYTW5PMXh1WEc1c1pYUWdVR0ZuWlVOdmJuUmxiblFnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFkrWEc0Z0lDQWdJQ0FnSUR4Rll6Skpibk4wWVc1alpYTWdMejVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlFZV2RsUTI5dWRHVnVkRHNpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kaXNwYXRjaGVyID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvZGlzcGF0Y2hlcicpO1xuXG52YXIgX2Rpc3BhdGNoZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGlzcGF0Y2hlcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgUmVnaW9uTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdSZWdpb25MaXN0JyxcblxuICByZWdpb25DaG9zZW46IGZ1bmN0aW9uIHJlZ2lvbkNob3NlbihyZWdpb24pIHtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5ub3RpZnlBbGwoJ3JlZ2lvbkFkZGVkJywgcmVnaW9uKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBsb2FkaW5nID0gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdsaScsXG4gICAgICBudWxsLFxuICAgICAgJ0xvYWRpbmcnXG4gICAgKTtcbiAgICB2YXIgcmVnaW9ucyA9IHRoaXMucHJvcHMucmVnaW9ucy5tYXAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsaScsXG4gICAgICAgIHsga2V5OiByZWdpb24ua2V5IH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2EnLFxuICAgICAgICAgIHsgb25DbGljazogX3RoaXMucmVnaW9uQ2hvc2VuLmJpbmQoX3RoaXMsIHJlZ2lvbi5rZXkpIH0sXG4gICAgICAgICAgcmVnaW9uLm5hbWVcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHZhciBib2R5ID0gdGhpcy5wcm9wcy5sb2FkaW5nID8gbG9hZGluZyA6IHJlZ2lvbnM7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndWwnLFxuICAgICAgeyBjbGFzc05hbWU6IGNsYXNzTmFtZXMoXCJyZWdpb25zLWxpc3RcIiwgdGhpcy5wcm9wcy52aXNpYmxlID8gJ3Zpc2libGUnIDogJycpIH0sXG4gICAgICBib2R5XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFJlZ2lvbkxpc3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWxKbFoybHZia3hwYzNRdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPMEZCUTBFc1NVRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWMlF5eEpRVUZKTEZWQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZEYWtNc1kwRkJXU3hGUVVGRkxITkNRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTTNRaXg1UWtGQlZ5eFRRVUZUTEVOQlFVTXNZVUZCWVN4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wZEJRemRETzBGQlEwUXNVVUZCVFN4RlFVRkZMR3RDUVVGWE96czdRVUZEYWtJc1VVRkJTU3hQUVVGUExFZEJRMVE3T3pzN1MwRkJaMElzUVVGRGFrSXNRMEZCUXp0QlFVTkdMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGRExFMUJRVTBzUlVGQlN6dEJRVU12UXl4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4QlFVRkRPMUZCUTJ4Q096dFpRVUZITEU5QlFVOHNSVUZCUlN4TlFVRkxMRmxCUVZrc1EwRkJReXhKUVVGSkxGRkJRVThzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4QlFVRkRPMVZCUVVVc1RVRkJUU3hEUVVGRExFbEJRVWs3VTBGQlN6dFBRVU53UlN4RFFVTk1PMHRCUTBnc1EwRkJReXhEUVVGRE96dEJRVVZJTEZGQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEhRVUZITEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNN1FVRkRiRVFzVjBGRFJUczdVVUZCU1N4VFFVRlRMRVZCUVVVc1ZVRkJWU3hEUVVGRExHTkJRV01zUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1IwRkJReXhUUVVGVExFZEJRVU1zUlVGQlJTeERRVUZETEVGQlFVTTdUVUZEZUVVc1NVRkJTVHRMUVVOR0xFTkJRMHc3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN2EwSkJSVmtzVlVGQlZTSXNJbVpwYkdVaU9pSlNaV2RwYjI1TWFYTjBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dWJHVjBJR05zWVhOelRtRnRaWE1nUFNCeVpYRjFhWEpsS0NkamJHRnpjMjVoYldWekp5azdYRzVjYm14bGRDQlNaV2RwYjI1TWFYTjBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaV2RwYjI1RGFHOXpaVzQ2SUdaMWJtTjBhVzl1S0hKbFoybHZiaWtnZTF4dUlDQWdJR1JwYzNCaGRHTm9aWEl1Ym05MGFXWjVRV3hzS0NkeVpXZHBiMjVCWkdSbFpDY3NJSEpsWjJsdmJpazdYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdiR1YwSUd4dllXUnBibWNnUFNBZ0tGeHVJQ0FnSUNBZ1BHeHBQa3h2WVdScGJtYzhMMnhwUGx4dUlDQWdJQ2s3WEc0Z0lDQWdiR1YwSUhKbFoybHZibk1nUFNCMGFHbHpMbkJ5YjNCekxuSmxaMmx2Ym5NdWJXRndLQ2h5WldkcGIyNHBJRDArSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUR4c2FTQnJaWGs5ZTNKbFoybHZiaTVyWlhsOVBseHVJQ0FnSUNBZ0lDQWdJRHhoSUc5dVEyeHBZMnM5ZTNSb2FYTXVjbVZuYVc5dVEyaHZjMlZ1TG1KcGJtUW9kR2hwY3l3Z2NtVm5hVzl1TG10bGVTbDlQbnR5WldkcGIyNHVibUZ0WlgwOEwyRStYRzRnSUNBZ0lDQWdJRHd2YkdrK1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ2JHVjBJR0p2WkhrZ1BTQjBhR2x6TG5CeWIzQnpMbXh2WVdScGJtY2dQeUJzYjJGa2FXNW5JRG9nY21WbmFXOXVjenRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BIVnNJR05zWVhOelRtRnRaVDE3WTJ4aGMzTk9ZVzFsY3loY0luSmxaMmx2Ym5NdGJHbHpkRndpTENCMGFHbHpMbkJ5YjNCekxuWnBjMmxpYkdVL0ozWnBjMmxpYkdVbk9pY25LWDArWEc0Z0lDQWdJQ0FnSUh0aWIyUjVmVnh1SUNBZ0lDQWdQQzkxYkQ1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1VtVm5hVzl1VEdsemREc2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2Rpc3BhdGNoZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9kaXNwYXRjaGVyJyk7XG5cbnZhciBfZGlzcGF0Y2hlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kaXNwYXRjaGVyKTtcblxudmFyIF9BZGRSZWdpb24gPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL0FkZFJlZ2lvbicpO1xuXG52YXIgX0FkZFJlZ2lvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BZGRSZWdpb24pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFNpZGViYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2lkZWJhcicsXG5cbiAgcmVnaW9uczogW3tcbiAgICBrZXk6ICdldS13ZXN0LTEnLFxuICAgIG5hbWU6IFwiRVUgKElyZWxhbmQpXCJcbiAgfSwge1xuICAgIGtleTogJ3VzLXdlc3QtMicsXG4gICAgbmFtZTogXCJVUyBXZXN0IChOLiBDYXJvbGluYSlcIlxuICB9XSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVnaW9uOiAnZXUtd2VzdC0xJ1xuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIF9kaXNwYXRjaGVyMi5kZWZhdWx0LnJlZ2lzdGVyKCdyZWdpb25BZGRlZCcsIChmdW5jdGlvbiAocmVnaW9uKSB7XG4gICAgICB0aGlzLnJlZ2lvblNlbGVjdGVkKHJlZ2lvbik7XG4gICAgfSkuYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgcmVnaW9uU2VsZWN0ZWQ6IGZ1bmN0aW9uIHJlZ2lvblNlbGVjdGVkKHJlZ2lvbikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVnaW9uOiByZWdpb25cbiAgICB9KTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5ub3RpZnlBbGwoJ3JlZ2lvbicsIHJlZ2lvbik7XG4gIH0sXG5cbiAgaXNBY3RpdmU6IGZ1bmN0aW9uIGlzQWN0aXZlKHJlZ2lvbikge1xuICAgIGlmIChyZWdpb24gPT09IHRoaXMuc3RhdGUucmVnaW9uKSB7XG4gICAgICByZXR1cm4gXCJhY3RpdmVcIjtcbiAgICB9O1xuICAgIHJldHVybiBcIlwiO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcmVnaW9ucyA9IHRoaXMucmVnaW9ucy5tYXAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsaScsXG4gICAgICAgIHsga2V5OiByZWdpb24ua2V5LFxuICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lcyhcImxpc3QtZ3JvdXAtaXRlbVwiLCBfdGhpcy5pc0FjdGl2ZShyZWdpb24ua2V5KSksXG4gICAgICAgICAgb25DbGljazogX3RoaXMucmVnaW9uU2VsZWN0ZWQuYmluZChfdGhpcywgcmVnaW9uLmtleSkgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW1nJywgeyBjbGFzc05hbWU6ICdpbWctY2lyY2xlIG1lZGlhLW9iamVjdCBwdWxsLWxlZnQnLCBzcmM6ICdodHRwOi8vbWVkaWEuYW1hem9ud2Vic2VydmljZXMuY29tL2F3c19zaW5nbGVib3hfMDEucG5nJywgd2lkdGg6ICczMicsIGhlaWdodDogJzMyJyB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWJvZHknIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHJlZ2lvbi5uYW1lXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICcwIHJ1bm5pbmcnXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3VsJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1ncm91cCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsaScsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1ncm91cC1oZWFkZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2g0JyxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgICdSZWdpb25zJ1xuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9BZGRSZWdpb24yLmRlZmF1bHQsIG51bGwpXG4gICAgICApLFxuICAgICAgcmVnaW9uc1xuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBTaWRlYmFyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsTnBaR1ZpWVhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPenM3T3p0QlFVVkJMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXpzN1FVRkZka01zU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6bENMRk5CUVU4c1JVRkJSU3hEUVVGRE8wRkJRMUlzVDBGQlJ5eEZRVUZGTEZkQlFWYzdRVUZEYUVJc1VVRkJTU3hGUVVGRkxHTkJRV003UjBGRGNrSXNSVUZCUlR0QlFVTkVMRTlCUVVjc1JVRkJSU3hYUVVGWE8wRkJRMmhDTEZGQlFVa3NSVUZCUlN4MVFrRkJkVUk3UjBGRE9VSXNRMEZCUXpzN1FVRkZSaXhwUWtGQlpTeEZRVUZGTERKQ1FVRlhPMEZCUXpGQ0xGZEJRVTg3UVVGRFRDeFpRVUZOTEVWQlFVVXNWMEZCVnp0TFFVTndRaXhEUVVGRE8wZEJRMGc3TzBGQlJVUXNiVUpCUVdsQ0xFVkJRVVVzTmtKQlFWYzdRVUZETlVJc2VVSkJRVmNzVVVGQlVTeERRVUZETEdGQlFXRXNSVUZCUlN4RFFVRkJMRlZCUVZNc1RVRkJUU3hGUVVGRk8wRkJRMnhFTEZWQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UzBGRE4wSXNRMEZCUVN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzBkQlEyWTdPMEZCUlVRc1owSkJRV01zUlVGQlJTeDNRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkRMMElzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMRmxCUVUwc1JVRkJSU3hOUVVGTk8wdEJRMllzUTBGQlF5eERRVUZETzBGQlEwZ3NlVUpCUVZjc1UwRkJVeXhEUVVGRExGRkJRVkVzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXp0SFFVTjRRenM3UVVGRlJDeFZRVUZSTEVWQlFVVXNhMEpCUVZNc1RVRkJUU3hGUVVGRk8wRkJRM3BDTEZGQlFVa3NUVUZCVFN4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyaERMR0ZCUVU4c1VVRkJVU3hEUVVGQk8wdEJRMmhDTEVOQlFVTTdRVUZEUml4WFFVRlBMRVZCUVVVc1EwRkJRenRIUVVOWU96dEJRVVZFTEZGQlFVMHNSVUZCUlN4clFrRkJWenM3TzBGQlEycENMRkZCUVVrc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVNc1RVRkJUU3hGUVVGTE8wRkJRM3BETEdGQlEwVTdPMVZCUVVrc1IwRkJSeXhGUVVGRkxFMUJRVTBzUTBGQlF5eEhRVUZITEVGQlFVTTdRVUZEYUVJc2JVSkJRVk1zUlVGQlJTeFZRVUZWTEVOQlFVTXNhVUpCUVdsQ0xFVkJRVVVzVFVGQlN5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFRkJRVU03UVVGRGNFVXNhVUpCUVU4c1JVRkJSU3hOUVVGTExHTkJRV01zUTBGQlF5eEpRVUZKTEZGQlFVOHNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhCUVVGRE8xRkJRM1JFTERaQ1FVRkxMRk5CUVZNc1JVRkJReXh0UTBGQmJVTXNSVUZCUXl4SFFVRkhMRVZCUVVNc2VVUkJRWGxFTEVWQlFVTXNTMEZCU3l4RlFVRkRMRWxCUVVrc1JVRkJReXhOUVVGTkxFVkJRVU1zU1VGQlNTeEhRVUZITzFGQlF6RkpPenRaUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzFWQlEzcENPenM3V1VGQlV5eE5RVUZOTEVOQlFVTXNTVUZCU1R0WFFVRlZPMVZCUXpsQ096czdPMWRCUVdkQ08xTkJRMW83VDBGRFNDeERRVU5NTzB0QlEwZ3NRMEZCUXl4RFFVRkRPMEZCUTBnc1YwRkRSVHM3VVVGQlNTeFRRVUZUTEVWQlFVTXNXVUZCV1R0TlFVTjRRanM3VlVGQlNTeFRRVUZUTEVWQlFVTXNiVUpCUVcxQ08xRkJReTlDT3pzN08xTkJRV2RDTzFGQlEyaENMRGhEUVVGaE8wOUJRMVk3VFVGRFNpeFBRVUZQTzB0QlEwd3NRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4UFFVRlBJaXdpWm1sc1pTSTZJbE5wWkdWaVlYSXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lMaTl6Y21NdmFuTXZJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJR1JwYzNCaGRHTm9aWElnWm5KdmJTQW5aR2x6Y0dGMFkyaGxjaWM3WEc1cGJYQnZjblFnUVdSa1VtVm5hVzl1SUdaeWIyMGdKMk52YlhCdmJtVnVkSE12UVdSa1VtVm5hVzl1Snp0Y2JteGxkQ0JqYkdGemMwNWhiV1Z6SUQwZ2NtVnhkV2x5WlNnblkyeGhjM051WVcxbGN5Y3BPMXh1WEc1c1pYUWdVMmxrWldKaGNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVm5hVzl1Y3pvZ1czdGNiaUFnSUNCclpYazZJQ2RsZFMxM1pYTjBMVEVuTEZ4dUlDQWdJRzVoYldVNklGd2lSVlVnS0VseVpXeGhibVFwWENKY2JpQWdmU3dnZTF4dUlDQWdJR3RsZVRvZ0ozVnpMWGRsYzNRdE1pY3NYRzRnSUNBZ2JtRnRaVG9nWENKVlV5QlhaWE4wSUNoT0xpQkRZWEp2YkdsdVlTbGNJbHh1SUNCOVhTeGNibHh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0J5WldkcGIyNDZJQ2RsZFMxM1pYTjBMVEVuWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNibHh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ1pHbHpjR0YwWTJobGNpNXlaV2RwYzNSbGNpZ25jbVZuYVc5dVFXUmtaV1FuTENCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjbVZuYVc5dVUyVnNaV04wWldRb2NtVm5hVzl1S1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dVhHNGdJSEpsWjJsdmJsTmxiR1ZqZEdWa09pQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjYmlBZ0lDQWdJSEpsWjJsdmJqb2djbVZuYVc5dVhHNGdJQ0FnZlNrN1hHNGdJQ0FnWkdsemNHRjBZMmhsY2k1dWIzUnBabmxCYkd3b0ozSmxaMmx2Ymljc0lISmxaMmx2YmlrN1hHNGdJSDBzWEc1Y2JpQWdhWE5CWTNScGRtVTZJR1oxYm1OMGFXOXVLSEpsWjJsdmJpa2dlMXh1SUNBZ0lHbG1JQ2h5WldkcGIyNGdQVDA5SUhSb2FYTXVjM1JoZEdVdWNtVm5hVzl1S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWENKaFkzUnBkbVZjSWx4dUlDQWdJSDA3WEc0Z0lDQWdjbVYwZFhKdUlGd2lYQ0k3WEc0Z0lIMHNYRzVjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdjbVZuYVc5dWN5QTlJSFJvYVhNdWNtVm5hVzl1Y3k1dFlYQW9LSEpsWjJsdmJpa2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEd4cElHdGxlVDE3Y21WbmFXOXVMbXRsZVgwZ1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYkdGemMwNWhiV1U5ZTJOc1lYTnpUbUZ0WlhNb1hDSnNhWE4wTFdkeWIzVndMV2wwWlcxY0lpd2dkR2hwY3k1cGMwRmpkR2wyWlNoeVpXZHBiMjR1YTJWNUtTbDlJRnh1SUNBZ0lDQWdJQ0FnSUNBZ2IyNURiR2xqYXoxN2RHaHBjeTV5WldkcGIyNVRaV3hsWTNSbFpDNWlhVzVrS0hSb2FYTXNJSEpsWjJsdmJpNXJaWGtwZlQ1Y2JpQWdJQ0FnSUNBZ0lDQThhVzFuSUdOc1lYTnpUbUZ0WlQxY0ltbHRaeTFqYVhKamJHVWdiV1ZrYVdFdGIySnFaV04wSUhCMWJHd3RiR1ZtZEZ3aUlITnlZejFjSW1oMGRIQTZMeTl0WldScFlTNWhiV0Y2YjI1M1pXSnpaWEoyYVdObGN5NWpiMjB2WVhkelgzTnBibWRzWldKdmVGOHdNUzV3Ym1kY0lpQjNhV1IwYUQxY0lqTXlYQ0lnYUdWcFoyaDBQVndpTXpKY0lpQXZQbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYldWa2FXRXRZbTlrZVZ3aVBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEhOMGNtOXVaejU3Y21WbmFXOXVMbTVoYldWOVBDOXpkSEp2Ym1jK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4Y0Q0d0lISjFibTVwYm1jOEwzQStYRzRnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHd2YkdrK1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZFd3Z1kyeGhjM05PWVcxbFBWd2liR2x6ZEMxbmNtOTFjRndpUGx4dUlDQWdJQ0FnSUNBOGJHa2dZMnhoYzNOT1lXMWxQVndpYkdsemRDMW5jbTkxY0Mxb1pXRmtaWEpjSWo1Y2JpQWdJQ0FnSUNBZ0lDQThhRFErVW1WbmFXOXVjend2YURRK1hHNGdJQ0FnSUNBZ0lDQWdQRUZrWkZKbFoybHZiaUF2UGx4dUlDQWdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDQWdJQ0I3Y21WbmFXOXVjMzFjYmlBZ0lDQWdJRHd2ZFd3K1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElGTnBaR1ZpWVhJN0lsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfVGFibGVIZWFkZXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlSGVhZGVyJyk7XG5cbnZhciBfVGFibGVIZWFkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGVIZWFkZXIpO1xuXG52YXIgX1RhYmxlQ29udGVudCA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50Jyk7XG5cbnZhciBfVGFibGVDb250ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RhYmxlQ29udGVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUYWJsZScsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndGFibGUnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlSGVhZGVyMi5kZWZhdWx0LCB7IGNvbHVtbnM6IHRoaXMucHJvcHMuY29sdW1ucyB9KSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlQ29udGVudDIuZGVmYXVsdCwgeyBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICAgIGNvbHVtbnM6IHRoaXMucHJvcHMuY29sdW1ucyxcbiAgICAgICAgbG9hZGluZzogdGhpcy5wcm9wcy5sb2FkaW5nIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096czdPenM3UVVGSFFTeEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETlVJc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN096dE5RVU5GTERaRFFVRmhMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4SFFVRkhPMDFCUXpWRExEaERRVUZqTEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUVVGQlF6dEJRVU4wUWl4bFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVGQlFVTTdRVUZETlVJc1pVRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4QlFVRkRMRWRCUVVVN1MwRkRkRU1zUTBGRFVqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeExRVUZMSWl3aVptbHNaU0k2SWxSaFlteGxMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWVdKc1pVaGxZV1JsY2lCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFSaFlteGxTR1ZoWkdWeUp6dGNibWx0Y0c5eWRDQlVZV0pzWlVOdmJuUmxiblFnWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlVWVdKc1pVTnZiblJsYm5Rbk8xeHVYRzVzWlhRZ1ZHRmliR1VnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBZV0pzWlQ1Y2JpQWdJQ0FnSUNBZ1BGUmhZbXhsU0dWaFpHVnlJR052YkhWdGJuTTllM1JvYVhNdWNISnZjSE11WTI5c2RXMXVjMzBnTHo1Y2JpQWdJQ0FnSUNBZ1BGUmhZbXhsUTI5dWRHVnVkQ0JrWVhSaFBYdDBhR2x6TG5CeWIzQnpMbVJoZEdGOUlGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOdmJIVnRibk05ZTNSb2FYTXVjSEp2Y0hNdVkyOXNkVzF1YzMxY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzYjJGa2FXNW5QWHQwYUdsekxuQnliM0J6TG14dllXUnBibWQ5THo1Y2JpQWdJQ0FnSUR3dmRHRmliR1UrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZSaFlteGxPeUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9lYyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMicpO1xuXG52YXIgX2VjMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VjKTtcblxudmFyIF9UYWJsZVJvdyA9IHJlcXVpcmUoJy9Vc2Vycy9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cnKTtcblxudmFyIF9UYWJsZVJvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZVJvdyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBUYWJsZUNvbnRlbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVGFibGVDb250ZW50JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGluc3RhbmNlc1Jvd3MgPSB0aGlzLnByb3BzLmRhdGEubWFwKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlUm93Mi5kZWZhdWx0LCB7IGtleTogaW5zdGFuY2UuaWQsIGluc3RhbmNlOiBpbnN0YW5jZSwgY29sdW1uczogX3RoaXMucHJvcHMuY29sdW1ucyB9KTtcbiAgICB9KTtcbiAgICB2YXIgZW1wdHlSb3cgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNvbFNwYW46ICc0JyB9LFxuICAgICAgICAnTm8gcmVzdWx0cyB5ZXQuJ1xuICAgICAgKVxuICAgICk7XG4gICAgdmFyIGxvYWRpbmcgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNvbFNwYW46ICc0JyB9LFxuICAgICAgICAnTG9hZGluZy4uLidcbiAgICAgIClcbiAgICApO1xuICAgIHZhciBib2R5ID0gdGhpcy5wcm9wcy5sb2FkaW5nID8gbG9hZGluZyA6IGluc3RhbmNlc1Jvd3MubGVuZ3RoID8gaW5zdGFuY2VzUm93cyA6IGVtcHR5Um93O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3Rib2R5JyxcbiAgICAgIG51bGwsXG4gICAgICBib2R5XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlQ29udGVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFEyOXVkR1Z1ZEM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3TzBGQlIwRXNTVUZCU1N4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTI1RExGRkJRVTBzUlVGQlJTeHJRa0ZCVnpzN08wRkJRMnBDTEZGQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkRMRkZCUVZFc1JVRkJTenRCUVVOd1JDeGhRVU5GTERCRFFVRlZMRWRCUVVjc1JVRkJSU3hSUVVGUkxFTkJRVU1zUlVGQlJTeEJRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkZMRkZCUVZFc1FVRkJReXhGUVVGRExFOUJRVThzUlVGQlJTeE5RVUZMTEV0QlFVc3NRMEZCUXl4UFFVRlBMRUZCUVVNc1IwRkJSeXhEUVVNdlJUdExRVU5JTEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVrc1VVRkJVU3hIUVVOV096czdUVUZEUlRzN1ZVRkJTU3hQUVVGUExFVkJRVU1zUjBGQlJ6czdUMEZCY1VJN1MwRkRha01zUVVGRFRpeERRVUZETzBGQlEwWXNVVUZCU1N4UFFVRlBMRWRCUTFRN096dE5RVU5GT3p0VlFVRkpMRTlCUVU4c1JVRkJReXhIUVVGSE96dFBRVUZuUWp0TFFVTTFRaXhCUVVOT0xFTkJRVU03UVVGRFJpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVkQlFVY3NZVUZCWVN4RFFVRkRMRTFCUVUwc1IwRkJSeXhoUVVGaExFZEJRVWNzVVVGQlVTeERRVUZETzBGQlF6RkdMRmRCUTBVN096dE5RVU5ITEVsQlFVazdTMEZEUXl4RFFVTlNPMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmxCUVZraUxDSm1hV3hsSWpvaVZHRmliR1ZEYjI1MFpXNTBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JsWXpJZ1puSnZiU0FuYzJWeWRtbGpaWE12WldNeUp6dGNibWx0Y0c5eWRDQlVZV0pzWlZKdmR5Qm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsVW05M0p6dGNibHh1YkdWMElGUmhZbXhsUTI5dWRHVnVkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYVc1emRHRnVZMlZ6VW05M2N5QTlJSFJvYVhNdWNISnZjSE11WkdGMFlTNXRZWEFvS0dsdWMzUmhibU5sS1NBOVBpQjdYRzRnSUNBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0lDQThWR0ZpYkdWU2IzY2dhMlY1UFh0cGJuTjBZVzVqWlM1cFpIMGdhVzV6ZEdGdVkyVTllMmx1YzNSaGJtTmxmU0JqYjJ4MWJXNXpQWHQwYUdsekxuQnliM0J6TG1OdmJIVnRibk45SUM4K1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUd4bGRDQmxiWEIwZVZKdmR5QTlJQ2hjYmlBZ0lDQWdJRHgwY2o1Y2JpQWdJQ0FnSUNBZ1BIUmtJR052YkZOd1lXNDlYQ0kwWENJK1RtOGdjbVZ6ZFd4MGN5QjVaWFF1UEM5MFpENWNiaUFnSUNBZ0lEd3ZkSEkrWEc0Z0lDQWdLVHRjYmlBZ0lDQnNaWFFnYkc5aFpHbHVaeUE5SUNoY2JpQWdJQ0FnSUR4MGNqNWNiaUFnSUNBZ0lDQWdQSFJrSUdOdmJGTndZVzQ5WENJMFhDSStURzloWkdsdVp5NHVMand2ZEdRK1hHNGdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDazdYRzRnSUNBZ2JHVjBJR0p2WkhrZ1BTQjBhR2x6TG5CeWIzQnpMbXh2WVdScGJtY2dQeUJzYjJGa2FXNW5JRG9nYVc1emRHRnVZMlZ6VW05M2N5NXNaVzVuZEdnZ1B5QnBibk4wWVc1alpYTlNiM2R6SURvZ1pXMXdkSGxTYjNjN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwWW05a2VUNWNiaUFnSUNBZ0lDQWdlMkp2WkhsOVhHNGdJQ0FnSUNBOEwzUmliMlI1UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCVVlXSnNaVU52Ym5SbGJuUTdYRzRpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIFRhYmxlSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogXCJUYWJsZUhlYWRlclwiLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBoZWFkZXJzID0gdGhpcy5wcm9wcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoY29sdW1uLCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidGhcIixcbiAgICAgICAgeyBrZXk6IGluZGV4IH0sXG4gICAgICAgIGNvbHVtbi5uYW1lXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgXCJ0aGVhZFwiLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidHJcIixcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaGVhZGVyc1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZUhlYWRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFNHVmhaR1Z5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUVVFc1NVRkJTU3hYUVVGWExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRMnhETEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUXl4TlFVRk5MRVZCUVVVc1MwRkJTeXhGUVVGTE8wRkJRM1JFTEdGQlEwVTdPMVZCUVVrc1IwRkJSeXhGUVVGRkxFdEJRVXNzUVVGQlF6dFJRVUZGTEUxQlFVMHNRMEZCUXl4SlFVRkpPMDlCUVUwc1EwRkRiRU03UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVTkZPenM3VFVGRFJUczdPMUZCUTBjc1QwRkJUenRQUVVOTU8wdEJRME1zUTBGRFVqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeFhRVUZYSWl3aVptbHNaU0k2SWxSaFlteGxTR1ZoWkdWeUxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbXhsZENCVVlXSnNaVWhsWVdSbGNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdhR1ZoWkdWeWN5QTlJSFJvYVhNdWNISnZjSE11WTI5c2RXMXVjeTV0WVhBb0tHTnZiSFZ0Yml3Z2FXNWtaWGdwSUQwK0lIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeDBhQ0JyWlhrOWUybHVaR1Y0ZlQ1N1kyOXNkVzF1TG01aGJXVjlQQzkwYUQ1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlNrN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwYUdWaFpENWNiaUFnSUNBZ0lDQWdQSFJ5UGx4dUlDQWdJQ0FnSUNBZ0lIdG9aV0ZrWlhKemZWeHVJQ0FnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ0FnUEM5MGFHVmhaRDVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVkdGaWJHVklaV0ZrWlhJN0lsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBUYWJsZVJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6IFwiVGFibGVSb3dcIixcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLnByb3BzLmluc3RhbmNlO1xuICAgIHZhciBjb2x1bW5zID0gdGhpcy5wcm9wcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICB2YXIga2V5ID0gY29sdW1uLmtleTtcbiAgICAgIHZhciB2YWx1ZSA9IHR5cGVvZiBrZXkgPT09IFwiZnVuY3Rpb25cIiA/IGtleShpbnN0YW5jZSkgOiBpbnN0YW5jZVtrZXldO1xuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgXCJ0ZFwiLFxuICAgICAgICB7IGtleTogdmFsdWUgfSxcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBcInRyXCIsXG4gICAgICBudWxsLFxuICAgICAgY29sdW1uc1xuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZVJvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFVtOTNMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJRVUVzU1VGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF5OUNMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnVReXhSUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlF5eE5RVUZOTEVWQlFVczdRVUZETDBNc1ZVRkJTU3hIUVVGSExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXp0QlFVTnlRaXhWUVVGSkxFdEJRVXNzUjBGQlJ5eEJRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRlZCUVZVc1IwRkJTU3hIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVY0UlN4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeExRVUZMTEVGQlFVTTdVVUZCUlN4TFFVRkxPMDlCUVUwc1EwRkROVUk3UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVTkZPenM3VFVGRFJ5eFBRVUZQTzB0QlEwd3NRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4UlFVRlJJaXdpWm1sc1pTSTZJbFJoWW14bFVtOTNMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW14bGRDQlVZV0pzWlZKdmR5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdhVzV6ZEdGdVkyVWdQU0IwYUdsekxuQnliM0J6TG1sdWMzUmhibU5sTzF4dUlDQWdJR3hsZENCamIyeDFiVzV6SUQwZ2RHaHBjeTV3Y205d2N5NWpiMngxYlc1ekxtMWhjQ2dvWTI5c2RXMXVLU0E5UGlCN1hHNGdJQ0FnSUNCc1pYUWdhMlY1SUQwZ1kyOXNkVzF1TG10bGVUdGNiaUFnSUNBZ0lHeGxkQ0IyWVd4MVpTQTlJQ2gwZVhCbGIyWWdhMlY1SUQwOVBTQmNJbVoxYm1OMGFXOXVYQ0lwSUQ4Z2EyVjVLR2x1YzNSaGJtTmxLU0E2SUdsdWMzUmhibU5sVzJ0bGVWMDdYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHgwWkNCclpYazllM1poYkhWbGZUNTdkbUZzZFdWOVBDOTBaRDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU2s3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBjajVjYmlBZ0lDQWdJQ0FnZTJOdmJIVnRibk45WEc0Z0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlVZV0pzWlZKdmR6c2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1NpZGViYXIgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1NpZGViYXInKTtcblxudmFyIF9TaWRlYmFyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1NpZGViYXIpO1xuXG52YXIgX1BhZ2VDb250ZW50ID0gcmVxdWlyZSgnL1VzZXJzL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9QYWdlQ29udGVudCcpO1xuXG52YXIgX1BhZ2VDb250ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1BhZ2VDb250ZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFdpbmRvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdXaW5kb3cnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ3BhbmUtZ3JvdXAnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdwYW5lLXNtIHNpZGViYXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1NpZGViYXIyLmRlZmF1bHQsIG51bGwpXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZScgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfUGFnZUNvbnRlbnQyLmRlZmF1bHQsIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFdpbmRvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbGRwYm1SdmR5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN08wRkJSMEVzU1VGQlNTeE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlJUZENMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenRSUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzAxQlEzcENPenRWUVVGTExGTkJRVk1zUlVGQlF5eHBRa0ZCYVVJN1VVRkRPVUlzTkVOQlFWYzdUMEZEVUR0TlFVTk9PenRWUVVGTExGTkJRVk1zUlVGQlF5eE5RVUZOTzFGQlEyNUNMR2RFUVVGbE8wOUJRMWc3UzBGRFJpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08ydENRVVZaTEUxQlFVMGlMQ0ptYVd4bElqb2lWMmx1Wkc5M0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlRhV1JsWW1GeUlHWnliMjBnSjJOdmJYQnZibVZ1ZEhNdlUybGtaV0poY2ljN1hHNXBiWEJ2Y25RZ1VHRm5aVU52Ym5SbGJuUWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OVFZV2RsUTI5dWRHVnVkQ2M3SUZ4dVhHNXNaWFFnVjJsdVpHOTNJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWNHRnVaUzFuY205MWNGd2lQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJoYm1VdGMyMGdjMmxrWldKaGNsd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4VGFXUmxZbUZ5SUM4K1hHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CaGJtVmNJajVjYmlBZ0lDQWdJQ0FnSUNBOFVHRm5aVU52Ym5SbGJuUWdMejVjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1YybHVaRzkzT3lKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBfbGlzdGVuZXJzID0ge307XG5cbnZhciBEaXNwYXRjaGVyID0gZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHt9O1xuRGlzcGF0Y2hlci5wcm90b3R5cGUgPSB7XG5cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyKGFjdGlvbk5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFfbGlzdGVuZXJzW2FjdGlvbk5hbWVdKSB7XG4gICAgICBfbGlzdGVuZXJzW2FjdGlvbk5hbWVdID0gW107XG4gICAgfVxuXG4gICAgX2xpc3RlbmVyc1thY3Rpb25OYW1lXS5wdXNoKGNhbGxiYWNrKTtcbiAgfSxcblxuICBub3RpZnlBbGw6IGZ1bmN0aW9uIG5vdGlmeUFsbChhY3Rpb25OYW1lKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgY2FsbGJhY2tzID0gX2xpc3RlbmVyc1thY3Rpb25OYW1lXSB8fCBbXTtcbiAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwuYXBwbHkoY2FsbGJhY2ssIFtjYWxsYmFja10uY29uY2F0KGFyZ3MpKTtcbiAgICB9KTtcbiAgfVxufTtcblxudmFyIGFwcERpc3BhY2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGFwcERpc3BhY2hlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVJwYzNCaGRHTm9aWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdRVUZCUVN4SlFVRkpMRlZCUVZVc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYQkNMRWxCUVVrc1ZVRkJWU3hIUVVGSExGTkJRV0lzVlVGQlZTeEhRVUZqTEVWQlFVVXNRMEZCUXp0QlFVTXZRaXhWUVVGVkxFTkJRVU1zVTBGQlV5eEhRVUZIT3p0QlFVVnlRaXhWUVVGUkxFVkJRVVVzYTBKQlFWTXNWVUZCVlN4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVOMlF5eFJRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhGUVVGRk8wRkJRek5DTEdkQ1FVRlZMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzB0QlF6ZENPenRCUVVWRUxHTkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UjBGRGRrTTdPMEZCUlVRc1YwRkJVeXhGUVVGRkxHMUNRVUZUTEZWQlFWVXNSVUZCVnp0elEwRkJUaXhKUVVGSk8wRkJRVW9zVlVGQlNUczdPMEZCUTNKRExGRkJRVWtzVTBGQlV5eEhRVUZITEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRE4wTXNZVUZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGRExGRkJRVkVzUlVGQlN6dEJRVU01UWl4alFVRlJMRU5CUVVNc1NVRkJTU3hOUVVGQkxFTkJRV0lzVVVGQlVTeEhRVUZOTEZGQlFWRXNVMEZCU3l4SlFVRkpMRVZCUVVNc1EwRkJRenRMUVVOc1F5eERRVUZETEVOQlFVTTdSMEZEU2p0RFFVTkdMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVY3NTVUZCU1N4VlFVRlZMRVZCUVVVc1EwRkJRenM3YTBKQlJYSkNMRmxCUVZraUxDSm1hV3hsSWpvaVpHbHpjR0YwWTJobGNpNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSXVMM055WXk5cWN5OGlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpzWlhRZ1gyeHBjM1JsYm1WeWN5QTlJSHQ5TzF4dVhHNXNaWFFnUkdsemNHRjBZMmhsY2lBOUlHWjFibU4wYVc5dUtDa2dlMzA3WEc1RWFYTndZWFJqYUdWeUxuQnliM1J2ZEhsd1pTQTlJSHRjYmlBZ1hHNGdJSEpsWjJsemRHVnlPaUJtZFc1amRHbHZiaWhoWTNScGIyNU9ZVzFsTENCallXeHNZbUZqYXlrZ2UxeHVJQ0FnSUdsbUlDZ2hYMnhwYzNSbGJtVnljMXRoWTNScGIyNU9ZVzFsWFNrZ2UxeHVJQ0FnSUNBZ1gyeHBjM1JsYm1WeWMxdGhZM1JwYjI1T1lXMWxYU0E5SUZ0ZE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUY5c2FYTjBaVzVsY25OYllXTjBhVzl1VG1GdFpWMHVjSFZ6YUNoallXeHNZbUZqYXlrN1hHNGdJSDBzWEc1Y2JpQWdibTkwYVdaNVFXeHNPaUJtZFc1amRHbHZiaWhoWTNScGIyNU9ZVzFsTENBdUxpNWhjbWR6S1NCN1hHNGdJQ0FnYkdWMElHTmhiR3hpWVdOcmN5QTlJRjlzYVhOMFpXNWxjbk5iWVdOMGFXOXVUbUZ0WlYwZ2ZId2dXMTA3WEc0Z0lDQWdZMkZzYkdKaFkydHpMbVp2Y2tWaFkyZ29LR05oYkd4aVlXTnJLU0E5UGlCN1hHNGdJQ0FnSUNCallXeHNZbUZqYXk1allXeHNLR05oYkd4aVlXTnJMQ0F1TGk1aGNtZHpLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVmVHRjYmx4dWJHVjBJR0Z3Y0VScGMzQmhZMmhsY2lBOUlHNWxkeUJFYVhOd1lYUmphR1Z5S0NrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHRndjRVJwYzNCaFkyaGxjanNpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9XaW5kb3cgPSByZXF1aXJlKCcvVXNlcnMva2Fyb2wvd29ya3NwYWNlL2thcm9sL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdycpO1xuXG52YXIgX1dpbmRvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9XaW5kb3cpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChfV2luZG93Mi5kZWZhdWx0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbmRvdy1jb250ZW50JykpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltMWhhVzR1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3UVVGRlFTeFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVTmlMREpEUVVGVkxFVkJRMVlzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eERRVU14UXl4RFFVRkRJaXdpWm1sc1pTSTZJbTFoYVc0dWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUxpOXpjbU12YW5Ndklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGZHBibVJ2ZHlCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFkcGJtUnZkeWM3WEc1Y2JsSmxZV04wUkU5TkxuSmxibVJsY2loY2JpQWdQRmRwYm1SdmR5QXZQaXhjYmlBZ1pHOWpkVzFsYm5RdVoyVjBSV3hsYldWdWRFSjVTV1FvSjNkcGJtUnZkeTFqYjI1MFpXNTBKeWxjYmlrN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGF3cyA9IGVsZWN0cm9uUmVxdWlyZSgnLi9hd3MtY29uZmlnLmpzb24nKTtcblxudmFyIEFXUyA9IGVsZWN0cm9uUmVxdWlyZSgnYXdzLXNkaycpO1xuQVdTLmNvbmZpZy51cGRhdGUoYXdzKTtcblxudmFyIGdldEVjMiA9IGZ1bmN0aW9uIGdldEVjMigpIHtcbiAgdmFyIHJlZ2lvbiA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/ICdldS13ZXN0LTEnIDogYXJndW1lbnRzWzBdO1xuXG4gIHJldHVybiBuZXcgQVdTLkVDMih7IHJlZ2lvbjogcmVnaW9uIH0pO1xufTtcblxudmFyIHJlZ2lvbk5hbWVzID0ge1xuICAndXMtZWFzdC0xJzogXCJVUyBFYXN0IChOLiBWaXJnaW5pYSlcIixcbiAgJ3VzLXdlc3QtMic6IFwiVVMgV2VzdCAoT3JlZ29uKVwiLFxuICAndXMtd2VzdC0xJzogXCJVUyBXZXN0IChOLiBDYWxpZm9ybmlhKVwiLFxuICAnZXUtd2VzdC0xJzogXCJFVSAoSXJlbGFuZClcIixcbiAgJ2V1LWNlbnRyYWwtMSc6IFwiRVUgKEZyYW5rZnVydClcIixcbiAgJ2FwLXNvdXRoZWFzdC0xJzogXCJBc2lhIFBhY2lmaWMgKFNpbmdhcG9yZSlcIixcbiAgJ2FwLW5vcnRoZWFzdC0xJzogXCJBc2lhIFBhY2lmaWMgKFRva3lvKVwiLFxuICAnYXAtc291dGhlYXN0LTInOiBcIkFzaWEgUGFjaWZpYyAoU3lkbmV5KVwiLFxuICAnc2EtZWFzdC0xJzogXCJTb3V0aCBBbWVyaWNhIChTw6NvIFBhdWxvKVwiXG59O1xuXG52YXIgZWMySW5zdGFuY2VzID0ge1xuICBmZXRjaEluc3RhbmNlczogZnVuY3Rpb24gZmV0Y2hJbnN0YW5jZXMocmVnaW9uKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICB2YXIgZWMyID0gZ2V0RWMyKHJlZ2lvbik7XG4gICAgICBlYzIuZGVzY3JpYmVJbnN0YW5jZXMoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgdmFyIGluc3RhbmNlcyA9IGRhdGEuUmVzZXJ2YXRpb25zLm1hcChmdW5jdGlvbiAoaW5zdGFuY2VPYmplY3QpIHtcbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZU9iamVjdC5JbnN0YW5jZXNbMF07XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogaW5zdGFuY2UuU3RhdGUuTmFtZSxcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogaW5zdGFuY2UuSW5zdGFuY2VUeXBlLFxuICAgICAgICAgICAga2V5TmFtZTogaW5zdGFuY2UuS2V5TmFtZSxcbiAgICAgICAgICAgIHRhZ3M6IGluc3RhbmNlLlRhZ3MubWFwKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IHRhZy5LZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRhZy5WYWx1ZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBwdWJsaWNJcEFkZHJlc3M6IGluc3RhbmNlLlB1YmxpY0lwQWRkcmVzcyxcbiAgICAgICAgICAgIGlkOiBpbnN0YW5jZS5JbnN0YW5jZUlkXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2VzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIGZldGNoUmVnaW9uczogZnVuY3Rpb24gZmV0Y2hSZWdpb25zKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgdmFyIGVjMiA9IGdldEVjMigpO1xuICAgICAgZWMyLmRlc2NyaWJlUmVnaW9ucyhmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG5cbiAgICAgICAgdmFyIHJlZ2lvbnMgPSBkYXRhLlJlZ2lvbnMubWFwKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgICAgICB2YXIgcmVnaW9uTmFtZSA9IHJlZ2lvbi5SZWdpb25OYW1lO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IHJlZ2lvbk5hbWUsXG4gICAgICAgICAgICBuYW1lOiByZWdpb25OYW1lc1tyZWdpb25OYW1lXSB8fCByZWdpb25OYW1lXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x2ZShyZWdpb25zKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBlYzJJbnN0YW5jZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wak1pNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0QlFVRkJMRWxCUVVrc1IwRkJSeXhIUVVGSExHVkJRV1VzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE96dEJRVVV2UXl4SlFVRkpMRWRCUVVjc1IwRkJSeXhsUVVGbExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEY2tNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWFpDTEVsQlFVa3NUVUZCVFN4SFFVRkhMRk5CUVZRc1RVRkJUU3hIUVVGblF6dE5RVUZ3UWl4TlFVRk5MSGxFUVVGRExGZEJRVmM3TzBGQlEzUkRMRk5CUVU4c1NVRkJTU3hIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkZMRTFCUVUwc1JVRkJReXhEUVVGRExFTkJRVU03UTBGRGRFTXNRMEZCUVRzN1FVRkZSQ3hKUVVGSkxGZEJRVmNzUjBGQlJ6dEJRVU5vUWl4aFFVRlhMRVZCUVVVc2RVSkJRWFZDTzBGQlEzQkRMR0ZCUVZjc1JVRkJSU3hyUWtGQmEwSTdRVUZETDBJc1lVRkJWeXhGUVVGRkxIbENRVUY1UWp0QlFVTjBReXhoUVVGWExFVkJRVVVzWTBGQll6dEJRVU16UWl4blFrRkJZeXhGUVVGRkxHZENRVUZuUWp0QlFVTm9ReXhyUWtGQlowSXNSVUZCUlN3d1FrRkJNRUk3UVVGRE5VTXNhMEpCUVdkQ0xFVkJRVVVzYzBKQlFYTkNPMEZCUTNoRExHdENRVUZuUWl4RlFVRkZMSFZDUVVGMVFqdEJRVU42UXl4aFFVRlhMRVZCUVVVc01rSkJRVEpDTzBOQlEzcERMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVYzdRVUZEYWtJc1owSkJRV01zUlVGQlJTeDNRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkRMMElzVjBGQlR5eEpRVUZKTEU5QlFVOHNRMEZCUXl4VlFVRlRMRTlCUVU4c1JVRkJSVHRCUVVOdVF5eFZRVUZKTEVkQlFVY3NSMEZCUnl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGVrSXNVMEZCUnl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEZWQlFWTXNSMEZCUnl4RlFVRkZMRWxCUVVrc1JVRkJSVHRCUVVONFF5eGxRVUZQTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRMnhDTEZsQlFVa3NVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFVTXNZMEZCWXl4RlFVRkxPMEZCUTNoRUxHTkJRVWtzVVVGQlVTeEhRVUZITEdOQlFXTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE0wTXNhVUpCUVU4N1FVRkRUQ3hyUWtGQlRTeEZRVUZGTEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTVHRCUVVNelFpeDNRa0ZCV1N4RlFVRkZMRkZCUVZFc1EwRkJReXhaUVVGWk8wRkJRMjVETEcxQ1FVRlBMRVZCUVVVc1VVRkJVU3hEUVVGRExFOUJRVTg3UVVGRGVrSXNaMEpCUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkRMRWRCUVVjc1JVRkJTenRCUVVNdlFpeHhRa0ZCVHp0QlFVTk1MRzFDUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEVkQlFVYzdRVUZEV2l4eFFrRkJTeXhGUVVGRkxFZEJRVWNzUTBGQlF5eExRVUZMTzJWQlEycENMRU5CUVVNN1lVRkRTQ3hEUVVGRE8wRkJRMFlzTWtKQlFXVXNSVUZCUlN4UlFVRlJMRU5CUVVNc1pVRkJaVHRCUVVONlF5eGpRVUZGTEVWQlFVVXNVVUZCVVN4RFFVRkRMRlZCUVZVN1YwRkRlRUlzUTBGQlFUdFRRVU5HTEVOQlFVTXNRMEZCUXp0QlFVTklMR1ZCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dFBRVU53UWl4RFFVRkRMRU5CUVVNN1MwRkRTaXhEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4alFVRlpMRVZCUVVVc2QwSkJRVmM3UVVGRGRrSXNWMEZCVHl4SlFVRkpMRTlCUVU4c1EwRkJReXhWUVVGVExFOUJRVThzUlVGQlJUdEJRVU51UXl4VlFVRkpMRWRCUVVjc1IwRkJSeXhOUVVGTkxFVkJRVVVzUTBGQlF6dEJRVU51UWl4VFFVRkhMRU5CUVVNc1pVRkJaU3hEUVVGRExGVkJRVk1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NSVUZCUlRzN1FVRkZkRU1zV1VGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlV5eE5RVUZOTEVWQlFVVTdRVUZET1VNc1kwRkJTU3hWUVVGVkxFZEJRVWNzVFVGQlRTeERRVUZETEZWQlFWVXNRMEZCUXp0QlFVTnVReXhwUWtGQlR6dEJRVU5NTEdWQlFVY3NSVUZCUlN4VlFVRlZPMEZCUTJZc1owSkJRVWtzUlVGQlJTeFhRVUZYTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1ZVRkJWVHRYUVVNMVF5eERRVUZETzFOQlEwZ3NRMEZCUXl4RFFVRkRPenRCUVVWSUxHVkJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0UFFVTnNRaXhEUVVGRExFTkJRVU03UzBGRFNpeERRVUZETEVOQlFVTTdSMEZEU2p0RFFVTkdMRU5CUVVNN08ydENRVVZoTEZsQlFWa2lMQ0ptYVd4bElqb2laV015TG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklteGxkQ0JoZDNNZ1BTQmxiR1ZqZEhKdmJsSmxjWFZwY21Vb0p5NHZZWGR6TFdOdmJtWnBaeTVxYzI5dUp5azdYRzVjYm14bGRDQkJWMU1nUFNCbGJHVmpkSEp2YmxKbGNYVnBjbVVvSjJGM2N5MXpaR3NuS1RzZ1hHNUJWMU11WTI5dVptbG5MblZ3WkdGMFpTaGhkM01wTzF4dVhHNXNaWFFnWjJWMFJXTXlJRDBnWm5WdVkzUnBiMjRvY21WbmFXOXVQU2RsZFMxM1pYTjBMVEVuS1NCN1hHNGdJSEpsZEhWeWJpQnVaWGNnUVZkVExrVkRNaWg3Y21WbmFXOXVPaUJ5WldkcGIyNTlLVHRjYm4xY2JseHViR1YwSUhKbFoybHZiazVoYldWeklEMGdlMXh1SUNBbmRYTXRaV0Z6ZEMweEp6b2dYQ0pWVXlCRllYTjBJQ2hPTGlCV2FYSm5hVzVwWVNsY0lpeGNiaUFnSjNWekxYZGxjM1F0TWljNklGd2lWVk1nVjJWemRDQW9UM0psWjI5dUtWd2lMRnh1SUNBbmRYTXRkMlZ6ZEMweEp6b2dYQ0pWVXlCWFpYTjBJQ2hPTGlCRFlXeHBabTl5Ym1saEtWd2lMRnh1SUNBblpYVXRkMlZ6ZEMweEp6b2dYQ0pGVlNBb1NYSmxiR0Z1WkNsY0lpeGNiaUFnSjJWMUxXTmxiblJ5WVd3dE1TYzZJRndpUlZVZ0tFWnlZVzVyWm5WeWRDbGNJaXhjYmlBZ0oyRndMWE52ZFhSb1pXRnpkQzB4SnpvZ1hDSkJjMmxoSUZCaFkybG1hV01nS0ZOcGJtZGhjRzl5WlNsY0lpeGNiaUFnSjJGd0xXNXZjblJvWldGemRDMHhKem9nWENKQmMybGhJRkJoWTJsbWFXTWdLRlJ2YTNsdktWd2lMRnh1SUNBbllYQXRjMjkxZEdobFlYTjBMVEluT2lCY0lrRnphV0VnVUdGamFXWnBZeUFvVTNsa2JtVjVLVndpTEZ4dUlDQW5jMkV0WldGemRDMHhKem9nWENKVGIzVjBhQ0JCYldWeWFXTmhJQ2hUdzZOdklGQmhkV3h2S1Z3aVhHNTlPMXh1WEc1c1pYUWdaV015U1c1emRHRnVZMlZ6SUQwZ2UxeHVJQ0JtWlhSamFFbHVjM1JoYm1ObGN6b2dablZ1WTNScGIyNG9jbVZuYVc5dUtTQjdYRzRnSUNBZ2NtVjBkWEp1SUc1bGR5QlFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1VcElIdGNiaUFnSUNBZ0lHeGxkQ0JsWXpJZ1BTQm5aWFJGWXpJb2NtVm5hVzl1S1R0Y2JpQWdJQ0FnSUdWak1pNWtaWE5qY21saVpVbHVjM1JoYm1ObGN5aG1kVzVqZEdsdmJpaGxjbklzSUdSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVzYjJjb1pHRjBZU2s3WEc0Z0lDQWdJQ0FnSUd4bGRDQnBibk4wWVc1alpYTWdQU0JrWVhSaExsSmxjMlZ5ZG1GMGFXOXVjeTV0WVhBb0tHbHVjM1JoYm1ObFQySnFaV04wS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnYkdWMElHbHVjM1JoYm1ObElEMGdhVzV6ZEdGdVkyVlBZbXBsWTNRdVNXNXpkR0Z1WTJWeld6QmRPMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnpkR0YwZFhNNklHbHVjM1JoYm1ObExsTjBZWFJsTGs1aGJXVXNYRzRnSUNBZ0lDQWdJQ0FnSUNCcGJuTjBZVzVqWlZSNWNHVTZJR2x1YzNSaGJtTmxMa2x1YzNSaGJtTmxWSGx3WlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJR3RsZVU1aGJXVTZJR2x1YzNSaGJtTmxMa3RsZVU1aGJXVXNYRzRnSUNBZ0lDQWdJQ0FnSUNCMFlXZHpPaUJwYm5OMFlXNWpaUzVVWVdkekxtMWhjQ2dvZEdGbktTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhMlY1T2lCMFlXY3VTMlY1TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGJIVmxPaUIwWVdjdVZtRnNkV1ZjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdmVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2NIVmliR2xqU1hCQlpHUnlaWE56T2lCcGJuTjBZVzVqWlM1UWRXSnNhV05KY0VGa1pISmxjM01zWEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaRG9nYVc1emRHRnVZMlV1U1c1emRHRnVZMlZKWkZ4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0FnSUhKbGMyOXNkbVVvYVc1emRHRnVZMlZ6S1R0Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJR1psZEdOb1VtVm5hVzl1Y3pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUc1bGR5QlFjbTl0YVhObEtHWjFibU4wYVc5dUtISmxjMjlzZG1VcElIdGNiaUFnSUNBZ0lHeGxkQ0JsWXpJZ1BTQm5aWFJGWXpJb0tUdGNiaUFnSUNBZ0lHVmpNaTVrWlhOamNtbGlaVkpsWjJsdmJuTW9ablZ1WTNScGIyNG9aWEp5TENCa1lYUmhLU0I3WEc1Y2JpQWdJQ0FnSUNBZ2JHVjBJSEpsWjJsdmJuTWdQU0JrWVhSaExsSmxaMmx2Ym5NdWJXRndLR1oxYm1OMGFXOXVLSEpsWjJsdmJpa2dlMXh1SUNBZ0lDQWdJQ0FnSUd4bGRDQnlaV2RwYjI1T1lXMWxJRDBnY21WbmFXOXVMbEpsWjJsdmJrNWhiV1U3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3RsZVRvZ2NtVm5hVzl1VG1GdFpTeGNiaUFnSUNBZ0lDQWdJQ0FnSUc1aGJXVTZJSEpsWjJsdmJrNWhiV1Z6VzNKbFoybHZiazVoYldWZElIeDhJSEpsWjJsdmJrNWhiV1ZjYmlBZ0lDQWdJQ0FnSUNCOU8xeHVJQ0FnSUNBZ0lDQjlLVHRjYmx4dUlDQWdJQ0FnSUNCeVpYTnZiSFpsS0hKbFoybHZibk1wTzF4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlNrN1hHNGdJSDFjYm4wN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHVmpNa2x1YzNSaGJtTmxjenNpWFgwPSJdfQ==
