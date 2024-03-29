import createEmotion from 'create-emotion'
import varsPlugin from 'stylis-custom-properties'
import _extends from '@babel/runtime/helpers/esm/extends'
import * as React from 'react'
import React__default, {
  createContext,
  createElement,
  Component,
  useState,
  useContext,
  useMemo,
  Children,
  cloneElement,
  PureComponent,
} from 'react'
import createEmotionStyled from 'create-emotion-styled'
import {
  omitByIndexed,
  pickByIndexed,
  groupKeys,
  isObject,
  mergeAll,
  pickBy,
  compact,
  mapValuesIndexed,
  find,
  noop,
  throttle,
  memoize,
  findIndex,
  memoizeOne,
  once,
  values,
  pick,
  merge,
  mapKeys,
  mapValues,
  trimEnd,
  identity,
  debounce,
} from '@livechat/data-utils'
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose'
import { getDisplayName } from 'recompose'
import { ThemeProvider as ThemeProvider$1, withTheme } from 'emotion-theming'
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose'
import _assertThisInitialized from '@babel/runtime/helpers/esm/assertThisInitialized'
import {
  bool,
  func,
  node,
  string,
  shape,
  oneOf,
  oneOfType,
  arrayOf,
  number,
} from 'prop-types'
import ResizeObserver from 'resize-observer-polyfill'
import isPropValid from '@emotion/is-prop-valid'
import {
  CSSTransition,
  TransitionGroup,
  Transition,
} from 'react-transition-group'
import Toggle from 'react-toggled'
import { darken } from 'polished'
import TextareaAutosize from 'react-textarea-autosize'
import { easeOut } from '@popmotion/easing'
import durationProgress from 'callbag-duration-progress'
import forEach from 'callbag-for-each'
import map from 'callbag-map'
import pipe from 'callbag-pipe'

const lcConversationId =
  window.Botcopy &&
  window.Botcopy.livechat &&
  window.Botcopy.livechat.currentRenderConversationId
const WIDGET_ROOT_ID = 'botcopy-widget-root'
const shadowHostId = `${WIDGET_ROOT_ID}${
  lcConversationId ? `-${lcConversationId}` : ``
}`

var emotion = createEmotion(
  {},
  {
    key: 'lc',
    stylisPlugins: [varsPlugin],
    container:
      document.getElementById(shadowHostId) &&
      document.getElementById(shadowHostId).shadowRoot
        ? document.getElementById(shadowHostId).shadowRoot
        : document.getElementById(shadowHostId),
  }
)
var css = emotion.css,
  cx = emotion.cx,
  injectGlobal = emotion.injectGlobal,
  keyframes = emotion.keyframes

var mapCommonPropsToStyles = function (props) {
  var styles = {}

  if (props.flexFill) {
    styles.flexGrow = 1
    styles.maxWidth = '100%'
  }

  if (props.flexFit) {
    if (process.env.NODE_ENV === 'development' && props.flexFill) {
      // eslint-disable-next-line no-console
      console.warn(
        "Using flexFill & flexFit props together doesn't make sense."
      )
    }

    styles.flexGrow = 0
  }

  if (props.noShrink) {
    styles.flexShrink = 0
  }

  if (props.ellipsis) {
    styles.whiteSpace = 'nowrap'
    styles.overflow = 'hidden'
    styles.textOverflow = 'ellipsis'
  }

  if (props.nowrap) {
    styles.whiteSpace = 'nowrap'
  }

  if (props.preserveLines) {
    if (process.env.NODE_ENV === 'development' && props.nowrap) {
      // eslint-disable-next-line no-console
      console.warn(
        "Using nowrap & preserveLines props together doesn't make sense."
      )
    }

    styles.whiteSpace = 'pre-line'
  }

  if (props.textWrap) {
    var breakWord = 'break-word'
    styles.wordWrap = breakWord
    styles.overflowWrap = breakWord
    styles.wordBreak = breakWord
  }

  return styles
}

var ThemeContext = createContext()

var ThemeProvider = function ThemeProvider(_ref) {
  var value = _ref.value,
    children = _ref.children
  return createElement(
    ThemeProvider$1,
    {
      theme: value,
    },
    createElement(
      ThemeContext.Provider,
      {
        value: value,
      },
      children
    )
  )
}

var isComponentKey = function isComponentKey(key) {
  return key.charAt(0) !== key.charAt(0).toLowerCase()
}

var _isComponentKey = function _isComponentKey(value, key) {
  return isComponentKey(key)
}

var omitComponentKeys = omitByIndexed.bind(null, _isComponentKey)
var pickComponentKeys = pickByIndexed.bind(null, _isComponentKey)

var empty = {}

var unpackRest = function unpackRest(rest) {
  return groupKeys(function (key) {
    if (isComponentKey(key)) {
      return 'components'
    }

    if (isObject(rest[key])) {
      return 'propsDescriptions'
    }

    return 'themeProps'
  }, rest)
}

var unpackThemeDescription = function (themeDescription) {
  if (!themeDescription) {
    return empty
  }

  var css = themeDescription.css,
    vars = themeDescription.vars,
    rest = _objectWithoutPropertiesLoose(themeDescription, ['css', 'vars'])

  return _extends(
    {
      css: css,
      vars: vars,
    },
    unpackRest(rest)
  )
}

var parsePropsDescriptions = function parsePropsDescriptions(
  componentName,
  props,
  propsDescriptions
) {
  if (propsDescriptions === void 0) {
    propsDescriptions = {}
  }

  var activeDescriptions = pickByIndexed(function (value, prop) {
    return props[prop]
  }, propsDescriptions)
  return Object.keys(activeDescriptions).map(function (prop) {
    var _componentDescription

    var propDescription = activeDescriptions[prop]

    var _unpackThemeDescripti = unpackThemeDescription(propDescription),
      themeProps = _unpackThemeDescripti.themeProps,
      components = _unpackThemeDescripti.components

    if (!themeProps) {
      return components
    }

    var componentDescription =
      ((_componentDescription = {}),
      (_componentDescription[componentName] = themeProps),
      _componentDescription)

    if (!components) {
      return componentDescription
    }

    return _extends({}, componentDescription, {}, components)
  })
}

var mergeInnerTheme = function mergeInnerTheme(componentName) {
  return function (props) {
    return function (theme) {
      var componentDescription = theme[componentName]

      if (!componentDescription) {
        return theme
      }

      var _unpackThemeDescripti2 = unpackThemeDescription(componentDescription),
        propsDescriptions = _unpackThemeDescripti2.propsDescriptions,
        components = _unpackThemeDescripti2.components

      if (!propsDescriptions && !components) {
        return theme
      }

      var activePropsDescriptions = parsePropsDescriptions(
        componentName,
        props,
        propsDescriptions
      )
      return mergeAll(
        [theme, components].concat(activePropsDescriptions).filter(Boolean)
      )
    }
  }
}

var withSubtheme = function (WrappedComponent) {
  var _class, _temp

  var wrappedName = WrappedComponent.__ui_kit_name
  var mergeThemes = mergeInnerTheme(wrappedName)
  return (
    (_temp = _class =
      /*#__PURE__*/
      (function (_React$Component) {
        _inheritsLoose(WithSubtheme, _React$Component)

        function WithSubtheme() {
          return _React$Component.apply(this, arguments) || this
        }

        var _proto = WithSubtheme.prototype

        _proto.render = function render() {
          var props = this.props
          return createElement(
            ThemeProvider,
            {
              value: mergeThemes(props),
            },
            createElement(WrappedComponent, props)
          )
        }

        return WithSubtheme
      })(Component)),
    (_class.displayName = 'WithSubtheme(' + wrappedName + ')'),
    _temp
  )
}

var styled = createEmotionStyled(emotion, React)
var registeredComponents = {}

var unpackCss = function unpackCss(props, css) {
  var basedOnProps = pickBy(isObject, css)

  if (Object.keys(basedOnProps) === 0) {
    return css
  }

  return compact(
    mapValuesIndexed(function (value, key) {
      if (!isObject(value)) {
        return value
      }

      if (key[0] === ':') {
        return unpackCss(props, value)
      }

      var activeProp = find(function (prop) {
        return props[prop]
      }, Object.keys(value)) // if (process.env.NODE_ENV !== 'production' && !activeProp && !value.default) {
      // 	console.warn(`This css description ("${JSON.stringify(value)}") has no default value.`)
      // }

      return value[activeProp] || value['default']
    }, css)
  )
}

var parseStyles = function parseStyles(props, componentName, mapPropsToStyles) {
  var theme = props.theme,
    style = props.style

  var _unpackThemeDescripti = unpackThemeDescription(theme[componentName]),
    css = _unpackThemeDescripti.css,
    componentVars = _unpackThemeDescripti.vars,
    themeProps = _unpackThemeDescripti.themeProps

  var vars = componentVars
    ? _extends({}, theme.vars, {}, componentVars)
    : theme.vars // TODO: should it be possible to specify common props in theme object?

  return [
    vars,
    typeof mapPropsToStyles === 'function' &&
      themeProps !== undefined &&
      mapPropsToStyles(themeProps),
    css && unpackCss(props, css),
    mapCommonPropsToStyles(props),
    typeof mapPropsToStyles === 'function' && mapPropsToStyles(props),
    style,
  ]
}

var styled$1 = function (component, options) {
  if (options === void 0) {
    options = {}
  }

  var _options = options,
    displayName = _options.displayName,
    displayType = _options.displayType,
    mapPropsToStyles = _options.mapPropsToStyles

  if (process.env.NODE_ENV !== 'production' && displayName) {
    if (registeredComponents[displayName]) {
      console.warn(
        '"' +
          displayName +
          '" is already registered. Those names should be unique.'
      )
    }

    registeredComponents[displayName] = true
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    !displayName &&
    options.section
  ) {
    console.warn('For `section` components valid `displayName` is required.')
  }

  var factory = styled(component, options)
  return function () {
    var name = displayName || displayType || null

    for (
      var _len = arguments.length, styles = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      styles[_key] = arguments[_key]
    }

    var styledComponent = factory.apply(
      void 0,
      styles.concat([
        function (props) {
          return parseStyles(props, name, mapPropsToStyles)
        },
      ])
    )
    styledComponent.__ui_kit_name = name
    return options.section
      ? Object.defineProperty(withSubtheme(styledComponent), 'toString', {
          value: styledComponent.toString,
        })
      : styledComponent
  }
}

var getBottomFoldPosition = function getBottomFoldPosition(element) {
  return element.scrollTop + element.clientHeight
}
var getOffsetTop = function getOffsetTop(element) {
  return element.getBoundingClientRect().top + window.pageYOffset
}

var isAboveFold = function isAboveFold(container, element) {
  return (
    getOffsetTop(element) - getOffsetTop(container) + element.clientHeight <=
    container.clientHeight
  )
}
var isScrollOnBottom = function isScrollOnBottom(node, threshold) {
  if (threshold === void 0) {
    threshold = 0
  }

  return (
    Math.abs(node.scrollTop + node.clientHeight - node.scrollHeight) <=
    threshold
  )
}
var isScrollOnTop = function isScrollOnTop(node, threshold) {
  if (threshold === void 0) {
    threshold = 0
  }

  return node.scrollTop <= threshold
}
var isScrolledToRight = function isScrolledToRight(element) {
  return (
    Math.abs(element.scrollLeft + element.clientWidth - element.scrollWidth) <=
    1
  )
}
var isScrolledToLeft = function isScrolledToLeft(element) {
  return element.scrollLeft <= 0
}

var isUserMessage = function isUserMessage(element) {
  return element.classList.contains('user-message')
}

var scrollToBottom = function scrollToBottom(element) {
  const bcMessageGroups = Array.from(
    element.getElementsByClassName('botcopy--message-group')
  )
  const lastResponseId =
    bcMessageGroups[bcMessageGroups.length - 1].dataset.responseId
  if (bcMessageGroups.length > 0 && lastResponseId) {
    const firstMessageGroupOfLastResponseIndex = bcMessageGroups.findIndex(
      ({ dataset }) => dataset.responseId === lastResponseId
    )
    const beforeFirstMessageGroupOfLastResponseIndex = Math.max(
      firstMessageGroupOfLastResponseIndex - 1,
      0
    )

    if (
      isUserMessage(bcMessageGroups[beforeFirstMessageGroupOfLastResponseIndex])
    ) {
      // Scroll to user message before the first message of last response
      element.scrollTop =
        bcMessageGroups[beforeFirstMessageGroupOfLastResponseIndex].offsetTop
    } else {
      // Scroll to first message of last response
      element.scrollTop =
        bcMessageGroups[firstMessageGroupOfLastResponseIndex].offsetTop
    }
    // console.log('scrollToBottom', element, element.scrollTop, element.scrollHeight, bcUserMessages)
    // console.log('bcLastUserMessage 1', bcLastUserMessage, bcLastUserMessage.scrollTop, bcLastUserMessage.scrollHeight, bcLastUserMessage.offsetTop, bcLastUserMessage.getBoundingClientRect())
    // scroll to user message
    // console.log('👇 scroll to bcLastUserMessage')
  } else {
    // original: scroll to bottom
    // console.log('👇 scroll to global element')
    element.scrollTop = element.scrollHeight
  }
}
var scrollToTop = function scrollToTop(element) {
  element.scrollTop = 0
}

var allowScrollEvent = function allowScrollEvent(event) {
  var currentTarget = event.currentTarget,
    deltaY = event.deltaY
  var scrollTop = currentTarget.scrollTop,
    scrollHeight = currentTarget.scrollHeight
  var scrollingDown = deltaY > 0

  if (
    scrollingDown &&
    deltaY > scrollHeight - getBottomFoldPosition(currentTarget)
  ) {
    currentTarget.scrollTop = scrollHeight
    return false
  }

  if (!scrollingDown && -deltaY > scrollTop) {
    currentTarget.scrollTop = 0
    return false
  }

  event.stopPropagation()
  return true
}
var containScrollInSubtree = function containScrollInSubtree(event) {
  var allowed = allowScrollEvent(event)

  if (allowed) {
    return
  }

  event.preventDefault()
}
var ENTER_KEYCODE = 13
var wasEnterPressed = function wasEnterPressed(event) {
  return event.which === ENTER_KEYCODE
}
var wasNewLineIntended = function wasNewLineIntended(event) {
  return wasEnterPressed(event) && (event.altKey || event.shiftKey)
}
var wasOnlyEnterPressed = function wasOnlyEnterPressed(event) {
  return wasEnterPressed(event) && !event.altKey && !event.shiftKey
}

