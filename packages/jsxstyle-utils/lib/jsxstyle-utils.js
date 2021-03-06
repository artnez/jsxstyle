define('jsxstyle-utils', ['exports'], function(exports) {
  'use strict';

  var canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
  var styleElement;
  if (
    typeof module !== 'undefined' &&
    module.hot &&
    typeof module.hot.addDisposeHandler === 'function'
  ) {
    // gross
    var hot = module.hot;
    if (typeof hot.data === 'object') {
      styleElement = hot.data.styleElement;
    }
    hot.addDisposeHandler(function(data) {
      data.styleElement = styleElement;
    });
  }
  if (canUseDOM && !styleElement) {
    styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode('/* jsxstyle */'));
    document.head.appendChild(styleElement);
  }
  function addStyleToHead(rule) {
    if (styleElement) {
      var sheet = styleElement.sheet;
      try {
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (insertError) {
        // insertRule will fail for rules with pseudoelements the browser doesn't support.
        // see: https://github.com/jsxstyle/jsxstyle/issues/75
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            '[jsxstyle] Could not insert rule at position ' +
              sheet.cssRules.length +
              ': `' +
              rule +
              '`'
          );
        }
      }
    }
  }

  var componentStyles = {
    Block: { display: 'block' },
    Box: null,
    Col: { display: 'flex', flexDirection: 'column' },
    Grid: { display: 'grid' },
    Inline: { display: 'inline' },
    InlineBlock: { display: 'inline-block' },
    InlineCol: { display: 'inline-flex', flexDirection: 'column' },
    InlineRow: { display: 'inline-flex', flexDirection: 'row' },
    Row: { display: 'flex', flexDirection: 'row' },
    // deprecated
    Flex: { display: 'flex' },
    InlineFlex: { display: 'inline-flex' },
    Table: { display: 'table' },
    TableCell: { display: 'table-cell' },
    TableRow: { display: 'table-row' },
  };

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   */
  //  A hearty blend of the following two files:
  // https://github.com/facebook/react/blob/master/src/renderers/dom/shared/CSSProperty.js
  // https://github.com/facebook/react/blob/master/src/renderers/dom/shared/dangerousStyleValue.js
  var isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexNegative: true,
    flexOrder: true,
    flexPositive: true,
    flexShrink: true,
    fontWeight: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true,
  };
  function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1);
  }
  var prefixes = ['Webkit', 'ms', 'Moz', 'O'];
  Object.keys(isUnitlessNumber).forEach(function(prop) {
    prefixes.forEach(function(prefix) {
      isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
    });
  });
  function dangerousStyleValue(name, value) {
    var isEmpty = value == null || typeof value === 'boolean' || value === '';
    if (isEmpty) {
      return '';
    }
    if (
      typeof value === 'number' &&
      value !== 0 &&
      !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
    ) {
      if (value > -1 && value < 1) {
        return Math.round(value * 1e6) / 1e4 + '%';
      }
      return value + 'px';
    }
    if (!value.toString) {
      // values that lack a toString method on their prototype will throw a TypeError
      // see https://github.com/jsxstyle/jsxstyle/issues/112
      if (process.env.NODE_ENV === 'development') {
        console.error(
          'Value for prop `%s` (`%o`) cannot be stringified.',
          name,
          value
        );
      }
      return '';
    }
    return ('' + value).trim();
  }

  var uppercasePattern = /([A-Z])/g;
  var msPattern = /^ms-/;
  var hyphenateCache = {};
  function hyphenateStyleName(styleName) {
    if (hyphenateCache.hasOwnProperty(styleName)) {
      return hyphenateCache[styleName];
    }
    var hyphenatedString = styleName
      .replace(uppercasePattern, '-$1')
      .toLowerCase()
      .replace(msPattern, '-ms-');
    hyphenateCache[styleName] = hyphenatedString;
    return hyphenateCache[styleName];
  }

  // global flag makes subsequent calls of capRegex.test advance to the next match
  var capRegex = /[A-Z]/g;
  var pseudoelements = {
    after: true,
    before: true,
    placeholder: true,
    selection: true,
  };
  var pseudoclasses = {
    active: true,
    checked: true,
    disabled: true,
    empty: true,
    enabled: true,
    focus: true,
    hover: true,
    invalid: true,
    link: true,
    required: true,
    target: true,
    valid: true,
  };
  var specialCaseProps = {
    children: true,
    class: true,
    className: true,
    component: true,
    mediaQueries: true,
    props: true,
    style: true,
  };
  function getStyleKeysForProps(props, pretty) {
    if (pretty === void 0) {
      pretty = false;
    }
    if (typeof props !== 'object' || props === null) {
      return null;
    }
    var propKeys = Object.keys(props).sort();
    var keyCount = propKeys.length;
    if (keyCount === 0) {
      return null;
    }
    var mediaQueries = props.mediaQueries;
    var hasMediaQueries = typeof mediaQueries === 'object';
    var usesMediaQueries = false;
    var styleKeyObj = {};
    var classNameKey = '';
    var seenMQs = {};
    var mqSortKeys = {};
    if (hasMediaQueries) {
      var idx = -1;
      for (var k in mediaQueries) {
        mqSortKeys[k] = '@' + (1000 + ++idx);
      }
    }
    for (var idx = -1; ++idx < keyCount; ) {
      var originalPropName = propKeys[idx];
      if (
        specialCaseProps.hasOwnProperty(originalPropName) ||
        !props.hasOwnProperty(originalPropName)
      ) {
        continue;
      }
      var propName = originalPropName;
      var propSansMQ = void 0;
      var pseudoelement = void 0;
      var pseudoclass = void 0;
      var mqKey = void 0;
      capRegex.lastIndex = 0;
      var splitIndex = 0;
      var prefix =
        capRegex.test(originalPropName) &&
        capRegex.lastIndex > 1 &&
        originalPropName.slice(0, capRegex.lastIndex - 1);
      // check for media query prefix
      if (prefix && hasMediaQueries && mediaQueries.hasOwnProperty(prefix)) {
        usesMediaQueries = true;
        mqKey = prefix;
        splitIndex = capRegex.lastIndex - 1;
        propSansMQ =
          originalPropName[splitIndex].toLowerCase() +
          originalPropName.slice(splitIndex + 1);
        prefix =
          capRegex.test(originalPropName) &&
          propSansMQ.slice(0, capRegex.lastIndex - splitIndex - 1);
      }
      // check for pseudoelement prefix
      if (prefix && pseudoelements.hasOwnProperty(prefix)) {
        pseudoelement = prefix;
        splitIndex = capRegex.lastIndex - 1;
        prefix =
          capRegex.test(originalPropName) &&
          originalPropName[splitIndex].toLowerCase() +
            originalPropName.slice(splitIndex + 1, capRegex.lastIndex - 1);
      }
      // check for pseudoclass prefix
      if (prefix && pseudoclasses.hasOwnProperty(prefix)) {
        pseudoclass = prefix;
        splitIndex = capRegex.lastIndex - 1;
      }
      // trim prefixes off propName
      if (splitIndex > 0) {
        propName =
          originalPropName[splitIndex].toLowerCase() +
          originalPropName.slice(splitIndex + 1);
      }
      var styleValue = dangerousStyleValue(propName, props[originalPropName]);
      if (styleValue === '') {
        continue;
      }
      var mediaQuery = mqKey && mediaQueries[mqKey];
      var mqSortKey = mqKey && mqSortKeys[mqKey];
      var key =
        '.' +
        (mqSortKey || '') +
        (pseudoclass ? ':' + pseudoclass : '') +
        (pseudoelement ? '::' + pseudoelement : '');
      if (!styleKeyObj.hasOwnProperty(key)) {
        styleKeyObj[key] = { styles: pretty ? '\n' : '' };
        if (mediaQuery) {
          styleKeyObj[key].mediaQuery = mediaQuery;
        }
        if (pseudoclass) {
          styleKeyObj[key].pseudoclass = pseudoclass;
        }
        if (pseudoelement) {
          styleKeyObj[key].pseudoelement = pseudoelement;
        }
      }
      if (mediaQuery) {
        seenMQs[mediaQuery] = seenMQs[mediaQuery] || '';
        seenMQs[mediaQuery] += propSansMQ + ':' + styleValue + ';';
      } else {
        classNameKey += originalPropName + ':' + styleValue + ';';
      }
      styleKeyObj[key].styles +=
        (pretty ? '  ' : '') +
        hyphenateStyleName(propName) +
        (pretty ? ': ' : ':') +
        styleValue +
        (pretty ? ';\n' : ';');
    }
    // append media query key
    if (usesMediaQueries) {
      var mqKeys = Object.keys(seenMQs).sort();
      for (var idx = -1, len = mqKeys.length; ++idx < len; ) {
        var mediaQuery = mqKeys[idx];
        classNameKey += '@' + mediaQuery + '~' + seenMQs[mediaQuery];
      }
    }
    if (classNameKey === '') {
      return null;
    }
    styleKeyObj.classNameKey = classNameKey;
    return styleKeyObj;
  }

  /* tslint:disable no-bitwise */
  // thx darksky: https://git.io/v9kWO
  function stringHash(str) {
    var hash = 5381;
    var i = str.length;
    while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return hash >>> 0;
  }

  function cannotInject() {
    throw new Error(
      'jsxstyle error: `injectOptions` must be called before any jsxstyle components mount.'
    );
  }
  function alreadyInjected() {
    throw new Error(
      'jsxstyle error: `injectOptions` should be called once and only once.'
    );
  }
  function getStringHash(key, props) {
    return '_' + stringHash(key).toString(36);
  }
  function getStyleCache() {
    var _classNameCache = {};
    var getClassNameForKey = getStringHash;
    var onInsertRule;
    var pretty = false;
    var styleCache = {
      reset: function() {
        _classNameCache = {};
      },
      injectOptions: function(options) {
        if (options) {
          if (options.getClassName) {
            getClassNameForKey = options.getClassName;
          }
          if (options.onInsertRule) {
            onInsertRule = options.onInsertRule;
          }
          if (options.pretty) {
            pretty = options.pretty;
          }
        }
        styleCache.injectOptions = alreadyInjected;
      },
      getClassName: function(props, classNameProp) {
        styleCache.injectOptions = cannotInject;
        var styleObj = getStyleKeysForProps(props, pretty);
        if (typeof styleObj !== 'object' || styleObj === null) {
          return classNameProp || null;
        }
        var key = styleObj.classNameKey;
        if (key && !_classNameCache.hasOwnProperty(key)) {
          _classNameCache[key] = getClassNameForKey(key, props);
          delete styleObj.classNameKey;
          Object.keys(styleObj)
            .sort()
            .forEach(function(k) {
              var selector = '.' + _classNameCache[key];
              // prettier-ignore
              var _a = styleObj[k], pseudoclass = _a.pseudoclass, pseudoelement = _a.pseudoelement, mediaQuery = _a.mediaQuery, styles = _a.styles;
              var rule =
                selector +
                (pseudoclass ? ':' + pseudoclass : '') +
                (pseudoelement ? '::' + pseudoelement : '') +
                (' {' + styles + '}');
              if (mediaQuery) {
                rule = '@media ' + mediaQuery + ' { ' + rule + ' }';
              }
              if (
                onInsertRule &&
                // if the function returns false, bail.
                onInsertRule(rule, props) === false
              ) {
                return;
              }
              addStyleToHead(rule);
            });
        }
        return _classNameCache[key] && classNameProp
          ? classNameProp + ' ' + _classNameCache[key]
          : _classNameCache[key] || classNameProp || null;
      },
    };
    return styleCache;
  }

  exports.addStyleToHead = addStyleToHead;
  exports.componentStyles = componentStyles;
  exports.dangerousStyleValue = dangerousStyleValue;
  exports.getStyleCache = getStyleCache;
  exports.getStyleKeysForProps = getStyleKeysForProps;
  exports.pseudoelements = pseudoelements;
  exports.pseudoclasses = pseudoclasses;
  exports.hyphenateStyleName = hyphenateStyleName;
  exports.stringHash = stringHash;

  Object.defineProperty(exports, '__esModule', { value: true });
});
