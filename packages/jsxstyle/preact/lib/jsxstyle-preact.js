define('jsxstyle/preact', ['exports', 'jsxstyle-utils', 'preact'], function(
  exports,
  jsxstyleUtils,
  preact
) {
  'use strict';

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

  var cache = jsxstyleUtils.getStyleCache();
  function factory(displayName) {
    var _a;
    var tagName = 'div';
    var defaultProps = jsxstyleUtils.componentStyles[displayName] || undefined;
    return (
      (_a = /** @class */ (function(_super) {
        __extends(class_1, _super);
        function class_1(props) {
          var _this = _super.call(this, props) || this;
          _this.component = props.component || tagName;
          _this.className = cache.getClassName(props, props.class);
          return _this;
        }
        class_1.prototype.componentWillReceiveProps = function(props) {
          this.component = props.component || tagName;
          this.className = cache.getClassName(props, props.class);
        };
        class_1.prototype.render = function(_a) {
          var props = _a.props,
            style = _a.style,
            children = _a.children;
          return preact.h(
            this.component,
            __assign({}, props, { class: this.className, style: style }),
            children
          );
        };
        return class_1;
      })(preact.Component)),
      (_a.defaultProps = defaultProps),
      (_a.displayName = displayName),
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

  exports.cache = cache;
  exports.Box = Box;
  exports.Block = Block;
  exports.Inline = Inline;
  exports.InlineBlock = InlineBlock;
  exports.Row = Row;
  exports.Col = Col;
  exports.InlineRow = InlineRow;
  exports.InlineCol = InlineCol;
  exports.Grid = Grid;

  Object.defineProperty(exports, '__esModule', { value: true });
});