var withPinnedScroll = function (_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$pinThreshold = _ref.pinThreshold,
    pinThreshold = _ref$pinThreshold === void 0 ? 20 : _ref$pinThreshold,
    _ref$reverse = _ref.reverse,
    reverse = _ref$reverse === void 0 ? false : _ref$reverse

  return function (WrappedComponent) {
    var _class, _temp2

    return (
      (_temp2 = _class =
        /*#__PURE__*/
        (function (_React$Component) {
          _inheritsLoose(WithPinnedScroll, _React$Component)

          function WithPinnedScroll() {
            var _this

            for (
              var _len = arguments.length, args = new Array(_len), _key = 0;
              _key < _len;
              _key++
            ) {
              args[_key] = arguments[_key]
            }

            _this =
              _React$Component.call.apply(
                _React$Component,
                [this].concat(args)
              ) || this
            _this._unmounted = false

            _this._getListRef = function (ref) {
              _this._listRef = ref

              _this.props.innerRef(ref)
            }

            _this._handleScroll = throttle(200, function (event) {
              if (_this._unmounted) {
                return
              }

              var _assertThisInitialize = _assertThisInitialized(_this),
                props = _assertThisInitialize.props,
                node = _assertThisInitialize._listRef

              props.onScroll(event)

              if (isScrollOnBottom(node, pinThreshold)) {
                _this._isAtTheBottom = true
                props.onScrollBottom(event)
                return
              }

              _this._isAtTheBottom = false

              if (isScrollOnTop(node, pinThreshold)) {
                props.onScrollTop(event)
                return
              }
            })

            _this._handleWheel = function (event) {
              if (_this.props.containScrollInSubtree) {
                containScrollInSubtree(event)
              }

              _this.props.onWheel(event)
            }

            _this.scrollToBottom = function () {
              scrollToBottom(_this._listRef)
              _this._isAtTheBottom = true
            }

            _this.scrollToTop = function () {
              scrollToTop(_this._listRef)
            }

            _this.scrollProps = {
              isScrollOnBottom: function isScrollOnBottom$1() {
                return isScrollOnBottom(_this._listRef, pinThreshold)
              },
              isScrollOnTop: function isScrollOnTop$1() {
                return isScrollOnTop(_this._listRef, pinThreshold)
              },
              scrollToBottom: _this.scrollToBottom,
              scrollToTop: _this.scrollToTop,
            }
            return _this
          }

          var _proto = WithPinnedScroll.prototype

          _proto.componentDidMount = function componentDidMount() {
            var _this2 = this

            if (!this.props.usePinnedScroll) {
              return
            }

            this._observer = new ResizeObserver(function () {
              if (!_this2._isAtTheBottom) {
                return
              }

              _this2.scrollToBottom()
            })

            this._observer.observe(this._listRef)

            if (reverse) {
              return
            }

            this.scrollToBottom()
          }

          _proto.componentWillUnmount = function componentWillUnmount() {
            this._unmounted = true

            if (this._observer) {
              this._observer.disconnect()
            }
          }

          _proto.getSnapshotBeforeUpdate = function getSnapshotBeforeUpdate() {
            if (!this.props.usePinnedScroll) {
              return null
            }

            var node = this._listRef
            return reverse
              ? {
                  shouldScrollToEdge: isScrollOnTop(node, pinThreshold),
                }
              : {
                  shouldScrollToEdge: isScrollOnBottom(node, pinThreshold),
                  prevScrollTop: node.scrollTop,
                  scrollTopFromBottomFold: Math.abs(
                    node.scrollTop - node.scrollHeight
                  ),
                }
          }

          _proto.componentDidUpdate = function componentDidUpdate(
            prevProps,
            prevState,
            snapshot
          ) {
            if (!this.props.usePinnedScroll) {
              return
            }

            if (snapshot.shouldScrollToEdge) {
              if (reverse) {
                scrollToTop(this._listRef)
              } else {
                this.scrollToBottom()
              }

              return
            }

            this._isAtTheBottom = false

            if (!reverse) {
              this._maybeRestoreScrollPosition(snapshot)
            }
          }

          _proto._maybeRestoreScrollPosition =
            function _maybeRestoreScrollPosition(_ref2) {
              var prevScrollTop = _ref2.prevScrollTop,
                scrollTopFromBottomFold = _ref2.scrollTopFromBottomFold
              var node = this._listRef // if we stay on the top of the list and new items get appended at the top
              // then the scroll position wont change but we have to restore the position nevertheless

              if (node.scrollTop === prevScrollTop && prevScrollTop !== 0) {
                return
              }

              node.scrollTop = Math.abs(
                scrollTopFromBottomFold - node.scrollHeight
              )
            }

          _proto.render = function render() {
            var _this$props = this.props,
              _containScrollInSubtree = _this$props.containScrollInSubtree,
              _onScrollBottom = _this$props.onScrollBottom,
              _onScrollTop = _this$props.onScrollTop,
              _usePinnedScroll = _this$props.usePinnedScroll,
              props = _objectWithoutPropertiesLoose(_this$props, [
                'containScrollInSubtree',
                'onScrollBottom',
                'onScrollTop',
                'usePinnedScroll',
              ])

            return createElement(
              WrappedComponent,
              _extends({}, props, this.scrollProps, {
                innerRef: this._getListRef,
                onScroll: this._handleScroll,
                onWheel: this._handleWheel,
              })
            )
          }

          return WithPinnedScroll
        })(Component)),
      (_class.displayName =
        'WithPinnedScroll(' + getDisplayName(WrappedComponent) + ')'),
      (_class.propTypes = {
        containScrollInSubtree: bool,
        innerRef: func,
        onScroll: func,
        onScrollBottom: func,
        onScrollTop: func,
        onWheel: func,
        usePinnedScroll: bool,
      }),
      (_class.defaultProps = {
        containScrollInSubtree: false,
        innerRef: noop,
        onScrollBottom: noop,
        onScrollTop: noop,
        onWheel: noop,
        onScroll: noop,
        usePinnedScroll: true,
      }),
      _temp2
    )
  }
}

var StyledList =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'ChatList',
    section: true,
    target: 'egyled90',
  })()
var ChatList = withPinnedScroll({
  reverse: true,
})(StyledList)

var mapPropsToStyles = function mapPropsToStyles(props) {
  var styles = {}

  if (props.verticalAlign) {
    if (props.verticalAlign === 'top') {
      styles.alignItems = 'flex-start'
    } else if (props.verticalAlign === 'bottom') {
      styles.alignItems = 'flex-end'
    } else {
      styles.alignItems = props.verticalAlign
    }
  }

  if (props.justify) {
    if (props.justify === true) {
      styles.justifyContent = 'space-between'
    } else if (props.justify === 'left') {
      styles.justifyContent = 'flex-start'
    } else if (props.justify === 'right') {
      styles.justifyContent = 'flex-end'
    } else {
      styles.justifyContent = props.justify
    }
  }

  if (props.reverse) {
    styles.flexDirection = 'row-reverse'
  }

  return styles
}

var StyledRow =
  /*#__PURE__*/
  styled$1('div', {
    mapPropsToStyles: mapPropsToStyles,
    target: 'e108e6fy0',
  })('display:flex;min-width:0;')

var mapPropsToStyles$1 = function mapPropsToStyles(props) {
  return {
    background: props.active ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0)',
  }
}

var StyledItem =
  /*#__PURE__*/
  styled$1(StyledRow, {
    displayName: 'ChatListItem',
    mapPropsToStyles: mapPropsToStyles$1,
    section: true,
    target: 'edumshe0',
  })(
    'padding:0.5em;transition:background 0.2s;border-bottom:1px solid rgba(0,0,0,0.1);&:hover{cursor:pointer;}'
  )

var ChatListItem = function ChatListItem(props) {
  return createElement(StyledItem, props)
}

ChatListItem.propTypes = {
  active: bool,
  children: node.isRequired,
}

var StyledBar =
  /*#__PURE__*/
  styled$1(StyledRow, {
    displayName: 'AgentBar',
    section: true,
    target: 'e1j58gbc0',
  })('padding:1em;')

var AgentBar = function AgentBar(props) {
  return createElement(
    StyledBar,
    _extends(
      {
        verticalAlign: 'center',
      },
      props
    )
  )
}

AgentBar.propTypes = {
  children: node,
}

var mapPropsToStyles$2 = function mapPropsToStyles(_ref) {
  var color = _ref.color

  if (!color) {
    return null
  }

  return {
    fill: color,
    '& *': {
      fill: color,
    },
  }
}

var createStyledIcon = memoize(function (Icon) {
  return (
    /*#__PURE__*/
    styled$1(Icon, {
      displayType: 'Icon',
      mapPropsToStyles: mapPropsToStyles$2,
      shouldForwardProp: isPropValid,
      target: 'e5ibypu0',
    })('&{display:block;}&,& *{fill:currentColor;}')
  )
})

var Icon = function Icon(_ref2) {
  var children = _ref2.children,
    props = _objectWithoutPropertiesLoose(_ref2, ['children'])

  var StyledIcon = createStyledIcon(children.type)
  return createElement(StyledIcon, props)
}

Icon.propTypes = {
  children: node.isRequired,
}

var Add = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        height: '20px',
        viewBox: '0 0 20 20',
        width: '20px',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        fill: 'none',
        fillRule: 'evenodd',
        stroke: 'none',
        strokeWidth: '1',
      },
      React__default.createElement(
        'g',
        {
          fill: '#000000',
          fillRule: 'nonzero',
        },
        React__default.createElement('path', {
          d: 'M10,0 C4.48,0 0,4.48 0,10 C0,15.52 4.48,20 10,20 C15.52,20 20,15.52 20,10 C20,4.48 15.52,0 10,0 Z M15,11 L11,11 L11,15 L9,15 L9,11 L5,11 L5,9 L9,9 L9,5 L11,5 L11,9 L15,9 L15,11 Z',
        })
      )
    )
  )
}

var AddIcon = function AddIcon(props) {
  return createElement(Icon, props, createElement(Add, null))
}

var ArrowLeft = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '8px',
        height: '13px',
        viewBox: '0 0 8 13',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-840.000000, -560.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform:
              'translate(845.000000, 567.000000) scale(-1, 1) translate(-845.000000, -567.000000) translate(831.000000, 553.000000)',
          },
          React__default.createElement(
            'g',
            {
              transform: 'translate(3.000000, 1.000000)',
            },
            React__default.createElement('polygon', {
              points:
                '8.59 17.34 13.17 12.75 8.59 8.16 10 6.75 16 12.75 10 18.75',
            })
          )
        )
      )
    )
  )
}

var ArrowLeftIcon = function ArrowLeftIcon(props) {
  return createElement(Icon, props, createElement(ArrowLeft, null))
}

var ArrowRight = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '8px',
        height: '13px',
        viewBox: '0 0 8 13',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-1104.000000, -560.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(1094.000000, 553.000000)',
          },
          React__default.createElement(
            'g',
            {
              transform: 'translate(2.000000, 1.000000)',
            },
            React__default.createElement('polygon', {
              points:
                '8.59 17.34 13.17 12.75 8.59 8.16 10 6.75 16 12.75 10 18.75',
            })
          )
        )
      )
    )
  )
}

var ArrowRightIcon = function ArrowRightIcon(props) {
  return createElement(Icon, props, createElement(ArrowRight, null))
}

var Attach = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '20px',
        height: '11px',
        viewBox: '0 0 20 11',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-1098.000000, -754.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(1096.000000, 747.000000)',
          },
          React__default.createElement('path', {
            d: 'M2,12.5 C2,9.46 4.46,7 7.5,7 L18,7 C20.21,7 22,8.79 22,11 C22,13.21 20.21,15 18,15 L9.5,15 C8.12,15 7,13.88 7,12.5 C7,11.12 8.12,10 9.5,10 L17,10 L17,12 L9.41,12 C8.86,12 8.86,13 9.41,13 L18,13 C19.1,13 20,12.1 20,11 C20,9.9 19.1,9 18,9 L7.5,9 C5.57,9 4,10.57 4,12.5 C4,14.43 5.57,16 7.5,16 L17,16 L17,18 L7.5,18 C4.46,18 2,15.54 2,12.5 Z',
          })
        )
      )
    )
  )
}

var AttachIcon = function AttachIcon(props) {
  return createElement(Icon, props, createElement(Attach, null))
}

var Person = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        viewBox: '0 0 58 58',
        style: {
          enableBackground: 'new 0 0 58 58',
        },
      },
      props
    ),
    React__default.createElement('rect', {
      style: {
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        fill: '#F2F2F2',
      },
      width: '58',
      height: '58',
    }),
    React__default.createElement('path', {
      style: {
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        fill: '#424D57',
      },
      d: 'M40,38c7.3,3.8,11,8.4,11,13.9v6c0,0.2-0.1,0.3-0.2,0.4C47.9,62,6.1,62,6.1,58l0-0.1l0-0.1 v-6c0-5.5,3.7-10.1,11-13.9c1.2-0.7,2-0.2,2-0.2c2.5,2.3,5.8,3.7,9.5,3.7l-0.1,0l0.3,0c3.5-0.1,6.7-1.5,9.1-3.7 C38,37.8,38.8,37.3,40,38z M28.5,17C34.3,17,39,21.7,39,27.5S34.3,38,28.5,38S18,33.3,18,27.5S22.7,17,28.5,17z',
    })
  )
}

var PersonIcon = function PersonIcon(props) {
  return createElement(Icon, props, createElement(Person, null))
}

var Chat = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '28px',
        height: '28px',
        viewBox: '0 0 28 28',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          fill: '#000000',
        },
        React__default.createElement('path', {
          d: 'M14,25.5 C12.4,25.5 10.8,25.2 9.4,24.7 L4.5,27.5 L4.5,21.9 C2,19.6 0.5,16.5 0.5,13 C0.5,6.1 6.5,0.5 14,0.5 C21.5,0.5 27.5,6.1 27.5,13 C27.5,19.9 21.5,25.5 14,25.5 L14,25.5 Z M9,11.5 C8.2,11.5 7.5,12.2 7.5,13 C7.5,13.8 8.2,14.5 9,14.5 C9.8,14.5 10.5,13.8 10.5,13 C10.5,12.2 9.8,11.5 9,11.5 L9,11.5 Z M14,11.5 C13.2,11.5 12.5,12.2 12.5,13 C12.5,13.8 13.2,14.5 14,14.5 C14.8,14.5 15.5,13.8 15.5,13 C15.5,12.2 14.8,11.5 14,11.5 L14,11.5 Z M19,11.5 C18.2,11.5 17.5,12.2 17.5,13 C17.5,13.8 18.2,14.5 19,14.5 C19.8,14.5 20.5,13.8 20.5,13 C20.5,12.2 19.8,11.5 19,11.5 L19,11.5 Z',
        })
      )
    )
  )
}

