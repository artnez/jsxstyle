import { getStyleCache, componentStyles } from 'jsxstyle-utils';
import { createElement, Component } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function(d, b) {
        d.__proto__ = b;
      }) ||
    function(d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype =
    b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

var __assign = function() {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

// tslint:disable max-classes-per-file
/** Shared instance of a style cache object. */
var cache = getStyleCache();
var getDerivedStateFromProps = function(props) {
  return {
    className: cache.getClassName(props, props.className),
  };
};
function factory(displayName) {
  var _a;
  var tagName = 'div';
  var defaultProps = componentStyles[displayName];
  return (
    (_a = /** @class */ (function(_super) {
      __extends(class_1, _super);
      function class_1(props) {
        var _this = _super.call(this, props) || this;
        // className will be set before initial render with either getDerivedStateFromProps or componentWillMount
        _this.state = { className: null };
        var componentWillMount = function() {
          _this.setState(getDerivedStateFromProps(_this.props));
        };
        var componentWillReceiveProps = function(nextProps) {
          _this.setState(getDerivedStateFromProps(nextProps));
        };
        // In React 16.3+, deprecated lifecycles will not be called if getDerivedStateFromProps is defined.
        // This boolean prevents React from logging the presence of these functions as an error in strict mode.
        // See https://github.com/reactjs/react-lifecycles-compat/blob/0a02b80/index.js#L47
        componentWillMount.__suppressDeprecationWarning = true;
        componentWillReceiveProps.__suppressDeprecationWarning = true;
        _this.componentWillMount = componentWillMount;
        _this.componentWillReceiveProps = componentWillReceiveProps;
        return _this;
      }
      class_1.prototype.render = function() {
        var _a = this.props,
          props = _a.props,
          style = _a.style,
          children = _a.children;
        var Component$$1 = this.props.component || tagName;
        return createElement(
          Component$$1,
          __assign({}, props, {
            className: this.state.className || undefined,
            style: style || undefined,
          }),
          children
        );
      };
      return class_1;
    })(Component)),
    (_a.defaultProps = defaultProps),
    (_a.displayName = displayName),
    (_a.getDerivedStateFromProps = getDerivedStateFromProps),
    _a
  );
}
function depFactory(displayName) {
  var _a;
  var defaultProps = componentStyles[displayName];
  var hasWarned = false;
  return (
    (_a = /** @class */ (function(_super) {
      __extends(class_2, _super);
      function class_2(props) {
        var _this = _super.call(this, props) || this;
        if (process.env.NODE_ENV !== 'production') {
          if (!hasWarned) {
            hasWarned = true;
            console.error(
              'jsxstyle\u2019s `%s` component is deprecated and will be removed in future versions of jsxstyle.',
              displayName
            );
          }
        }
        return _this;
      }
      class_2.prototype.render = function() {
        return createElement(Box, __assign({}, this.props));
      };
      return class_2;
    })(Component)),
    (_a.displayName = displayName),
    (_a.defaultProps = defaultProps),
    _a
  );
}
var Box = factory('Box');
var Block = factory('Block');
var Inline = factory('Inline');
var InlineBlock = factory('InlineBlock');
var Row = factory('Row');
var Col = factory('Col');
var InlineRow = factory('InlineRow');
var InlineCol = factory('InlineCol');
var Grid = factory('Grid');
// <Box component="table" />
var Table = depFactory('Table');
var TableRow = depFactory('TableRow');
var TableCell = depFactory('TableCell');
// <Row display="inline-flex" />
var Flex = depFactory('Flex');
var InlineFlex = depFactory('InlineFlex');

export {
  cache,
  Box,
  Block,
  Inline,
  InlineBlock,
  Row,
  Col,
  InlineRow,
  InlineCol,
  Grid,
  Table,
  TableRow,
  TableCell,
  Flex,
  InlineFlex,
};
