import {
  Fragment,
  Teleport,
  Transition,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createSlots,
  createTextVNode,
  createVNode,
  defineComponent,
  getCurrentInstance,
  getCurrentScope,
  guardReactiveProps,
  h,
  inject,
  isRef,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  onBeforeUnmount,
  onMounted,
  onScopeDispose,
  openBlock,
  provide,
  reactive,
  readonly,
  ref,
  renderList,
  renderSlot,
  resolveDynamicComponent,
  shallowRef,
  toDisplayString,
  toHandlers,
  toRaw,
  toRef,
  toRefs,
  unref,
  useAttrs,
  useSlots,
  vModelCheckbox,
  vShow,
  watch,
  watchEffect,
  withCtx,
  withDirectives
} from "./chunk-R647EDCJ.js";

// node_modules/@floating-ui/core/dist/floating-ui.core.browser.mjs
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getLengthFromAxis(axis) {
  return axis === "y" ? "height" : "width";
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "x" : "y";
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const side = getSide(placement);
  const isVertical = mainAxis === "x";
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  {
    if (platform2 == null) {
      console.error(["Floating UI: `platform` property was not passed to config. If you", "want to use Floating UI on the web, install @floating-ui/dom", "instead of the /core package. Otherwise, you can create your own", "`platform`: https://floating-ui.com/docs/platform"].join(" "));
    }
    if (validMiddleware.filter((_ref) => {
      let {
        name
      } = _ref;
      return name === "autoPlacement" || name === "flip";
    }).length > 1) {
      throw new Error(["Floating UI: duplicate `flip` and/or `autoPlacement` middleware", "detected. This will lead to an infinite loop. Ensure only one of", "either has been passed to the `middleware` array."].join(" "));
    }
    if (!reference || !floating) {
      console.error(["Floating UI: The reference and/or floating element was not defined", "when `computePosition()` was called. Ensure that both elements have", "been created and can be measured."].join(" "));
    }
  }
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    {
      if (resetCount > 50) {
        console.warn(["Floating UI: The middleware lifecycle appears to be running in an", "infinite loop. This is usually caused by a `reset` continually", "being returned without a break condition."].join(" "));
      }
    }
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getSideObjectFromPadding(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = options;
  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var min = Math.min;
var max = Math.max;
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
var sides = ["top", "right", "bottom", "left"];
var allPlacements = sides.reduce((acc, side) => acc.concat(side, side + "-start", side + "-end"), []);
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  let mainAlignmentSide = mainAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide)
  };
}
var oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt2 = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt2;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
var flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = options;
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const {
          main,
          cross
        } = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[main], overflow[cross]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, value) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === "x";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = typeof value === "function" ? value(state) : value;
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
var offset = function(value) {
  if (value === void 0) {
    value = 0;
  }
  return {
    name: "offset",
    options: value,
    async fn(state) {
      const {
        x,
        y
      } = state;
      const diffCoords = await convertValueToCoords(state, value);
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }
  };
};
function getCrossAxis(axis) {
  return axis === "x" ? "y" : "x";
}
var shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = options;
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const mainAxis = getMainAxisFromPlacement(getSide(placement));
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min3 = mainAxisCoord + overflow[minSide];
        const max3 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = within(min3, mainAxisCoord, max3);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min3 = crossAxisCoord + overflow[minSide];
        const max3 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = within(min3, crossAxisCoord, max3);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};