var ChatIcon = function ChatIcon(props) {
  return createElement(Icon, props, createElement(Chat, null))
}

var CheckboxOff = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '16px',
        height: '16px',
        viewBox: '0 0 16 16',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-861.000000, -556.000000)',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(861.000000, 556.000000)',
          },
          React__default.createElement(
            'g',
            null,
            React__default.createElement('rect', {
              stroke: '#BCC6D0',
              strokeWidth: '1',
              x: '0.5',
              y: '0.5',
              width: '15',
              height: '15',
              rx: '4',
              style: {
                fill: 'none',
              },
            })
          )
        )
      )
    )
  )
}

var CheckboxOffIcon = function CheckboxOffIcon(props) {
  return createElement(Icon, props, createElement(CheckboxOff, null))
}

var CheckboxOn = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '16px',
        height: '16px',
        viewBox: '0 0 16 16',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-861.000000, -526.000000)',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(861.000000, 526.000000)',
          },
          React__default.createElement(
            'g',
            null,
            React__default.createElement('rect', {
              stroke: '#4384F5',
              strokeWidth: '1',
              x: '0.5',
              y: '0.5',
              width: '15',
              height: '15',
              rx: '4',
              style: {
                fill: 'none',
              },
            })
          ),
          React__default.createElement('polygon', {
            fill: '#4384F5',
            points:
              '4 8.17070347 6.8554326 11.0329509 12.4300003 5.44475349 10.9852468 4 6.84861773 8.13662909 5.44475349 6.72594998',
          })
        )
      )
    )
  )
}

var CheckboxOnIcon = function CheckboxOnIcon(props) {
  return createElement(Icon, props, createElement(CheckboxOn, null))
}

var Close = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        height: '14px',
        viewBox: '0 0 14 14',
        width: '14px',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        fill: 'none',
        fillRule: 'evenodd',
        stroke: 'none',
        strokeWidth: '1',
      },
      React__default.createElement('polygon', {
        fill: '#000000',
        points:
          '14 1.41 12.59 8.8817842e-16 7 5.59 1.41 8.8817842e-16 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7',
      })
    )
  )
}

var CloseIcon = function CloseIcon(props) {
  return createElement(Icon, props, createElement(Close, null))
}

var Email = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '18px',
        height: '14px',
        viewBox: '0 0 18 14',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-853.000000, -227.000000)',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(830.000000, 207.000000)',
          },
          React__default.createElement(
            'g',
            null,
            React__default.createElement(
              'g',
              {
                transform: 'translate(22.000000, 17.000000)',
              },
              React__default.createElement('path', {
                d: 'M16.6666667,3.33333333 L3.33333333,3.33333333 C2.41666667,3.33333333 1.675,4.08333333 1.675,5 L1.66666667,15 C1.66666667,15.9166667 2.41666667,16.6666667 3.33333333,16.6666667 L16.6666667,16.6666667 C17.5833333,16.6666667 18.3333333,15.9166667 18.3333333,15 L18.3333333,5 C18.3333333,4.08333333 17.5833333,3.33333333 16.6666667,3.33333333 Z M16.6666667,15 L3.33333333,15 L3.33333333,6.66666667 L10,10.8333333 L16.6666667,6.66666667 L16.6666667,15 Z M10,9.16666667 L3.33333333,5 L16.6666667,5 L10,9.16666667 Z',
                fillOpacity: '0.6',
                fill: '#424D57',
                fillRule: 'nonzero',
              })
            )
          )
        )
      )
    )
  )
}

var EmailIcon = function EmailIcon(props) {
  return createElement(Icon, props, createElement(Email, null))
}

var EmailFilled = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '21px',
        height: '16px',
        viewBox: '0 0 20 16',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement('path', {
        d: 'M18,0 L2,0 C0.9,0 0.01,0.9 0.01,2 L0,14 C0,15.1 0.9,16 2,16 L18,16 C19.1,16 20,15.1 20,14 L20,2 C20,0.9 19.1,0 18,0 Z M17.6,4.25 L10.53,8.67 C10.21,8.87 9.79,8.87 9.47,8.67 L2.4,4.25 C2.15,4.09 2,3.82 2,3.53 C2,2.86 2.73,2.46 3.3,2.81 L10,7 L16.7,2.81 C17.27,2.46 18,2.86 18,3.53 C18,3.82 17.85,4.09 17.6,4.25 Z',
        fill: '#000000',
        fillRule: 'nonzero',
      })
    )
  )
}

var EmailFilledIcon = function EmailFilledIcon(props) {
  return createElement(Icon, props, createElement(EmailFilled, null))
}

var Emoji = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        height: '20px',
        viewBox: '0 0 20 20',
        width: '20px',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        fill: 'none',
        fillRule: 'evenodd',
        stroke: 'none',
        strokeWidth: '1',
      },
      React__default.createElement(
        'g',
        {
          fill: '#000000',
        },
        React__default.createElement('path', {
          d: 'M13.5,9 C14.3,9 15,8.3 15,7.5 C15,6.7 14.3,6 13.5,6 C12.7,6 12,6.7 12,7.5 C12,8.3 12.7,9 13.5,9 L13.5,9 Z M6.5,9 C7.3,9 8,8.3 8,7.5 C8,6.7 7.3,6 6.5,6 C5.7,6 5,6.7 5,7.5 C5,8.3 5.7,9 6.5,9 L6.5,9 Z M10,16 C12.6,16 14.8,14.3 15.7,12 L4.3,12 C5.2,14.3 7.4,16 10,16 L10,16 Z M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C14.4,2 18,5.6 18,10 C18,14.4 14.4,18 10,18 L10,18 Z',
        })
      )
    )
  )
}

var EmojiIcon = function EmojiIcon(props) {
  return createElement(Icon, props, createElement(Emoji, null))
}

var Exit = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '24px',
        height: '24px',
        viewBox: '0 0 24 24',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-963.000000, -248.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(960.000000, 245.000000)',
          },
          React__default.createElement('path', {
            d: 'M12.6125,19.4875 L14.375,21.25 L20.625,15 L14.375,8.75 L12.6125,10.5125 L15.8375,13.75 L3.75,13.75 L3.75,16.25 L15.8375,16.25 L12.6125,19.4875 Z M23.75,3.75 L6.25,3.75 C4.8625,3.75 3.75,4.875 3.75,6.25 L3.75,11.25 L6.25,11.25 L6.25,6.25 L23.75,6.25 L23.75,23.75 L6.25,23.75 L6.25,18.75 L3.75,18.75 L3.75,23.75 C3.75,25.125 4.8625,26.25 6.25,26.25 L23.75,26.25 C25.125,26.25 26.25,25.125 26.25,23.75 L26.25,6.25 C26.25,4.875 25.125,3.75 23.75,3.75 Z',
          })
        )
      )
    )
  )
}

var ExitIcon = function ExitIcon(props) {
  return createElement(Icon, props, createElement(Exit, null))
}

var Hourglass = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '16px',
        height: '26px',
        viewBox: '0 0 16 26',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-967.000000, -284.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(960.000000, 282.000000)',
          },
          React__default.createElement('path', {
            d: 'M7.5,2.5 L7.5,10 L7.5125,10 L7.5,10.0125 L12.5,15 L7.5,20 L7.5125,20.0125 L7.5,20.0125 L7.5,27.5 L22.5,27.5 L22.5,20.0125 L22.4875,20.0125 L22.5,20 L17.5,15 L22.5,10.0125 L22.4875,10 L22.5,10 L22.5,2.5 L7.5,2.5 Z M20,20.625 L20,25 L10,25 L10,20.625 L15,15.625 L20,20.625 Z M15,14.375 L10,9.375 L10,5 L20,5 L20,9.375 L15,14.375 Z',
          })
        )
      )
    )
  )
}

var HourglassIcon = function HourglassIcon(props) {
  return createElement(Icon, props, createElement(Hourglass, null))
}

var Maximize = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        fill: 'none',
        height: '24',
        viewBox: '0 0 24 24',
        width: '24',
      },
      props
    ),
    React__default.createElement('path', {
      d: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
    })
  )
}

var MaximizeIcon = function MaximizeIcon(props) {
  return createElement(Icon, props, createElement(Maximize, null))
}

var MenuVertical = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        height: '4px',
        viewBox: '0 0 16 4',
        width: '16px',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        fill: 'none',
        fillRule: 'evenodd',
        stroke: 'none',
        strokeWidth: '1',
      },
      React__default.createElement(
        'g',
        {
          fill: '#000000',
        },
        React__default.createElement('path', {
          d: 'M2,0 C0.9,0 0,0.9 0,2 C0,3.1 0.9,4 2,4 C3.1,4 4,3.1 4,2 C4,0.9 3.1,0 2,0 Z M14,0 C12.9,0 12,0.9 12,2 C12,3.1 12.9,4 14,4 C15.1,4 16,3.1 16,2 C16,0.9 15.1,0 14,0 Z M8,0 C6.9,0 6,0.9 6,2 C6,3.1 6.9,4 8,4 C9.1,4 10,3.1 10,2 C10,0.9 9.1,0 8,0 Z',
        })
      )
    )
  )
}

var MenuVerticalIcon = function MenuVerticalIcon(props) {
  return createElement(Icon, props, createElement(MenuVertical, null))
}

var Minimize = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        fill: 'none',
        height: '24',
        viewBox: '0 0 24 24',
        width: '24',
      },
      props
    ),
    React__default.createElement('path', {
      d: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
    })
  )
}

var MinimizeIcon = function MinimizeIcon(props) {
  return createElement(Icon, props, createElement(Minimize, null))
}

var Mute = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '16px',
        height: '16px',
        viewBox: '0 0 16 16',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-854.000000, -325.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(830.000000, 207.000000)',
          },
          React__default.createElement(
            'g',
            null,
            React__default.createElement(
              'g',
              {
                transform: 'translate(22.000000, 116.000000)',
              },
              React__default.createElement('path', {
                d: 'M13.75,10 C13.75,8.525 12.9,7.25833333 11.6666667,6.64166667 L11.6666667,8.48333333 L13.7083333,10.525 C13.7333333,10.3583333 13.75,10.1833333 13.75,10 Z M15.8333333,10 C15.8333333,10.7833333 15.6666667,11.5166667 15.3833333,12.2 L16.6416667,13.4583333 C17.1916667,12.425 17.5,11.25 17.5,10 C17.5,6.43333333 15.0083333,3.45 11.6666667,2.69166667 L11.6666667,4.40833333 C14.075,5.125 15.8333333,7.35833333 15.8333333,10 Z M3.55833333,2.5 L2.5,3.55833333 L6.44166667,7.5 L2.5,7.5 L2.5,12.5 L5.83333333,12.5 L10,16.6666667 L10,11.0583333 L13.5416667,14.6 C12.9833333,15.0333333 12.3583333,15.375 11.6666667,15.5833333 L11.6666667,17.3 C12.8166667,17.0416667 13.8583333,16.5083333 14.7416667,15.7916667 L16.4416667,17.5 L17.5,16.4416667 L10,8.94166667 L3.55833333,2.5 Z M10,3.33333333 L8.25833333,5.075 L10,6.81666667 L10,3.33333333 Z',
              })
            )
          )
        )
      )
    )
  )
}

var MuteIcon = function MuteIcon(props) {
  return createElement(Icon, props, createElement(Mute, null))
}

var Unmute = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '16px',
        height: '16px',
        viewBox: '0 0 16 16',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-854.000000, -325.000000)',
          fill: '#FFFFFF',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(830.000000, 207.000000)',
          },
          React__default.createElement('path', {
            d: 'M24.5,123.5 L24.5,128.5 L27.8333333,128.5 L32,132.666667 L32,119.333333 L27.8333333,123.5 L24.5,123.5 Z M35.75,126 C35.75,124.525 34.9,123.258333 33.6666667,122.641667 L33.6666667,129.35 C34.9,128.741667 35.75,127.475 35.75,126 Z M33.6666667,118.691667 L33.6666667,120.408333 C36.075,121.125 37.8333333,123.358333 37.8333333,126 C37.8333333,128.641667 36.075,130.875 33.6666667,131.591667 L33.6666667,133.308333 C37.0083333,132.55 39.5,129.566667 39.5,126 C39.5,122.433333 37.0083333,119.45 33.6666667,118.691667 Z',
          })
        )
      )
    )
  )
}

var UnmuteIcon = function UnmuteIcon(props) {
  return createElement(Icon, props, createElement(Unmute, null))
}

var RadioOff = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '16px',
        height: '16px',
        viewBox: '0 0 16 16',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-861.000000, -656.000000)',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(861.000000, 656.000000)',
          },
          React__default.createElement(
            'g',
            null,
            React__default.createElement('circle', {
              stroke: '#BCC6D0',
              strokeWidth: '1',
              cx: '8',
              cy: '8',
              r: '7.5',
              style: {
                fill: 'none',
              },
            })
          )
        )
      )
    )
  )
}

var RadioOffIcon = function RadioOffIcon(props) {
  return createElement(Icon, props, createElement(RadioOff, null))
}

var RadioOn = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '16px',
        height: '16px',
        viewBox: '0 0 16 16',
        version: '1.1',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-861.000000, -626.000000)',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(861.000000, 626.000000)',
          },
          React__default.createElement(
            'g',
            null,
            React__default.createElement('circle', {
              stroke: '#4384F5',
              strokeWidth: '1',
              cx: '8',
              cy: '8',
              r: '7.5',
              style: {
                fill: 'none',
              },
            })
          ),
          React__default.createElement('circle', {
            fill: '#4384F5',
            cx: '8',
            cy: '8',
            r: '3',
          })
        )
      )
    )
  )
}

var RadioOnIcon = function RadioOnIcon(props) {
  return createElement(Icon, props, createElement(RadioOn, null))
}

