(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/karol/workspace/karol/github/ec2-browser/node_modules/classnames/index.js":[function(require,module,exports){
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

},{}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Ec2Instances.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Table = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/Table');

var _Table2 = _interopRequireDefault(_Table);

var _ec = require('/home/karol/workspace/karol/github/ec2-browser/src/js/services/ec2');

var _ec2 = _interopRequireDefault(_ec);

var _dispatcher = require('/home/karol/workspace/karol/github/ec2-browser/src/js/dispatcher');

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


},{"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Table":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Table.js","/home/karol/workspace/karol/github/ec2-browser/src/js/dispatcher":"/home/karol/workspace/karol/github/ec2-browser/src/js/dispatcher.js","/home/karol/workspace/karol/github/ec2-browser/src/js/services/ec2":"/home/karol/workspace/karol/github/ec2-browser/src/js/services/ec2.js"}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/PageContent.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Ec2Instances = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/Ec2Instances');

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


},{"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Ec2Instances":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Ec2Instances.js"}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Sidebar.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dispatcher = require('/home/karol/workspace/karol/github/ec2-browser/src/js/dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

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
        )
      ),
      regions
    );
  }
});

exports.default = Sidebar;


},{"/home/karol/workspace/karol/github/ec2-browser/src/js/dispatcher":"/home/karol/workspace/karol/github/ec2-browser/src/js/dispatcher.js","classnames":"/home/karol/workspace/karol/github/ec2-browser/node_modules/classnames/index.js"}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Table.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TableHeader = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableContent = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableContent');

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


},{"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableContent":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableContent.js","/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableHeader":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableHeader.js"}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableContent.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ec = require('/home/karol/workspace/karol/github/ec2-browser/src/js/services/ec2');

var _ec2 = _interopRequireDefault(_ec);

