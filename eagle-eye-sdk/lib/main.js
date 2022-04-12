(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.eagleSDK = {}));
})(this, (function (exports) { 'use strict';

  /**
   * @file ajax request file
   * @author JYkid
   * @version 0.0.1-beta
   */
  /* eslint-disable */
  var ajax = (function () {
      return {
          canAjax: function () {
              return (window.XMLHttpRequest && window.JSON);
          },
          post: function (url, data, timeout) {
              var xhr = new XMLHttpRequest();
              xhr.open("post", url, true);
              xhr.setRequestHeader("content-type", "application/json;charset=utf-8");
              xhr.setRequestHeader("Accept", "application/json");
              xhr.timeout = timeout || 30000;
              xhr.onload = function () {
                  if (!(xhr === null || xhr === void 0 ? void 0 : xhr.responseText) || typeof (xhr === null || xhr === void 0 ? void 0 : xhr.responseText) !== 'string') {
                      return;
                  }
                  var result = JSON.parse(xhr.responseText || "");
                  if (result.status === 1) ;
              };
              xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4) {
                      if (xhr.status === 200) {
                          if (!(xhr === null || xhr === void 0 ? void 0 : xhr.responseText) || typeof (xhr === null || xhr === void 0 ? void 0 : xhr.responseText) !== 'string') {
                              return;
                          }
                          var result = JSON === null || JSON === void 0 ? void 0 : JSON.parse(xhr.responseText || "");
                          if (result.status === 1) ;
                      }
                      else {
                        //   throw new Error("网络请求错误，请稍后再试～");
                      }
                  }
              };
              xhr.send(window.JSON.stringify(data));
          }
      };
  })();

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  /**
   * @file get browser && platform parameter
   * @author JYkid
   * @version 0.0.1
   */
  var getWrap = function (config) {
      var wrap = {
          data: [],
          // --- 存放静态资源的加载 url ---
          ip: "",
          _geWrap: function () {
              var _a, _b;
              var data = {};
              var navigator = window.navigator;
              // UA
              data.userAgent = navigator.userAgent;
              // appName
              data.appName = navigator.appName;
              // appVersion
              data.appVersion = navigator.appVersion;
              // CPU
              // @ts-ignore
              data.cpuClass = navigator.cpuClass;
              // platform
              data.platform = navigator.platform;
              // languages
              data.language = navigator.language;
              // url
              data.url = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href;
              // time
              data.time = new Date().getTime();
              // --- referrer
              data.referrer = document === null || document === void 0 ? void 0 : document.referrer;
              // --- performance.timing - For SSR ---
              var timing = (performance === null || performance === void 0 ? void 0 : performance.timing) || {};
              data.time = {
                  newPage: (timing === null || timing === void 0 ? void 0 : timing.fetchStart) - (timing === null || timing === void 0 ? void 0 : timing.navigationStart) || 0,
                  redirect: (timing === null || timing === void 0 ? void 0 : timing.redirectEnd) - (timing === null || timing === void 0 ? void 0 : timing.redirectStart) || 0,
                  appcache: (timing === null || timing === void 0 ? void 0 : timing.domainLookupStart) - (timing === null || timing === void 0 ? void 0 : timing.fetchStart) || 0,
                  unload: (timing === null || timing === void 0 ? void 0 : timing.unloadEventEnd) - (timing === null || timing === void 0 ? void 0 : timing.unloadEventStart) || 0,
                  dnsLooking: (timing === null || timing === void 0 ? void 0 : timing.domainLookupEnd) - (timing === null || timing === void 0 ? void 0 : timing.domainLookupStart) || 0,
                  tcpConnect: (timing === null || timing === void 0 ? void 0 : timing.connectEnd) - (timing === null || timing === void 0 ? void 0 : timing.connectStart) || 0,
                  request: (timing === null || timing === void 0 ? void 0 : timing.responseEnd) - (timing === null || timing === void 0 ? void 0 : timing.requestStart) || 0,
                  whiteScreen: (timing === null || timing === void 0 ? void 0 : timing.responseStart) - (timing === null || timing === void 0 ? void 0 : timing.navigationStart) || 0,
                  domParse: (timing === null || timing === void 0 ? void 0 : timing.domComplete) - (timing === null || timing === void 0 ? void 0 : timing.domInteractive) || 0,
              };
              // --- performance.getEntriesByType - For resource loading time ---
              data.resourceLoading = [];
              // --- 是否开启资源上报监控 ---
              if (config.sendResource) {
                  (_b = performance === null || performance === void 0 ? void 0 : performance.getEntriesByType('resource')) === null || _b === void 0 ? void 0 : _b.forEach(function (item, index) {
                      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                      // 资源 url 已经被记录 且不是 ajax 请求, 之前出现过的 index 跳过 只使用最新的
                      if (config.resourceUrl.indexOf(item.name) !== -1 && item.initiatorType !== 'xmlhttprequest' || index <= config.resourceIndex) {
                          return;
                      }
                      config.resourceUrl.push(item.name);
                      config.resourceIndex = index;
                      var value = {
                          name: item.name,
                          entryType: item.entryType,
                          initiatorType: item.initiatorType,
                          nextHopProtocol: item.nextHopProtocol,
                          transferSize: item.transferSize,
                      };
                      /**
                       * --- 请求类型
                       * - link script img css other
                       * - fetch xmlhttprequest
                       */
                      if (item.initiatorType !== 'xmlhttprequest' && item.initiatorType !== 'fetch') {
                          var loadTime = ((_a = item.responseEnd) === null || _a === void 0 ? void 0 : _a.toFixed(0)) - ((_b = item.responseStart) === null || _b === void 0 ? void 0 : _b.toFixed(0));
                          if (loadTime < 500) {
                              return;
                          }
                          // --- 加载资源花费的时间 ---
                          value.loading = ((_c = item.responseEnd) === null || _c === void 0 ? void 0 : _c.toFixed(0)) - ((_d = item.responseStart) === null || _d === void 0 ? void 0 : _d.toFixed(0)) || undefined,
                              // --- startTime： 开始进入下载的时间 - responseStart 真正开始下载的时间 ---
                              value.prepareLoading = ((_e = item.responseStart) === null || _e === void 0 ? void 0 : _e.toFixed(0)) - ((_f = item.startTime) === null || _f === void 0 ? void 0 : _f.toFixed(0)) || undefined,
                              data.resourceLoading.push(value);
                      }
                      else {
                          var loadTime = ((_g = item.responseEnd) === null || _g === void 0 ? void 0 : _g.toFixed(0)) - ((_h = item.fetchStart) === null || _h === void 0 ? void 0 : _h.toFixed(0));
                          if (loadTime < 500) {
                              return;
                          }
                          // --- 加载资源花费的时间 ---
                          value.loading = ((_j = item.responseEnd) === null || _j === void 0 ? void 0 : _j.toFixed(0)) - ((_k = item.fetchStart) === null || _k === void 0 ? void 0 : _k.toFixed(0)) || undefined;
                          value.prepareLoading = 0,
                              data.resourceLoading.push(value);
                      }
                  });
              }
              return data;
          },
          // webrtc 获取 IP
          _getIP: function (onNewIP) {
              var myPeerConnection = (window === null || window === void 0 ? void 0 : window.RTCPeerConnection) ||
                  (window === null || window === void 0 ? void 0 : window.mozRTCPeerConnection) ||
                  (window === null || window === void 0 ? void 0 : window.webkitRTCPeerConnection);
              var pc = new myPeerConnection({
                  iceServers: [
                      {
                          urls: "stun:stun01.sipphone.com",
                      },
                      {
                          urls: "stun:stun.ekiga.net",
                      },
                      {
                          urls: "stun:stun.fwdnet.net",
                      },
                      {
                          urls: "stun:stun.l.google.com:19302",
                      },
                      {
                          urls: "stun:stun.l.google.com:19302",
                      },
                      {
                          urls: "stun:stun.l.google.com:19302",
                      },
                  ],
              }), noop = function () { }, localIPs = {}, ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
              function iterateIP(ip) {
                  // @ts-ignore
                  if (!localIPs[ip]) {
                      onNewIP(ip);
                  }
                  // @ts-ignore
                  localIPs[ip] = true;
              }
              //create a bogus data channel
              pc.createDataChannel("");
              // create offer and set local description
              pc.createOffer()
                  .then(function (sdp) {
                  sdp.sdp.split("\n").forEach(function (line) {
                      if (line.indexOf("candidate") < 0)
                          return;
                      line.match(ipRegex).forEach(iterateIP);
                  });
                  pc.setLocalDescription(sdp, noop, noop);
              })
                  .catch(function (reason) {
                  // An error occurred, so handle the failure to connect
              });
              //listen for candidate events
              pc.onicecandidate = function (ice) {
                  if (!ice ||
                      !ice.candidate ||
                      !ice.candidate.candidate ||
                      !ice.candidate.candidate.match(ipRegex))
                      return;
                  ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
              };
          },
          // 处理错误信息
          _getErrorMessage: function (err, resource) {
              var self = this;
              var data = self._geWrap();
              self._getIP(function (ip) {
                  data.ip = ip;
              });
              data.detail = {};
              if (err.type === "ajaxLoad") {
                  data.detail.responseURL = err.detail.responseURL;
                  data.detail.status = err.detail.status;
                  data.detail.statusText = err.detail.statusText;
                  data.event_type = "ajax";
              }
              else if (err.type === "error") {
                  data.detail.message = err.message;
                  data.detail.line = err.lineno;
                  data.detail.filename = err.filename;
                  data.event_type = "error";
              }
              if (resource) {
                  data.detail.src = err.target.src || err.target.href;
                  data.event_type = "resource";
                  data.event_type = "resource";
              }
              return data;
          },
          // ---- 用户主动上报信息 ----
          _getEventMessage: function (type, eventData) {
              var _this = this;
              var data = this._geWrap();
              if (!this.ip) {
                  this._getIP(function (ip) {
                      _this.ip = ip;
                      data.ip = ip;
                  });
              }
              data.detail = __assign({}, eventData);
              data.event_type = type;
              return data;
          },
      };
      return wrap;
  };

  /**
   * @file error event center
   * @author JYkidrecord
   * @version 0.0.1-beta
   */
  var getErrorData = function (err, config, resource) {
      var wrap = getWrap(config);
      var data = wrap._getErrorMessage(err, resource);
      data.record = [];
      data.app_key = config.app_key;
      return data;
  };
  // ajaxError
  var ajaxError = function (err, config) {
      // 处理err 上报
      if (err.type === "ajaxLoad" && err.detail.status >= 400) {
          var data = getErrorData(err, config);
          ajax.post(config.protocol + config.url, data);
      }
  };
  // js 抛出的错误
  var getJsError = function (err, config) {
      var data = getErrorData(err, config);
      ajax.post(config.protocol + config.url, data);
  };
  // 资源加载错误
  var getResourceError = function (err, config) {
      var data = getErrorData(err, config, true);
      ajax.post(config.protocol + config.url, data);
  };

  /**
   * @file config detail file
   * @author JYkid
   * @version 0.0.1-beta
   */
  function newConfig(conf) {
      var config = {
          https: true,
          url: "/monitor",
          record: false,
          app_key: "",
          resourceUrl: [],
          resourceIndex: -1,
          startTime: new Date().getTime() || 0,
          // - 是否开启全局点击 -
          globalClick: true,
          // - 是否上报资源数据 -
          sendResource: true,
          // - 禁用 AJAX 请求监听 -
          disableHook: false,
          // - 始化后自动发送 PV -
          autoSendPv: true,
          // - 是否监听页面的 hashchange -
          enableSPA: true,
          // - 开启心跳检测 -
          openHeartbeat: false,
          // 日志采样配置，值1/10/100
          sample: 1,
          // - 开始计时 -
          beginTiming: 0,
          // - 耗费时间 -
          costTime: 0,
          _extend: function (self, conf) {
              Object.keys(conf).map(function (x) {
                  self[x] = conf[x];
                  return;
              });
              return self;
          },
      };
      return config._extend(config, conf);
  }

  /**
   * EventCenter save data in array
   * @returns Array
   */
  var eventCenter = function () {
      var event = {
          data: [],
          record: [],
          _get: function () {
              return this.data;
          },
          _getRecord: function () {
              return this.record;
          },
          _set: function (event) {
              this.data.push(event);
          },
          _setRecord: function (event) {
              this.record.push(event);
          },
          _clearRecord: function () {
              this.record.splice(0, self.record.length);
          },
      };
      return event;
  };

  /**
   * @file user report event
   * @author JYkidrecord
   * @version 0.0.1
   */
  var getEventData = function (type, event, config) {
      var wrap = getWrap(config);
      var data = wrap._getEventMessage(type, event);
      data.app_key = config.app_key;
      data.firstScreenTime = config.firstScreenTime || 0;
      return data;
  };
  /**
   *
   * @param { String } type
   * @param { Object } eventData
   */
  var userRepoet = function (type, eventData, config) {
      var data = getEventData(type, eventData, config);
      ajax.post(config.protocol + config.url, data, function () {
          config._clearEvent();
      });
  };

  /**
   * --- 通过元素找到唯一定位 ---
   * @param { Any } element
   * @returns Object { id, type } String String
   */
  var getDomUniqueId = function (element) {
      var _a;
      if (!element) {
          return {};
      }
      var result = {
          id: "",
          type: "",
      };
      var className = "";
      var target = {
          id: element.id,
          name: element.name,
          className: "",
          tag: element.tagName.toLowerCase(),
          type: element.type ? element.type.toLowerCase() : "",
          classList: element.classList || [],
      };
      element.classList.forEach(function (item) {
          // 过滤非法 class 名称
          if (/^[a-zA-Z]/.test(item)) {
              className += "." + item;
          }
      });
      target.className = className;
      if (target.tag === "body" || target.tag === "html") {
          result.id = target.tag;
          result.type = target.tag;
      }
      // 如果有 ID 则返回 ID
      if (target.id && document.getElementById(target.id) === element) {
          var queryTag = target.tag + "#" + target.id;
          try {
              var queryResult = document.querySelector(queryTag);
              if (queryResult === element) {
                  result.id = queryTag;
              }
          }
          catch (e) {
              console.log('id 不合法');
          }
          result.type = "getElementById";
      }
      // 如果没有 ID 但可以通过 Name 找到则返回
      if (!result.id && target.name && document.getElementsByName(target.name)[0] === element) {
          result.id = target.name;
          result.type = "getElementsByName";
      }
      // 如果没有 ID 但可以通过 className querySelector 找到
      if (!result.id && className && document.querySelector(target.tag + className) === element) {
          result.id = target.tag + className;
          result.type = "querySelector";
      }
      // 单独处理 radio
      if (!result.id && target.type === "radio") {
          var value = element.value;
          var queryString = target.tag + "[value='" + value + "']";
          if (target.name) {
              queryString += "[name='" + target.name + "']";
          }
          if (document.querySelector(queryString) === element) {
              result.id = queryString;
              result.type = "querySelector";
          }
      }
      // 单独处理 a 标签
      if (!result.id && target.tag === 'a') {
          var href = (_a = element.attributes.href) === null || _a === void 0 ? void 0 : _a.value;
          if (href) {
              var queryString = "a[href='" + href + "']";
              var selectedEl = document.querySelector(queryString);
              if (selectedEl === element) {
                  result.id = queryString;
                  result.type = "querySelector";
              }
          }
      }
      // 没有 ID 尝试组合查询 tag, class, name
      if (!result.id) {
          var queryString = target.tag;
          queryString = className ? queryString + className : queryString;
          queryString = target.name ? queryString + "[name='" + target.name + "']" : queryString;
          if (document.querySelector(queryString) === element) {
              result.id = queryString;
              result.type = "querySelector";
          }
      }
      // 没有 ID 尝试通过 order 找到
      if (!result.id) {
          var queryString = target.tag;
          queryString = className ? queryString + className : queryString;
          var elements = document.querySelectorAll(queryString);
          if (elements && elements.length > 0) {
              var index = null;
              for (var i = 0; i < elements.length; i++) {
                  if (element === elements[i]) {
                      index = i + 1;
                      break;
                  }
              }
              if (index) {
                  queryString = queryString + ":nth-child(" + index + ")";
                  if (document.querySelector(queryString) === element) {
                      result.id = queryString;
                      result.type = "querySelector";
                  }
              }
          }
      }
      return result;
  };
  var isIE = function () {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
          return true;
      }
      else {
          return false;
      }
  };

  /**
   * init user config in page
   * @returns config
   */
  var initUserConfig = function (userConfig, event) {
      var config = newConfig(userConfig);
      config.event = event;
      config.eventCenter = eventCenter();
      config.protocol = window.location.protocol + "//";
      if (config.https) {
          config.protocol = "https://";
      }
      // --- 监听 Dom 变化 ---
      initListenDom(config);
      // --- 监听 HashRouter 变化 ---
      if (config.enableSPA) {
          initListenHash(config);
      }
      // --- 监听 JS 报错 ---
      initListenJS(config);
      // --- 监听 AJAX ---
      if (!config.disableHook) {
          initListenAjax(config);
      }
      // --- 监听全局点击事件 ---
      if (config.globalClick) {
          initListenBody(config);
      }
      // --- 开启心跳检测 ---
      if (config.openHeartbeat) {
          initHeartbeat(config);
      }
      return config;
  };
  // ----- 监听 Dom 变化 -----
  var initListenDom = function (config) {
      if (!window.MutationObserver) {
          // 不支持 MutationObserver 的话
          return;
      }
      var calcFirstScreenTime = "pending";
      var observerData = [];
      new Date().getTime();
      var firstScreenTime = 0;
      // --- 没有完成页面初始化加载的时候就关闭 ---
      var unmountObserver = function (delayTime, immediately) {
          if (observer) {
              // MutationObserver 停止观察变动
              // 如果没有停止的话会间隔 500ms 重复观察
              if (immediately || compare(delayTime)) {
                  observer.disconnect();
                  observer = null;
                  getfirstScreenTime();
                  calcFirstScreenTime = 'finished';
              }
              else {
                  setTimeout(function () {
                      unmountObserver(delayTime);
                  }, 500);
              }
          }
      };
      var unmountObserverListener = function () {
          if (calcFirstScreenTime === 'pending') {
              unmountObserver(0, true);
          }
          if (!isIE()) {
              window.removeEventListener('beforeunload', unmountObserverListener);
          }
      };
      window.addEventListener('beforeunload', unmountObserverListener);
      var removeSmallScore = function (observerData) {
          for (var i = 1; i < observerData.length; i++) {
              if (observerData[i].score < observerData[i - 1].score) {
                  observerData.splice(i, 1);
                  return removeSmallScore(observerData);
              }
          }
          return observerData;
      };
      var getfirstScreenTime = function () {
          var _a, _b, _c;
          observerData = removeSmallScore(observerData);
          var data;
          for (var i = 1; i < observerData.length; i++) {
              if (observerData[i].time >= observerData[i - 1].time) {
                  var scoreDiffer = observerData[i].score - observerData[i - 1].score;
                  if (!data || data.rate <= scoreDiffer) {
                      data = { time: observerData[i].time, rate: scoreDiffer };
                  }
              }
          }
          firstScreenTime = (data === null || data === void 0 ? void 0 : data.time) || 0;
          config.firstScreenTime = firstScreenTime;
          // --- 监听是否自动发送 uv ---
          if (config.autoSendPv) {
              userRepoet('uv', {
                  domready: false,
                  url: ((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.split("?")[0]) || "",
                  // --- 刷新还是正常访问 - 刷新需要单独记录 ---
                  type: ((_c = performance === null || performance === void 0 ? void 0 : performance.navigation) === null || _c === void 0 ? void 0 : _c.type) === 1 ? "reload" : "normal",
              }, config);
          }
      };
      var traverseEl = function (element, layer, identify) {
          // 窗口可视高度
          var height = window.innerHeight || 0;
          var score = 0;
          var tagName = element.tagName;
          if (tagName !== 'SCRIPT' &&
              tagName !== 'STYLE' &&
              tagName !== 'META' &&
              tagName !== 'HEAD') {
              var len = element.children ? element.children.length : 0;
              if (len > 0) {
                  for (var children = element.children, i = len - 1; i >= 0; i--) {
                      score += traverseEl(children[i], layer + 1, score > 0);
                  }
              }
              // 如果元素高度超出屏幕可视高度直接返回 0 分
              if (score <= 0 && !identify) {
                  if (element.getBoundingClientRect &&
                      element.getBoundingClientRect().top >= height) {
                      return 0;
                  }
              }
              score += 1 + 0.5 * layer;
          }
          return score;
      };
      // 每次 dom 结构改变时，都会调用里面定义的函数
      var observer = new window.MutationObserver(function () {
          // 当前时间 - 性能开始计算时间
          var time = new Date().getTime() - config.startTime;
          var body = document.querySelector('body');
          var score = 0;
          if (body) {
              score = traverseEl(body, 1, false);
              observerData.push({ score: score, time: time });
          }
          else {
              observerData.push({ score: 0, time: time });
          }
      });
      // 设置观察目标，接受两个参数: target：观察目标，options：通过对象成员来设置观察选项
      // 设为 childList: true, subtree: true 表示用来监听 DOM 节点插入、删除和修改时
      observer.observe(document, { childList: true, subtree: true });
      observer = observer;
      config.observerData = observerData;
      var compare = function (delayTime) {
          // 当前所开销的时间
          var _time = Date.now() - config.startTime;
          // 取最后一个元素时间 time
          var time = (observerData &&
              observerData.length &&
              observerData[observerData.length - 1].time) ||
              0;
          return _time > delayTime || _time - time > 2 * 500;
      };
      if (document.readyState === 'complete') {
          // MutationObserver监听的最大时间，10秒，超过 10 秒将强制结束
          unmountObserver(10000);
      }
      else {
          window.addEventListener('load', function () {
              unmountObserver(10000);
              // getfirstScreenTime();
          }, false);
      }
  };
  var initListenJS = function (config) {
      // --- Promise ---
      var unhandledrejection = function (err) {
          getJsError(err, config);
      };
      window.addEventListener("unhandledrejection", unhandledrejection);
      // --- JS ---
      console.log("++++++", config);
      var errorEvent = function (err, data) {
          // 判断错误是否来自 monitor
          if (err.cancelable) {
              console.log(1111111, err);
              if (err.filename.indexOf('eagle-eye') > -1) {
                  return;
              }
            //   console.log(err, err.filename.indexOf('eagle-eye') > -1);
              getJsError(err, config);
          }
          else {
              // 静态资源加载的error事件
              getResourceError(err, config);
          }
      };
      window.addEventListener("error", errorEvent, true);
      // --- 挂载错误 ---
      config.eventCenter._set({
          type: "error",
          func: errorEvent
      });
  };
  var initListenAjax = function (config) {
      function ajaxEventTrigger(event) {
          var ajaxEvent = new CustomEvent(event, { detail: config });
          window.dispatchEvent(ajaxEvent);
      }
      var oldXHR = window.XMLHttpRequest;
      function newXHR() {
          var realXHR = new oldXHR();
          realXHR.addEventListener('load', function () {
              ajaxEventTrigger.call(config, 'ajaxLoad');
          }, false);
          realXHR.addEventListener('timeout', function () {
              ajaxEventTrigger.call(config, 'ajaxTimeout');
          }, false);
          realXHR.addEventListener('readystatechange', function () {
              ajaxEventTrigger.call(config, 'ajaxReadyStateChange');
          }, false);
          return realXHR;
      }
      window.XMLHttpRequest = newXHR;
      startLintenAjax(config);
  };
  var startLintenAjax = function (config) {
      // ajax timeout
      var ajaxTimeout = function (err) {
          var _a, _b;
          !(((_b = (_a = err === null || err === void 0 ? void 0 : err.detail) === null || _a === void 0 ? void 0 : _a.responseURL) === null || _b === void 0 ? void 0 : _b.indexOf(config._config.url)) > -1) && ajaxError(err, self);
      };
      window.addEventListener("ajaxTimeout", ajaxTimeout);
      config.eventCenter._set({
          type: "ajaxTimeout",
          func: ajaxTimeout
      });
      // ajax load error
      var ajaxLoad = function (err) {
          var _a, _b;
          !(((_b = (_a = err === null || err === void 0 ? void 0 : err.detail) === null || _a === void 0 ? void 0 : _a.responseURL) === null || _b === void 0 ? void 0 : _b.indexOf(config._config.url)) > -1) && ajaxError(err, self);
      };
      window.addEventListener("ajaxLoad", ajaxLoad);
      config.eventCenter._set({
          type: "ajaxLoad",
          func: ajaxLoad
      });
  };
  /**
   * 初始化监听 URL 变化
   * @param { Object } config
   */
  var initListenHash = function (config) {
      var hashchange = function () {
          var _a, _b;
          userRepoet('pv', {
              url: ((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.split("?")[0]) || ""
          }, config);
      };
      window.addEventListener("hashchange", hashchange);
      config.eventCenter._set({
          type: "hashchange",
          func: hashchange
      });
      var historyWrap = function (type) {
          var orig = history === null || history === void 0 ? void 0 : history[type];
          var e = new Event(type);
          return function () {
              // @ts-ignore
              var rv = orig.apply(this, arguments);
              e.arguments = arguments;
              window.dispatchEvent(e);
              return rv;
          };
      };
      history.pushState = historyWrap('pushState');
      history.replaceState = historyWrap('replaceState');
      window.addEventListener('pushState', hashchange);
      config.eventCenter._set({
          type: "pushState",
          func: hashchange
      });
      window.addEventListener('replaceState', hashchange);
      config.eventCenter._set({
          type: "replaceState",
          func: hashchange
      });
  };
  /**
   * 初始化监听 body 点击事件
   * @param { Object } config
   */
  var initListenBody = function (config) {
      // --- JS ---
      var clickEvent = function (event) {
          var _a, _b;
          var target = getDomUniqueId(event === null || event === void 0 ? void 0 : event.target);
          if (!target.id || !target.type) {
              return;
          }
          userRepoet('click', {
              url: ((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) === null || _b === void 0 ? void 0 : _b.split("?")[0]) || "",
              dom: target,
          }, config);
      };
      document === null || document === void 0 ? void 0 : document.body.addEventListener("click", clickEvent);
      config.eventCenter._set({
          type: "clickEvent",
          func: clickEvent
      });
  };
  /**
   * 开启心跳检测
   * @param { Object } config
   */
  var initHeartbeat = function (config) {
      // -- 如果浏览器支持 serviceWorker --
      if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('service-worker.js', {
              scope: './'
          }).then(function (res) {
              var _a;
              if (((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) !== null) {
                  // - 每五秒发一次心跳 -
                  var HEARTBEAT_INTERVAL = 5 * 1000;
                  // - 发送消息的 ID -
                  var sessionId_1 = "";
                  // --- 发送心跳 ---
                  var heartbeat = function () {
                      var _a, _b;
                      (_b = (_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) === null || _b === void 0 ? void 0 : _b.postMessage({
                          type: 'running',
                          id: sessionId_1,
                          // 附加信息，如果页面 crash，上报的附加数据
                          data: config,
                      });
                  };
                  // --- 卸载 ---
                  window.addEventListener("beforeunload", function () {
                      var _a, _b;
                      (_b = (_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) === null || _b === void 0 ? void 0 : _b.postMessage({
                          type: 'clear',
                          id: sessionId_1
                      });
                  });
                  setInterval(heartbeat, HEARTBEAT_INTERVAL);
                  heartbeat();
              }
          });
      }
  };

  /**
   * @description 监控 SDK monitor 对象
   * @example
   * import monitor from '@baishan/eagle-eye-sdk'
   * monitor({
   *   url: '',
   *   XXX: '',
   * });
   *
   */
  var monitor = function (config) {
      return {
          config: config,
          // ---- 销毁监控 ----
          destory: function () {
              var _a, _b;
              var array = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.eventCenter) === null || _b === void 0 ? void 0 : _b._get();
              for (var i = 0; i < array.length; i++) {
                  // event type add different stage
                  if (array[i].type === 'error') {
                      window.removeEventListener(array[i].type, array[i].func, true);
                  }
                  else {
                      window.removeEventListener(array[i].type, array[i].func);
                  }
              }
          },
          // ---- 获取监控数据 ----
          getRecord: function () {
              var array = this.config._getRrwebEvent();
              return array;
          },
          // ---- 主动上报 ----
          report: function (type, eventData) {
              if (eventData === void 0) { eventData = {}; }
              return userRepoet(type, eventData, this.config);
          },
          // ---- 计时开始 ----
          start: function () {
              this.config.beginTiming = new Date().getTime();
          },
          stop: function () {
              // --- 只有开始计时的时候才算时间 ---
              if (this.config.beginTiming > 0) {
                  this.config.costTime = new Date().getTime() - this.config.beginTiming;
                  this.config.beginTiming = 0;
              }
              else {
                  // --- 否则使用 startTime 作为默认时间 ---
                  this.config.costTime = new Date().getTime() - this.config.startTime;
              }
          }
      };
  };

  /**
   * @description 监控 SDK 入口文件
   * @params { Object } userConfig
   * @returns
   */
  var initMonitor = function (userConfig) {
      var event = eventCenter();
      var config = initUserConfig(userConfig, event);
      // @ts-ignore
      var newMonitor = monitor(config);
      return newMonitor;
  };

  exports.initMonitor = initMonitor;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