var RateBad = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '14px',
        height: '19px',
        viewBox: '0 0 14 19',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-1092.000000, -247.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(832.000000, 237.000000)',
          },
          React__default.createElement('path', {
            d: 'M262.011431,10.0079649 C264.301872,10.0254688 266.149331,11.871012 266.149331,14.141574 L266.149331,15.006151 C266.149331,15.7362453 266.746389,16.3281036 267.482897,16.3281036 L270.483677,16.3281036 C270.679987,16.3281036 270.875953,16.3444026 271.069519,16.3768295 C272.984075,16.6975635 274.27384,18.4961084 273.950288,20.3939919 L273.161331,25.0218442 C272.786728,27.2191809 270.866945,28.8276198 268.618875,28.8276198 L265.455497,28.8276198 C262.442509,28.8276198 260,26.406381 260,23.4196316 L260,12.0040832 C260,10.9016253 260.893719,10.0079066 261.996177,10.0079066 C262.001262,10.0079066 262.006347,10.007926 262.011431,10.0079649 Z M268.206897,24.4827922 L272.086361,24.4827922 L272.086361,25.4442124 L269.168317,25.4442124 C268.637339,25.4442124 268.206897,25.0137699 268.206897,24.4827922 Z M268.206897,22.0689991 L273.056228,22.0689991 L273.056228,23.0304193 L269.168317,23.0304193 C268.637339,23.0304193 268.206897,22.5999768 268.206897,22.0689991 Z M268.206897,19.655206 L273.541161,19.655206 L273.541161,20.6166262 L269.168317,20.6166262 C268.637339,20.6166262 268.206897,20.1861837 268.206897,19.655206 Z M261.939732,23.4196316 C261.939732,25.3444256 263.513794,26.9047795 265.455497,26.9047795 L268.618875,26.9047795 C269.920389,26.9047795 271.031842,25.9735781 271.248717,24.7014358 L272.037675,20.0735835 C272.182715,19.2228081 271.604545,18.4165638 270.746296,18.2727865 C270.659525,18.2582503 270.571678,18.2509439 270.483677,18.2509439 L267.482897,18.2509439 C265.675104,18.2509439 264.209598,16.7982006 264.209598,15.006151 L264.209598,14.141574 C264.209598,12.9271831 263.221501,11.9401098 261.996478,11.930748 L261.939732,11.9303143 L261.939732,23.4196316 Z',
            transform:
              'translate(267.000000, 19.413810) scale(-1, -1) translate(-267.000000, -19.413810) ',
          })
        )
      )
    )
  )
}

var RateBadIcon = function RateBadIcon(props) {
  return createElement(Icon, props, createElement(RateBad, null))
}

var RateGood = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '14px',
        height: '19px',
        viewBox: '0 0 14 19',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        stroke: 'none',
        strokeWidth: '1',
        fill: 'none',
        fillRule: 'evenodd',
      },
      React__default.createElement(
        'g',
        {
          transform: 'translate(-1047.000000, -247.000000)',
          fill: '#424D57',
          fillRule: 'nonzero',
        },
        React__default.createElement(
          'g',
          {
            transform: 'translate(832.000000, 237.000000)',
          },
          React__default.createElement('path', {
            d: 'M217.011431,10.0079649 C219.301872,10.0254688 221.149331,11.871012 221.149331,14.141574 L221.149331,15.006151 C221.149331,15.7362453 221.746389,16.3281036 222.482897,16.3281036 L225.483677,16.3281036 C225.679987,16.3281036 225.875953,16.3444026 226.069519,16.3768295 C227.984075,16.6975635 229.27384,18.4961084 228.950288,20.3939919 L228.161331,25.0218442 C227.786728,27.2191809 225.866945,28.8276198 223.618875,28.8276198 L220.455497,28.8276198 C217.442509,28.8276198 215,26.406381 215,23.4196316 L215,12.0040832 C215,10.9016253 215.893719,10.0079066 216.996177,10.0079066 C217.001262,10.0079066 217.006347,10.007926 217.011431,10.0079649 Z M223.206897,24.4827922 L227.086361,24.4827922 L227.086361,25.4442124 L224.168317,25.4442124 C223.637339,25.4442124 223.206897,25.0137699 223.206897,24.4827922 Z M223.206897,22.0689991 L228.056228,22.0689991 L228.056228,23.0304193 L224.168317,23.0304193 C223.637339,23.0304193 223.206897,22.5999768 223.206897,22.0689991 Z M223.206897,19.655206 L228.541161,19.655206 L228.541161,20.6166262 L224.168317,20.6166262 C223.637339,20.6166262 223.206897,20.1861837 223.206897,19.655206 Z M216.939732,23.4196316 C216.939732,25.3444256 218.513794,26.9047795 220.455497,26.9047795 L223.618875,26.9047795 C224.920389,26.9047795 226.031842,25.9735781 226.248717,24.7014358 L227.037675,20.0735835 C227.182715,19.2228081 226.604545,18.4165638 225.746296,18.2727865 C225.659525,18.2582503 225.571678,18.2509439 225.483677,18.2509439 L222.482897,18.2509439 C220.675104,18.2509439 219.209598,16.7982006 219.209598,15.006151 L219.209598,14.141574 C219.209598,12.9271831 218.221501,11.9401098 216.996478,11.930748 L216.939732,11.9303143 L216.939732,23.4196316 Z',
          })
        )
      )
    )
  )
}

var RateGoodIcon = function RateGoodIcon(props) {
  return createElement(Icon, props, createElement(RateGood, null))
}

var Send = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        height: '18px',
        viewBox: '0 0 21 18',
        width: '21px',
      },
      props
    ),
    React__default.createElement(
      'g',
      {
        fill: 'none',
        fillRule: 'evenodd',
        stroke: 'none',
        strokeWidth: '1',
      },
      React__default.createElement(
        'g',
        {
          fill: '#000000',
        },
        React__default.createElement('polygon', {
          points: '0.01 18 21 9 0.01 0 0 7 15 9 0 11',
        })
      )
    )
  )
}

var SendIcon = function SendIcon(props) {
  return createElement(Icon, props, createElement(Send, null))
}

var Search = function (_ref) {
  var _ref$styles = _ref.styles,
    props = _objectWithoutPropertiesLoose(_ref, ['styles'])

  return React__default.createElement(
    'svg',
    _extends(
      {
        width: '28px',
        height: '28px',
        viewBox: '0 0 512 512',
      },
      props
    ),
    React__default.createElement('path', {
      d: 'M508.5 481.6l-129-129c-2.3-2.3-5.3-3.5-8.5-3.5h-10.3C395 312 416 262.5 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c54.5 0 104-21 141.1-55.2V371c0 3.2 1.3 6.2 3.5 8.5l129 129c4.7 4.7 12.3 4.7 17 0l9.9-9.9c4.7-4.7 4.7-12.3 0-17zM208 384c-97.3 0-176-78.7-176-176S110.7 32 208 32s176 78.7 176 176-78.7 176-176 176z',
    })
  )
}

var SearchIcon = function SearchIcon(props) {
  return createElement(Icon, props, createElement(Search, null))
}

var mapPropsToStyles$3 = function mapPropsToStyles(props) {
  var propsStyle = {}
  var imageStyle = {}
  var size = props.size,
    radius = props.radius,
    fontSize = props.fontSize

  if (size) {
    propsStyle.width = size
    propsStyle.height = size
    propsStyle.lineHeight = size
  }

  if (radius) {
    propsStyle.borderRadius = radius
    imageStyle.borderRadius = radius
  }

  if (fontSize) {
    propsStyle.fontSize = fontSize
  }

  return _extends({}, propsStyle, {
    '& img': imageStyle,
  })
}

var embeddedImageStyle = function embeddedImageStyle(visible) {
  return (
    /*#__PURE__*/
    css(
      'display:block;border-radius:inherit;width:100%;height:100%;object-fit:cover;visibility:',
      visible ? 'visible' : 'hidden',
      ';'
    )
  )
}

var StyledAvatar =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'Avatar',
    mapPropsToStyles: mapPropsToStyles$3,
    target: 'e11ezd0e0',
  })(
    'border:1px solid #fff;border-radius:50%;text-align:center;background-color:#fff;text-transform:uppercase;overflow:hidden;'
  )

var Avatar = function Avatar(props) {
  var _React$useState = useState('pending'),
    imageStatus = _React$useState[0],
    setImageStatus = _React$useState[1]

  var imageStyle = embeddedImageStyle(imageStatus !== 'pending')
  var imgUrl = props.imgUrl,
    letter = props.letter
  var child = null

  if (imageStatus === 'failed') {
    child = createElement(PersonIcon, {
      className: imageStyle,
    })
  } else if (imgUrl) {
    child = createElement('img', {
      src: imgUrl,
      className: imageStyle,
      onLoad: function onLoad() {
        return setImageStatus('loaded')
      },
      onError: function onError() {
        return setImageStatus('failed')
      },
    })
  } else if (letter) {
    child = createElement('span', null, letter)
  } else if (process.env.NODE_ENV === 'development') {
    console.warn('Avatar component expects one of imgUrl or letter props.')
  }

  return createElement(StyledAvatar, props, child)
}

Avatar.propTypes = {
  /** URL of the image */
  imgUrl: string,

  /** Letter to be used instead of the image (when imgUrl is not provided) */
  letter: string,

  /** Avatar size (width and height) */
  size: string,

  /** Override component's styles */
  style: shape(),
}

var forwardBorderRadiuses =
  /*#__PURE__*/
  css(
    '& >:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:0;border-bottom-left-radius:0;}& >:last-child{border-top-left-radius:0;border-top-right-radius:0;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit;}& >:first-child:last-child{border-top-left-radius:inherit;border-top-right-radius:inherit;border-bottom-right-radius:inherit;border-bottom-left-radius:inherit;}'
  )

var useTheme = function useTheme() {
  return useContext(ThemeContext)
}

var useThemeProps = function useThemeProps(displayName) {
  var theme = useTheme()
  var themeProps = useMemo(
    function () {
      return unpackThemeDescription(theme[displayName]).themeProps || {}
    },
    [theme]
  )
  return themeProps
}

var displayName = 'Bubble'

var flipBorderRadiusesHorizontally = function flipBorderRadiusesHorizontally(
  _ref
) {
  var borderTopLeftRadius = _ref.borderTopLeftRadius,
    borderTopRightRadius = _ref.borderTopRightRadius,
    borderBottomRightRadius = _ref.borderBottomRightRadius,
    borderBottomLeftRadius = _ref.borderBottomLeftRadius
  return {
    borderTopLeftRadius: borderTopRightRadius,
    borderTopRightRadius: borderTopLeftRadius,
    borderBottomRightRadius: borderBottomLeftRadius,
    borderBottomLeftRadius: borderBottomRightRadius,
  }
}

var mapPropsToStyles$4 = function mapPropsToStyles(props) {
  var isOwn = props.isOwn,
    ovalBorderRadius = props.ovalBorderRadius,
    sharpBorderRadius = props.sharpBorderRadius,
    radiusType = props.radiusType
  var borderRadiuses = {
    borderTopLeftRadius:
      radiusType === 'single' || radiusType === 'first'
        ? ovalBorderRadius
        : sharpBorderRadius,
    borderTopRightRadius: ovalBorderRadius,
    borderBottomRightRadius: ovalBorderRadius,
    borderBottomLeftRadius:
      radiusType === 'single' || radiusType === 'last'
        ? ovalBorderRadius
        : sharpBorderRadius,
  } // TODO maybe this could be reversed somehow in theme?
  // return isOwn ? flipBorderRadiusesHorizontally(borderRadiuses) : borderRadiuses

  return isOwn ? flipBorderRadiusesHorizontally(borderRadiuses) : borderRadiuses
}

var StyledBubble =
  /*#__PURE__*/
  styled$1(
    function (props) {
      var themeProps = useThemeProps(displayName)
      return createElement('div', _extends({}, themeProps, props))
    },
    {
      displayName: displayName,
      shouldForwardProp: isPropValid,
      mapPropsToStyles: mapPropsToStyles$4,
      target: 'emwkn670',
    }
  )(
    forwardBorderRadiuses,
    ';border:1px solid rgba(0,0,0,0.05);display:inline-block;max-width:100%;margin-bottom:0.1em;& img{max-width:100%;display:block;}'
  )
StyledBubble.propTypes = {
  /** Test of the message */
  children: node,

  /** Message auhor - me (right side) or their (left side) */
  isOwn: bool,

  /** Specifies rendering type, it's used for appropriate corners' rounding */
  radiusType: oneOf(['single', 'first', 'last']),
}

var StyledColumn =
  /*#__PURE__*/
  styled$1('div', {
    target: 'ek650k30',
  })('display:flex;flex-direction:column;min-width:0;')

var mapPropsToStyles$5 = function mapPropsToStyles(props) {
  return {
    flexShrink: props.shrink ? 1 : 0,
  }
}

var StyledFill =
  /*#__PURE__*/
  styled$1('div', {
    mapPropsToStyles: mapPropsToStyles$5,
    target: 'e1jdwequ0',
  })()

var Fill = function Fill(props) {
  return createElement(
    StyledFill,
    _extends(
      {
        flexFill: true,
      },
      props
    )
  )
}

Fill.defaultProps = {
  shrink: true,
}
Fill.propTypes = {
  shrink: bool,
}

var mapPropsToStyles$6 = function mapPropsToStyles(props) {
  return {
    flexShrink: props.shrink ? 1 : 0,
  }
}

var StyledFit =
  /*#__PURE__*/
  styled$1('div', {
    mapPropsToStyles: mapPropsToStyles$6,
    target: 'e1yi1p4d0',
  })()

var Fit = function Fit(props) {
  return createElement(
    StyledFit,
    _extends(
      {
        flexFit: true,
      },
      props
    )
  )
}

Fit.defaultProps = {
  shrink: true,
}
Fit.propTypes = {
  shrink: bool,
}

var StyledButton =
  /*#__PURE__*/
  styled$1('button', {
    displayName: 'IconButton',
    section: true,
    target: 'e1m5b1js0',
  })(
    'appearance:none;background:transparent;border:0;display:inline-block;margin:0;padding:0.5em;color:inherit;&:hover{cursor:',
    function (props) {
      return props.disabled ? 'default' : 'pointer'
    },
    ';}&:active,&:focus{outline:none;}'
  )
StyledButton.propTypes = {
  active: bool,
  disabled: bool,
  children: node.isRequired,
  color: string,
  onClick: func,
}