var _TableRow = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableRow');

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


},{"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableRow":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableRow.js","/home/karol/workspace/karol/github/ec2-browser/src/js/services/ec2":"/home/karol/workspace/karol/github/ec2-browser/src/js/services/ec2.js"}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableHeader.js":[function(require,module,exports){
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


},{}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/TableRow.js":[function(require,module,exports){
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


},{}],"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Window.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sidebar = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _PageContent = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/PageContent');

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


},{"/home/karol/workspace/karol/github/ec2-browser/src/js/components/PageContent":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/PageContent.js","/home/karol/workspace/karol/github/ec2-browser/src/js/components/Sidebar":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Sidebar.js"}],"/home/karol/workspace/karol/github/ec2-browser/src/js/dispatcher.js":[function(require,module,exports){
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


},{}],"/home/karol/workspace/karol/github/ec2-browser/src/js/main.js":[function(require,module,exports){
'use strict';

var _Window = require('/home/karol/workspace/karol/github/ec2-browser/src/js/components/Window');

var _Window2 = _interopRequireDefault(_Window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ReactDOM.render(React.createElement(_Window2.default, null), document.getElementById('window-content'));


},{"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Window":"/home/karol/workspace/karol/github/ec2-browser/src/js/components/Window.js"}],"/home/karol/workspace/karol/github/ec2-browser/src/js/services/ec2.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var aws = electronRequire('./aws-config.json');

var AWS = electronRequire('aws-sdk');
AWS.config.update(aws);

var ec2Instances = {
  fetchInstances: function fetchInstances() {
    var region = arguments.length <= 0 || arguments[0] === undefined ? 'eu-west-1' : arguments[0];

    return new Promise(function (resolve) {
      var ec2 = new AWS.EC2({ region: region });
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
  }
};

exports.default = ec2Instances;


},{}]},{},["/home/karol/workspace/karol/github/ec2-browser/src/js/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvRWMySW5zdGFuY2VzLmpzIiwiL2hvbWUva2Fyb2wvd29ya3NwYWNlL2thcm9sL2dpdGh1Yi9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9QYWdlQ29udGVudC5qcyIsIi9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvU2lkZWJhci5qcyIsIi9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGUuanMiLCIvaG9tZS9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZ2l0aHViL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlQ29udGVudC5qcyIsIi9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVIZWFkZXIuanMiLCIvaG9tZS9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZ2l0aHViL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlUm93LmpzIiwiL2hvbWUva2Fyb2wvd29ya3NwYWNlL2thcm9sL2dpdGh1Yi9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9XaW5kb3cuanMiLCIvaG9tZS9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZ2l0aHViL2VjMi1icm93c2VyL3NyYy9qcy9kaXNwYXRjaGVyLmpzIiwiL2hvbWUva2Fyb2wvd29ya3NwYWNlL2thcm9sL2dpdGh1Yi9lYzItYnJvd3Nlci9zcmMvanMvbWFpbi5qcyIsIi9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQSxZQUFZLENBQUM7O0FBRWIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFO0VBQzNDLEtBQUssRUFBRSxJQUFJO0FBQ2IsQ0FBQyxDQUFDLENBQUM7O0FBRUgsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7O0FBRS9GLElBQUksT0FBTyxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsb0VBQW9FLENBQUMsQ0FBQzs7QUFFeEYsSUFBSSxJQUFJLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXZDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDOztBQUU5RixJQUFJLFlBQVksR0FBRyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFdkQsU0FBUyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFOztBQUUvRixJQUFJLEdBQUcsR0FBRyxTQUFTLEdBQUcsQ0FBQyxPQUFP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QU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBVSxjQUFjLEVBQUU7VUFDOUQsSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUMzQyxPQUFPO1lBQ0wsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUMzQixZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO1lBQ3pCLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRTtjQUNyQyxPQUFPO2dCQUNMLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDWixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7ZUFDakIsQ0FBQzthQUNILENBQUM7WUFDRixlQUFlLEVBQUUsUUFBUSxDQUFDLGVBQWU7WUFDekMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxVQUFVO1dBQ3hCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDcEIsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0o7QUFDSCxDQUFDLENBQUM7O0FBRUYsT0FBTyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUM7QUFDL0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNSBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuLyogZ2xvYmFsIGRlZmluZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5cdGZ1bmN0aW9uIGNsYXNzTmFtZXMgKCkge1xuXHRcdHZhciBjbGFzc2VzID0gJyc7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3NlcyArPSAnICcgKyBhcmc7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoYXJnVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmcsIGtleSkgJiYgYXJnW2tleV0pIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsga2V5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLnN1YnN0cigxKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gY2xhc3NOYW1lcztcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gcmVnaXN0ZXIgYXMgJ2NsYXNzbmFtZXMnLCBjb25zaXN0ZW50IHdpdGggbnBtIHBhY2thZ2UgbmFtZVxuXHRcdGRlZmluZSgnY2xhc3NuYW1lcycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9UYWJsZSA9IHJlcXVpcmUoJy9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGUnKTtcblxudmFyIF9UYWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZSk7XG5cbnZhciBfZWMgPSByZXF1aXJlKCcvaG9tZS9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZ2l0aHViL2VjMi1icm93c2VyL3NyYy9qcy9zZXJ2aWNlcy9lYzInKTtcblxudmFyIF9lYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lYyk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgdGFnID0gZnVuY3Rpb24gdGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZS50YWdzLmZpbHRlcihmdW5jdGlvbiAodGFnKSB7XG4gICAgICByZXR1cm4gdGFnLmtleSA9PT0gdGFnTmFtZTtcbiAgICB9KVswXS52YWx1ZTtcbiAgfTtcbn07XG5cbnZhciBFYzJJbnN0YW5jZXMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRWMySW5zdGFuY2VzJyxcblxuICBjb2x1bW5zOiBbeyBuYW1lOiBcIklkXCIsIGtleTogJ2lkJyB9LCB7IG5hbWU6IFwiTmFtZVwiLCBrZXk6IHRhZyhcIk5hbWVcIikgfSwgeyBuYW1lOiBcIktleSBuYW1lXCIsIGtleTogJ2tleU5hbWUnIH0sIHsgbmFtZTogXCJJbnN0YW5jZSB0eXBlXCIsIGtleTogJ2luc3RhbmNlVHlwZScgfSwgeyBuYW1lOiBcIlN0YXR1c1wiLCBrZXk6ICdzdGF0dXMnIH1dLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBbXSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICByZWdpb246ICdldS13ZXN0LTEnXG4gICAgfTtcbiAgfSxcblxuICBmZXRjaEluc3RhbmNlczogZnVuY3Rpb24gZmV0Y2hJbnN0YW5jZXMocmVnaW9uKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcztcbiAgICBfZWMyLmRlZmF1bHQuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKS50aGVuKGZ1bmN0aW9uIChpbnN0YW5jZXMpIHtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIGRhdGE6IGluc3RhbmNlcyxcbiAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmZldGNoSW5zdGFuY2VzKHRoaXMuc3RhdGUucmVnaW9uKTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5yZWdpc3RlcigncmVnaW9uJywgKGZ1bmN0aW9uIChyZWdpb24pIHtcbiAgICAgIHRoaXMuZmV0Y2hJbnN0YW5jZXMocmVnaW9uKTtcbiAgICB9KS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBjaGFuZ2VSZWdpb246IGZ1bmN0aW9uIGNoYW5nZVJlZ2lvbihlKSB7XG4gICAgdmFyIHJlZ2lvbiA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVnaW9uOiByZWdpb24sXG4gICAgICBsb2FkaW5nOiB0cnVlXG4gICAgfSk7XG4gICAgdGhpcy5mZXRjaEluc3RhbmNlcyhyZWdpb24pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfVGFibGUyLmRlZmF1bHQsIHsgY29sdW1uczogdGhpcy5jb2x1bW5zLCBkYXRhOiB0aGlzLnN0YXRlLmRhdGEsIGxvYWRpbmc6IHRoaXMuc3RhdGUubG9hZGluZyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBFYzJJbnN0YW5jZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtWak1rbHVjM1JoYm1ObGN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN096czdPenRCUVVsQkxFbEJRVWtzUjBGQlJ5eEhRVUZITEZOQlFVNHNSMEZCUnl4RFFVRlpMRTlCUVU4c1JVRkJSVHRCUVVNeFFpeFRRVUZQTEZWQlFWTXNVVUZCVVN4RlFVRkZPMEZCUTNoQ0xGZEJRVThzVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJReXhIUVVGSExFVkJRVXM3UVVGRGJrTXNZVUZCVHl4SFFVRkhMRU5CUVVNc1IwRkJSeXhMUVVGTExFOUJRVThzUTBGQlF6dExRVU0xUWl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETzBkQlEySXNRMEZCUXp0RFFVTklMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlEyNURMRk5CUVU4c1JVRkJSU3hEUVVOUUxFVkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlN4SFFVRkhMRVZCUVVVc1NVRkJTU3hGUVVGRExFVkJRM1pDTEVWQlFVTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1JVRkJSU3hIUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RlFVRkRMRVZCUTJoRExFVkJRVU1zU1VGQlNTeEZRVUZGTEZWQlFWVXNSVUZCUlN4SFFVRkhMRVZCUVVVc1UwRkJVeXhGUVVGRExFVkJRMnhETEVWQlFVTXNTVUZCU1N4RlFVRkZMR1ZCUVdVc1JVRkJSU3hIUVVGSExFVkJRVVVzWTBGQll5eEZRVUZETEVWQlF6VkRMRVZCUVVNc1NVRkJTU3hGUVVGRkxGRkJRVkVzUlVGQlJTeEhRVUZITEVWQlFVVXNVVUZCVVN4RlFVRkRMRU5CUTJoRE96dEJRVVZFTEdsQ1FVRmxMRVZCUVVVc01rSkJRVmM3UVVGRE1VSXNWMEZCVHp0QlFVTk1MRlZCUVVrc1JVRkJSU3hGUVVGRk8wRkJRMUlzWVVGQlR5eEZRVUZGTEVsQlFVazdRVUZEWWl4WlFVRk5MRVZCUVVVc1YwRkJWenRMUVVOd1FpeERRVUZETzBkQlEwZzdPMEZCUlVRc1owSkJRV01zUlVGQlJTeDNRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkRMMElzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR0ZCUVU4c1JVRkJSU3hKUVVGSk8wdEJRMlFzUTBGQlF5eERRVUZET3p0QlFVVklMRkZCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU55UWl4cFFrRkJTU3hqUVVGakxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVVNc1UwRkJVeXhGUVVGTE8wRkJRemRETEdWQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRha0lzV1VGQlNTeEZRVUZGTEZOQlFWTTdRVUZEWml4bFFVRlBMRVZCUVVVc1MwRkJTenRQUVVObUxFTkJRVU1zUTBGQlF6dExRVU5LTEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTjJReXg1UWtGQlZ5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVFc1ZVRkJVeXhOUVVGTkxFVkJRVVU3UVVGRE4wTXNWVUZCU1N4RFFVRkRMR05CUVdNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dExRVU0zUWl4RFFVRkJMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEWmpzN1FVRkZSQ3hqUVVGWkxFVkJRVVVzYzBKQlFWTXNRMEZCUXl4RlFVRkZPMEZCUTNoQ0xGRkJRVWtzVFVGQlRTeEhRVUZITEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGQk8wRkJRek5DTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRXaXhaUVVGTkxFVkJRVVVzVFVGQlRUdEJRVU5rTEdGQlFVOHNSVUZCUlN4SlFVRkpPMHRCUTJRc1EwRkJReXhEUVVGRE8wRkJRMGdzVVVGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRIUVVNM1FqczdRVUZGUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN08wMUJRMFVzZFVOQlFVOHNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFRkJRVU1zUlVGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFRkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFRkJRVU1zUjBGQlJ6dExRVU5vUml4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmxCUVZraUxDSm1hV3hsSWpvaVJXTXlTVzV6ZEdGdVkyVnpMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWVdKc1pTQm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsSnp0Y2JtbHRjRzl5ZENCbFl6SWdabkp2YlNBbmMyVnlkbWxqWlhNdlpXTXlKenRjYm1sdGNHOXlkQ0JrYVhOd1lYUmphR1Z5SUdaeWIyMGdKMlJwYzNCaGRHTm9aWEluTzF4dVhHNXNaWFFnZEdGbklEMGdablZ1WTNScGIyNG9kR0ZuVG1GdFpTa2dlMXh1SUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRvYVc1emRHRnVZMlVwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdhVzV6ZEdGdVkyVXVkR0ZuY3k1bWFXeDBaWElvS0hSaFp5a2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJoWnk1clpYa2dQVDA5SUhSaFowNWhiV1U3WEc0Z0lDQWdmU2xiTUYwdWRtRnNkV1U3WEc0Z0lIMDdYRzU5TzF4dVhHNXNaWFFnUldNeVNXNXpkR0Z1WTJWeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCamIyeDFiVzV6T2lCYlhHNGdJQ0FnZTI1aGJXVTZJRndpU1dSY0lpd2dhMlY1T2lBbmFXUW5mU3hjYmlBZ0lDQjdibUZ0WlRvZ1hDSk9ZVzFsWENJc0lHdGxlVG9nZEdGbktGd2lUbUZ0WlZ3aUtYMHNYRzRnSUNBZ2UyNWhiV1U2SUZ3aVMyVjVJRzVoYldWY0lpd2dhMlY1T2lBbmEyVjVUbUZ0WlNkOUxGeHVJQ0FnSUh0dVlXMWxPaUJjSWtsdWMzUmhibU5sSUhSNWNHVmNJaXdnYTJWNU9pQW5hVzV6ZEdGdVkyVlVlWEJsSjMwc1hHNGdJQ0FnZTI1aGJXVTZJRndpVTNSaGRIVnpYQ0lzSUd0bGVUb2dKM04wWVhSMWN5ZDlMRnh1SUNCZExGeHVYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR1JoZEdFNklGdGRMRnh1SUNBZ0lDQWdiRzloWkdsdVp6b2dkSEoxWlN4Y2JpQWdJQ0FnSUhKbFoybHZiam9nSjJWMUxYZGxjM1F0TVNkY2JpQWdJQ0I5TzF4dUlDQjlMRnh1WEc0Z0lHWmxkR05vU1c1emRHRnVZMlZ6T2lCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lHeHZZV1JwYm1jNklIUnlkV1ZjYmlBZ0lDQjlLVHRjYmlBZ0lDQmNiaUFnSUNCc1pYUWdZMjl0Y0c5dVpXNTBJRDBnZEdocGN6dGNiaUFnSUNCbFl6SXVabVYwWTJoSmJuTjBZVzVqWlhNb2NtVm5hVzl1S1M1MGFHVnVLQ2hwYm5OMFlXNWpaWE1wSUQwK0lIdGNiaUFnSUNBZ0lHTnZiWEJ2Ym1WdWRDNXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQWdJR1JoZEdFNklHbHVjM1JoYm1ObGN5eGNiaUFnSUNBZ0lDQWdiRzloWkdsdVp6b2dabUZzYzJWY2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJR052YlhCdmJtVnVkRVJwWkUxdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0IwYUdsekxtWmxkR05vU1c1emRHRnVZMlZ6S0hSb2FYTXVjM1JoZEdVdWNtVm5hVzl1S1R0Y2JpQWdJQ0JrYVhOd1lYUmphR1Z5TG5KbFoybHpkR1Z5S0NkeVpXZHBiMjRuTENCbWRXNWpkR2x2YmloeVpXZHBiMjRwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVabVYwWTJoSmJuTjBZVzVqWlhNb2NtVm5hVzl1S1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dVhHNGdJR05vWVc1blpWSmxaMmx2YmpvZ1puVnVZM1JwYjI0b1pTa2dlMXh1SUNBZ0lHeGxkQ0J5WldkcGIyNGdQU0JsTG5SaGNtZGxkQzUyWVd4MVpWeHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdjbVZuYVc5dU9pQnlaV2RwYjI0c1hHNGdJQ0FnSUNCc2IyRmthVzVuT2lCMGNuVmxYRzRnSUNBZ2ZTazdYRzRnSUNBZ2RHaHBjeTVtWlhSamFFbHVjM1JoYm1ObGN5aHlaV2RwYjI0cE8xeHVJQ0I5TEZ4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFkrWEc0Z0lDQWdJQ0FnSUR4VVlXSnNaU0JqYjJ4MWJXNXpQWHQwYUdsekxtTnZiSFZ0Ym5OOUlHUmhkR0U5ZTNSb2FYTXVjM1JoZEdVdVpHRjBZWDBnYkc5aFpHbHVaejE3ZEdocGN5NXpkR0YwWlM1c2IyRmthVzVuZlNBdlBseHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVWak1rbHVjM1JoYm1ObGN6c2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX0VjMkluc3RhbmNlcyA9IHJlcXVpcmUoJy9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvRWMySW5zdGFuY2VzJyk7XG5cbnZhciBfRWMySW5zdGFuY2VzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0VjMkluc3RhbmNlcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBQYWdlQ29udGVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdQYWdlQ29udGVudCcsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KF9FYzJJbnN0YW5jZXMyLmRlZmF1bHQsIG51bGwpXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFBhZ2VDb250ZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsQmhaMlZEYjI1MFpXNTBMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenM3T3p0QlFVVkJMRWxCUVVrc1YwRkJWeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOc1F5eFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdPMDFCUTBVc2FVUkJRV2RDTzB0QlExb3NRMEZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4WFFVRlhJaXdpWm1sc1pTSTZJbEJoWjJWRGIyNTBaVzUwTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWk0dmMzSmpMMnB6THlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCRll6Skpibk4wWVc1alpYTWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OUZZekpKYm5OMFlXNWpaWE1uTzF4dVhHNXNaWFFnVUdGblpVTnZiblJsYm5RZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZK1hHNGdJQ0FnSUNBZ0lEeEZZekpKYm5OMFlXNWpaWE1nTHo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JRWVdkbFEyOXVkR1Z1ZERzaVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGlzcGF0Y2hlciA9IHJlcXVpcmUoJy9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2Rpc3BhdGNoZXInKTtcblxudmFyIF9kaXNwYXRjaGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rpc3BhdGNoZXIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFNpZGViYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2lkZWJhcicsXG5cbiAgcmVnaW9uczogW3tcbiAgICBrZXk6ICdldS13ZXN0LTEnLFxuICAgIG5hbWU6IFwiRVUgKElyZWxhbmQpXCJcbiAgfSwge1xuICAgIGtleTogJ3VzLXdlc3QtMicsXG4gICAgbmFtZTogXCJVUyBXZXN0IChOLiBDYXJvbGluYSlcIlxuICB9XSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVnaW9uOiAnZXUtd2VzdC0xJ1xuICAgIH07XG4gIH0sXG5cbiAgcmVnaW9uU2VsZWN0ZWQ6IGZ1bmN0aW9uIHJlZ2lvblNlbGVjdGVkKHJlZ2lvbikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVnaW9uOiByZWdpb25cbiAgICB9KTtcbiAgICBfZGlzcGF0Y2hlcjIuZGVmYXVsdC5ub3RpZnlBbGwoJ3JlZ2lvbicsIHJlZ2lvbik7XG4gIH0sXG5cbiAgaXNBY3RpdmU6IGZ1bmN0aW9uIGlzQWN0aXZlKHJlZ2lvbikge1xuICAgIGlmIChyZWdpb24gPT09IHRoaXMuc3RhdGUucmVnaW9uKSB7XG4gICAgICByZXR1cm4gXCJhY3RpdmVcIjtcbiAgICB9O1xuICAgIHJldHVybiBcIlwiO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcmVnaW9ucyA9IHRoaXMucmVnaW9ucy5tYXAoZnVuY3Rpb24gKHJlZ2lvbikge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsaScsXG4gICAgICAgIHsga2V5OiByZWdpb24ua2V5LFxuICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lcyhcImxpc3QtZ3JvdXAtaXRlbVwiLCBfdGhpcy5pc0FjdGl2ZShyZWdpb24ua2V5KSksXG4gICAgICAgICAgb25DbGljazogX3RoaXMucmVnaW9uU2VsZWN0ZWQuYmluZChfdGhpcywgcmVnaW9uLmtleSkgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW1nJywgeyBjbGFzc05hbWU6ICdpbWctY2lyY2xlIG1lZGlhLW9iamVjdCBwdWxsLWxlZnQnLCBzcmM6ICdodHRwOi8vbWVkaWEuYW1hem9ud2Vic2VydmljZXMuY29tL2F3c19zaW5nbGVib3hfMDEucG5nJywgd2lkdGg6ICczMicsIGhlaWdodDogJzMyJyB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lZGlhLWJvZHknIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHJlZ2lvbi5uYW1lXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICcwIHJ1bm5pbmcnXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3VsJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1ncm91cCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsaScsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1ncm91cC1oZWFkZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2g0JyxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgICdSZWdpb25zJ1xuICAgICAgICApXG4gICAgICApLFxuICAgICAgcmVnaW9uc1xuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBTaWRlYmFyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsTnBaR1ZpWVhJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN096czdPMEZCUTBFc1NVRkJTU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWMlF5eEpRVUZKTEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZET1VJc1UwRkJUeXhGUVVGRkxFTkJRVU03UVVGRFVpeFBRVUZITEVWQlFVVXNWMEZCVnp0QlFVTm9RaXhSUVVGSkxFVkJRVVVzWTBGQll6dEhRVU55UWl4RlFVRkZPMEZCUTBRc1QwRkJSeXhGUVVGRkxGZEJRVmM3UVVGRGFFSXNVVUZCU1N4RlFVRkZMSFZDUVVGMVFqdEhRVU01UWl4RFFVRkRPenRCUVVWR0xHbENRVUZsTEVWQlFVVXNNa0pCUVZjN1FVRkRNVUlzVjBGQlR6dEJRVU5NTEZsQlFVMHNSVUZCUlN4WFFVRlhPMHRCUTNCQ0xFTkJRVU03UjBGRFNEczdRVUZGUkN4blFrRkJZeXhGUVVGRkxIZENRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTXZRaXhSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NXVUZCVFN4RlFVRkZMRTFCUVUwN1MwRkRaaXhEUVVGRExFTkJRVU03UVVGRFNDeDVRa0ZCVnl4VFFVRlRMRU5CUVVNc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBkQlEzaERPenRCUVVWRUxGVkJRVkVzUlVGQlJTeHJRa0ZCVXl4TlFVRk5MRVZCUVVVN1FVRkRla0lzVVVGQlNTeE5RVUZOTEV0QlFVc3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGFFTXNZVUZCVHl4UlFVRlJMRU5CUVVFN1MwRkRhRUlzUTBGQlF6dEJRVU5HTEZkQlFVOHNSVUZCUlN4RFFVRkRPMGRCUTFnN08wRkJSVVFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPenM3UVVGRGFrSXNVVUZCU1N4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUXl4TlFVRk5MRVZCUVVzN1FVRkRla01zWVVGRFJUczdWVUZCU1N4SFFVRkhMRVZCUVVVc1RVRkJUU3hEUVVGRExFZEJRVWNzUVVGQlF6dEJRVU5vUWl4dFFrRkJVeXhGUVVGRkxGVkJRVlVzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSU3hOUVVGTExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1FVRkJRenRCUVVOd1JTeHBRa0ZCVHl4RlFVRkZMRTFCUVVzc1kwRkJZeXhEUVVGRExFbEJRVWtzVVVGQlR5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRUZCUVVNN1VVRkRkRVFzTmtKQlFVc3NVMEZCVXl4RlFVRkRMRzFEUVVGdFF5eEZRVUZETEVkQlFVY3NSVUZCUXl4NVJFRkJlVVFzUlVGQlF5eExRVUZMTEVWQlFVTXNTVUZCU1N4RlFVRkRMRTFCUVUwc1JVRkJReXhKUVVGSkxFZEJRVWM3VVVGRE1VazdPMWxCUVVzc1UwRkJVeXhGUVVGRExGbEJRVms3VlVGRGVrSTdPenRaUVVGVExFMUJRVTBzUTBGQlF5eEpRVUZKTzFkQlFWVTdWVUZET1VJN096czdWMEZCWjBJN1UwRkRXanRQUVVOSUxFTkJRMHc3UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVTkZPenRSUVVGSkxGTkJRVk1zUlVGQlF5eFpRVUZaTzAxQlEzaENPenRWUVVGSkxGTkJRVk1zUlVGQlF5eHRRa0ZCYlVJN1VVRkRMMEk3T3pzN1UwRkJaMEk3VDBGRFlqdE5RVU5LTEU5QlFVODdTMEZEVEN4RFFVTk1PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRTlCUVU4aUxDSm1hV3hsSWpvaVUybGtaV0poY2k1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdUwzTnlZeTlxY3k4aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1pHbHpjR0YwWTJobGNpQm1jbTl0SUNka2FYTndZWFJqYUdWeUp6dGNibXhsZENCamJHRnpjMDVoYldWeklEMGdjbVZ4ZFdseVpTZ25ZMnhoYzNOdVlXMWxjeWNwTzF4dVhHNXNaWFFnVTJsa1pXSmhjaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZuYVc5dWN6b2dXM3RjYmlBZ0lDQnJaWGs2SUNkbGRTMTNaWE4wTFRFbkxGeHVJQ0FnSUc1aGJXVTZJRndpUlZVZ0tFbHlaV3hoYm1RcFhDSmNiaUFnZlN3Z2UxeHVJQ0FnSUd0bGVUb2dKM1Z6TFhkbGMzUXRNaWNzWEc0Z0lDQWdibUZ0WlRvZ1hDSlZVeUJYWlhOMElDaE9MaUJEWVhKdmJHbHVZU2xjSWx4dUlDQjlYU3hjYmx4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNCeVpXZHBiMjQ2SUNkbGRTMTNaWE4wTFRFblhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmx4dUlDQnlaV2RwYjI1VFpXeGxZM1JsWkRvZ1puVnVZM1JwYjI0b2NtVm5hVzl1S1NCN1hHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQnlaV2RwYjI0NklISmxaMmx2Ymx4dUlDQWdJSDBwTzF4dUlDQWdJR1JwYzNCaGRHTm9aWEl1Ym05MGFXWjVRV3hzS0NkeVpXZHBiMjRuTENCeVpXZHBiMjRwTzF4dUlDQjlMRnh1WEc0Z0lHbHpRV04wYVhabE9pQm1kVzVqZEdsdmJpaHlaV2RwYjI0cElIdGNiaUFnSUNCcFppQW9jbVZuYVc5dUlEMDlQU0IwYUdsekxuTjBZWFJsTG5KbFoybHZiaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRndpWVdOMGFYWmxYQ0pjYmlBZ0lDQjlPMXh1SUNBZ0lISmxkSFZ5YmlCY0lsd2lPMXh1SUNCOUxGeHVYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnYkdWMElISmxaMmx2Ym5NZ1BTQjBhR2x6TG5KbFoybHZibk11YldGd0tDaHlaV2RwYjI0cElEMCtJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHhzYVNCclpYazllM0psWjJsdmJpNXJaWGw5SUZ4dUlDQWdJQ0FnSUNBZ0lDQWdZMnhoYzNOT1lXMWxQWHRqYkdGemMwNWhiV1Z6S0Z3aWJHbHpkQzFuY205MWNDMXBkR1Z0WENJc0lIUm9hWE11YVhOQlkzUnBkbVVvY21WbmFXOXVMbXRsZVNrcGZTQmNiaUFnSUNBZ0lDQWdJQ0FnSUc5dVEyeHBZMnM5ZTNSb2FYTXVjbVZuYVc5dVUyVnNaV04wWldRdVltbHVaQ2gwYUdsekxDQnlaV2RwYjI0dWEyVjVLWDArWEc0Z0lDQWdJQ0FnSUNBZ1BHbHRaeUJqYkdGemMwNWhiV1U5WENKcGJXY3RZMmx5WTJ4bElHMWxaR2xoTFc5aWFtVmpkQ0J3ZFd4c0xXeGxablJjSWlCemNtTTlYQ0pvZEhSd09pOHZiV1ZrYVdFdVlXMWhlbTl1ZDJWaWMyVnlkbWxqWlhNdVkyOXRMMkYzYzE5emFXNW5iR1ZpYjNoZk1ERXVjRzVuWENJZ2QybGtkR2c5WENJek1sd2lJR2hsYVdkb2REMWNJak15WENJZ0x6NWNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbTFsWkdsaExXSnZaSGxjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHh6ZEhKdmJtYytlM0psWjJsdmJpNXVZVzFsZlR3dmMzUnliMjVuUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQSEErTUNCeWRXNXVhVzVuUEM5d1BseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ0lDQThMMnhwUGx4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0I5S1R0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0WjNKdmRYQmNJajVjYmlBZ0lDQWdJQ0FnUEd4cElHTnNZWE56VG1GdFpUMWNJbXhwYzNRdFozSnZkWEF0YUdWaFpHVnlYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BHZzBQbEpsWjJsdmJuTThMMmcwUGx4dUlDQWdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDQWdJQ0I3Y21WbmFXOXVjMzFjYmlBZ0lDQWdJRHd2ZFd3K1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElGTnBaR1ZpWVhJN0lsMTkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfVGFibGVIZWFkZXIgPSByZXF1aXJlKCcvaG9tZS9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZ2l0aHViL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1RhYmxlSGVhZGVyJyk7XG5cbnZhciBfVGFibGVIZWFkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVGFibGVIZWFkZXIpO1xuXG52YXIgX1RhYmxlQ29udGVudCA9IHJlcXVpcmUoJy9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVDb250ZW50Jyk7XG5cbnZhciBfVGFibGVDb250ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1RhYmxlQ29udGVudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdUYWJsZScsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAndGFibGUnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlSGVhZGVyMi5kZWZhdWx0LCB7IGNvbHVtbnM6IHRoaXMucHJvcHMuY29sdW1ucyB9KSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlQ29udGVudDIuZGVmYXVsdCwgeyBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICAgIGNvbHVtbnM6IHRoaXMucHJvcHMuY29sdW1ucyxcbiAgICAgICAgbG9hZGluZzogdGhpcy5wcm9wcy5sb2FkaW5nIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklsUmhZbXhsTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN096czdPenM3UVVGSFFTeEpRVUZKTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETlVJc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN096dE5RVU5GTERaRFFVRmhMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4SFFVRkhPMDFCUXpWRExEaERRVUZqTEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUVVGQlF6dEJRVU4wUWl4bFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVGQlFVTTdRVUZETlVJc1pVRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4QlFVRkRMRWRCUVVVN1MwRkRkRU1zUTBGRFVqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeExRVUZMSWl3aVptbHNaU0k2SWxSaFlteGxMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JVWVdKc1pVaGxZV1JsY2lCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFSaFlteGxTR1ZoWkdWeUp6dGNibWx0Y0c5eWRDQlVZV0pzWlVOdmJuUmxiblFnWm5KdmJTQW5ZMjl0Y0c5dVpXNTBjeTlVWVdKc1pVTnZiblJsYm5Rbk8xeHVYRzVzWlhRZ1ZHRmliR1VnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBZV0pzWlQ1Y2JpQWdJQ0FnSUNBZ1BGUmhZbXhsU0dWaFpHVnlJR052YkhWdGJuTTllM1JvYVhNdWNISnZjSE11WTI5c2RXMXVjMzBnTHo1Y2JpQWdJQ0FnSUNBZ1BGUmhZbXhsUTI5dWRHVnVkQ0JrWVhSaFBYdDBhR2x6TG5CeWIzQnpMbVJoZEdGOUlGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOdmJIVnRibk05ZTNSb2FYTXVjSEp2Y0hNdVkyOXNkVzF1YzMxY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzYjJGa2FXNW5QWHQwYUdsekxuQnliM0J6TG14dllXUnBibWQ5THo1Y2JpQWdJQ0FnSUR3dmRHRmliR1UrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUZSaFlteGxPeUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9lYyA9IHJlcXVpcmUoJy9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL3NlcnZpY2VzL2VjMicpO1xuXG52YXIgX2VjMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2VjKTtcblxudmFyIF9UYWJsZVJvdyA9IHJlcXVpcmUoJy9ob21lL2thcm9sL3dvcmtzcGFjZS9rYXJvbC9naXRodWIvZWMyLWJyb3dzZXIvc3JjL2pzL2NvbXBvbmVudHMvVGFibGVSb3cnKTtcblxudmFyIF9UYWJsZVJvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UYWJsZVJvdyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBUYWJsZUNvbnRlbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVGFibGVDb250ZW50JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGluc3RhbmNlc1Jvd3MgPSB0aGlzLnByb3BzLmRhdGEubWFwKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1RhYmxlUm93Mi5kZWZhdWx0LCB7IGtleTogaW5zdGFuY2UuaWQsIGluc3RhbmNlOiBpbnN0YW5jZSwgY29sdW1uczogX3RoaXMucHJvcHMuY29sdW1ucyB9KTtcbiAgICB9KTtcbiAgICB2YXIgZW1wdHlSb3cgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNvbFNwYW46ICc0JyB9LFxuICAgICAgICAnTm8gcmVzdWx0cyB5ZXQuJ1xuICAgICAgKVxuICAgICk7XG4gICAgdmFyIGxvYWRpbmcgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNvbFNwYW46ICc0JyB9LFxuICAgICAgICAnTG9hZGluZy4uLidcbiAgICAgIClcbiAgICApO1xuICAgIHZhciBib2R5ID0gdGhpcy5wcm9wcy5sb2FkaW5nID8gbG9hZGluZyA6IGluc3RhbmNlc1Jvd3MubGVuZ3RoID8gaW5zdGFuY2VzUm93cyA6IGVtcHR5Um93O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3Rib2R5JyxcbiAgICAgIG51bGwsXG4gICAgICBib2R5XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRhYmxlQ29udGVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFEyOXVkR1Z1ZEM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3TzBGQlIwRXNTVUZCU1N4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTI1RExGRkJRVTBzUlVGQlJTeHJRa0ZCVnpzN08wRkJRMnBDTEZGQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRkRMRkZCUVZFc1JVRkJTenRCUVVOd1JDeGhRVU5GTERCRFFVRlZMRWRCUVVjc1JVRkJSU3hSUVVGUkxFTkJRVU1zUlVGQlJTeEJRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkZMRkZCUVZFc1FVRkJReXhGUVVGRExFOUJRVThzUlVGQlJTeE5RVUZMTEV0QlFVc3NRMEZCUXl4UFFVRlBMRUZCUVVNc1IwRkJSeXhEUVVNdlJUdExRVU5JTEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVrc1VVRkJVU3hIUVVOV096czdUVUZEUlRzN1ZVRkJTU3hQUVVGUExFVkJRVU1zUjBGQlJ6czdUMEZCY1VJN1MwRkRha01zUVVGRFRpeERRVUZETzBGQlEwWXNVVUZCU1N4UFFVRlBMRWRCUTFRN096dE5RVU5GT3p0VlFVRkpMRTlCUVU4c1JVRkJReXhIUVVGSE96dFBRVUZuUWp0TFFVTTFRaXhCUVVOT0xFTkJRVU03UVVGRFJpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVkQlFVY3NZVUZCWVN4RFFVRkRMRTFCUVUwc1IwRkJSeXhoUVVGaExFZEJRVWNzVVVGQlVTeERRVUZETzBGQlF6RkdMRmRCUTBVN096dE5RVU5ITEVsQlFVazdTMEZEUXl4RFFVTlNPMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzJ0Q1FVVlpMRmxCUVZraUxDSm1hV3hsSWpvaVZHRmliR1ZEYjI1MFpXNTBMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1sdGNHOXlkQ0JsWXpJZ1puSnZiU0FuYzJWeWRtbGpaWE12WldNeUp6dGNibWx0Y0c5eWRDQlVZV0pzWlZKdmR5Qm1jbTl0SUNkamIyMXdiMjVsYm5SekwxUmhZbXhsVW05M0p6dGNibHh1YkdWMElGUmhZbXhsUTI5dWRHVnVkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYVc1emRHRnVZMlZ6VW05M2N5QTlJSFJvYVhNdWNISnZjSE11WkdGMFlTNXRZWEFvS0dsdWMzUmhibU5sS1NBOVBpQjdYRzRnSUNBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0lDQThWR0ZpYkdWU2IzY2dhMlY1UFh0cGJuTjBZVzVqWlM1cFpIMGdhVzV6ZEdGdVkyVTllMmx1YzNSaGJtTmxmU0JqYjJ4MWJXNXpQWHQwYUdsekxuQnliM0J6TG1OdmJIVnRibk45SUM4K1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUd4bGRDQmxiWEIwZVZKdmR5QTlJQ2hjYmlBZ0lDQWdJRHgwY2o1Y2JpQWdJQ0FnSUNBZ1BIUmtJR052YkZOd1lXNDlYQ0kwWENJK1RtOGdjbVZ6ZFd4MGN5QjVaWFF1UEM5MFpENWNiaUFnSUNBZ0lEd3ZkSEkrWEc0Z0lDQWdLVHRjYmlBZ0lDQnNaWFFnYkc5aFpHbHVaeUE5SUNoY2JpQWdJQ0FnSUR4MGNqNWNiaUFnSUNBZ0lDQWdQSFJrSUdOdmJGTndZVzQ5WENJMFhDSStURzloWkdsdVp5NHVMand2ZEdRK1hHNGdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDazdYRzRnSUNBZ2JHVjBJR0p2WkhrZ1BTQjBhR2x6TG5CeWIzQnpMbXh2WVdScGJtY2dQeUJzYjJGa2FXNW5JRG9nYVc1emRHRnVZMlZ6VW05M2N5NXNaVzVuZEdnZ1B5QnBibk4wWVc1alpYTlNiM2R6SURvZ1pXMXdkSGxTYjNjN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwWW05a2VUNWNiaUFnSUNBZ0lDQWdlMkp2WkhsOVhHNGdJQ0FnSUNBOEwzUmliMlI1UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCVVlXSnNaVU52Ym5SbGJuUTdYRzRpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIFRhYmxlSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogXCJUYWJsZUhlYWRlclwiLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBoZWFkZXJzID0gdGhpcy5wcm9wcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoY29sdW1uLCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidGhcIixcbiAgICAgICAgeyBrZXk6IGluZGV4IH0sXG4gICAgICAgIGNvbHVtbi5uYW1lXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgXCJ0aGVhZFwiLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFwidHJcIixcbiAgICAgICAgbnVsbCxcbiAgICAgICAgaGVhZGVyc1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZUhlYWRlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFNHVmhaR1Z5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUVVFc1NVRkJTU3hYUVVGWExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRMnhETEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUXl4TlFVRk5MRVZCUVVVc1MwRkJTeXhGUVVGTE8wRkJRM1JFTEdGQlEwVTdPMVZCUVVrc1IwRkJSeXhGUVVGRkxFdEJRVXNzUVVGQlF6dFJRVUZGTEUxQlFVMHNRMEZCUXl4SlFVRkpPMDlCUVUwc1EwRkRiRU03UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVTkZPenM3VFVGRFJUczdPMUZCUTBjc1QwRkJUenRQUVVOTU8wdEJRME1zUTBGRFVqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRyUWtGRldTeFhRVUZYSWl3aVptbHNaU0k2SWxSaFlteGxTR1ZoWkdWeUxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbXhsZENCVVlXSnNaVWhsWVdSbGNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdhR1ZoWkdWeWN5QTlJSFJvYVhNdWNISnZjSE11WTI5c2RXMXVjeTV0WVhBb0tHTnZiSFZ0Yml3Z2FXNWtaWGdwSUQwK0lIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeDBhQ0JyWlhrOWUybHVaR1Y0ZlQ1N1kyOXNkVzF1TG01aGJXVjlQQzkwYUQ1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlNrN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHgwYUdWaFpENWNiaUFnSUNBZ0lDQWdQSFJ5UGx4dUlDQWdJQ0FnSUNBZ0lIdG9aV0ZrWlhKemZWeHVJQ0FnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ0FnUEM5MGFHVmhaRDVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dVpYaHdiM0owSUdSbFptRjFiSFFnVkdGaWJHVklaV0ZrWlhJN0lsMTkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBUYWJsZVJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6IFwiVGFibGVSb3dcIixcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLnByb3BzLmluc3RhbmNlO1xuICAgIHZhciBjb2x1bW5zID0gdGhpcy5wcm9wcy5jb2x1bW5zLm1hcChmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICB2YXIga2V5ID0gY29sdW1uLmtleTtcbiAgICAgIHZhciB2YWx1ZSA9IHR5cGVvZiBrZXkgPT09IFwiZnVuY3Rpb25cIiA/IGtleShpbnN0YW5jZSkgOiBpbnN0YW5jZVtrZXldO1xuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgXCJ0ZFwiLFxuICAgICAgICB7IGtleTogdmFsdWUgfSxcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBcInRyXCIsXG4gICAgICBudWxsLFxuICAgICAgY29sdW1uc1xuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZVJvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbFJoWW14bFVtOTNMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJRVUVzU1VGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF5OUNMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnVReXhSUVVGSkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlF5eE5RVUZOTEVWQlFVczdRVUZETDBNc1ZVRkJTU3hIUVVGSExFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXp0QlFVTnlRaXhWUVVGSkxFdEJRVXNzUjBGQlJ5eEJRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRlZCUVZVc1IwRkJTU3hIUVVGSExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NVVUZCVVN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVY0UlN4aFFVTkZPenRWUVVGSkxFZEJRVWNzUlVGQlJTeExRVUZMTEVGQlFVTTdVVUZCUlN4TFFVRkxPMDlCUVUwc1EwRkROVUk3UzBGRFNDeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVTkZPenM3VFVGRFJ5eFBRVUZQTzB0QlEwd3NRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dHJRa0ZGV1N4UlFVRlJJaXdpWm1sc1pTSTZJbFJoWW14bFVtOTNMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaTR2YzNKakwycHpMeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW14bGRDQlVZV0pzWlZKdmR5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdhVzV6ZEdGdVkyVWdQU0IwYUdsekxuQnliM0J6TG1sdWMzUmhibU5sTzF4dUlDQWdJR3hsZENCamIyeDFiVzV6SUQwZ2RHaHBjeTV3Y205d2N5NWpiMngxYlc1ekxtMWhjQ2dvWTI5c2RXMXVLU0E5UGlCN1hHNGdJQ0FnSUNCc1pYUWdhMlY1SUQwZ1kyOXNkVzF1TG10bGVUdGNiaUFnSUNBZ0lHeGxkQ0IyWVd4MVpTQTlJQ2gwZVhCbGIyWWdhMlY1SUQwOVBTQmNJbVoxYm1OMGFXOXVYQ0lwSUQ4Z2EyVjVLR2x1YzNSaGJtTmxLU0E2SUdsdWMzUmhibU5sVzJ0bGVWMDdYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJRHgwWkNCclpYazllM1poYkhWbGZUNTdkbUZzZFdWOVBDOTBaRDVjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmU2s3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeDBjajVjYmlBZ0lDQWdJQ0FnZTJOdmJIVnRibk45WEc0Z0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQlVZV0pzWlZKdmR6c2lYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1NpZGViYXIgPSByZXF1aXJlKCcvaG9tZS9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZ2l0aHViL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1NpZGViYXInKTtcblxudmFyIF9TaWRlYmFyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1NpZGViYXIpO1xuXG52YXIgX1BhZ2VDb250ZW50ID0gcmVxdWlyZSgnL2hvbWUva2Fyb2wvd29ya3NwYWNlL2thcm9sL2dpdGh1Yi9lYzItYnJvd3Nlci9zcmMvanMvY29tcG9uZW50cy9QYWdlQ29udGVudCcpO1xuXG52YXIgX1BhZ2VDb250ZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1BhZ2VDb250ZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFdpbmRvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdXaW5kb3cnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ3BhbmUtZ3JvdXAnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdwYW5lLXNtIHNpZGViYXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoX1NpZGViYXIyLmRlZmF1bHQsIG51bGwpXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAncGFuZScgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChfUGFnZUNvbnRlbnQyLmRlZmF1bHQsIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFdpbmRvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbGRwYm1SdmR5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3T3pzN08wRkJSMEVzU1VGQlNTeE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlJUZENMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenRSUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzAxQlEzcENPenRWUVVGTExGTkJRVk1zUlVGQlF5eHBRa0ZCYVVJN1VVRkRPVUlzTkVOQlFWYzdUMEZEVUR0TlFVTk9PenRWUVVGTExGTkJRVk1zUlVGQlF5eE5RVUZOTzFGQlEyNUNMR2RFUVVGbE8wOUJRMWc3UzBGRFJpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08ydENRVVZaTEUxQlFVMGlMQ0ptYVd4bElqb2lWMmx1Wkc5M0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpNHZjM0pqTDJwekx5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQlRhV1JsWW1GeUlHWnliMjBnSjJOdmJYQnZibVZ1ZEhNdlUybGtaV0poY2ljN1hHNXBiWEJ2Y25RZ1VHRm5aVU52Ym5SbGJuUWdabkp2YlNBblkyOXRjRzl1Wlc1MGN5OVFZV2RsUTI5dWRHVnVkQ2M3SUZ4dVhHNXNaWFFnVjJsdVpHOTNJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWNHRnVaUzFuY205MWNGd2lQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJoYm1VdGMyMGdjMmxrWldKaGNsd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4VGFXUmxZbUZ5SUM4K1hHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CaGJtVmNJajVjYmlBZ0lDQWdJQ0FnSUNBOFVHRm5aVU52Ym5SbGJuUWdMejVjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHVaWGh3YjNKMElHUmxabUYxYkhRZ1YybHVaRzkzT3lKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbnZhciBfbGlzdGVuZXJzID0ge307XG5cbnZhciBEaXNwYXRjaGVyID0gZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHt9O1xuRGlzcGF0Y2hlci5wcm90b3R5cGUgPSB7XG5cbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyKGFjdGlvbk5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFfbGlzdGVuZXJzW2FjdGlvbk5hbWVdKSB7XG4gICAgICBfbGlzdGVuZXJzW2FjdGlvbk5hbWVdID0gW107XG4gICAgfVxuXG4gICAgX2xpc3RlbmVyc1thY3Rpb25OYW1lXS5wdXNoKGNhbGxiYWNrKTtcbiAgfSxcblxuICBub3RpZnlBbGw6IGZ1bmN0aW9uIG5vdGlmeUFsbChhY3Rpb25OYW1lKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgY2FsbGJhY2tzID0gX2xpc3RlbmVyc1thY3Rpb25OYW1lXSB8fCBbXTtcbiAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwuYXBwbHkoY2FsbGJhY2ssIFtjYWxsYmFja10uY29uY2F0KGFyZ3MpKTtcbiAgICB9KTtcbiAgfVxufTtcblxudmFyIGFwcERpc3BhY2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGFwcERpc3BhY2hlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVJwYzNCaGRHTm9aWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdRVUZCUVN4SlFVRkpMRlZCUVZVc1IwRkJSeXhGUVVGRkxFTkJRVU03TzBGQlJYQkNMRWxCUVVrc1ZVRkJWU3hIUVVGSExGTkJRV0lzVlVGQlZTeEhRVUZqTEVWQlFVVXNRMEZCUXp0QlFVTXZRaXhWUVVGVkxFTkJRVU1zVTBGQlV5eEhRVUZIT3p0QlFVVnlRaXhWUVVGUkxFVkJRVVVzYTBKQlFWTXNWVUZCVlN4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVOMlF5eFJRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhGUVVGRk8wRkJRek5DTEdkQ1FVRlZMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzB0QlF6ZENPenRCUVVWRUxHTkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UjBGRGRrTTdPMEZCUlVRc1YwRkJVeXhGUVVGRkxHMUNRVUZUTEZWQlFWVXNSVUZCVnp0elEwRkJUaXhKUVVGSk8wRkJRVW9zVlVGQlNUczdPMEZCUTNKRExGRkJRVWtzVTBGQlV5eEhRVUZITEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRE4wTXNZVUZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGRExGRkJRVkVzUlVGQlN6dEJRVU01UWl4alFVRlJMRU5CUVVNc1NVRkJTU3hOUVVGQkxFTkJRV0lzVVVGQlVTeEhRVUZOTEZGQlFWRXNVMEZCU3l4SlFVRkpMRVZCUVVNc1EwRkJRenRMUVVOc1F5eERRVUZETEVOQlFVTTdSMEZEU2p0RFFVTkdMRU5CUVVNN08wRkJSVVlzU1VGQlNTeFpRVUZaTEVkQlFVY3NTVUZCU1N4VlFVRlZMRVZCUVVVc1EwRkJRenM3YTBKQlJYSkNMRmxCUVZraUxDSm1hV3hsSWpvaVpHbHpjR0YwWTJobGNpNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSXVMM055WXk5cWN5OGlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpzWlhRZ1gyeHBjM1JsYm1WeWN5QTlJSHQ5TzF4dVhHNXNaWFFnUkdsemNHRjBZMmhsY2lBOUlHWjFibU4wYVc5dUtDa2dlMzA3WEc1RWFYTndZWFJqYUdWeUxuQnliM1J2ZEhsd1pTQTlJSHRjYmlBZ1hHNGdJSEpsWjJsemRHVnlPaUJtZFc1amRHbHZiaWhoWTNScGIyNU9ZVzFsTENCallXeHNZbUZqYXlrZ2UxeHVJQ0FnSUdsbUlDZ2hYMnhwYzNSbGJtVnljMXRoWTNScGIyNU9ZVzFsWFNrZ2UxeHVJQ0FnSUNBZ1gyeHBjM1JsYm1WeWMxdGhZM1JwYjI1T1lXMWxYU0E5SUZ0ZE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUY5c2FYTjBaVzVsY25OYllXTjBhVzl1VG1GdFpWMHVjSFZ6YUNoallXeHNZbUZqYXlrN1hHNGdJSDBzWEc1Y2JpQWdibTkwYVdaNVFXeHNPaUJtZFc1amRHbHZiaWhoWTNScGIyNU9ZVzFsTENBdUxpNWhjbWR6S1NCN1hHNGdJQ0FnYkdWMElHTmhiR3hpWVdOcmN5QTlJRjlzYVhOMFpXNWxjbk5iWVdOMGFXOXVUbUZ0WlYwZ2ZId2dXMTA3WEc0Z0lDQWdZMkZzYkdKaFkydHpMbVp2Y2tWaFkyZ29LR05oYkd4aVlXTnJLU0E5UGlCN1hHNGdJQ0FnSUNCallXeHNZbUZqYXk1allXeHNLR05oYkd4aVlXTnJMQ0F1TGk1aGNtZHpLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVmVHRjYmx4dWJHVjBJR0Z3Y0VScGMzQmhZMmhsY2lBOUlHNWxkeUJFYVhOd1lYUmphR1Z5S0NrN1hHNWNibVY0Y0c5eWRDQmtaV1poZFd4MElHRndjRVJwYzNCaFkyaGxjanNpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9XaW5kb3cgPSByZXF1aXJlKCcvaG9tZS9rYXJvbC93b3Jrc3BhY2Uva2Fyb2wvZ2l0aHViL2VjMi1icm93c2VyL3NyYy9qcy9jb21wb25lbnRzL1dpbmRvdycpO1xuXG52YXIgX1dpbmRvdzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9XaW5kb3cpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChfV2luZG93Mi5kZWZhdWx0LCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbmRvdy1jb250ZW50JykpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltMWhhVzR1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3UVVGRlFTeFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVTmlMREpEUVVGVkxFVkJRMVlzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eERRVU14UXl4RFFVRkRJaXdpWm1sc1pTSTZJbTFoYVc0dWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUxpOXpjbU12YW5Ndklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElGZHBibVJ2ZHlCbWNtOXRJQ2RqYjIxd2IyNWxiblJ6TDFkcGJtUnZkeWM3WEc1Y2JsSmxZV04wUkU5TkxuSmxibVJsY2loY2JpQWdQRmRwYm1SdmR5QXZQaXhjYmlBZ1pHOWpkVzFsYm5RdVoyVjBSV3hsYldWdWRFSjVTV1FvSjNkcGJtUnZkeTFqYjI1MFpXNTBKeWxjYmlrN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIGF3cyA9IGVsZWN0cm9uUmVxdWlyZSgnLi9hd3MtY29uZmlnLmpzb24nKTtcblxudmFyIEFXUyA9IGVsZWN0cm9uUmVxdWlyZSgnYXdzLXNkaycpO1xuQVdTLmNvbmZpZy51cGRhdGUoYXdzKTtcblxudmFyIGVjMkluc3RhbmNlcyA9IHtcbiAgZmV0Y2hJbnN0YW5jZXM6IGZ1bmN0aW9uIGZldGNoSW5zdGFuY2VzKCkge1xuICAgIHZhciByZWdpb24gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAnZXUtd2VzdC0xJyA6IGFyZ3VtZW50c1swXTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgdmFyIGVjMiA9IG5ldyBBV1MuRUMyKHsgcmVnaW9uOiByZWdpb24gfSk7XG4gICAgICBlYzIuZGVzY3JpYmVJbnN0YW5jZXMoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgdmFyIGluc3RhbmNlcyA9IGRhdGEuUmVzZXJ2YXRpb25zLm1hcChmdW5jdGlvbiAoaW5zdGFuY2VPYmplY3QpIHtcbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBpbnN0YW5jZU9iamVjdC5JbnN0YW5jZXNbMF07XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogaW5zdGFuY2UuU3RhdGUuTmFtZSxcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogaW5zdGFuY2UuSW5zdGFuY2VUeXBlLFxuICAgICAgICAgICAga2V5TmFtZTogaW5zdGFuY2UuS2V5TmFtZSxcbiAgICAgICAgICAgIHRhZ3M6IGluc3RhbmNlLlRhZ3MubWFwKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IHRhZy5LZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRhZy5WYWx1ZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBwdWJsaWNJcEFkZHJlc3M6IGluc3RhbmNlLlB1YmxpY0lwQWRkcmVzcyxcbiAgICAgICAgICAgIGlkOiBpbnN0YW5jZS5JbnN0YW5jZUlkXG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlc29sdmUoaW5zdGFuY2VzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBlYzJJbnN0YW5jZXM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Wak1pNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3p0QlFVRkJMRWxCUVVrc1IwRkJSeXhIUVVGSExHVkJRV1VzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE96dEJRVVV2UXl4SlFVRkpMRWRCUVVjc1IwRkJSeXhsUVVGbExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEY2tNc1IwRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN08wRkJSWFpDTEVsQlFVa3NXVUZCV1N4SFFVRkhPMEZCUTJwQ0xHZENRVUZqTEVWQlFVVXNNRUpCUVRaQ08xRkJRWEJDTEUxQlFVMHNlVVJCUVVNc1YwRkJWenM3UVVGRGVrTXNWMEZCVHl4SlFVRkpMRTlCUVU4c1EwRkJReXhWUVVGVExFOUJRVThzUlVGQlJUdEJRVU51UXl4VlFVRkpMRWRCUVVjc1IwRkJSeXhKUVVGSkxFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVVc1RVRkJUU3hGUVVGRExFTkJRVU1zUTBGQlF6dEJRVU40UXl4VFFVRkhMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNWVUZCVXl4SFFVRkhMRVZCUVVVc1NVRkJTU3hGUVVGRk8wRkJRM2hETEdWQlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGJFSXNXVUZCU1N4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCUXl4alFVRmpMRVZCUVVzN1FVRkRlRVFzWTBGQlNTeFJRVUZSTEVkQlFVY3NZMEZCWXl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU16UXl4cFFrRkJUenRCUVVOTUxHdENRVUZOTEVWQlFVVXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSk8wRkJRek5DTEhkQ1FVRlpMRVZCUVVVc1VVRkJVU3hEUVVGRExGbEJRVms3UVVGRGJrTXNiVUpCUVU4c1JVRkJSU3hSUVVGUkxFTkJRVU1zVDBGQlR6dEJRVU42UWl4blFrRkJTU3hGUVVGRkxGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVVNc1IwRkJSeXhGUVVGTE8wRkJReTlDTEhGQ1FVRlBPMEZCUTB3c2JVSkJRVWNzUlVGQlJTeEhRVUZITEVOQlFVTXNSMEZCUnp0QlFVTmFMSEZDUVVGTExFVkJRVVVzUjBGQlJ5eERRVUZETEV0QlFVczdaVUZEYWtJc1EwRkJRenRoUVVOSUxFTkJRVU03UVVGRFJpd3lRa0ZCWlN4RlFVRkZMRkZCUVZFc1EwRkJReXhsUVVGbE8wRkJRM3BETEdOQlFVVXNSVUZCUlN4UlFVRlJMRU5CUVVNc1ZVRkJWVHRYUVVONFFpeERRVUZCTzFOQlEwWXNRMEZCUXl4RFFVRkRPMEZCUTBnc1pVRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzA5QlEzQkNMRU5CUVVNc1EwRkJRenRMUVVOS0xFTkJRVU1zUTBGQlF6dEhRVU5LTzBOQlEwWXNRMEZCUXpzN2EwSkJSV0VzV1VGQldTSXNJbVpwYkdVaU9pSmxZekl1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pTGk5emNtTXZhbk12SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWJHVjBJR0YzY3lBOUlHVnNaV04wY205dVVtVnhkV2x5WlNnbkxpOWhkM010WTI5dVptbG5MbXB6YjI0bktUdGNibHh1ZG1GeUlFRlhVeUE5SUdWc1pXTjBjbTl1VW1WeGRXbHlaU2duWVhkekxYTmtheWNwT3lCY2JrRlhVeTVqYjI1bWFXY3VkWEJrWVhSbEtHRjNjeWs3WEc1Y2JteGxkQ0JsWXpKSmJuTjBZVzVqWlhNZ1BTQjdYRzRnSUdabGRHTm9TVzV6ZEdGdVkyVnpPaUJtZFc1amRHbHZiaWh5WldkcGIyNDlKMlYxTFhkbGMzUXRNU2NwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdibVYzSUZCeWIyMXBjMlVvWm5WdVkzUnBiMjRvY21WemIyeDJaU2tnZTF4dUlDQWdJQ0FnZG1GeUlHVmpNaUE5SUc1bGR5QkJWMU11UlVNeUtIdHlaV2RwYjI0NklISmxaMmx2Ym4wcE95QmNiaUFnSUNBZ0lHVmpNaTVrWlhOamNtbGlaVWx1YzNSaGJtTmxjeWhtZFc1amRHbHZiaWhsY25Jc0lHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29aR0YwWVNrN1hHNGdJQ0FnSUNBZ0lHeGxkQ0JwYm5OMFlXNWpaWE1nUFNCa1lYUmhMbEpsYzJWeWRtRjBhVzl1Y3k1dFlYQW9LR2x1YzNSaGJtTmxUMkpxWldOMEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2JHVjBJR2x1YzNSaGJtTmxJRDBnYVc1emRHRnVZMlZQWW1wbFkzUXVTVzV6ZEdGdVkyVnpXekJkTzF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J6ZEdGMGRYTTZJR2x1YzNSaGJtTmxMbE4wWVhSbExrNWhiV1VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQnBibk4wWVc1alpWUjVjR1U2SUdsdWMzUmhibU5sTGtsdWMzUmhibU5sVkhsd1pTeGNiaUFnSUNBZ0lDQWdJQ0FnSUd0bGVVNWhiV1U2SUdsdWMzUmhibU5sTGt0bGVVNWhiV1VzWEc0Z0lDQWdJQ0FnSUNBZ0lDQjBZV2R6T2lCcGJuTjBZVzVqWlM1VVlXZHpMbTFoY0Nnb2RHRm5LU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYTJWNU9pQjBZV2N1UzJWNUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhiSFZsT2lCMFlXY3VWbUZzZFdWY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZlR0Y2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdjSFZpYkdsalNYQkJaR1J5WlhOek9pQnBibk4wWVc1alpTNVFkV0pzYVdOSmNFRmtaSEpsYzNNc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWkRvZ2FXNXpkR0Z1WTJVdVNXNXpkR0Z1WTJWSlpGeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lISmxjMjlzZG1Vb2FXNXpkR0Z1WTJWektUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNTlPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JsWXpKSmJuTjBZVzVqWlhNN0lsMTkiXX0=