// node_modules/@floating-ui/dom/dist/floating-ui.dom.browser.mjs
function getWindow(node) {
  var _node$ownerDocument;
  return ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
var min2 = Math.min;
var max2 = Math.max;
var round = Math.round;
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width);
  let height = parseFloat(css.height);
  const offsetWidth = element.offsetWidth;
  const offsetHeight = element.offsetHeight;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    fallback: shouldFallback
  };
}
function getNodeName(node) {
  return isNode(node) ? (node.nodeName || "").toLowerCase() : "";
}
var uaString;
function getUAString() {
  if (uaString) {
    return uaString;
  }
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    uaString = uaData.brands.map((item) => item.brand + "/" + item.version).join(" ");
    return uaString;
  }
  return navigator.userAgent;
}
function isHTMLElement(value) {
  return value instanceof getWindow(value).HTMLElement;
}
function isElement(value) {
  return value instanceof getWindow(value).Element;
}
function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const isFirefox = /firefox/i.test(getUAString());
  const css = getComputedStyle$1(element);
  const backdropFilter = css.backdropFilter || css.WebkitBackdropFilter;
  return css.transform !== "none" || css.perspective !== "none" || (backdropFilter ? backdropFilter !== "none" : false) || isFirefox && css.willChange === "filter" || isFirefox && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective"].some((value) => css.willChange.includes(value)) || ["paint", "layout", "strict", "content"].some((value) => {
    const contain = css.contain;
    return contain != null ? contain.includes(value) : false;
  });
}
function isClientRectVisualViewportBased() {
  return /^((?!chrome|android).)*safari/i.test(getUAString());
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
var FALLBACK_SCALE = {
  x: 1,
  y: 1
};
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return FALLBACK_SCALE;
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    fallback
  } = getCssDimensions(domElement);
  let x = (fallback ? round(rect.width) : rect.width) / width;
  let y = (fallback ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  var _win$visualViewport, _win$visualViewport2;
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = FALLBACK_SCALE;
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const win = domElement ? getWindow(domElement) : window;
  const addVisualOffsets = isClientRectVisualViewportBased() && isFixedStrategy;
  let x = (clientRect.left + (addVisualOffsets ? ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0 : 0)) / scale.x;
  let y = (clientRect.top + (addVisualOffsets ? ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0 : 0)) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win2 = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win2.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win2) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      iframeRect.x += (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      iframeRect.y += (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += iframeRect.x;
      y += iframeRect.y;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}
function getDocumentElement(node) {
  return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = {
    x: 1,
    y: 1
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max2(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max2(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max2(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return parentNode.ownerDocument.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list) {
  var _node$ownerDocument;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isClientRectVisualViewportBased();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : {
    x: 1,
    y: 1
  };
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const mutableRect = {
      ...clippingAncestor
    };
    if (isClientRectVisualViewportBased()) {
      var _win$visualViewport, _win$visualViewport2;
      const win = getWindow(element);
      mutableRect.x -= ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0;
      mutableRect.y -= ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0;
    }
    rect = mutableRect;
  }
  return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const containingBlock = isContainingBlock(currentNode);
    const shouldIgnoreCurrentNode = computedStyle.position === "fixed";
    if (shouldIgnoreCurrentNode) {
      currentContainingBlockComputedStyle = null;
    } else {
      const shouldDropCurrentNode = elementIsFixed ? !containingBlock && !currentContainingBlockComputedStyle : !containingBlock && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max2(rect.top, accRect.top);
    accRect.right = min2(rect.right, accRect.right);
    accRect.bottom = min2(rect.bottom, accRect.bottom);
    accRect.left = max2(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  if (isHTMLElement(element)) {
    return getCssDimensions(element);
  }
  return element.getBoundingClientRect();
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const rect = getBoundingClientRect(element, true, strategy === "fixed", offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
var platform = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getScale,
  async getElementRects(_ref) {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    return {
      reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
      floating: {
        x: 0,
        y: 0,
        ...await getDimensionsFn(floating)
      }
    };
  },
  getClientRects: (element) => Array.from(element.getClientRects()),
  isRTL: (element) => getComputedStyle$1(element).direction === "rtl"
};
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll: _ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    animationFrame = false
  } = options;
  const ancestorScroll = _ancestorScroll && !animationFrame;
  const ancestors = ancestorScroll || ancestorResize ? [...isElement(reference) ? getOverflowAncestors(reference) : reference.contextElement ? getOverflowAncestors(reference.contextElement) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  let observer = null;
  if (elementResize) {
    let initialUpdate = true;
    observer = new ResizeObserver(() => {
      if (!initialUpdate) {
        update();
      }
      initialUpdate = false;
    });
    isElement(reference) && !animationFrame && observer.observe(reference);
    if (!isElement(reference) && reference.contextElement && !animationFrame) {
      observer.observe(reference.contextElement);
    }
    observer.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _observer;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    (_observer = observer) == null ? void 0 : _observer.disconnect();
    observer = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
var computePosition2 = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// node_modules/anu-vue/dist/anu-vue.js
function Ve(s) {
  return s !== null && typeof s == "object";
}
function Pe(s, t, e = ".", a) {
  if (!Ve(t))
    return Pe(s, {}, e, a);
  const i = Object.assign({}, t);
  for (const o in s) {
    if (o === "__proto__" || o === "constructor")
      continue;
    const n = s[o];
    n != null && (a && a(i, o, n, e) || (Array.isArray(n) && Array.isArray(i[o]) ? i[o] = [...n, ...i[o]] : Ve(n) && Ve(i[o]) ? i[o] = Pe(n, i[o], (e ? `${e}.` : "") + o.toString(), a) : i[o] = n));
  }
  return i;
}
function ct(s) {
  return (...t) => t.reduce((e, a) => Pe(e, a, "", s), {});
}
var F = ct();
var dt = (s, t, e, a) => {
  const i = ref(a), o = () => {
    s.value !== void 0 ? t(e) : i.value = !i.value;
  };
  return {
    internalState: computed(() => s.value !== void 0 ? s.value : i.value),
    toggle: o
  };
};
var Bt = ({ r: s, g: t, b: e }) => (s * 299 + t * 587 + e * 114) / 1e3;
var Tt = (s) => {
  if (s.length === 4)
    return {
      r: Number(`0x${s[1]}${s[1]}`),
      g: Number(`0x${s[2]}${s[2]}`),
      b: Number(`0x${s[3]}${s[3]}`)
    };
  if (s.length === 7)
    return {
      r: Number(`0x${s[1]}${s[2]}`),
      g: Number(`0x${s[3]}${s[4]}`),
      b: Number(`0x${s[5]}${s[6]}`)
    };
};
var jt = (s, t = 128) => {
  if (s === void 0)
    return "var(--a-contrast-dark)";
  const e = Tt(s);
  return e === void 0 || Bt(e) >= t ? "var(--a-contrast-dark)" : "var(--a-contrast-light)";
};
var ge = {
  type: [String, void 0]
};
var se = { type: Boolean };
var pt = { type: Boolean };
var le = { type: Number };
var z = { type: [Array, String, Number, Object, void 0] };
var Nt = ct((s, t, e) => {
  if (t === "type")
    return s[t] = e, true;
  if (t === "required" && e)
    return delete s.default, s[t] = e, true;
});
var re = (s) => {
  let t = {
    color: ge,
    variant: {
      type: String,
      default: "text"
    },
    states: {
      type: Boolean,
      default: false
    }
  };
  return s && (t = F(s, t)), t;
};
var ie = () => {
  const s = (e, a, i, o) => {
    const n = [
      i ? o && o.statesClass ? o.statesClass : "states" : ""
    ], l = e && ["primary", "success", "info", "warning", "danger"].includes(e), r = e && /^#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}$/.test(e), u = [];
    if (l)
      u.push({ "--a-layer-color": `hsla(var(--a-${e}),var(--un-bg-opacity))` }, { "--un-ring-color": `hsl(var(--a-${e}))` }), n.push("[--un-bg-opacity:1]");
    else if (u.push({ "--a-layer-color": e }), r) {
      const m = jt(e);
      u.push(`--a-layer-text: ${m}`), u.push(`--un-ring-color: ${e}`);
    }
    const d = l ? a === "fill" ? "white" : e : "layer-text", p = `text-${l ? d : `$a-${d}`} typography-title-${d} typography-subtitle-${d} typography-text-${d}`;
    return e && (n.push(p), n.push("typography-subtitle-opacity-100 typography-text-opacity-100"), a === "text" ? n.push("text-$a-layer-color") : (a === "fill" && n.push("bg-$a-layer-color"), a === "light" && n.push("bg-$a-layer-color bg-opacity-15"), a === "outline" && n.push("border-width-1 uno-layer-base-border-solid border-$a-layer-color"))), {
      styles: u,
      classes: n
    };
  };
  return {
    getLayerClasses: (e, a, i, o) => {
      const n = ref([]), l = ref([]);
      return watch([e, a, i, () => unref(o)], () => {
        const { classes: r, styles: u } = s(unref(e), unref(a), unref(i), unref(o));
        n.value = r, l.value = u;
      }, { immediate: true }), {
        classes: n,
        styles: l
      };
    }
  };
};
var Be = Symbol("spacingSymbol");
var Lt = (s) => {
  s.provide(Be, 100);
};
var ue = (s) => {
  const t = inject(Be, 100), e = computed(() => s.value || t);
  return provide(Be, e.value), e;
};
var Et = { key: 0 };
var Rt = { class: "flex-grow" };
var Mt = { key: 1 };
var Dt = defineComponent({
  name: "AAlert"
});
var Ft = defineComponent({
  ...Dt,
  props: {
    spacing: le,
    ...re({
      color: {
        default: "primary"
      },
      variant: {
        default: "light"
      }
    }),
    icon: z,
    appendIcon: z,
    dismissible: Boolean,
    modelValue: {
      type: Boolean,
      default: void 0
    }
  },
  emits: ["click:appendIcon", "update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, { internalState: a, toggle: i } = dt(toRef(e, "modelValue"), t, "update:modelValue", true), o = ue(toRef(e, "spacing")), { getLayerClasses: n } = ie(), { styles: l, classes: r } = n(
      toRef(e, "color"),
      toRef(e, "variant"),
      toRef(e, "states")
    ), u = e.appendIcon || (e.dismissible ? "i-bx-x" : null), d = () => {
      e.dismissible && i(), t("click:appendIcon");
    };
    return (p, m) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["a-alert items-start w-full", [
        ...unref(r),
        unref(a) ? "flex" : "hidden"
      ]]),
      style: normalizeStyle([
        ...unref(l),
        { "--a-spacing": unref(o) / 100 }
      ])
    }, [
      e.icon ? (openBlock(), createElementBlock("div", Et, [
        createBaseVNode("i", {
          class: normalizeClass(e.icon)
        }, null, 2)
      ])) : createCommentVNode("", true),
      createBaseVNode("div", Rt, [
        renderSlot(p.$slots, "default")
      ]),
      unref(u) ? (openBlock(), createElementBlock("div", Mt, [
        createBaseVNode("div", null, [
          createBaseVNode("span", {
            class: normalizeClass(["align-text-top", [
              unref(u),
              { "cursor-pointer": e.dismissible }
            ]]),
            onClick: d
          }, null, 2)
        ])
      ])) : createCommentVNode("", true)
    ], 6));
  }
});
var Wt = {
  spacing: le,
  ...re({
    color: {
      default: "primary"
    },
    variant: {
      default: "light"
    }
  }),
  icon: z,
  content: String,
  src: String,
  alt: {
    type: String,
    default: "avatar"
  }
};
var zt = ["src", "alt"];
var Ut = { key: 2 };
var Ht = defineComponent({
  name: "AAvatar"
});
var Te = defineComponent({
  ...Ht,
  props: Wt,
  setup(s) {
    const t = s, e = ue(toRef(t, "spacing")), { getLayerClasses: a } = ie(), { styles: i, classes: o } = a(
      toRef(t, "color"),
      toRef(t, "variant"),
      toRef(t, "states")
    );
    return (n, l) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["a-avatar overflow-hidden inline-flex items-center justify-center", unref(o)]),
      style: normalizeStyle([
        ...unref(i),
        { "--a-spacing": unref(e) / 100 }
      ])
    }, [
      renderSlot(n.$slots, "default", {}, () => [
        t.src ? (openBlock(), createElementBlock("img", {
          key: 0,
          src: t.src,
          alt: t.alt
        }, null, 8, zt)) : t.icon ? (openBlock(), createElementBlock("i", {
          key: 1,
          class: normalizeClass(t.icon)
        }, null, 2)) : (openBlock(), createElementBlock("span", Ut, toDisplayString(t.content), 1))
      ])
    ], 6));
  }
});
var ft = (s) => s == null || s === "" ? true : !!(Array.isArray(s) && s.length === 0);
var Qt = (s) => Array.isArray(s) && s.length === 0;
var Ae = (s) => s !== null && !!s && typeof s == "object" && !Array.isArray(s);
var qt = (s) => (typeof s == "string" || typeof s == "number") && s !== "" && !isNaN(Number(s));
var Xt = { class: "a-badge-wrapper relative" };
var Yt = defineComponent({
  name: "ABadge",
  inheritAttrs: false
});
var Jt = defineComponent({
  ...Yt,
  props: {
    spacing: le,
    modelValue: {
      type: Boolean,
      default: true
    },
    color: F({
      default: "primary"
    }, ge),
    dot: Boolean,
    bordered: {
      type: Boolean,
      default: true
    },
    max: Number,
    content: [Number, String],
    anchor: {
      type: String,
      default: "top right"
    },
    overlap: {
      type: Boolean,
      default: true
    },
    offsetX: {
      type: [Number, String],
      default: 4
    },
    offsetY: {
      type: [Number, String],
      default: 4
    }
  },
  setup(s) {
    const t = s, e = 4, a = 12, i = ue(toRef(t, "spacing")), o = (r) => {
      if (!qt(r) || t.max === void 0)
        return r;
      const u = Number(r);
      return u > t.max ? `${t.max}+` : u;
    }, n = computed(() => {
      const r = t.overlap && e === t.offsetY ? a : t.offsetY, u = t.overlap && e === t.offsetX ? a : t.offsetX;
      return { y: r, x: u };
    }), l = computed(() => {
      const [r, u] = t.anchor.split(" ");
      return {
        top: r === "top" ? "auto" : `calc(100% - ${n.value.y}px)`,
        bottom: r === "bottom" ? "auto" : `calc(100% - ${n.value.y}px)`,
        left: u === "left" ? "auto" : `calc(100% - ${n.value.x}px)`,
        right: u === "right" ? "auto" : `calc(100% - ${n.value.x}px)`
      };
    });
    return (r, u) => (openBlock(), createElementBlock("div", Xt, [
      renderSlot(r.$slots, "default"),
      createVNode(Transition, { name: "scale" }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("div", mergeProps(r.$attrs, {
            class: ["a-badge absolute", [
              `bg-${t.color}`,
              { "a-badge-dot": t.dot },
              { "a-badge-bordered": t.bordered }
            ]],
            style: [
              unref(l),
              { "--a-spacing": unref(i) / 100 }
            ]
          }), [
            t.dot ? createCommentVNode("", true) : (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              r.$slots.content ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createTextVNode(toDisplayString(o(r.$slots.content()[0].children)), 1)
              ], 64)) : t.content ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(o(t.content)), 1)
              ], 64)) : createCommentVNode("", true)
            ], 64))
          ], 16), [
            [vShow, t.modelValue]
          ])
        ]),
        _: 1
      })
    ]));
  }
});
var oe = {
  spacing: le,
  inputWrapperClasses: { type: null },
  inputClasses: { type: null },
  inputContainerAttrs: Object,
  hint: String,
  error: String,
  label: String,
  prependIcon: String,
  appendIcon: String,
  prependInnerIcon: String,
  appendInnerIcon: String,
  disabled: se,
  readonly: pt
};
var Gt = defineComponent({
  name: "TransitionExpand",
  setup(s, { slots: t }) {
    const e = (o) => {
      const n = getComputedStyle(o).width;
      o.style.width = n, o.style.position = "absolute", o.style.visibility = "hidden", o.style.height = "auto";
      const l = getComputedStyle(o).height;
      o.style.width = "", o.style.position = "", o.style.visibility = "", o.style.height = "0px", getComputedStyle(o).height, requestAnimationFrame(() => {
        o.style.height = l;
      });
    }, a = (o) => {
      o.style.height = "auto";
    }, i = (o) => {
      const n = getComputedStyle(o).height;
      o.style.height = n, getComputedStyle(o).height, requestAnimationFrame(() => {
        o.style.height = "0px";
      });
    };
    return () => h(
      h(Transition),
      {
        name: "expand",
        onEnter: e,
        onAfterEnter: a,
        onLeave: i
      },
      () => {
        var o;
        return (o = t.default) == null ? void 0 : o.call(t);
      }
    );
  }
});
var Kt = (s, t) => {
  const e = s.__vccOpts || s;
  for (const [a, i] of t)
    e[a] = i;
  return e;
};
var Zt = Kt(Gt, [["__scopeId", "data-v-f9e96780"]]);
var es = ["for"];
var ts = { class: "h-8" };
var ss = defineComponent({
  name: "ABaseInput"
});
var Se = defineComponent({
  ...ss,
  props: oe,
  emits: ["click:inputWrapper"],
  setup(s, { expose: t, emit: e }) {
    const a = s, i = useAttrs(), o = ue(toRef(a, "spacing")), n = "transition duration-150 ease -in", l = i.id || a.label ? `a-input-${i.id || a.label}-${Math.random().toString(36).slice(2, 7)}` : void 0, r = ref(), u = ref();
    return t({
      refRoot: r,
      refInputContainer: u
    }), (d, p) => (openBlock(), createElementBlock("div", {
      ref_key: "refRoot",
      ref: r,
      class: normalizeClass(["a-base-input-root i:children:focus-within:text-primary flex flex-col flex-grow flex-shrink-0", [
        a.disabled && "a-base-input-disabled",
        (a.disabled || a.readonly) && "pointer-events-none",
        !(a.disabled || a.readonly) && "a-base-input-interactive"
      ]]),
      style: normalizeStyle({ "--a-spacing": unref(o) / 100 })
    }, [
      renderSlot(d.$slots, "label", {}, () => [
        a.label ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: unref(l),
          class: normalizeClass(["a-base-input-label", [a.error && "text-danger"]])
        }, toDisplayString(a.label), 11, es)) : createCommentVNode("", true)
      ]),
      createBaseVNode("div", mergeProps({
        ref_key: "refInputContainer",
        ref: u,
        class: "a-base-input-input-container flex items-center"
      }, a.inputContainerAttrs), [
        renderSlot(d.$slots, "prepend", {}, () => [
          a.prependIcon ? (openBlock(), createElementBlock("i", {
            key: 0,
            class: normalizeClass([n, a.prependIcon])
          }, null, 2)) : createCommentVNode("", true)
        ]),
        createBaseVNode("div", {
          class: normalizeClass([[a.inputWrapperClasses, a.error ? "border-danger" : "focus-within:border-primary"], "a-base-input-input-wrapper cursor-text em:spacing:px-4 spacing:gap-x-2 relative i:focus-within:text-primary items-center border border-solid border-a-border w-full"]),
          onClick: p[0] || (p[0] = (m) => d.$emit("click:inputWrapper"))
        }, [
          renderSlot(d.$slots, "prepend-inner", {}, () => [
            a.prependInnerIcon ? (openBlock(), createElementBlock("i", {
              key: 0,
              class: normalizeClass(["a-base-input-prepend-inner-icon", [n, a.prependInnerIcon]])
            }, null, 2)) : createCommentVNode("", true)
          ]),
          renderSlot(d.$slots, "default", {
            id: unref(l),
            readonly: a.readonly,
            disabled: a.disabled,
            class: normalizeClass(["a-base-input-child w-full h-full inset-0 rounded-inherit bg-transparent", [
              a.inputClasses,
              d.$slots["prepend-inner"] || a.prependInnerIcon ? "a-base-input-w-prepend-inner" : "a-base-input-wo-prepend-inner",
              d.$slots["append-inner"] || a.appendInnerIcon ? "a-base-input-w-append-inner" : "a-base-input-wo-append-inner"
            ]])
          }),
          renderSlot(d.$slots, "append-inner", {}, () => [
            a.appendInnerIcon ? (openBlock(), createElementBlock("i", {
              key: 0,
              class: normalizeClass(["a-base-input-append-inner-icon ms-auto", [n, a.appendInnerIcon]])
            }, null, 2)) : createCommentVNode("", true)
          ])
        ], 2),
        renderSlot(d.$slots, "append", {}, () => [
          a.appendIcon ? (openBlock(), createElementBlock("i", {
            key: 0,
            class: normalizeClass([n, a.appendIcon])
          }, null, 2)) : createCommentVNode("", true)
        ])
      ], 16),
      renderSlot(d.$slots, "bottom", {}, () => [
        createVNode(Zt, null, {
          default: withCtx(() => [
            withDirectives(createBaseVNode("div", ts, [
              createBaseVNode("small", {
                class: normalizeClass(["inline-block", [a.error ? "text-danger" : "text-light-emphasis"]])
              }, toDisplayString(a.error || a.hint), 3)
            ], 512), [
              [vShow, a.error || a.hint]
            ])
          ]),
          _: 1
        })
      ])
    ], 6));
  }
});
var as = ["tabindex", "disabled"];
var ns = defineComponent({
  name: "ABtn"
});
var je = defineComponent({
  ...ns,
  props: {
    ...re({
      color: {
        default: "primary"
      },
      variant: {
        default: "fill"
      },
      states: {
        default: true
      }
    }),
    spacing: le,
    icon: z,
    appendIcon: z,
    iconOnly: Boolean,
    disabled: se
  },
  setup(s) {
    const t = s, e = ue(toRef(t, "spacing")), { getLayerClasses: a } = ie(), { styles: i, classes: o } = a(
      toRef(t, "color"),
      toRef(t, "variant"),
      toRef(t, "states")
    );
    return (n, l) => (openBlock(), createElementBlock("button", {
      tabindex: t.disabled ? -1 : 0,
      style: normalizeStyle([
        ...unref(i),
        { "--a-spacing": unref(e) / 100 }
      ]),
      class: normalizeClass(["whitespace-nowrap inline-flex justify-center items-center", [
        t.iconOnly ? "a-btn-icon-only" : "a-btn",
        t.disabled && "opacity-50 pointer-events-none",
        unref(o)
      ]]),
      disabled: t.disabled ? true : void 0
    }, [
      t.icon ? (openBlock(), createElementBlock("i", {
        key: 0,
        class: normalizeClass(t.icon)
      }, null, 2)) : createCommentVNode("", true),
      renderSlot(n.$slots, "default"),
      t.appendIcon ? (openBlock(), createElementBlock("i", {
        key: 1,
        class: normalizeClass(t.appendIcon)
      }, null, 2)) : createCommentVNode("", true)
    ], 14, as));
  }
});
var Me = {
  title: z,
  subtitle: z,
  text: z,
  titleTag: {
    type: String,
    default: "span"
  },
  subtitleTag: {
    type: String,
    default: "span"
  },
  textTag: {
    type: String,
    default: "span"
  }
};
var os = Object.defineProperty;
var ls = Object.defineProperties;
var rs = Object.getOwnPropertyDescriptors;
var ze = Object.getOwnPropertySymbols;
var is = Object.prototype.hasOwnProperty;
var us = Object.prototype.propertyIsEnumerable;
var Ue = (s, t, e) => t in s ? os(s, t, { enumerable: true, configurable: true, writable: true, value: e }) : s[t] = e;
var cs = (s, t) => {
  for (var e in t || (t = {}))
    is.call(t, e) && Ue(s, e, t[e]);
  if (ze)
    for (var e of ze(t))
      us.call(t, e) && Ue(s, e, t[e]);
  return s;
};
var ds = (s, t) => ls(s, rs(t));
function ps(s, t) {
  var e;
  const a = shallowRef();
  return watchEffect(() => {
    a.value = s();
  }, ds(cs({}, t), {
    flush: (e = t == null ? void 0 : t.flush) != null ? e : "sync"
  })), readonly(a);
}
var He;
var yt = typeof window < "u";
var fs = (s) => typeof s < "u";
var ys = (s) => typeof s == "function";
var Qe = (s) => typeof s == "number";
var ms = (s) => typeof s == "string";
var qe = (s, t, e) => Math.min(e, Math.max(t, s));
var we = () => {
};
yt && ((He = window == null ? void 0 : window.navigator) == null ? void 0 : He.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function K(s) {
  return typeof s == "function" ? s() : unref(s);
}
function vs(s) {
  return s;
}
function gs(s) {
  return getCurrentScope() ? (onScopeDispose(s), true) : false;
}
function he(s, ...t) {
  const e = t.flat();
  return reactive(Object.fromEntries(e.map((a) => [a, toRef(s, a)])));
}
function Xe(s, t, e = {}) {
  var a, i;
  const {
    flush: o = "sync",
    deep: n = false,
    immediate: l = true,
    direction: r = "both",
    transform: u = {}
  } = e;
  let d, p;
  const m = (a = u.ltr) != null ? a : (v) => v, f = (i = u.rtl) != null ? i : (v) => v;
  return (r === "both" || r === "ltr") && (d = watch(s, (v) => t.value = m(v), { flush: o, deep: n, immediate: l })), (r === "both" || r === "rtl") && (p = watch(t, (v) => s.value = f(v), { flush: o, deep: n, immediate: l })), () => {
    d == null || d(), p == null || p();
  };
}
function hs(s, t, e) {
  const a = watch(s, (...i) => (nextTick(() => a()), t(...i)), e);
}
function pe(s) {
  var t;
  const e = K(s);
  return (t = e == null ? void 0 : e.$el) != null ? t : e;
}
var De = yt ? window : void 0;
function Y(...s) {
  let t, e, a, i;
  if (ms(s[0]) || Array.isArray(s[0]) ? ([e, a, i] = s, t = De) : [t, e, a, i] = s, !t)
    return we;
  Array.isArray(e) || (e = [e]), Array.isArray(a) || (a = [a]);
  const o = [], n = () => {
    o.forEach((d) => d()), o.length = 0;
  }, l = (d, p, m) => (d.addEventListener(p, m, i), () => d.removeEventListener(p, m, i)), r = watch(() => pe(t), (d) => {
    n(), d && o.push(...e.flatMap((p) => a.map((m) => l(d, p, m))));
  }, { immediate: true, flush: "post" }), u = () => {
    r(), n();
  };
  return gs(u), u;
}
function xe(s, t, e = {}) {
  const { window: a = De, ignore: i = [], capture: o = true, detectIframe: n = false } = e;
  if (!a)
    return;
  let l = true, r;
  const u = (f) => i.some((v) => {
    if (typeof v == "string")
      return Array.from(a.document.querySelectorAll(v)).some((O) => O === f.target || f.composedPath().includes(O));
    {
      const O = pe(v);
      return O && (f.target === O || f.composedPath().includes(O));
    }
  }), d = (f) => {
    a.clearTimeout(r);
    const v = pe(s);
    if (!(!v || v === f.target || f.composedPath().includes(v))) {
      if (f.detail === 0 && (l = !u(f)), !l) {
        l = true;
        return;
      }
      t(f);
    }
  }, p = [
    Y(a, "click", d, { passive: true, capture: o }),
    Y(a, "pointerdown", (f) => {
      const v = pe(s);
      v && (l = !f.composedPath().includes(v) && !u(f));
    }, { passive: true }),
    Y(a, "pointerup", (f) => {
      if (f.button === 0) {
        const v = f.composedPath();
        f.composedPath = () => v, r = a.setTimeout(() => d(f), 50);
      }
    }, { passive: true }),
    n && Y(a, "blur", (f) => {
      var v;
      const O = pe(s);
      ((v = a.document.activeElement) == null ? void 0 : v.tagName) === "IFRAME" && !(O != null && O.contains(a.document.activeElement)) && t(f);
    })
  ].filter(Boolean);
  return () => p.forEach((f) => f());
}
function bs(s) {
  return JSON.parse(JSON.stringify(s));
}
var Ne = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var Le = "__vueuse_ssr_handlers__";
Ne[Le] = Ne[Le] || {};
Ne[Le];
function Ye(s, t, { window: e = De, initialValue: a = "" } = {}) {
  const i = ref(a), o = computed(() => {
    var n;
    return pe(t) || ((n = e == null ? void 0 : e.document) == null ? void 0 : n.documentElement);
  });
  return watch([o, () => K(s)], ([n, l]) => {
    var r;
    if (n && e) {
      const u = (r = e.getComputedStyle(n).getPropertyValue(l)) == null ? void 0 : r.trim();
      i.value = u || a;
    }
  }, { immediate: true }), watch(i, (n) => {
    var l;
    (l = o.value) != null && l.style && o.value.style.setProperty(K(s), n);
  }), i;
}
function Ce() {
  const s = ref(false);
  return onMounted(() => {
    s.value = true;
  }), s;
}
function Je(s, t, e) {
  const a = ref(s);
  return computed({
    get() {
      return a.value = qe(a.value, K(t), K(e));
    },
    set(i) {
      a.value = qe(i, K(t), K(e));
    }
  });
}
function _s(s) {
  const {
    total: t = 1 / 0,
    pageSize: e = 10,
    page: a = 1,
    onPageChange: i = we,
    onPageSizeChange: o = we,
    onPageCountChange: n = we
  } = s, l = Je(e, 1, 1 / 0), r = computed(() => Math.max(1, Math.ceil(unref(t) / unref(l)))), u = Je(a, 1, r), d = computed(() => u.value === 1), p = computed(() => u.value === r.value);
  isRef(a) && Xe(a, u), isRef(e) && Xe(e, l);
  function m() {
    u.value--;
  }
  function f() {
    u.value++;
  }
  const v = {
    currentPage: u,
    currentPageSize: l,
    pageCount: r,
    isFirstPage: d,
    isLastPage: p,
    prev: m,
    next: f
  };
  return watch(u, () => {
    i(reactive(v));
  }), watch(l, () => {
    o(reactive(v));
  }), watch(r, () => {
    n(reactive(v));
  }), v;
}
var Ge;
(function(s) {
  s.UP = "UP", s.RIGHT = "RIGHT", s.DOWN = "DOWN", s.LEFT = "LEFT", s.NONE = "NONE";
})(Ge || (Ge = {}));
var $s = Object.defineProperty;
var Ke = Object.getOwnPropertySymbols;
var ws = Object.prototype.hasOwnProperty;
var As = Object.prototype.propertyIsEnumerable;
var Ze = (s, t, e) => t in s ? $s(s, t, { enumerable: true, configurable: true, writable: true, value: e }) : s[t] = e;
var ks = (s, t) => {
  for (var e in t || (t = {}))
    ws.call(t, e) && Ze(s, e, t[e]);
  if (Ke)
    for (var e of Ke(t))
      As.call(t, e) && Ze(s, e, t[e]);
  return s;
};
var Ss = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
ks({
  linear: vs
}, Ss);
function mt(s, t, e, a = {}) {
  var i, o, n;
  const {
    clone: l = false,
    passive: r = false,
    eventName: u,
    deep: d = false,
    defaultValue: p
  } = a, m = getCurrentInstance(), f = e || (m == null ? void 0 : m.emit) || ((i = m == null ? void 0 : m.$emit) == null ? void 0 : i.bind(m)) || ((n = (o = m == null ? void 0 : m.proxy) == null ? void 0 : o.$emit) == null ? void 0 : n.bind(m == null ? void 0 : m.proxy));
  let v = u;
  t || (t = "modelValue"), v = u || v || `update:${t.toString()}`;
  const O = (j) => l ? ys(l) ? l(j) : bs(j) : j, E = () => fs(s[t]) ? O(s[t]) : p;
  if (r) {
    const j = E(), w = ref(j);
    return watch(() => s[t], (W) => w.value = O(W)), watch(w, (W) => {
      (W !== s[t] || d) && f(v, W);
    }, { deep: d }), w;
  } else
    return computed({
      get() {
        return E();
      },
      set(j) {
        f(v, j);
      }
    });
}
var me = (s) => computed(
  () => {
    const t = K(s), [e, a, i] = t === void 0 ? [] : typeof t == "string" || typeof t == "number" ? [t] : t;
    return { content: e, classes: a, attrs: i };
  }
);
var xs = { class: "uno-layer-base-text-base gap-4 flex flex-col" };
var Cs = {
  key: 0,
  class: "flex justify-between"
};
var Is = { class: "flex-grow" };
var Os = defineComponent({
  name: "ATypography"
});
var Ie = defineComponent({
  ...Os,
  props: Me,
  setup(s) {
    const t = s, e = me(toRef(t, "title")), a = me(toRef(t, "subtitle")), i = me(toRef(t, "text"));
    return (o, n) => (openBlock(), createElementBlock("div", xs, [
      o.$slots.title || t.title || o.$slots.subtitle || t.subtitle || o.$slots["header-right"] ? (openBlock(), createElementBlock("div", Cs, [
        createBaseVNode("div", Is, [
          (Array.isArray(t.title) ? t.title[0] : t.title) || o.$slots.title ? (openBlock(), createBlock(resolveDynamicComponent(t.titleTag), mergeProps({ key: 0 }, unref(e).attrs, {
            class: ["a-typography-title font-medium block em:uno-layer-base-text-lg uno-layer-base-text-[hsla(var(--a-typography-title-color),var(--a-typography-title-opacity))]", [unref(e).classes]]
          }), {
            default: withCtx(() => [
              renderSlot(o.$slots, "title", {}, () => [
                createTextVNode(toDisplayString(unref(e).content), 1)
              ])
            ]),
            _: 3
          }, 16, ["class"])) : createCommentVNode("", true),
          (Array.isArray(t.subtitle) ? t.subtitle[0] : t.subtitle) || o.$slots.subtitle ? (openBlock(), createBlock(resolveDynamicComponent(t.subtitleTag), mergeProps({ key: 1 }, unref(a).attrs, {
            class: ["a-typography-subtitle block em:uno-layer-base-text-sm uno-layer-base-text-[hsla(var(--a-typography-subtitle-color),var(--a-typography-subtitle-opacity))]", [unref(a).classes]]
          }), {
            default: withCtx(() => [
              renderSlot(o.$slots, "subtitle", {}, () => [
                createTextVNode(toDisplayString(unref(a).content), 1)
              ])
            ]),
            _: 3
          }, 16, ["class"])) : createCommentVNode("", true)
        ]),
        renderSlot(o.$slots, "header-right")
      ])) : createCommentVNode("", true),
      (Array.isArray(t.text) ? t.text[0] : t.text) || o.$slots.text ? (openBlock(), createBlock(resolveDynamicComponent(t.textTag), mergeProps({ key: 1 }, unref(i).attrs, {
        class: ["a-typography-text uno-layer-base-text-[hsla(var(--a-typography-text-color),var(--a-typography-text-opacity))]", [unref(i).classes]]
      }), {
        default: withCtx(() => [
          renderSlot(o.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(unref(i).content), 1)
          ])
        ]),
        _: 3
      }, 16, ["class"])) : createCommentVNode("", true)
    ]));
  }
});
var ve = {
  ...re(),
  ...Me,
  spacing: le,
  img: String,
  imgAlt: String
};
var Vs = (s, t) => {
  const { title: e, subtitle: a, text: i } = s, o = (n) => {
    var l;
    return n && n.value ? typeof n.value == "string" ? !!n.value : typeof n.value == "number" ? ((l = n.value) != null ? l : null) !== null : !!n.value.length : false;
  };
  return o(e) || o(a) || o(i) || t.title || t.subtitle || t["header-right"];
};
var Ps = ["src", "alt"];
var Bs = {
  key: 1,
  class: "a-card-typography-wrapper"
};
var Ts = defineComponent({
  name: "ACard"
});
var be = defineComponent({
  ...Ts,
  props: ve,
  setup(s) {
    const t = s, e = useSlots(), a = ue(toRef(t, "spacing")), { getLayerClasses: i } = ie(), { styles: o, classes: n } = i(
      toRef(t, "color"),
      toRef(t, "variant"),
      toRef(t, "states")
    ), l = Vs(toRefs(t), e), r = me(toRef(t, "text"));
    return r.value.classes === void 0 ? r.value.classes = "uno-layer-base-text-sm" : Array.isArray(r.value.classes) ? r.value.classes = [...r.value.classes, "uno-layer-base-text-sm"] : r.value.classes = " uno-layer-base-text-sm", (u, d) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["a-card overflow-hidden uno-layer-base-bg-[hsl(var(--a-layer))]", unref(n)]),
      style: normalizeStyle([
        ...unref(o),
        { "--a-spacing": unref(a) / 100 }
      ])
    }, [
      t.img ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: t.img,
        alt: t.imgAlt
      }, null, 8, Ps)) : createCommentVNode("", true),
      unref(l) ? (openBlock(), createElementBlock("div", Bs, [
        createVNode(unref(Ie), {
          title: t.title,
          subtitle: t.subtitle,
          text: Object.values(unref(r))
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(u.$slots).filter((p) => p !== "default"), (p) => ({
            name: p,
            fn: withCtx((m) => [
              renderSlot(u.$slots, p, normalizeProps(guardReactiveProps(m || {})))
            ])
          }))
        ]), 1032, ["title", "subtitle", "text"])
      ])) : createCommentVNode("", true),
      renderSlot(u.$slots, "default")
    ], 6));
  }
});
var js = defineComponent({
  name: "ACheckbox"
});
var Ns = defineComponent({
  ...js,
  props: {
    color: F({ default: "primary" }, ge),
    modelValue: [Boolean, Array, Set],
    label: String,
    icon: F({ default: "i-bx-check" }, z),
    disabled: se,
    indeterminate: Boolean
  },
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, a = useAttrs(), i = `a-checkbox-${a.id || a.value}-${Math.random().toString(36).slice(2, 7)}`, o = mt(e, "modelValue", t), n = ref(), l = ref("");
    watch([o, () => e.indeterminate], ([u, d], [p, m]) => {
      n.value && (n.value.indeterminate = d), l.value = !d && (!m || u) ? e.icon : "i-bx-minus";
    }, { immediate: true });
    const r = computed(() => {
      var u;
      return typeof o.value == "boolean" ? o.value : Array.isArray(o.value) ? o.value.includes(a.value) : (u = o.value) == null ? void 0 : u.has(a.value);
    });
    return (u, d) => (openBlock(), createElementBlock("label", {
      for: i,
      class: normalizeClass(["inline-flex items-center cursor-pointer", [e.disabled && "a-checkbox-disabled pointer-events-none"]])
    }, [
      withDirectives(createBaseVNode("input", mergeProps({
        id: i,
        ref: unref(n),
        "onUpdate:modelValue": d[0] || (d[0] = (p) => isRef(o) ? o.value = p : null),
        class: "hidden",
        type: "checkbox"
      }, unref(a)), null, 16), [
        [vModelCheckbox, unref(o)]
      ]),
      createBaseVNode("div", {
        class: normalizeClass(["a-checkbox-box flex items-center justify-center shrink-0", [(e.indeterminate || unref(r)) && `bg-${e.color} border-${e.color} children:scale-full`]])
      }, [
        createBaseVNode("i", {
          class: normalizeClass(["a-checkbox-icon scale-0 text-white", unref(l)])
        }, null, 2)
      ], 2),
      renderSlot(u.$slots, "default", {}, () => [
        createTextVNode(toDisplayString(e.label), 1)
      ])
    ], 2));
  }
});
var Ls = defineComponent({
  name: "AChip"
});
var Es = defineComponent({
  ...Ls,
  props: {
    ...re({
      color: {
        default: "primary"
      },
      variant: {
        default: "light"
      }
    }),
    modelValue: {
      type: Boolean,
      default: true
    },
    closable: Boolean,
    icon: z,
    appendIcon: z,
    disabled: se
  },
  emits: ["update:modelValue", "click:close", "click:appendIcon"],
  setup(s, { emit: t }) {
    const e = s, a = useAttrs(), { getLayerClasses: i } = ie(), o = computed(() => a.onClick !== void 0), { styles: n, classes: l } = i(
      toRef(e, "color"),
      toRef(e, "variant"),
      o
    ), r = () => {
      t("update:modelValue", false), t("click:close");
    };
    return (u, d) => e.modelValue ? (openBlock(), createElementBlock("div", {
      key: 0,
      style: normalizeStyle(unref(n)),
      class: normalizeClass(["a-chip", [
        {
          "a-chip-disabled": e.disabled,
          "cursor-pointer": unref(o)
        },
        unref(l)
      ]])
    }, [
      e.icon ? (openBlock(), createElementBlock("i", {
        key: 0,
        class: normalizeClass(e.icon)
      }, null, 2)) : createCommentVNode("", true),
      renderSlot(u.$slots, "default"),
      e.appendIcon ? (openBlock(), createElementBlock("i", {
        key: 1,
        class: normalizeClass(e.appendIcon)
      }, null, 2)) : createCommentVNode("", true),
      e.closable ? (openBlock(), createElementBlock("i", {
        key: 2,
        class: "i-bx-x hover:i-bx-bxs-x-circle hover:opacity-70",
        onClick: r
      })) : createCommentVNode("", true)
    ], 6)) : createCommentVNode("", true);
  }
});
var Fe = {
  rows: {
    type: Array,
    default: () => []
  },
  cols: {
    type: [Array],
    default: () => []
  },
  noDataText: {
    type: String,
    default: "No records found!"
  },
  spacing: le
};
var Rs = { class: "overflow-x-auto" };
var Ms = { class: "a-table-table overflow-x-auto w-full max-w-full" };
var Ds = ["onClick"];
var Fs = { class: "a-table-td-text" };
var Ws = { key: 1 };
var zs = ["colspan"];
var Us = {
  key: 0,
  class: "a-table-footer"
};
var Hs = defineComponent({
  name: "ATable"
});
var vt = defineComponent({
  ...Hs,
  props: F(Fe, ve),
  emits: ["click:header"],
  setup(s, { emit: t }) {
    const e = s, a = he(e, Object.keys(ve)), i = ue(toRef(e, "spacing")), o = computed(() => e.cols.length ? e.cols : e.rows.length ? Object.keys(e.rows[0]).map((n) => ({ name: n })) : []);
    return (n, l) => (openBlock(), createBlock(unref(be), mergeProps(unref(a), {
      class: "a-table",
      style: { "--a-spacing": unref(i) / 100 }
    }), createSlots({
      default: withCtx(() => [
        renderSlot(n.$slots, "before-table"),
        createBaseVNode("div", Rs, [
          createBaseVNode("table", Ms, [
            createBaseVNode("thead", null, [
              createBaseVNode("tr", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(o), (r, u) => (openBlock(), createElementBlock("th", {
                  key: u,
                  class: normalizeClass(["a-table-table-th whitespace-nowrap", typeof r.headerClasses == "function" ? r.headerClasses(r) : r.headerClasses]),
                  onClick: (d) => n.$emit("click:header", r)
                }, [
                  renderSlot(n.$slots, `header-${r.name}`, normalizeProps(guardReactiveProps({ col: r })), () => [
                    createBaseVNode("span", null, toDisplayString(r.name), 1)
                  ])
                ], 10, Ds))), 128))
              ])
            ]),
            createBaseVNode("tbody", null, [
              e.rows.length ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(e.rows, (r, u) => (openBlock(), createElementBlock("tr", { key: u }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(o), (d, p) => (openBlock(), createElementBlock("td", {
                  key: p,
                  class: normalizeClass(["a-table-table-td whitespace-nowrap", typeof d.classes == "function" ? d.classes(r) : d.classes])
                }, [
                  renderSlot(n.$slots, `col-${d.name}`, normalizeProps(guardReactiveProps({ row: r, colIndex: p })), () => [
                    createBaseVNode("span", Fs, toDisplayString(d.formatter ? d.formatter(r) : r[d.name]), 1)
                  ])
                ], 2))), 128))
              ]))), 128)) : (openBlock(), createElementBlock("tr", Ws, [
                createBaseVNode("td", {
                  class: "em:px-[1.15rem] em:h-14 whitespace-nowrap text-center font-medium",
                  colspan: e.cols.length
                }, toDisplayString(e.noDataText), 9, zs)
              ]))
            ]),
            n.$slots.footer ? (openBlock(), createElementBlock("tfoot", Us, [
              renderSlot(n.$slots, "footer")
            ])) : createCommentVNode("", true)
          ])
        ]),
        renderSlot(n.$slots, "after-table")
      ]),
      _: 2
    }, [
      renderList(Object.keys(n.$slots).filter((r) => r !== "default"), (r) => ({
        name: r,
        fn: withCtx((u) => [
          renderSlot(n.$slots, r, normalizeProps(guardReactiveProps(u || {})))
        ])
      }))
    ]), 1040, ["style"]));
  }
});
var Qs = Nt({
  rows: {
    type: [Array, Function],
    required: true
  },
  cols: {
    type: [Array],
    default: () => []
  },
  search: {
    type: [Boolean, String],
    default: false
  },
  isSortable: {
    type: Boolean,
    default: true
  },
  multiSort: Boolean,
  pageSize: {
    type: Number,
    default: 10
  }
}, Fe);
var et = {
  isSortable: true,
  headerClasses: (s) => s.isSortable && "cursor-pointer select-none",
  sortBy: void 0,
  isFilterable: true
};
var qs = (s, t, e = void 0, a = false) => {
  const i = (l, r, u) => {
    const d = l[r];
    if (u) {
      if (typeof d == "string")
        return d;
    } else if (typeof d == "string" || typeof d == "number" || typeof d == "boolean")
      return d.toLocaleString();
    return null;
  }, o = (l, r, u, d) => {
    const p = i(l, r, d);
    return p ? p.toLocaleLowerCase().includes(u) : false;
  };
  return {
    results: computed(() => {
      const l = unref(t), r = unref(s).toLocaleLowerCase(), u = e && unref(e), d = unref(a);
      return ft(r) ? l : l.filter((p) => {
        if (typeof u == "function")
          return u(unref(s), p);
        if (d) {
          if (typeof p == "string")
            return p.toLocaleLowerCase().includes(r);
        } else if (typeof p == "string" || typeof p == "number" || typeof p == "boolean")
          return String(p).toLocaleLowerCase().includes(r);
        return Ae(p) ? u ? typeof u == "string" ? o(p, u, r, d) : u.some((m) => {
          if (typeof m == "string")
            return o(p, m, r, d);
          {
            const { name: f, filterBy: v } = m;
            return v(p[f], unref(s), p);
          }
        }) : Object.entries(p).some(([m, f]) => {
          if (d) {
            if (typeof f == "string")
              return f.toLocaleLowerCase().includes(r);
          } else if (typeof f == "string" || typeof f == "number" || typeof f == "boolean")
            return String(f).toLocaleLowerCase().includes(r);
          return false;
        }) : false;
      });
    })
  };
};
var Xs = (s, t = void 0, e = true) => {
  const a = (n) => n instanceof Date && !isNaN(n), i = (n, l) => Qe(n) && Qe(l) ? n - l : a(n) && a(l) ? Date.parse(new Date(n)) - Date.parse(new Date(l)) : typeof n == "boolean" && typeof l == "boolean" ? n - l : String(n).localeCompare(String(l));
  return {
    results: computed(() => {
      const n = JSON.parse(JSON.stringify(unref(s))), l = unref(t), u = unref(e) ? 1 : -1;
      return n.sort((p, m) => Ae(p) && Ae(m) ? l ? typeof l == "string" ? i(p[l], m[l]) * u : ft(l) ? 0 : l.map((v) => {
        if (typeof v == "string")
          return i(p[v], m[v]) * u;
        {
          const { name: O, sortBy: E, isAsc: j } = v;
          if (E)
            return E(p[O], m[O]);
          if (j !== void 0) {
            const w = j ? 1 : -1;
            return i(p[O], m[O]) * w;
          }
          return 0;
        }
      }).reduce((v, O) => v || O) : 0 : i(p, m) * u);
    })
  };
};
var Ys = { class: "i-bx-up-arrow-alt" };
var Js = { class: "i-bx-down-arrow-alt" };
var Gs = { class: "a-data-table-pagination flex items-center w-full" };
var Ks = createBaseVNode("div", { class: "flex-grow" }, null, -1);
var Zs = { class: "a-data-table-per-page flex items-center" };
var ea = createBaseVNode("span", { class: "sm:inline hidden" }, "per page", -1);
var ta = { class: "a-data-table-pagination-navigation" };
var sa = defineComponent({
  name: "ADataTable"
});
var aa = defineComponent({
  ...sa,
  props: Qs,
  emits: ["click:header", "update:search"],
  setup(s, { emit: t }) {
    const e = s, a = he(e, Object.keys(Fe).filter((k) => !["rows", "cols"].includes(k))), i = ref(typeof e.rows != "function" ? e.rows : []), o = ref(0), n = computed(() => typeof e.rows == "function" ? o.value : e.rows.length), l = ref([]);
    watch(() => e.cols, (k) => {
      l.value = k.map((P) => F(P, et));
    }, { immediate: true });
    const r = (k) => k.map((P) => F({ ...et, name: P }));
    if (!e.cols.length)
      if (Array.isArray(e.rows) && e.rows.length)
        l.value = r(Object.keys(e.rows[0]));
      else {
        const k = ps(
          () => typeof e.rows == "function" ? i.value.length : e.rows.length
        );
        hs(k, () => {
          l.value = r(
            Object.keys((typeof e.rows == "function" ? i.value : e.rows)[0])
          );
        });
      }
    const u = ref(typeof e.search == "boolean" ? "" : e.search);
    watch(u, (k) => {
      t("update:search", k), p();
    });
    const d = computed(() => l.value.filter((k) => k.isSortable && k.sortBy !== void 0)), p = () => {
      if (typeof e.rows == "function")
        e.rows({
          q: u.value,
          currentPage: m.value,
          rowsPerPage: f.value,
          sortedCols: d.value
        }).then((k) => {
          const { rows: P, total: I } = k;
          i.value = P, o.value = I;
        });
      else {
        const { results: k } = qs(
          u,
          e.rows,
          l.value.map((G) => G.filterFunc ? { name: G.name, filterBy: G.filterFunc } : G.name)
        ), { results: P } = Xs(
          k,
          computed(() => {
            const G = [];
            return d.value.forEach((de) => {
              de.sortFunc ? G.push({ name: de.name, sortBy: de.sortFunc }) : de.sortBy !== void 0 && G.push({ name: de.name, isAsc: de.sortBy === "asc" });
            }), G;
          })
        ), I = (m.value - 1) * f.value, ce = m.value * f.value;
        i.value = P.value.slice(I, ce);
      }
    }, {
      currentPage: m,
      currentPageSize: f,
      pageCount: v,
      isFirstPage: O,
      isLastPage: E,
      prev: j,
      next: w
    } = _s({
      total: n,
      page: 1,
      pageSize: e.pageSize,
      onPageChange: p,
      onPageSizeChange: p
    });
    p();
    const W = (k) => {
      k = k;
      const P = l.value.find((I) => k.name === I.name);
      if (!P) {
        console.warn(`Clicked col ${k.name} doesn't exist in table cols: ${l.value.map((I) => I.name).join(", ")}`);
        return;
      }
      !P.isSortable || (P.sortBy === void 0 ? P.sortBy = "asc" : P.sortBy === "asc" ? P.sortBy = "desc" : P.sortBy = void 0, e.multiSort || l.value.forEach((I, ce) => {
        I.name !== k.name && (I.sortBy = void 0);
      }), t("click:header", k), k.isSortable && p());
    }, T = useSlots(), ae = typeof e.search == "boolean" && e.search || e.search || T["before-search"] || T["after-search"], _e = computed(() => {
      const k = typeof e.rows == "function" ? i.value.length : e.rows.length ? (m.value - 1) * f.value + 1 : 0, P = E.value ? n.value : m.value * f.value;
      return `${k} - ${P} of ${n.value}`;
    });
    return (k, P) => (openBlock(), createBlock(unref(vt), mergeProps(unref(a), {
      cols: unref(l),
      rows: unref(i),
      class: "a-data-table",
      "onClick:header": W
    }), createSlots({
      "after-table": withCtx(() => [
        createBaseVNode("div", Gs, [
          createVNode(unref(Ie), {
            class: "a-data-table-pagination-meta",
            subtitle: unref(_e)
          }, null, 8, ["subtitle"]),
          Ks,
          createBaseVNode("div", Zs, [
            ea,
            createVNode(unref(_t), {
              modelValue: unref(f),
              "onUpdate:modelValue": P[1] || (P[1] = (I) => isRef(f) ? f.value = I : null),
              options: Array.from(/* @__PURE__ */ new Set([e.pageSize, 5, 10, 15, 20])).sort((I, ce) => I - ce),
              spacing: 80,
              "options-wrapper-classes": "a-data-table-per-page-select--options-wrapper-classes"
            }, null, 8, ["modelValue", "options"])
          ]),
          createBaseVNode("div", ta, [
            createVNode(unref(je), {
              class: "a-data-table-paginate-previous",
              icon: "i-bx-left-arrow-alt",
              "icon-only": "",
              variant: "default",
              disabled: unref(O),
              onClick: unref(j)
            }, null, 8, ["disabled", "onClick"]),
            createVNode(unref(je), {
              class: "a-data-table-paginate-next",
              icon: "i-bx-right-arrow-alt",
              "icon-only": "",
              variant: "default",
              disabled: unref(E),
              onClick: unref(w)
            }, null, 8, ["disabled", "onClick"])
          ])
        ])
      ]),
      _: 2
    }, [
      unref(ae) ? {
        name: "header-right",
        fn: withCtx(() => [
          renderSlot(k.$slots, "before-search"),
          typeof e.search == "boolean" && e.search || e.search ? (openBlock(), createBlock(unref(ht), {
            key: 0,
            modelValue: unref(u),
            "onUpdate:modelValue": P[0] || (P[0] = (I) => isRef(u) ? u.value = I : null),
            placeholder: "search...",
            class: "max-w-48 text-sm",
            "prepend-inner-icon": "i-bx-search"
          }, null, 8, ["modelValue"])) : createCommentVNode("", true),
          renderSlot(k.$slots, "after-search")
        ]),
        key: "0"
      } : void 0,
      renderList(unref(l), (I) => ({
        name: `header-${I.name}`,
        fn: withCtx(() => [
          renderSlot(k.$slots, `header-${I.name}`, normalizeProps(guardReactiveProps({ col: I })), () => [
            createBaseVNode("span", null, toDisplayString(I.name), 1)
          ]),
          withDirectives(createBaseVNode("i", Ys, null, 512), [
            [vShow, I.sortBy === "asc"]
          ]),
          withDirectives(createBaseVNode("i", Js, null, 512), [
            [vShow, I.sortBy === "desc"]
          ])
        ])
      })),
      renderList(Object.keys(k.$slots).filter((I) => !I.startsWith("header-")), (I) => ({
        name: I,
        fn: withCtx((ce) => [
          renderSlot(k.$slots, I, normalizeProps(guardReactiveProps(ce || {})))
        ])
      }))
    ]), 1040, ["cols", "rows"]));
  }
});
var gt = (s) => {
  const t = ref(), e = Ye("--scrollbar-width", t), a = Ye("--window-scroll-top", t);
  watch(s, (i) => {
    e.value || (e.value = `${window.innerWidth - document.body.clientWidth}px`);
    const o = document.documentElement.classList;
    if (i)
      a.value = `-${window.scrollY}px`, o.add("scroll-lock");
    else {
      const n = a.value;
      o.remove("scroll-lock"), window.scrollTo(0, parseInt(n || "0") * -1);
    }
  });
};
function ee(s) {
  return { teleportTarget: computed(() => {
    const e = unref(s);
    if (typeof window > "u")
      return;
    const a = e === void 0 ? document.body : typeof e == "string" ? document.querySelector(e) : e;
    if (a == null) {
      console.warn(`Unable to locate target ${e}`);
      return;
    }
    if (!ee.cache.has(a)) {
      const i = document.createElement("div");
      i.id = "a-teleport-target", a.appendChild(i), ee.cache.set(a, i);
    }
    return ee.cache.get(a);
  }) };
}
ee.cache = /* @__PURE__ */ new WeakMap();
var na = { class: "a-dialog-wrapper grid uno-layer-base-place-items-center fixed uno-layer-base-inset-0 bg-[hsla(var(--a-overlay-color),var(--a-overlay-opacity))]" };
var oa = defineComponent({
  name: "ADialog",
  inheritAttrs: false
});
var la = defineComponent({
  ...oa,
  props: F({
    modelValue: Boolean,
    persistent: Boolean
  }, ve),
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, { teleportTarget: a } = ee(), i = Ce(), o = ref();
    return e.persistent || xe(o, () => {
      !e.modelValue || t("update:modelValue", false);
    }), gt(toRef(e, "modelValue")), (n, l) => unref(i) ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: unref(a)
    }, [
      createVNode(Transition, { name: "bg" }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("div", na, [
            createVNode(Transition, { name: "scale" }, {
              default: withCtx(() => [
                withDirectives(createVNode(unref(be), mergeProps({
                  ref_key: "refCard",
                  ref: o,
                  class: "a-dialog backface-hidden transform translate-z-0 max-w-[calc(100vw-2rem)]"
                }, { ...n.$attrs, ...e }), createSlots({ _: 2 }, [
                  renderList(n.$slots, (r, u) => ({
                    name: u,
                    fn: withCtx((d) => [
                      renderSlot(n.$slots, u, normalizeProps(guardReactiveProps(d || {})))
                    ])
                  }))
                ]), 1040), [
                  [vShow, e.modelValue]
                ])
              ]),
              _: 3
            })
          ], 512), [
            [vShow, e.modelValue]
          ])
        ]),
        _: 3
      })
    ], 8, ["to"])) : createCommentVNode("", true);
  }
});
var ra = defineComponent({
  name: "ADrawer",
  inheritAttrs: false
});
var ia = defineComponent({
  ...ra,
  props: F({
    modelValue: Boolean,
    persistent: Boolean,
    anchor: {
      type: String,
      default: "left"
    }
  }, ve),
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, { teleportTarget: a } = ee(), i = Ce(), o = ref();
    return e.persistent || xe(o, () => {
      !e.modelValue || t("update:modelValue", false);
    }), gt(toRef(e, "modelValue")), (n, l) => unref(i) ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: unref(a)
    }, [
      createVNode(Transition, { name: "bg" }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("div", {
            class: normalizeClass(["a-drawer-wrapper flex fixed uno-layer-base-inset-0 bg-[hsla(var(--a-overlay-color),var(--a-overlay-opacity))]", [
              `a-drawer-anchor-${e.anchor}`,
              ["top", "bottom"].includes(e.anchor) && "flex-col",
              ["right", "bottom"].includes(e.anchor) && "justify-end"
            ]])
          }, [
            createVNode(Transition, {
              name: `slide-${e.anchor === "bottom" ? "up" : e.anchor === "top" ? "down" : e.anchor}`
            }, {
              default: withCtx(() => [
                withDirectives(createVNode(unref(be), mergeProps({
                  ref_key: "refCard",
                  ref: o,
                  class: ["a-drawer backface-hidden transform translate-z-0", [e.anchor === "bottom" && "[--a-transition-slide-up-transform:100%]"]]
                }, { ...n.$attrs, ...e }), createSlots({ _: 2 }, [
                  renderList(n.$slots, (r, u) => ({
                    name: u,
                    fn: withCtx((d) => [
                      renderSlot(n.$slots, u, normalizeProps(guardReactiveProps(d || {})))
                    ])
                  }))
                ]), 1040, ["class"]), [
                  [vShow, e.modelValue]
                ])
              ]),
              _: 3
            }, 8, ["name"])
          ], 2), [
            [vShow, e.modelValue]
          ])
        ]),
        _: 3
      })
    ], 8, ["to"])) : createCommentVNode("", true);
  }
});
var ua = ["value"];
var ca = defineComponent({
  name: "AInput",
  inheritAttrs: false
});
var ht = defineComponent({
  ...ca,
  props: F({
    modelValue: [String, Number]
  }, oe),
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, a = he(e, Object.keys(oe)), i = useAttrs(), o = ref(), n = i.type && i.type === "file", l = (u) => {
      const d = u.target.value;
      t("update:modelValue", d);
    }, r = () => {
      var u;
      (u = o.value) == null || u.focus();
    };
    return (u, d) => (openBlock(), createBlock(unref(Se), mergeProps({ ...unref(a), class: u.$attrs.class }, {
      class: [[unref(n) && "a-input-type-file"], "a-input"],
      "onClick:inputWrapper": r
    }), createSlots({
      default: withCtx((p) => [
        createBaseVNode("input", mergeProps({ ...u.$attrs, ...p }, {
          ref_key: "input",
          ref: o,
          class: "a-input-input",
          value: e.modelValue,
          onInput: l
        }), null, 16, ua)
      ]),
      _: 2
    }, [
      renderList(Object.keys(u.$slots).filter((p) => p !== "default"), (p) => ({
        name: p,
        fn: withCtx((m) => [
          renderSlot(u.$slots, p, normalizeProps(guardReactiveProps(m || {})))
        ])
      }))
    ]), 1040, ["class"]));
  }
});
var da = {
  ...re({
    states: {
      default: true
    }
  }),
  ...Me,
  value: { type: null },
  icon: z,
  iconAppend: Boolean,
  disabled: se,
  avatarProps: Object,
  avatarAppend: Boolean,
  isActive: Boolean
};
var pa = defineComponent({
  name: "AListItem"
});
var bt = defineComponent({
  ...pa,
  props: da,
  emits: ["click:icon", "click:avatar", "click:iconAppend", "click:avatarAppend"],
  setup(s, { emit: t }) {
    const e = s, { getLayerClasses: a } = ie(), i = me(e.title);
    Array.isArray(i.value.classes) ? i.value.classes = [...i.value.classes, "uno-layer-base-text-base"] : i.value.classes += " uno-layer-base-text-base";
    const { styles: o, classes: n } = a(
      computed(() => e.isActive ? e.color || "primary" : void 0),
      computed(() => e.isActive ? e.variant || "light" : "text"),
      toRef(e, "states"),
      { statesClass: "states:10" }
    );
    return (l, r) => (openBlock(), createElementBlock("li", {
      style: normalizeStyle(unref(o)),
      class: normalizeClass(["a-list-item flex items-center gap-$a-list-item-gap m-$a-list-item-margin p-$a-list-item-padding min-h-$a-list-item-min-height", [
        { "opacity-50 pointer-events-none": e.disabled },
        e.value !== void 0 || l.$attrs.onClick ? [...unref(n), "cursor-pointer"] : ""
      ]])
    }, [
      renderSlot(l.$slots, "prepend", {}, () => [
        e.icon && !e.iconAppend ? (openBlock(), createElementBlock("i", {
          key: 0,
          class: normalizeClass(["uno-layer-base-text-xl", e.icon]),
          onClick: r[0] || (r[0] = (u) => l.$emit("click:icon"))
        }, null, 2)) : createCommentVNode("", true),
        e.avatarProps && !e.avatarAppend ? (openBlock(), createBlock(unref(Te), mergeProps({ key: 1 }, e.avatarProps, {
          onClick: r[1] || (r[1] = (u) => l.$emit("click:avatar"))
        }), null, 16)) : createCommentVNode("", true)
      ]),
      renderSlot(l.$slots, "item", {}, () => [
        createVNode(unref(Ie), {
          class: "flex-grow",
          subtitle: e.subtitle,
          text: e.text,
          title: e.title ? Object.values(unref(i)) : void 0
        }, null, 8, ["subtitle", "text", "title"])
      ]),
      renderSlot(l.$slots, "append", {}, () => [
        e.icon && e.iconAppend ? (openBlock(), createElementBlock("i", {
          key: 0,
          class: normalizeClass(["uno-layer-base-text-xl", e.icon]),
          onClick: r[2] || (r[2] = (u) => l.$emit("click:iconAppend"))
        }, null, 2)) : createCommentVNode("", true),
        e.avatarProps && e.avatarAppend ? (openBlock(), createBlock(unref(Te), mergeProps({ key: 1 }, e.avatarProps, {
          onClick: r[3] || (r[3] = (u) => l.$emit("click:avatarAppend"))
        }), null, 16)) : createCommentVNode("", true)
      ])
    ], 6));
  }
});
function fa(s) {
  const { options: t, multi: e } = s, a = ref(), i = (n) => {
    unref(e) ? a.value instanceof Set ? a.value.has(n) ? a.value.delete(n) : a.value.add(n) : a.value = /* @__PURE__ */ new Set([n]) : a.value = n;
  };
  watch(
    () => unref(e),
    () => {
      a.value = void 0;
    }
  );
  const o = ref([]);
  return typeof t == "number" ? o.value = [...Array(t)].map((n, l) => ({
    value: l,
    isSelected: computed(
      () => unref(e) ? a.value instanceof Set ? a.value.has(l) : false : l === a.value
    )
  })) : o.value = t.map((n) => ({
    value: n,
    isSelected: computed(() => unref(e) ? a.value instanceof Set ? a.value.has(n) : false : n === toRaw(a.value))
  })), {
    options: o,
    value: a,
    select: i
  };
}
var ya = { class: "a-list grid gap-$a-list-gap" };
var ma = { key: 0 };
var va = { key: 1 };
var ga = defineComponent({
  name: "AList"
});
var ha = defineComponent({
  ...ga,
  props: {
    items: {
      type: Array,
      default: () => []
    },
    multi: Boolean,
    modelValue: null,
    iconAppend: Boolean,
    avatarAppend: Boolean
  },
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, { options: a, select: i, value: o } = fa({
      options: !Qt(e.items) && e.items[0].value ? e.items.map((l) => l.value) : e.items.length,
      multi: e.multi
    }), n = (l, r) => {
      i(l.value || r), t("update:modelValue", o.value);
    };
    return (l, r) => (openBlock(), createElementBlock("ul", ya, [
      l.$slots.before ? (openBlock(), createElementBlock("li", ma, [
        renderSlot(l.$slots, "before")
      ])) : createCommentVNode("", true),
      renderSlot(l.$slots, "default", { handleListItemClick: n }, () => [
        (openBlock(true), createElementBlock(Fragment, null, renderList(e.items, (u, d) => (openBlock(), createBlock(unref(bt), mergeProps({ key: d }, u, {
          "avatar-append": e.avatarAppend,
          "icon-append": e.iconAppend,
          "is-active": unref(a)[d].isSelected,
          value: e.modelValue !== void 0 ? unref(a)[d] : void 0
        }, toHandlers({
          click: u.value || e.modelValue !== void 0 ? () => n(u, d) : null
        })), {
          default: withCtx(() => [
            renderSlot(l.$slots, "prepend", {
              item: u,
              index: d
            }),
            renderSlot(l.$slots, "item", {
              item: u,
              index: d
            }),
            renderSlot(l.$slots, "append", {
              item: u,
              index: d
            })
          ]),
          _: 2
        }, 1040, ["avatar-append", "icon-append", "is-active", "value"]))), 128))
      ]),
      l.$slots.after ? (openBlock(), createElementBlock("li", va, [
        renderSlot(l.$slots, "after")
      ])) : createCommentVNode("", true)
    ]));
  }
});
var ba = (s) => ({
  name: "sameWidth",
  fn: ({ rects: t, x: e, y: a }) => (s.style.minWidth = `${t.reference.width}px`, { x: e, y: a })
});
var _a = defineComponent({
  name: "AMenu"
});
var $a = defineComponent({
  ..._a,
  props: {
    modelValue: {
      type: Boolean,
      default: void 0
    },
    persist: {
      type: [Boolean, String],
      default: false
    },
    trigger: {
      type: String,
      default: "click"
    },
    transition: {
      type: [String, null],
      default: "slide-up"
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    strategy: {
      type: String,
      default: "absolute"
    },
    middleware: {
      type: [Function, Object],
      default: null
    }
  },
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, { teleportTarget: a } = ee(), i = Ce(), { internalState: o, toggle: n } = dt(toRef(e, "modelValue"), t, "update:modelValue", false), l = ref(), r = ref(), u = async () => {
      const p = e.middleware === null ? [
        ba(r.value.$el),
        flip(),
        shift({ padding: 10 })
      ] : e.middleware(l.value, r.value.$el), { x: m, y: f } = await computePosition2(l.value, r.value.$el, {
        strategy: e.strategy,
        placement: e.placement,
        middleware: p
      });
      Object.assign(r.value.$el.style, {
        left: `${m}px`,
        top: `${f}px`
      });
    };
    let d;
    return onMounted(() => {
      var m, f;
      const p = getCurrentInstance();
      l.value = (f = (m = p == null ? void 0 : p.proxy) == null ? void 0 : m.$el) == null ? void 0 : f.parentNode;
    }), watch(
      [i, () => e.placement],
      () => {
        nextTick(() => {
          d = autoUpdate(l.value, r.value.$el, u);
        });
      }
    ), onBeforeUnmount(() => d()), e.modelValue === void 0 && (e.trigger === "hover" ? (Y(l, "mouseenter", () => {
      o.value === false && n();
    }), Y(l, "mouseleave", () => {
      o.value === true && n();
    }), Y(r, "mouseenter", () => {
      o.value === false && n();
    }), Y(r, "mouseleave", () => {
      o.value === true && n();
    })) : (console.log("click..."), Y(l, "click", n), e.persist !== true && xe(
      l,
      (p) => {
        o.value && n();
      },
      {
        ignore: e.persist === "content" ? [r] : []
      }
    ))), (p, m) => unref(i) ? (openBlock(), createBlock(Teleport, {
      key: 0,
      to: unref(a)
    }, [
      createVNode(Transition, {
        name: e.transition || void 0
      }, {
        default: withCtx(() => {
          var f;
          return [
            withDirectives(createVNode(unref(be), {
              ref_key: "refFloating",
              ref: r,
              class: normalizeClass(["a-menu", [e.strategy === "fixed" ? "fixed" : "absolute"]])
            }, {
              default: withCtx(() => [
                renderSlot(p.$slots, "default")
              ]),
              _: 3
            }, 8, ["class"]), [
              [vShow, (f = e.modelValue) != null ? f : unref(o)]
            ])
          ];
        }),
        _: 3
      }, 8, ["name"])
    ], 8, ["to"])) : createCommentVNode("", true);
  }
});
var wa = ["checked"];
var Aa = defineComponent({
  name: "ARadio",
  inheritAttrs: false
});
var ka = defineComponent({
  ...Aa,
  props: {
    color: F({
      default: "primary"
    }, ge),
    modelValue: String,
    inputClasses: { type: null },
    label: String,
    disabled: se
  },
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, a = useAttrs(), i = `a-radio-${a.id || a.value}-${Math.random().toString(36).slice(2, 7)}`, o = computed(() => e.modelValue === a.value);
    return (n, l) => (openBlock(), createElementBlock("label", {
      for: i,
      class: normalizeClass(["inline-flex items-center cursor-pointer", [
        e.disabled && "a-radio-disabled pointer-events-none",
        n.$attrs.class
      ]])
    }, [
      createBaseVNode("input", mergeProps({ ...n.$attrs, class: e.inputClasses }, {
        id: i,
        checked: unref(o),
        class: "hidden",
        type: "radio",
        onChange: l[0] || (l[0] = (r) => t("update:modelValue", r.target.value))
      }), null, 16, wa),
      createBaseVNode("div", {
        class: normalizeClass(["a-radio-circle after:w-full after:h-full after:rounded-full after:block after:content-empty after:transform after:transition after:transition-transform", [
          `after:bg-${e.color}`,
          unref(o) ? `after:scale-full border-${e.color}` : "after:scale-0 border-[hsla(var(--a-base-color),var(--a-border-opacity))]"
        ]])
      }, null, 2),
      renderSlot(n.$slots, "default", {}, () => [
        createTextVNode(toDisplayString(e.label), 1)
      ])
    ], 2));
  }
});
var Sa = ["onMouseenter"];
var xa = defineComponent({
  name: "ARating"
});
var Ca = defineComponent({
  ...xa,
  props: {
    ...re({
      color: {
        default: "warning"
      }
    }),
    modelValue: Number,
    length: {
      type: [Number, String],
      default: 5
    },
    halve: Boolean,
    emptyIcon: {
      type: String,
      default: "i-bx:star"
    },
    halfIcon: {
      type: String,
      default: "i-bx:bxs-star-half"
    },
    fullIcon: {
      type: String,
      default: "i-bx:bxs-star"
    },
    noHoverHint: Boolean,
    animate: Boolean,
    readonly: pt,
    disabled: se
  },
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, { getLayerClasses: a } = ie(), { styles: i, classes: o } = a(
      toRef(e, "color"),
      ref(""),
      ref(false)
    ), n = ref(0), l = ref(false), r = computed(
      () => {
        var f;
        return !e.noHoverHint && !e.readonly && !e.disabled && l.value ? n.value : (f = e.modelValue) != null ? f : 0;
      }
    ), u = computed(
      () => Array.from({ length: Number(e.length) }, (f, v) => v + 1).map(
        (f) => f <= r.value ? e.fullIcon : f - r.value === 0.5 ? e.halfIcon : e.emptyIcon
      )
    ), d = () => {
      t("update:modelValue", n.value);
    }, p = (f, v) => {
      l.value = true;
      const { offsetX: O, target: E } = f;
      if (E instanceof HTMLElement) {
        const j = O * 100 / E.clientWidth;
        e.halve ? n.value = j < 50 ? v + 0.5 : v + 1 : n.value = v + 1;
      }
    }, m = () => {
      l.value = false;
    };
    return (f, v) => (openBlock(), createElementBlock("div", {
      style: normalizeStyle(unref(i)),
      class: normalizeClass(["a-rating flex", [
        e.animate && !e.readonly && !e.disabled && "a-rating-animated",
        e.readonly && "a-rating-readonly pointer-events-none",
        e.disabled && "a-rating-disabled pointer-events-none",
        ...unref(o)
      ]])
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(u), (O, E) => (openBlock(), createElementBlock("i", {
        key: E,
        class: normalizeClass(["cursor-pointer", O]),
        onClick: d,
        onMouseenter: (j) => p(j, E),
        onMouseleave: m
      }, null, 42, Sa))), 128))
    ], 6));
  }
});
var Ia = ["value"];
var Oa = ["onClick"];
var Va = defineComponent({
  name: "ASelect",
  inheritAttrs: false
});
var _t = defineComponent({
  ...Va,
  props: F({
    modelValue: { type: null },
    options: {
      type: [String, Number, Object],
      default: () => []
    },
    emitObject: Boolean,
    optionsWrapperClasses: { type: null }
  }, oe),
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, a = he(e, Object.keys(oe)), { teleportTarget: i } = ee(), o = Ce(), n = ref(), l = ref(), r = ref(), u = (w) => Ae(w) && "label" in w && "value" in w, d = ref(false), p = async () => {
      const { x: w, y: W } = await computePosition2(n.value.refInputContainer, r.value, {
        placement: "bottom-start",
        middleware: [
          offset(6),
          {
            name: "sameWidth",
            fn: ({ rects: T, x: ae, y: _e }) => (r.value.style.width = `${T.reference.width}px`, { x: ae, y: _e })
          },
          flip(),
          shift({ padding: 10 })
        ]
      });
      Object.assign(r.value.style, {
        left: `${w}px`,
        top: `${W}px`
      });
    };
    let m = () => {
    };
    onMounted(() => {
      nextTick(() => {
        m = autoUpdate(n.value.refInputContainer, r.value, p);
      });
    }), onBeforeUnmount(() => m()), xe(
      r,
      (w) => {
        d.value && (d.value = false);
      },
      {
        ignore: [n]
      }
    );
    const f = () => {
      var w;
      e.disabled || e.readonly || (d.value = !d.value, (w = l.value) == null || w.focus());
    }, v = "a-select-option states before:transition-none cursor-pointer text-ellipsis overflow-hidden", O = (w) => {
      const W = u(w) && !e.emitObject ? w.value : w;
      t("update:modelValue", W);
    }, E = (w) => {
      w.target !== r.value && (d.value = false);
    }, j = computed(() => {
      var W;
      const w = e.options.find((T) => u(T) ? T.value === (e.emitObject ? e.modelValue.value : e.modelValue) : T === e.modelValue);
      return w ? u(w) ? w.label : w : ((W = e.modelValue) == null ? void 0 : W.label) || "";
    });
    return (w, W) => (openBlock(), createElementBlock(Fragment, null, [
      createVNode(unref(Se), mergeProps({ ...unref(a), class: w.$attrs.class }, {
        ref_key: "refReference",
        ref: n,
        "append-inner-icon": "i-bx-chevron-down",
        class: "a-select",
        "input-container-attrs": {
          onClick: f
        }
      }), createSlots({
        default: withCtx((T) => [
          createBaseVNode("input", mergeProps({ ...w.$attrs, ...T }, {
            ref_key: "selectRef",
            ref: l,
            readonly: "",
            class: "a-select-input",
            value: unref(j)
          }), null, 16, Ia)
        ]),
        _: 2
      }, [
        renderList(Object.keys(w.$slots).filter((T) => T !== "default"), (T) => ({
          name: T,
          fn: withCtx((ae) => [
            renderSlot(w.$slots, T, normalizeProps(guardReactiveProps(ae || {})))
          ])
        }))
      ]), 1040, ["input-container-attrs"]),
      unref(o) ? (openBlock(), createBlock(Teleport, {
        key: 0,
        to: unref(i)
      }, [
        withDirectives(createBaseVNode("ul", {
          ref_key: "refFloating",
          ref: r,
          class: normalizeClass(["a-select-options-container absolute bg-[hsl(var(--a-layer))]", e.optionsWrapperClasses]),
          onClick: E
        }, [
          renderSlot(w.$slots, "default", {
            attrs: { class: v }
          }, () => [
            (openBlock(true), createElementBlock(Fragment, null, renderList(e.options, (T, ae) => (openBlock(), createElementBlock("li", {
              key: ae,
              class: normalizeClass(v),
              onClick: (_e) => O(T)
            }, toDisplayString(u(T) ? T.label : T), 9, Oa))), 128))
          ])
        ], 2), [
          [vShow, unref(d)]
        ])
      ], 8, ["to"])) : createCommentVNode("", true)
    ], 64));
  }
});
var Pa = { class: "a-switch-label" };
var Ba = defineComponent({
  name: "ASwitch"
});
var Ta = defineComponent({
  ...Ba,
  props: {
    color: F({
      default: "primary"
    }, ge),
    label: String,
    modelValue: {
      type: [Boolean, Array, Set],
      default: false
    },
    onIcon: String,
    offIcon: String,
    disabled: se
  },
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, a = useAttrs(), i = `a-switch-${a.id || a.value}-${Math.random().toString(36).slice(2, 7)}`, o = mt(e, "modelValue", t), n = computed(() => o.value ? { transform: "translateX(calc(var(--a-switch-track-size) - 100% - (var(--a-switch-thumb-margin) *2 )))" } : { transform: "translateX(0)" });
    return (l, r) => (openBlock(), createElementBlock("label", {
      for: i,
      class: normalizeClass(["a-switch a-switch cursor-pointer uno-layer-base-rounded-full justify-between items-center", [
        e.label || l.$slots.default ? "flex" : "inline-flex",
        e.disabled && "a-switch-disabled pointer-events-none"
      ]])
    }, [
      withDirectives(createBaseVNode("input", {
        id: i,
        "onUpdate:modelValue": r[0] || (r[0] = (u) => isRef(o) ? o.value = u : null),
        class: "hidden",
        role: "switch",
        type: "checkbox"
      }, null, 512), [
        [vModelCheckbox, unref(o)]
      ]),
      createBaseVNode("div", Pa, [
        renderSlot(l.$slots, "default", {}, () => [
          createTextVNode(toDisplayString(e.label), 1)
        ])
      ]),
      createBaseVNode("div", {
        class: normalizeClass(["a-switch-toggle flex rounded-inherit min-w-$a-switch-track-size", unref(o) ? `bg-${e.color}` : "bg-[hsl(var(--a-switch-default-color))]"])
      }, [
        createBaseVNode("div", {
          class: "a-switch-dot grid place-items-center rounded-inherit m-$a-switch-thumb-margin",
          style: normalizeStyle(unref(n))
        }, [
          createBaseVNode("div", {
            class: normalizeClass(["a-switch-icon color-$a-switch-icon-color", [
              unref(o) ? `${e.onIcon} text-${e.color}` : e.offIcon
            ]])
          }, null, 2)
        ], 4)
      ], 2)
    ], 2));
  }
});
var ja = ["value"];
var Na = defineComponent({
  name: "ATextarea",
  inheritAttrs: false
});
var La = defineComponent({
  ...Na,
  props: F({
    modelValue: String,
    height: String
  }, oe),
  emits: ["update:modelValue"],
  setup(s, { emit: t }) {
    const e = s, a = he(e, Object.keys(oe)), i = ref(), o = () => {
      var n;
      (n = i.value) == null || n.focus();
    };
    return (n, l) => (openBlock(), createBlock(unref(Se), mergeProps({ ...unref(a), class: n.$attrs.class }, {
      "input-wrapper-classes": ["min-h-32 overflow-hidden", e.height, e.inputWrapperClasses],
      class: "a-textarea !pointer-events-auto",
      "onClick:inputWrapper": o
    }), createSlots({
      default: withCtx((r) => [
        createBaseVNode("textarea", mergeProps({ ...n.$attrs, ...r }, {
          ref_key: "textarea",
          ref: i,
          class: "a-textarea-textarea bg-transparent resize-none",
          value: e.modelValue,
          onInput: l[0] || (l[0] = (u) => t("update:modelValue", u.target.value))
        }), null, 16, ja)
      ]),
      _: 2
    }, [
      renderList(Object.keys(n.$slots).filter((r) => r !== "default"), (r) => ({
        name: r,
        fn: withCtx((u) => [
          r !== "default" ? renderSlot(n.$slots, r, normalizeProps(mergeProps({ key: 0 }, u || {}))) : createCommentVNode("", true)
        ])
      }))
    ]), 1040, ["input-wrapper-classes"]));
  }
});
var tt = Object.freeze(Object.defineProperty({
  __proto__: null,
  AAlert: Ft,
  AAvatar: Te,
  ABadge: Jt,
  ABaseInput: Se,
  ABtn: je,
  ACard: be,
  ACheckbox: Ns,
  AChip: Es,
  ADataTable: aa,
  ADialog: la,
  ADrawer: ia,
  AInput: ht,
  AList: ha,
  AListItem: bt,
  AMenu: $a,
  ARadio: ka,
  ARating: Ca,
  ASelect: _t,
  ASwitch: Ta,
  ATable: vt,
  ATextarea: La,
  ATypography: Ie
}, Symbol.toStringTag, { value: "Module" }));
function Da() {
  return {
    type: "component",
    resolve: (s) => {
      if (s.match(/^A[A-Z]/))
        return { name: s, from: "anu-vue" };
    }
  };
}
function Fa() {
  return {
    name: "@anu-vue/preset-core",
    variants: [
      (s) => s.startsWith("i:") ? {
        matcher: s.slice(2),
        selector: (t) => `${t} > i`
      } : s
    ]
  };
}
var Ea = {
  registerComponents: true
};
var Wa = {
  install(s, t = {}) {
    if (Lt(s), F(t, Ea).registerComponents)
      for (const a in tt) {
        const i = tt[a];
        s.component(i.name, i);
      }
  }
};
var za = {
  height: "1.2em",
  width: "1.2em",
  "vertical-align": "text-top",
  "flex-shrink": "0",
  display: "inline-block"
};
export {
  Ft as AAlert,
  Te as AAvatar,
  Jt as ABadge,
  Se as ABaseInput,
  je as ABtn,
  be as ACard,
  Ns as ACheckbox,
  Es as AChip,
  aa as ADataTable,
  la as ADialog,
  ia as ADrawer,
  ht as AInput,
  ha as AList,
  bt as AListItem,
  $a as AMenu,
  ka as ARadio,
  Ca as ARating,
  _t as ASelect,
  Ta as ASwitch,
  vt as ATable,
  La as ATextarea,
  Ie as ATypography,
  Da as AnuComponentResolver,
  Wa as anu,
  Fa as presetAnu,
  za as presetIconExtraProperties,
  Be as spacingSymbol,
  fa as useGroupModel,
  qs as useSearch,
  Xs as useSort
};
//# sourceMappingURL=anu-vue.js.map