var _React$createContext = createContext({
    isScrollOnBottom: noop,
    isScrollOnTop: noop,
    registerUnseenListItem: noop,
    scrollToBottom: noop,
    scrollToTop: noop,
  }),
  MessageListProvider = _React$createContext.Provider,
  MessageListSpy = _React$createContext.Consumer

var autoInc = function autoInc(start) {
  if (start === void 0) {
    start = 0
  }

  var counter = start
  return function () {
    return counter++
  }
}

var nextId = autoInc()
var StyledList$1 =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'MessageList',
    target: 'e1i3n9g60',
  })('padding:0.5em;overflow-y:auto;height:100%;')

var MessageList =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(MessageList, _React$Component)

    function MessageList() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this
      _this._listItems = []

      _this._registerUnseenListItem = function (listItemDescription) {
        var id = nextId()

        _this._listItems.push(
          _extends({}, listItemDescription, {
            id: id,
          })
        )

        return _this._unregisterUnseenListItem.bind(
          _assertThisInitialized(_this),
          id
        )
      }

      _this._unregisterUnseenListItem = function (id) {
        var index = findIndex(function (_ref) {
          var itemId = _ref.id
          return itemId === id
        }, _this._listItems)

        if (index === -1) {
          return
        }

        _this._listItems.splice(index, 1)
      }

      _this._getListRef = function (ref) {
        _this.listRef = ref

        _this.props.innerRef(ref)
      }

      _this._handleScroll = throttle(300, function (event) {
        if (_this.props.active) {
          _this.callSeenCallbacks()
        }

        _this.props.onScroll(event)
      })
      _this._context = {
        isScrollOnBottom: _this.props.isScrollOnBottom,
        isScrollOnTop: _this.props.isScrollOnTop,
        registerUnseenListItem: _this._registerUnseenListItem,
        scrollToBottom: _this.props.scrollToBottom,
        scrollToTop: _this.props.scrollToTop,
      }
      return _this
    }

    var _proto = MessageList.prototype

    _proto.componentDidMount = function componentDidMount() {
      if (this.props.active === true) {
        this.callSeenCallbacks()
      }
    }

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      if (prevProps.active === false && this.props.active === true) {
        this.callSeenCallbacks()
      }
    }

    _proto.callSeenCallbacks = function callSeenCallbacks() {
      var _this2 = this

      this._listItems.forEach(function (listItem) {
        if (!isAboveFold(_this2.listRef, listItem.ref)) {
          return
        }

        listItem.onSeen()
      })
    }

    _proto.render = function render() {
      return createElement(
        MessageListProvider,
        {
          value: this._context,
        },
        createElement(
          StyledList$1,
          _extends({}, this.props, {
            innerRef: this._getListRef,
            onScroll: this._handleScroll,
          })
        )
      )
    }

    return MessageList
  })(Component)

MessageList.propTypes = {
  /** This prop tell us if we should call onSeen callbacks from contained MessageListItems when scrolling */
  active: bool,

  /** Children of the list */
  children: node.isRequired,

  /** Prop used as function ref to the underlaying DOM element */
  innerRef: func,

  /** Callback hooked into list's scroll event */
  onScroll: func,
}
MessageList.defaultProps = {
  active: true,
  innerRef: noop,
  onScroll: noop,
}
var MessageList$1 = withPinnedScroll()(MessageList)

var MessageListItem =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(MessageListItem, _React$Component)

    function MessageListItem() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this
      _this._unregisterFromMessageList = noop
      _this._registerInMessageList = memoizeOne(function (register) {
        return function (ref) {
          // this only handles null ref (when it stops to listen to onSeen - when this.props.seen transition from true to false)
          _this._unregisterFromMessageList()

          if (!ref) {
            return
          }

          _this._unregisterFromMessageList = register({
            ref: ref,
            onSeen: _this.props.onSeen,
          })
        }
      })
      return _this
    }

    var _proto = MessageListItem.prototype

    _proto.componentWillUnmount = function componentWillUnmount() {
      this._unregisterFromMessageList()
    }

    _proto.render = function render() {
      var _this2 = this

      return createElement(MessageListSpy, null, function (_ref) {
        var registerUnseenListItem = _ref.registerUnseenListItem
        return createElement(
          'div',
          {
            ref: _this2.props.seen
              ? null
              : _this2._registerInMessageList(registerUnseenListItem),
          },
          Children.only(_this2.props.children)
        )
      })
    }

    return MessageListItem
  })(Component)

MessageListItem.propTypes = {
  children: node.isRequired,
  onSeen: func,
}
MessageListItem.defaultProps = {
  onSeen: noop,
}

var fade =
  /*#__PURE__*/
  css(
    '&-enter{opacity:0;height:0;}&-enter&-enter-active{opacity:1;height:1.2em;transition:height 200ms ease-in-out,opacity 100ms ease-in-out 100ms;}&-exit{opacity:1;height:1.2em;}&-exit&-exit-active{opacity:0;height:0;transition:height 100ms ease-in-out 100ms,opacity 200ms ease-in-out;}'
  )

var Fade = function Fade(_ref) {
  var children = _ref.children,
    props = _objectWithoutPropertiesLoose(_ref, ['children'])

  return createElement(
    CSSTransition,
    _extends({}, props, {
      classNames: fade,
      timeout: 200,
    }),
    children
  )
}

Fade.propTypes = {
  children: node,
}

var mapPropsToStyles$7 = function mapPropsToStyles(_ref) {
  var horizontalAlign = _ref.horizontalAlign

  if (!horizontalAlign) {
    return null
  }

  return {
    flexDirection: horizontalAlign === 'left' ? 'row' : 'row-reverse',
  }
} // TODO: check out if this element should be flex, seems it might be some leftover, need to check all browsers

var StyledMessage =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'Message',
    mapPropsToStyles: mapPropsToStyles$7,
    section: true,
    target: 'e10ccb470',
  })(
    'display:flex;align-items:flex-start;font-size:0.9em;margin:0.3em;max-width:100%;'
  )
var AuthorName =
  /*#__PURE__*/
  styled$1('span', {
    displayName: 'AuthorName',
    target: 'e10ccb471',
  })('font-size:0.8em;')
var MessageMeta =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'MessageMeta',
    target: 'e10ccb472',
  })('text-align:left;')
var Content =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'Content',
    target: 'e10ccb473',
  })(
    'display:flex;flex-direction:column;overflow:hidden;align-items:flex-start;'
  )
var Time =
  /*#__PURE__*/
  styled$1('span', {
    displayName: 'Time',
    target: 'e10ccb474',
  })('font-size:0.8em;')
var Status =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'Status',
    target: 'e10ccb475',
  })('text-align:right;font-size:0.8em;')

var Message =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(Message, _React$Component)

    function Message() {
      return _React$Component.apply(this, arguments) || this
    }

    var _proto = Message.prototype

    _proto.render = function render() {
      var _this$props = this.props,
        children = _this$props.children,
        authorName = _this$props.authorName,
        deliveryStatus = _this$props.deliveryStatus,
        isOwn = _this$props.isOwn,
        date = _this$props.date,
        showMetaOnClick = _this$props.showMetaOnClick,
        onSeen = _this$props.onSeen,
        radiusType = _this$props.radiusType,
        seen = _this$props.seen,
        props = _objectWithoutPropertiesLoose(_this$props, [
          'children',
          'authorName',
          'deliveryStatus',
          'isOwn',
          'date',
          'showMetaOnClick',
          'onSeen',
          'radiusType',
          'seen',
        ])

      var message = createElement(Toggle, null, function (_ref2) {
        var authorOpened = _ref2.on,
          getElementTogglerProps = _ref2.getElementTogglerProps
        return createElement(
          StyledMessage,
          _extends({}, getElementTogglerProps(props), {
            own: isOwn,
            tabIndex: null,
          }),
          createElement(
            Content,
            null,
            createElement(
              TransitionGroup,
              null,
              (!showMetaOnClick || authorOpened) &&
                createElement(
                  Fade,
                  null,
                  createElement(
                    MessageMeta,
                    null,
                    authorName &&
                      createElement(AuthorName, null, authorName, ' '),
                    date && createElement(Time, null, date)
                  )
                )
            ),
            children,
            deliveryStatus && createElement(Status, null, deliveryStatus)
          )
        )
      })
      return createElement(
        MessageListItem,
        {
          onSeen: onSeen,
          seen: seen,
        },
        message
      )
    }

    return Message
  })(Component)

Message.propTypes = {
  /** Message author's name */
  authorName: string,
  authorOpened: bool,

  /** Message children components */
  children: node,

  /** Message date */
  date: string,
  deliveryStatus: string,

  /** Message author - agent (left side) or visitor (right side) */
  isOwn: bool,
  onClick: func,

  /** Callback called when the user scrolls the list to the message. Message must be wrapped by MessageList component. */
  onSeen: func,
  showMetaOnClick: bool,

  /** Override component's styles */
  style: shape(),
  toggleAuthor: func,

  /** Specifies rendering type, it's used for appropriate corners' rounding */
  radiusType: oneOf(['single', 'first', 'last']),
  seen: bool,
}
Message.defaultProps = {
  onClick: function onClick() {},
  seen: false,
}

var SubTitle =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'SubTitle',
    target: 'e1fut3qs0',
  })('font-weight:300;opacity:0.7;')
SubTitle.defaultProps = {
  textWrap: true,
}

var Title =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'Title',
    target: 'e9xf8br0',
  })('font-weight:500;')
Title.defaultProps = {
  textWrap: true,
}

var warnOnce = once(console.warn.bind(console))
var StyledTitle =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'MessageTitle',
    target: 'e1ykjxgu0',
  })('font-weight:600;padding:1em;')
var marginBottomClass =
  /*#__PURE__*/
  css('margin-bottom:4px;')

var MessageTitle = function MessageTitle(_ref) {
  var children = _ref.children,
    title = _ref.title,
    subtitle = _ref.subtitle,
    props = _objectWithoutPropertiesLoose(_ref, [
      'children',
      'title',
      'subtitle',
    ])

  if (
    process.env.NODE_ENV !== 'production' &&
    children &&
    (title || subtitle)
  ) {
    // eslint-disable-next-line no-console
    warnOnce(
      [
        'You should not use title nor subtitle & children props together.',
        'They cannot be rendered at once - children prop has higher rendering priority.',
      ].join('\n')
    )
  }

  var childs = children
    ? children
    : [
        title &&
          createElement(
            Title,
            {
              key: 'title',
              className: marginBottomClass,
            },
            title
          ),
        subtitle &&
          createElement(
            SubTitle,
            {
              key: 'subtitle',
              preserveLines: true,
            },
            subtitle
          ),
      ]
  return createElement(StyledTitle, props, childs)
}

MessageTitle.propTypes = {
  children: oneOfType([arrayOf(node), node]),
  subtitle: string,
  title: string,
}

var StyledText =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'MessageText',
    target: 'eovu8nx0',
  })(
    'white-space:pre-line;word-wrap:break-word;overflow-wrap:break-word;max-width:100%;padding:1em;'
  )

var mapPropsToStyles$8 = function mapPropsToStyles(props) {
  var _ref = props.style || {},
    borderTopLeftRadius = _ref.borderTopLeftRadius,
    borderTopRightRadius = _ref.borderTopRightRadius,
    borderBottomRightRadius = _ref.borderBottomRightRadius,
    borderBottomLeftRadius = _ref.borderBottomLeftRadius

  return {
    img: {
      borderTopLeftRadius: borderTopLeftRadius,
      borderTopRightRadius: borderTopRightRadius,
      borderBottomRightRadius: borderBottomRightRadius,
      borderBottomLeftRadius: borderBottomLeftRadius,
    },
  }
}

var StyledMedia =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'MessageMedia',
    mapPropsToStyles: mapPropsToStyles$8,
    target: 'evmhqt80',
  })('overflow:hidden;')

var borderColor = 'rgba(0, 0, 0, 0.1)'
var border = '1px solid ' + borderColor
var StyledButtons =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'MessageButtons',
    target: 'edowbh60',
  })(
    forwardBorderRadiuses,
    ';& >:first-child{border-top:',
    border,
    ';}&:first-child >:first-child{border-top:0;}& >:last-child{border-bottom:',
    border,
    ';}&:last-child >:last-child{border-bottom:0;}> *{border-color:',
    borderColor,
    ' !important;}'
  )

var getDarker = darken(0.2)

var mapPropsToStyles$9 = function mapPropsToStyles(props) {
  // TODO: fix color here
  var color = props.primary ? props.theme.vars['--primary-color'] : 'black'
  var darkerColor = getDarker(color)
  return {
    borderColor: color,
    color: color,
    ':hover': {
      color: darkerColor,
      borderColor: darkerColor,
    },
  }
}

var StyledButton$1 =
  /*#__PURE__*/
  styled$1(
    function (_ref) {
      var href = _ref.href,
        props = _objectWithoutPropertiesLoose(_ref, ['href'])

      if (!href) {
        return createElement('button', props)
      }

      return createElement(
        'a',
        _extends(
          {
            href: href,
            rel: 'nofollow noopener',
          },
          props
        )
      )
    },
    {
      displayName: 'Button',
      mapPropsToStyles: mapPropsToStyles$9,
      shouldForwardProp: isPropValid,
      target: 'e1972fzd0',
    }
  )(
    'border-width:1px;border-style:solid;background-color:#fff;font-size:1em;font-family:inherit;text-align:center;text-decoration:none;appearance:none;padding:0.8em;transition:box-shadow 0.1s,color 0.1s,border-color 0.2s;&:hover{cursor:pointer;}&:active{box-shadow:none;outline:none;}&:focus{box-shadow:none;outline:none;}&[disabled]{pointer-events:none;}'
  )

var Button = function Button(_ref2) {
  var label = _ref2.label,
    props = _objectWithoutPropertiesLoose(_ref2, ['label'])

  return createElement(StyledButton$1, props, label)
}

Button.propTypes = {
  /** Button's label */
  label: string,
}

var StyledButton$2 =
  /*#__PURE__*/
  styled$1(Button, {
    target: 'e121y1dq0',
  })(
    'display:inline-block;width:100%;border-left:0;border-right:0;border-top:0;border-bottom-color:rgba(0,0,0,0.1);box-shadow:none;transition:background-color 0.1s;background:transparent;color:',
    function (props) {
      return props.disabled ? '#8D9BA9' : 'inherit'
    },
    ';margin:0;&:hover{border-bottom-color:rgba(0,0,0,0.15);background:rgba(0,0,0,0.02);color:inherit;}&:active{background:rgba(0,0,0,0.04);color:inherit;}'
  )

