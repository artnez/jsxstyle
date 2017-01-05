'use strict';

var CSSProperties = require('./CSSProperties');
var CSSVendorPrefixes = require('./CSSVendorPrefixes');
var GlobalStylesheets = require('./GlobalStylesheets');
var React = require('react');

var assign = require('object-assign');

var stylePrefix = /^(Webkit|ms|Moz|hover|focus|active)/;

function splitPropsAndStyles(propsAndStyles) {
  var props = {};
  var style = {};

  for (var key in propsAndStyles) {
    if (key === 'style' || key === 'props') {
      continue;
    }
    if (CSSProperties[key] || stylePrefix.test(key)) {
      style[key] = propsAndStyles[key];
    } else {
      props[key] = propsAndStyles[key];
    }
  }

  assign(style, propsAndStyles.style);
  assign(props, propsAndStyles.props);

  return { props: props, style: style };
}

function makeStyleComponentClass(defaults, displayName, tagName) {
  tagName = tagName || 'div';
  displayName = displayName || 'Style';

  var Style = React.createClass({
    displayName: displayName,

    statics: {
      style: defaults
    },

    getDefaultProps: function getDefaultProps() {
      return defaults;
    },

    refStyleKey: function refStyleKey(props) {
      var _splitPropsAndStyles = splitPropsAndStyles(props),
          style = _splitPropsAndStyles.style;

      this.component = this.props.component || tagName;
      this.styleKey = GlobalStylesheets.getKey(style, displayName, this.component);
      if (this.styleKey) {
        GlobalStylesheets.ref(this.styleKey);
      }
    },

    componentWillMount: function componentWillMount() {
      this.refStyleKey(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      if (this.styleKey) {
        GlobalStylesheets.unref(this.styleKey);
      }
      this.refStyleKey(nextProps);
    },

    componentWillUnmount: function componentWillUnmount() {
      if (this.styleKey) {
        GlobalStylesheets.unref(this.styleKey);
      }
    },

    render: function render() {
      var _splitPropsAndStyles2 = splitPropsAndStyles(this.props),
          props = _splitPropsAndStyles2.props;

      delete props.component; // React will warn if we send an unknown prop.

      var className = this.styleKey ? GlobalStylesheets.getClassName(this.styleKey) : null;
      if (className || props.className) {
        props.className = (props.className || '') + ' ' + (className || '');
      }

      return React.createElement(this.component, props);
    }
  });

  return Style;
}

module.exports = makeStyleComponentClass;