var MessageButton =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(MessageButton, _React$Component)

    function MessageButton() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this

      _this.handleClick = function (event) {
        event.stopPropagation()

        _this.props.onClick(event)
      }

      return _this
    }

    var _proto = MessageButton.prototype

    _proto.render = function render() {
      return createElement(
        StyledButton$2,
        _extends({}, this.props, {
          onClick: this.handleClick,
        })
      )
    }

    return MessageButton
  })(Component)

MessageButton.propTypes = {
  className: string,

  /** Button's label */
  label: string,
  onClick: func,
  primary: bool,

  /** Button's value */
  value: oneOfType([string, number]),
}
MessageButton.defaultProps = {
  onClick: noop,
}

var compactChildren = function compactChildren(children) {
  return Children.toArray(children).filter(Boolean)
}
var hasControlledProps = function hasControlledProps(controlledList, ownProps) {
  return (
    values(pick(controlledList, ownProps)).filter(function (prop) {
      return prop !== undefined
    }).length > 0
  )
}

var SINGLE = {
  radiusType: 'single',
}
var FIRST = {
  radiusType: 'first',
}
var LAST = {
  radiusType: 'last',
}
var hideMetaProps = {
  authorName: null,
  date: null,
}

var mapPropsToStyles$a = function mapPropsToStyles(props) {
  if (props.isOwn) {
    return {
      flexDirection: 'row-reverse',
    }
  }

  return null
}

var StyledGroup =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'MessageGroup',
    mapPropsToStyles: mapPropsToStyles$a,
    target: 'eslhdd60',
  })('display:flex;margin-bottom:1em;')
var AvatarWrapper =
  /*#__PURE__*/
  styled$1('div', {
    target: 'eslhdd61',
  })(
    'display:flex;flex-direction:column;align-items:center;text-align:center;font-size:0.7em;line-height:1.6em;',
    function (props) {
      return {
        minWidth: props.theme.Avatar.size,
        margin: props.isOwn ? '0 0 0 .3em' : '0 .3em 0 0',
      }
    },
    ';'
  )
var messageGropContainerStyle =
  /*#__PURE__*/
  css('overflow:hidden;')

var MessageGroup = function MessageGroup(_ref) {
  var avatar = _ref.avatar,
    avatarLetter = _ref.avatarLetter,
    children = _ref.children,
    onlyFirstWithMeta = _ref.onlyFirstWithMeta,
    props = _objectWithoutPropertiesLoose(_ref, [
      'avatar',
      'avatarLetter',
      'children',
      'onlyFirstWithMeta',
    ])

  var compactedChildren = compactChildren(children)
  var childrenCount = Children.count(compactedChildren)
  return createElement(
    StyledGroup,
    props,
    (avatar || avatarLetter) &&
      createElement(
        AvatarWrapper,
        {
          flexFit: true,
          isOwn: props.isOwn,
        },
        createElement(Avatar, {
          imgUrl: avatar,
          letter: avatarLetter,
        })
      ),
    createElement(
      Fill,
      {
        className: messageGropContainerStyle,
      },
      Children.map(compactedChildren, function (child, index) {
        if (childrenCount === 1) {
          return cloneElement(child, SINGLE)
        }

        if (index === 0) {
          return cloneElement(child, FIRST)
        }

        var hideMeta = onlyFirstWithMeta && index > 0

        if (index === childrenCount - 1) {
          return cloneElement(
            child,
            hideMeta ? _extends({}, LAST, {}, hideMetaProps) : LAST
          )
        }

        return hideMeta ? cloneElement(child, hideMetaProps) : child
      })
    )
  )
}

MessageGroup.propTypes = {
  /** Message author's avatar URL */
  avatar: string,

  /** Message author's initials (if no URL is passed) */
  avatarLetter: string,

  /** Component's children nodes - i.e. Message components */
  children: node,

  /** Message author - agent (left side) or visitor (right side) */
  isOwn: bool,
  onlyFirstWithMeta: bool,
}

var darkTheme = {
  vars: {
    'primary-color': '#0d449b',
    'secondary-color': '#3a3a3a',
    'tertiary-color': 'rgba(0, 0, 0, 0.8)',
  },
  AgentBar: {
    css: {
      color: '#fff',
    },
    IconButton: {
      css: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '50%',
        padding: '1em',
        margin: '.3em',
      },
    },
    Icon: {
      css: {
        transform: 'scale(0.7)',
      },
    },
  },
  Bubble: {
    css: {
      color: '#fff',
    },
  },
  TitleBar: {
    css: {
      background: '#3a3a3a',
      borderRadius: '1.2em 1.2em 0 0',
      padding: '.5em',
    },
  },
  FixedWrapperMaximized: {
    css: {
      borderRadius: '1.2em',
      overflow: 'hidden',
      height: '660px',
    },
  },
  Message: {
    secondaryTextColor: '#fff',
  },
  TextComposer: {
    css: {
      background: '#eaeaea',
    },
  },
  TextInput: {
    css: {
      background: '#eaeaea',
    },
  },
}

var purpleTheme = {
  vars: {
    'primary-color': '#6D5BBA',
    'secondary-color': '#3a3a3a',
    'tertiary-color': 'rgba(0, 0, 0, 0.8)',
  },
  Avatar: {
    size: '20px',
    css: {
      boxShadow: '0 .1em 1em rgba(0, 0, 0, 0.3)',
    },
  },
  AgentBar: {
    css: {
      color: '#fff',
      background: 'linear-gradient(to right, #6D5BBA, #8D58BF)',
      borderRadius: '.5em',
      marginBottom: '.7em',
      boxShadow: '0 .1em 1em rgba(0, 0, 0, 0.3)',
    },
  },
  TitleBar: {
    css: {
      background: 'transparent',
      borderRadius: '.5em',
      marginBottom: '.5em',
      padding: '0',
    },
    IconButton: {
      css: {
        background: 'linear-gradient(to right, #6D5BBA, #8D58BF)',
        borderRadius: '8px',
        padding: '1em',
        margin: '.3em',
        boxShadow: '0 .1em 1em rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MessageList: {
    css: {
      background: 'linear-gradient(to right, #6D5BBA, #8D58BF)',
      marginBottom: '.7em',
      borderRadius: '.5em',
      boxShadow: '0 .1em 1em rgba(0, 0, 0, 0.3)',
    },
  },
  TextComposer: {
    css: {
      borderRadius: '.5em',
      marginBottom: '.7em',
      boxShadow: '0 .1em 1em rgba(0, 0, 0, 0.3)',
    },
  },
  Message: {
    secondaryTextColor: '#fff',
    own: {
      Bubble: {
        css: {
          color: '#fff',
          background: '#AA8BD2',
        },
      },
    },
  },
  Bubble: {
    ovalBorderRadius: '.4em',
    sharpBorderRadius: '.4em',
    css: {
      color: '#5A6976',
      background: '#fff',
      fontSize: '14px',
    },
  },
  FixedWrapperMaximized: {
    css: {
      width: '280px',
    },
  },
}

var elegantTheme = {
  vars: {
    'primary-color': '#5A6976',
  },
  Avatar: {
    size: '20px',
    css: {
      boxShadow: '0 .1em 1em rgba(0, 0, 0, 0.3)',
    },
  },
  FixedWrapperMaximized: {
    css: {
      width: '310px',
      borderRadius: 0,
      boxShadow: '0 .1em 1em rgba(0, 0, 0, 0.3)',
    },
  },
  AgentBar: {
    css: {
      color: '#000',
      background: '#fff',
    },
    Avatar: {
      css: {
        boxShadow: 'none',
      },
    },
  },
  TitleBar: {
    css: {
      color: '#000',
      background: '#fff',
    },
    Icon: {
      color: '#D9A646',
    },
  },
  MessageList: {
    css: {
      background: 'rgba(0, 0, 0, 0.8)',
    },
  },
  Bubble: {
    sharpBorderRadius: '.4em',
    ovalBorderRadius: '.4em',
  },
}

var LIGHT_BLUE = '#427fe1'
var WHITE = '#fff'
var defaultTheme = {
  vars: {
    'primary-color': LIGHT_BLUE,
    'secondary-color': '#fbfbfb',
    'tertiary-color': WHITE,
  },
  AgentBar: {
    Avatar: {
      size: '42px',
      css: {
        marginRight: '.6em',
      },
    },
    css: {
      backgroundColor: 'var(--secondary-color)',
    },
  },
  Avatar: {
    size: '30px',
  },
  Bubble: {
    sharpBorderRadius: '0.3em',
    ovalBorderRadius: '1.4em',
    css: {
      backgroundColor: {
        default: 'var(--secondary-color)',
        bot: 'green',
      },
    },
  },
  Button: {},
  ChatListItem: {
    Avatar: {
      css: {
        marginRight: '.5em',
      },
    },
  },
  FixedWrapperMaximized: {
    animationDuration: 100,
    width: '400px',
    height: '500px',
  },
  FixedWrapperMinimized: {
    animationDuration: 100,
  },
  FixedWrapperRoot: {
    position: 'right',
    css: {},
  },
  Message: {
    secondaryTextColor: '#000',
    horizontalAlign: 'left',
    own: {
      horizontalAlign: 'right',
      Bubble: {
        css: {
          backgroundColor: 'var(--primary-color)',
          color: WHITE,
        },
      },
      Content: {
        css: {
          alignItems: 'flex-end',
        },
      },
      MessageMeta: {
        css: {
          textAlign: 'right',
        },
      },
      Time: {
        css: {
          textAlign: 'right',
        },
      },
    },
    bot: {
      Bubble: {
        css: {
          backgroundColor: 'green',
        },
      },
    },
  },
  MessageButtons: {},
  MessageGroup: {},
  MessageList: {
    css: {
      backgroundColor: 'var(--tertiary-color)',
    },
  },
  MessageMedia: {},
  MessageText: {},
  MessageTitle: {},
  QuickReply: {
    css: {
      borderColor: 'var(--primary-color)',
      backgroundColor: '#fff',
      color: 'var(--primary-color)',
    },
  },
  TextComposer: {
    // TODO: this is a color for text, but sounds like a color for background
    inputColor: '#000',
    Icon: {
      color: '#aaa',
    },
    IconButton: {
      active: {
        Icon: {
          color: 'var(--primary-color)',
        },
      },
    },
  },
  TitleBar: {
    iconsColor: '#fff',
    behaviour: 'default',
    css: {
      backgroundColor: 'var(--primary-color)',
    },
  },
}

var parseTheme = function parseTheme(theme) {
  var componentKeys = pickComponentKeys(theme)

  if (Object.keys(componentKeys).length === 0) {
    return _extends({}, theme, {
      vars: mapKeys(function (key) {
        return '--' + key
      }, theme.vars || {}),
    })
  }

  return _extends(
    {},
    theme,
    {},
    mapValues(function (component) {
      return _extends({}, parseTheme(component), {
        css: component.css || {},
      })
    }, componentKeys),
    {
      vars: mapKeys(function (key) {
        return '--' + key
      }, theme.vars || {}),
    }
  )
}

var TopLevelThemeProvider = function TopLevelThemeProvider(_ref) {
  var _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? {} : _ref$theme,
    children = _ref.children
  var parsed = parseTheme(merge(defaultTheme, theme))
  return createElement(
    ThemeProvider,
    {
      value: parsed,
    },
    children
  )
}

// TODO: hover states and such should be handled - tweak at least borderColor, and backgroundColor

var StyledReply =
  /*#__PURE__*/
  styled$1('button', {
    displayName: 'QuickReply',
    target: 'e1gt5po80',
  })(
    'border-width:1px;border-style:solid;font-size:1em;line-height:1em;appearance:none;transition:box-shadow 0.1s,color 0.1s,border-color 0.2s;margin:0.25em;background-color:#fff;border-radius:1.4em;box-shadow:0 0.1em 0.1em 0 rgba(32,34,40,0.05);font-weight:400;overflow:hidden;padding:0.375em 1em 0.5em;word-break:break-word;&:hover{cursor:pointer;}&:active,&:focus{box-shadow:none;outline:none;background-color:rgba(0,0,0,0.05);}'
  )

var QuickReply =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(QuickReply, _React$Component)

    function QuickReply() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this

      _this._handleClick = function (event) {
        // TODO: discuss during review - button already has native value
        // QuickReply might not need onSelect, just onClick, and one can read the value by accessing event.target.value
        // QuickReplies OTOH needs onSelect
        _this.props.onSelect(_this.props.value)

        _this.props.onClick(event)
      }

      return _this
    }

    var _proto = QuickReply.prototype

    _proto.render = function render() {
      return createElement(
        StyledReply,
        _extends({}, this.props, {
          onClick: this._handleClick,
        })
      )
    }

    return QuickReply
  })(Component)

QuickReply.defaultProps = {
  onClick: noop,
  onSelect: noop,
}
QuickReply.propTypes = {
  children: node.isRequired,
  onClick: func,
  onSelect: func,
  value: oneOfType([string, number]),
}

// eslint-disable-next-line no-console

var warnOnce$1 = once(console.warn.bind(console))
var StyledReplies =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'QuickReplies',
    target: 'e1dnb9qc0',
  })(
    'display:flex;flex-wrap:wrap;text-align:center;justify-content:center;width:100%;'
  )

var QuickReplies =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(QuickReplies, _React$Component)

    function QuickReplies() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this

      _this._handleSelect = function (value) {
        return _this.props.onSelect(value)
      }

      return _this
    }

    var _proto = QuickReplies.prototype

    _proto.render = function render() {
      var _this2 = this

      // eslint-disable-next-line no-unused-vars
      var _this$props = this.props,
        children = _this$props.children,
        replies = _this$props.replies,
        onSelect = _this$props.onSelect,
        props = _objectWithoutPropertiesLoose(_this$props, [
          'children',
          'replies',
          'onSelect',
        ])

      if (process.env.NODE_ENV !== 'production' && children && replies) {
        // eslint-disable-next-line no-console
        warnOnce$1(
          [
            'You should not use replies & children props together.',
            'They cannot be rendered at once - children prop has higher rendering priority.',
          ].join('\n')
        )
      }

      var childs = children
        ? compactChildren(children)
        : replies.map(function (reply, index) {
            return createElement(
              QuickReply,
              {
                key: index,
                value: reply,
              },
              reply
            )
          })
      return createElement(
        StyledReplies,
        props,
        Children.map(childs, function (child) {
          return cloneElement(child, {
            onSelect: _this2._handleSelect,
          })
        })
      )
    }

    return QuickReplies
  })(Component)

QuickReplies.defaultProps = {
  onSelect: noop,
}
QuickReplies.propTypes = {
  children: node,
  onSelect: func,
  replies: arrayOf(string),
}

var StyledBar$1 =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'TitleBar',
    section: true,
    target: 'e1ohfhv0',
  })(
    'display:flex;justify-content:center;align-items:center;width:100%;border:#000;color:#fff;position:relative;z-index:2;text-align:center;padding:0.4em;'
  )
var Title$1 =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'TitleBarTitle',
    target: 'e1ohfhv1',
  })(
    'width:100%;margin:0;margin-bottom:4px;padding:0 2px;text-align:center;font-size:0.9em;flex-grow:1;'
  )

var TitleBar = function TitleBar(_ref) {
  var leftIcons = _ref.leftIcons,
    rightIcons = _ref.rightIcons,
    title = _ref.title,
    props = _objectWithoutPropertiesLoose(_ref, [
      'leftIcons',
      'rightIcons',
      'title',
    ])

  return createElement(
    StyledBar$1,
    props,
    leftIcons,
    createElement(
      Title$1,
      {
        ellipsis: true,
      },
      title
    ),
    rightIcons
  )
}

TitleBar.propTypes = {
  leftIcons: arrayOf(node),
  rightIcons: arrayOf(node),
  theme: shape(),
  title: node,
}

var _React$createContext$1 = createContext(),
  ComposerProvider = _React$createContext$1.Provider,
  ComposerSpy = _React$createContext$1.Consumer
var StyledComposer =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'TextComposer',
    section: true,
    target: 'eyij3xx0',
  })('padding:0.5em;background:#fff;border-top:1px solid rgba(0,0,0,0.1);')

var TextComposer =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(TextComposer, _React$Component)

    function TextComposer() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this
      _this.state = {
        value: _this._getValue({
          value: _this.props.defaultValue,
        }),
      }

      _this._handleButtonClick = function (event) {
        var sent = _this.maybeSend()

        if (!sent) {
          return
        }

        _this.props.onButtonClick(event)
      }

      _this._handleChange = function (event) {
        var value = event.target.value

        if (!_this._isControlled()) {
          _this.setState({
            value: value,
          })
        }

        _this.props.onValueChange(value)

        _this.props.onChange(event)
      }

      _this._handleInputRef = function (ref) {
        _this._inputRef = ref

        _this.props.inputRef(ref)
      }

      _this._handleKeyDown = function (event) {
        var onKeyDown = _this.props.onKeyDown

        if (wasOnlyEnterPressed(event)) {
          event.preventDefault()
        }

        if (!wasEnterPressed(event) || wasNewLineIntended(event)) {
          onKeyDown(event)
          return
        }

        _this.maybeSend()

        onKeyDown(event)
      }

      _this.maybeSend = function () {
        if (!_this._canSend()) {
          return false
        }

        if (!_this._isControlled()) {
          _this.setState({
            value: '',
          })
        }

        _this.props.onValueChange('')

        _this.props.onSend(trimEnd(_this.state.value))

        return true
      }

      return _this
    }

    var _proto = TextComposer.prototype

    _proto._getValue = function _getValue(state, props) {
      if (state === void 0) {
        state = this.state
      }

      if (props === void 0) {
        props = this.props
      }

      return this._isControlled() ? props.value : state.value
    }

    _proto._canSend = function _canSend() {
      return this.props.active && this.state.value.trim() !== ''
    }

    _proto._isControlled = function _isControlled() {
      return this.props.value === 'string'
    }

    _proto.componentDidUpdate = function componentDidUpdate(
      prevProps,
      prevState
    ) {
      var value = this._getValue()

      var prevValue = this._getValue(prevState, prevProps)

      if (value !== prevValue && value === '') {
        this._inputRef.focus()
      }
    }

    _proto.render = function render() {
      // eslint-disable-next-line no-unused-vars
      var _this$props = this.props,
        active = _this$props.active,
        children = _this$props.children,
        defaultValue = _this$props.defaultValue,
        onButtonClick = _this$props.onButtonClick,
        onChange = _this$props.onChange,
        onKeyDown = _this$props.onKeyDown,
        onSend = _this$props.onSend,
        onValueChange = _this$props.onValueChange,
        value = _this$props.value,
        props = _objectWithoutPropertiesLoose(_this$props, [
          'active',
          'children',
          'defaultValue',
          'onButtonClick',
          'onChange',
          'onKeyDown',
          'onSend',
          'onValueChange',
          'value',
        ])

      var contextValue = {
        active: this._canSend(),
        inputRef: this._handleInputRef,
        value: this._getValue(),
        maybeSend: this.maybeSend,
        onButtonClick: this._handleButtonClick,
        onChange: this._handleChange,
        onKeyDown: this._handleKeyDown,
      }
      return createElement(
        ComposerProvider,
        {
          value: contextValue,
        },
        createElement(StyledComposer, props, children)
      )
    }

    return TextComposer
  })(Component)

TextComposer.propTypes = {
  active: bool,
  children: node,
  defaultValue: string,
  inputRef: func,
  onButtonClick: func,
  onChange: func,
  onKeyDown: func,
  onSend: func,
  value: string,
}
TextComposer.defaultProps = {
  active: true,
  defaultValue: '',
  inputRef: noop,
  onButtonClick: noop,
  onChange: noop,
  onKeyDown: noop,
  onSend: noop,
  onValueChange: noop,
}

var withComposer = function (mapComposerToProps) {
  if (mapComposerToProps === void 0) {
    mapComposerToProps = identity
  }

  return function (WrappedComponent) {
    var _class, _temp

    return (
      (_temp = _class =
        /*#__PURE__*/
        (function (_React$Component) {
          _inheritsLoose(WithComposer, _React$Component)

          function WithComposer() {
            return _React$Component.apply(this, arguments) || this
          }

          var _proto = WithComposer.prototype

          _proto.render = function render() {
            var _this = this

            return createElement(ComposerSpy, null, function (context) {
              return createElement(
                WrappedComponent,
                _extends(
                  {},
                  _this.props,
                  mapComposerToProps(context, _this.props)
                )
              )
            })
          }

          return WithComposer
        })(Component)),
      (_class.displayName =
        'withComposer(' + getDisplayName(WrappedComponent) + ')'),
      _temp
    )
  }
}

var SendButton =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(SendButton, _React$Component)

    function SendButton() {
      return _React$Component.apply(this, arguments) || this
    }

    var _proto = SendButton.prototype

    _proto.render = function render() {
      var _this$props = this.props,
        icon = _this$props.icon,
        restProps = _objectWithoutPropertiesLoose(_this$props, ['icon'])

      return createElement(
        StyledButton,
        restProps,
        icon ? createElement(Icon, null, icon) : createElement(SendIcon, null)
      )
    }

    return SendButton
  })(Component) // eslint-disable-next-line no-console

SendButton.propTypes = {
  active: bool,
  onClick: func,
}
var warnOnce$2 = once(console.warn.bind(console))
var SendButton$1 = withComposer(function (_ref, ownProps) {
  var active = _ref.active,
    onButtonClick = _ref.onButtonClick

  if (process.env.NODE_ENV === 'development') {
    var sendButtonProps = ['active', 'onClick']

    if (hasControlledProps(sendButtonProps, ownProps)) {
      // eslint-disable-next-line no-console
      warnOnce$2(
        [
          sendButtonProps + ' props are controlled by TextComposer,',
          'if you want to use those please pass them to the TextComposer instead of ' +
            getDisplayName(SendButton) +
            '.',
        ].join(' ')
      )
    }
  }

  return active
    ? {
        active: active,
        onClick: onButtonClick,
      }
    : {
        active: active,
      }
})(SendButton)

// TODO: we should have our own styled factory and this omit should be applied for each "global" custom prop
// for wrapped custom React component

var StyledInput =
  /*#__PURE__*/
  styled$1(
    function (_ref) {
      var flexFill = _ref.flexFill,
        props = _objectWithoutPropertiesLoose(_ref, ['flexFill'])

      return createElement(TextareaAutosize, props)
    },
    {
      displayName: 'TextInput',
      target: 'e1m92qam0',
    }
  )(
    'apperance:none;border:0;resize:none;background-color:#fff;height:1.5em;line-height:1.5em;min-width 0;width:100%;font-size:1em;&:focus,&:active{outline:none;}'
  )

var TextInput =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(TextInput, _React$Component)

    function TextInput() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this

      _this._getRef = function (ref) {
        _this.props.inputRef(ref)

        _this.props.innerRef(ref)
      }

      return _this
    }

    var _proto = TextInput.prototype

    _proto.render = function render() {
      // eslint-disable-next-line no-unused
      var _this$props = this.props,
        innerRef = _this$props.innerRef,
        inputRef = _this$props.inputRef,
        props = _objectWithoutPropertiesLoose(_this$props, [
          'innerRef',
          'inputRef',
        ])

      return createElement(
        StyledInput,
        _extends({}, props, {
          inputRef: this._getRef,
        })
      )
    }

    return TextInput
  })(Component) // eslint-disable-next-line no-console

TextInput.defaultProps = {
  innerRef: noop,
  inputRef: noop,
  maxRows: 3,
  onChange: noop,
  onKeyDown: noop,
  placeholder: 'Write a message...',
}
TextInput.propTypes = {
  defaultValue: string,
  innerRef: func,
  inputRef: func,
  maxRows: number,
  minRows: number,
  onChange: func,
  onHeightChange: func,
  onKeyDown: func,
  placeholder: string,
  value: string,
}
var warnOnce$3 = once(console.warn.bind(console))
var TextInput$1 = withComposer(function (_ref2, ownProps) {
  var inputRef = _ref2.inputRef,
    onChange = _ref2.onChange,
    onKeyDown = _ref2.onKeyDown,
    value = _ref2.value

  if (process.env.NODE_ENV === 'development') {
    var textInputProps = [
      'defaultValue',
      'inputRef',
      'onChange',
      'onKeyDown',
      'value',
    ]

    if (hasControlledProps(textInputProps, ownProps)) {
      // eslint-disable-next-line no-console
      warnOnce$3(
        [
          textInputProps + ' props are controlled by TextComposer,',
          'if you want to use those please pass them to the TextComposer instead of ' +
            getDisplayName(TextInput) +
            '.',
        ].join(' ')
      )
    }
  }

  return {
    inputRef: inputRef,
    onChange: onChange,
    onKeyDown: onKeyDown,
    value: value,
  }
})(TextInput)

var mapPropsToStyles$b = function mapPropsToStyles(props) {
  var propsStyle = {}

  if (props.theme) {
    // TODO: should be done with nesting?
    propsStyle.right =
      props.theme.FixedWrapperRoot.position === 'right' ? '0' : 'auto'
    propsStyle.left =
      props.theme.FixedWrapperRoot.position === 'left' ? '0' : 'auto'
  }

  if (props.animationDuration) {
    propsStyle.transition = 'all ' + props.animationDuration + 'ms ease-out'
  }

  if (props.state) {
    propsStyle.transform =
      props.state === 'entered' ? 'none' : 'scale(0.8) translate(10%, 30%)'
    propsStyle.opacity = props.state === 'entered' ? '1' : '0'
  }

  if (props.height) {
    propsStyle.height = props.height
  }

  if (props.width) {
    propsStyle.width = props.width
  }

  return propsStyle
}

var StyledWrapper =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'FixedWrapperMaximized',
    mapPropsToStyles: mapPropsToStyles$b,
    target: 'ep7mz240',
  })(
    'display:flex;flex-direction:column;max-height:100vh;position:absolute;bottom:0;@media (max-width:490px){width:100%;height:100%;position:fixed;}'
  )

var FixedWrapperMaximized = function FixedWrapperMaximized(props) {
  return createElement(
    Transition,
    {
      in: props.active,
      mountOnEnter: true,
      timeout: props.theme.FixedWrapperMaximized.animationDuration,
      unmountOnExit: true,
    },
    function (state) {
      return createElement(
        StyledWrapper,
        _extends({}, props, {
          state: state,
        }),
        Children.map(props.children, function (child) {
          return cloneElement(child, {
            minimize: props.minimize,
          })
        })
      )
    }
  )
}

FixedWrapperMaximized.propTypes = {
  /** Component active - shown or hidden */
  active: bool,

  /** Content of the component, will have minimize function injected */
  children: node.isRequired,

  /** Method to change component's state from shown to hiden - passed by FixedWrapper.Root */
  minimize: func,

  /** Override component's styles */
  style: shape(),
}
var Maximized = withTheme(FixedWrapperMaximized)

var mapPropsToStyles$c = function mapPropsToStyles(_ref) {
  var state = _ref.state,
    theme = _ref.theme
  var propsStyles = {}

  if (theme) {
    propsStyles.transition =
      'all ' + theme.FixedWrapperMaximized.animationDuration + 'ms ease-out' // TODO could be done with nesting?

    propsStyles.right =
      theme.FixedWrapperRoot.position === 'right' ? '0' : 'auto'
    propsStyles.left = theme.FixedWrapperRoot.position === 'left' ? '0' : 'auto'
  }

  if (state) {
    propsStyles.transform =
      state === 'entered' ? 'none' : 'scale(0.8) translate(10%, 30%)'
    propsStyles.opacity = state === 'entered' ? '1' : '0'
  }

  return propsStyles
}

var StyledWrapper$1 =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'FixedWrapperMinimized',
    mapPropsToStyles: mapPropsToStyles$c,
    target: 'eq1nrcm0',
  })('width:60px;height:60px;position:absolute;bottom:1em;')

var FixedWrapperMinimized = function FixedWrapperMinimized(props) {
  return createElement(
    Transition,
    {
      in: props.active,
      mountOnEnter: true,
      timeout: props.theme.FixedWrapperMinimized.animationDuration,
      unmountOnExit: true,
    },
    function (state) {
      return createElement(
        StyledWrapper$1,
        _extends({}, props, {
          state: state,
        }),
        Children.map(props.children, function (child) {
          return cloneElement(child, {
            maximize: props.maximize,
          })
        })
      )
    }
  )
}

FixedWrapperMinimized.propTypes = {
  /** Component active - shown or hidden */
  active: bool,

  /** Content of the component, will have maximize function injected */
  children: node.isRequired,

  /** Method to change component's state from shown to hiden - passed by FixedWrapper.Root */
  maximize: func,

  /** Override component's styles */
  style: shape(),
}
var Minimized = withTheme(FixedWrapperMinimized)

var mapPropsToStyles$d = function mapPropsToStyles(props) {
  var propsStyles = {}

  if (props.position === 'right') {
    propsStyles.right = '1em'
    propsStyles.left = 'auto'
  } else if (props.position === 'left') {
    propsStyles.right = 'auto'
    propsStyles.left = '1em'
  }

  return propsStyles
}

var StyledWrapper$2 =
  /*#__PURE__*/
  styled$1('div', {
    displayName: 'FixedWrapperRoot',
    mapPropsToStyles: mapPropsToStyles$d,
    target: 'e7t7c040',
  })('position:fixed;bottom:0;z-index:99;font-size:16px;')

var FixedWrapperRoot = function FixedWrapperRoot(props) {
  return createElement(
    StyledWrapper$2,
    props,
    createElement(
      Toggle,
      {
        defaultOn: props.maximizedOnInit,
      },
      function (_ref) {
        var on = _ref.on,
          setOff = _ref.setOff,
          setOn = _ref.setOn
        return createElement(
          'div',
          null,
          Children.map(props.children, function (child) {
            if (child.type === Maximized) {
              return cloneElement(child, {
                minimize: setOff,
                active: on,
              })
            }

            if (child.type === Minimized) {
              return cloneElement(child, {
                maximize: setOn,
                active: !on,
              })
            }

            return child
          })
        )
      }
    )
  )
}

FixedWrapperRoot.defaultProps = {
  maximizedOnInit: false,
}
FixedWrapperRoot.propTypes = {
  /** Content of the component. FixedWrapper.Maximized and FixedWrapper.Minimized components will receive the proper state and methods */
  children: node.isRequired,

  /** Show maximized component on init */
  maximizedOnInit: bool,

  /** Override component's styles */
  style: shape(),
}

var FixedWrapperImport = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  Root: FixedWrapperRoot,
  Maximized: Maximized,
  Minimized: Minimized,
})

var FixedWrapper = FixedWrapperImport

var ElementButtons =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(ElementButtons, _React$Component)

    function ElementButtons() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key2 = 0;
        _key2 < _len;
        _key2++
      ) {
        args[_key2] = arguments[_key2]
      }

      _this =
        _React$Component.call.apply(_React$Component, [this].concat(args)) ||
        this

      _this.handleButtonClick = function (key) {
        return function (event) {
          _this.props.onButtonClick(event, key)
        }
      }

      return _this
    }

    var _proto = ElementButtons.prototype

    _proto.render = function render() {
      var _this2 = this

      var _this$props = this.props,
        buttons = _this$props.buttons,
        onButtonClick = _this$props.onButtonClick
      return createElement(
        StyledButtons,
        null,
        buttons.map(function (_ref, index) {
          var text = _ref.text,
            _key = _ref.key,
            buttonProps = _objectWithoutPropertiesLoose(_ref, ['text', 'key'])

          var key = _key !== undefined ? _key : index
          return createElement(
            MessageButton,
            _extends(
              {
                key: key,
                label: text,
                onClick: _this2.handleButtonClick(key),
              },
              buttonProps
            )
          )
        })
      )
    }

    return ElementButtons
  })(Component)

ElementButtons.defaultProps = {
  onButtonClick: noop,
}

var stopPropagation = function stopPropagation(event) {
  return event.stopPropagation()
} // eslint-disable-next-line jsx-a11y/anchor-has-content

var Link = function Link(props) {
  return createElement(
    'a',
    _extends({}, props, {
      onClick: stopPropagation,
      rel: 'nofollow noopener',
      target: '_blank',
    })
  )
}

var StyledImg =
  /*#__PURE__*/
  styled$1('img', {
    target: 'e9ztsyy0',
  })('display:block;width:100%;height:150px;object-fit:cover;')
var StyledImageContainer =
  /*#__PURE__*/
  styled$1('div', {
    target: 'e9ztsyy1',
  })('width:100%;margin:0 auto;')

var getThumbnailProps = function getThumbnailProps(url, srcset) {
  var props = {
    src: url,
  }

  if (srcset !== undefined) {
    props.srcSet = srcset
  }

  return props
} // eslint-disable-next-line react/no-multi-comp

var Image = function Image(_ref) {
  var url = _ref.url,
    srcset = _ref.srcset,
    props = _objectWithoutPropertiesLoose(_ref, ['url', 'srcset'])

  return createElement(
    StyledMedia,
    props,
    createElement(
      StyledImageContainer,
      null,
      createElement(
        StyledImg,
        _extends(
          {
            alt: '',
          },
          getThumbnailProps(url, srcset)
        )
      )
    )
  )
} // eslint-disable-next-line react/no-multi-comp

var CardImage = function CardImage(_ref2) {
  var link = _ref2.link,
    props = _objectWithoutPropertiesLoose(_ref2, ['link'])

  return link
    ? createElement(
        Link,
        {
          href: link,
          style: props.style,
        },
        Image(props)
      )
    : Image(props)
}

CardImage.propTypes = {
  link: string,
  url: string.isRequired,
  srcSet: string,
}

var minWidth =
  /*#__PURE__*/
  css('width:230px;')

var Card =
  /*#__PURE__*/
  (function (_React$Component) {
    _inheritsLoose(Card, _React$Component)

    function Card() {
      return _React$Component.apply(this, arguments) || this
    }

    var _proto = Card.prototype

    _proto.render = function render() {
      var _this$props = this.props,
        card = _this$props.card,
        onButtonClick = _this$props.onButtonClick,
        restProps = _objectWithoutPropertiesLoose(_this$props, [
          'card',
          'onButtonClick',
        ])

      return createElement(
        StyledBubble,
        _extends(
          {
            className: minWidth,
          },
          restProps
        ),
        card.image && createElement(CardImage, card.image),
        (card.title || card.subtitle) &&
          createElement(MessageTitle, {
            subtitle: card.subtitle,
            title: card.title,
          }),
        card.buttons &&
          createElement(ElementButtons, {
            buttons: card.buttons,
            onButtonClick: onButtonClick,
          })
      )
    }

    return Card
  })(Component)

var StyledCarouselContainer =
  /*#__PURE__*/
  styled$1('div', {
    target: 'epptpc30',
  })('position:relative;width:100%;display:flex;')
var StyledCardsContainer =
  /*#__PURE__*/
  styled$1('div', {
    target: 'epptpc31',
  })(
    'display:flex;width:100%;overflow-x:',
    function (props) {
      return props.mobile ? 'auto' : 'hidden'
    },
    ';-webkit-overflow-scrolling:touch;align-items:flex-start;-ms-overflow-style:none;&::-webkit-scrollbar{display:none;}'
  )
var StyledCardContainer =
  /*#__PURE__*/
  styled$1('div', {
    target: 'epptpc32',
  })('flex-grow:0;flex-shrink:0;& + &{margin-left:0.5em;}')
var ArrowButton =
  /*#__PURE__*/
  styled$1('button', {
    target: 'epptpc33',
  })(
    'position:absolute;width:30px;height:30px;border-radius:50%;background:#fff;border:0;box-shadow:0 4px 12px rgba(0,0,0,0.3);outline:none;text-align:center;top:32%;display:flex;align-items:center;justify-content:center;padding:0;&:hover{cursor:pointer;}svg{display:inline;}',
    function (_ref) {
      var _ref2

      var variant = _ref.variant
      return (_ref2 = {}), (_ref2[variant] = '.5em'), _ref2
    },
    ';'
  )

var distance = function distance(max) {
  return function (percent) {
    return percent * max
  }
}

var animateScrollX = function animateScrollX(targetX, durationMs, element) {
  var initialX = element.scrollLeft
  var diffX = targetX - initialX
  pipe(
    durationProgress(durationMs),
    map(easeOut),
    map(distance(diffX)),
    forEach(function (x) {
      element.scrollLeft = initialX + x
    })
  )
}

var calculateItemsWidth = function calculateItemsWidth(_ref3) {
  var count = _ref3.count,
    width = _ref3.width,
    spacing = _ref3.spacing
  return count * width + (count - 1) * spacing
}

var Carousel =
  /*#__PURE__*/
  (function (_React$PureComponent) {
    _inheritsLoose(Carousel, _React$PureComponent)

    function Carousel() {
      var _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      _this =
        _React$PureComponent.call.apply(
          _React$PureComponent,
          [this].concat(args)
        ) || this
      _this.state = {
        showScrollLeft: false,
        showScrollRight: false,
      }

      _this.getCardContainerRef = function (ref) {
        _this.cardContainerRef = ref
      }

      _this.showAppropriateArrowsIfNeeded = function () {
        var _assertThisInitialize = _assertThisInitialized(_this),
          cardContainerRef = _assertThisInitialize.cardContainerRef

        _this.setState({
          showScrollLeft: !isScrolledToLeft(cardContainerRef),
          showScrollRight: !isScrolledToRight(cardContainerRef),
        })
      }

      _this.handleContainerScroll = throttle(
        200,
        _this.showAppropriateArrowsIfNeeded
      )
      _this.scrollToDirection = memoize(function (direction) {
        return function (event) {
          event.stopPropagation()
          var _this$cardContainerRe = _this.cardContainerRef,
            currentX = _this$cardContainerRe.scrollLeft,
            visibleWidth = _this$cardContainerRe.offsetWidth,
            scrollWidth = _this$cardContainerRe.scrollWidth
          var calculatedX = currentX + direction * visibleWidth
          var clampedX =
            direction === 1
              ? Math.min(calculatedX, scrollWidth - visibleWidth)
              : Math.max(calculatedX, 0)
          var targetX =
            calculatedX === clampedX
              ? _this.findXToCenterNextBatch(calculatedX, direction)
              : clampedX
          animateScrollX(targetX, 300, _this.cardContainerRef)
        }
      })
      return _this
    }

    var _proto = Carousel.prototype

    _proto.componentDidMount = function componentDidMount() {
      this.showAppropriateArrowsIfNeeded()
      this._observer = new ResizeObserver(
        debounce(200, this.showAppropriateArrowsIfNeeded)
      )

      this._observer.observe(this.cardContainerRef)
    }

    _proto.componentWillUnmount = function componentWillUnmount() {
      this._observer.disconnect()
    }

    _proto.findXToCenterNextBatch = function findXToCenterNextBatch(
      targetX,
      direction
    ) {
      var _this$cardContainerRe2 = this.cardContainerRef,
        childNodes = _this$cardContainerRe2.childNodes,
        visibleWidth = _this$cardContainerRe2.offsetWidth
      var first = childNodes[0],
        second = childNodes[1]

      var _first$getBoundingCli = first.getBoundingClientRect(),
        right = _first$getBoundingCli.right,
        width = _first$getBoundingCli.width

      var spacing = second.getBoundingClientRect().left - right
      var itemsCount = Math.abs(targetX) / (width + spacing)
      var completeItemsCount =
        direction === 1 ? Math.floor(itemsCount) : Math.ceil(itemsCount)
      var obscuredX = completeItemsCount * (width + spacing)
      var estimatedVisibleCount = Math.floor(visibleWidth / (width + spacing))
      var estimateItemsWidth = calculateItemsWidth({
        count: estimatedVisibleCount,
        width: width,
        spacing: spacing,
      })
      var visibleCount =
        estimateItemsWidth + width <= visibleWidth
          ? estimatedVisibleCount + 1
          : estimatedVisibleCount
      var itemsWidth = calculateItemsWidth({
        count: visibleCount,
        width: width,
        spacing: spacing,
      })
      var finalX = obscuredX + itemsWidth / 2 - visibleWidth / 2
      return finalX
    }

    _proto.render = function render() {
      var _this$props = this.props,
        children = _this$props.children,
        mobile = _this$props.mobile
      return createElement(
        StyledCarouselContainer,
        null,
        createElement(
          StyledCardsContainer,
          {
            innerRef: this.getCardContainerRef,
            mobile: mobile,
            onScroll: this.handleContainerScroll,
          },
          Children.map(children, function (child) {
            return createElement(StyledCardContainer, null, child)
          })
        ),
        this.state.showScrollLeft &&
          createElement(
            ArrowButton,
            {
              onClick: this.scrollToDirection(-1),
              variant: 'left',
            },
            createElement(ArrowLeftIcon, null)
          ),
        this.state.showScrollRight &&
          createElement(
            ArrowButton,
            {
              onClick: this.scrollToDirection(1),
              variant: 'right',
            },
            createElement(ArrowRightIcon, null)
          )
      )
    }

    return Carousel
  })(PureComponent)

Carousel.defaultProps = {
  mobile:
    typeof window !== 'undefined'
      ? /mobile/gi.test(navigator.userAgent)
      : false,
}

export {
  AddIcon,
  AgentBar,
  ArrowLeftIcon,
  ArrowRightIcon,
  AttachIcon,
  Avatar,
  StyledBubble as Bubble,
  Card,
  Carousel,
  ChatIcon,
  ChatList,
  ChatListItem,
  CheckboxOffIcon,
  CheckboxOnIcon,
  CloseIcon,
  StyledColumn as Column,
  ComposerSpy,
  EmailFilledIcon,
  EmailIcon,
  EmojiIcon,
  ExitIcon,
  Fill,
  Fit,
  FixedWrapper,
  HourglassIcon,
  Icon,
  StyledButton as IconButton,
  MaximizeIcon,
  MenuVerticalIcon,
  Message,
  MessageButton,
  StyledButtons as MessageButtons,
  MessageGroup,
  MessageList$1 as MessageList,
  MessageListItem,
  MessageListSpy,
  StyledMedia as MessageMedia,
  StyledText as MessageText,
  MessageTitle,
  MinimizeIcon,
  MuteIcon,
  PersonIcon,
  QuickReplies,
  QuickReply,
  RadioOffIcon,
  RadioOnIcon,
  RateBadIcon,
  RateGoodIcon,
  StyledRow as Row,
  SearchIcon,
  SendButton$1 as SendButton,
  SendIcon,
  SubTitle as Subtitle,
  TextComposer,
  TextInput$1 as TextInput,
  TopLevelThemeProvider as ThemeProvider,
  Title,
  TitleBar,
  UnmuteIcon,
  css,
  cx,
  darkTheme,
  defaultTheme,
  elegantTheme,
  injectGlobal,
  keyframes,
  purpleTheme,
  styled$1 as styled,
}
