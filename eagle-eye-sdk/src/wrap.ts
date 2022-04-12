import { generateUUID } from './utils/index';

/**
 * @file get browser && platform parameter
 * @author JYkid
 * @version 0.0.1
 */
export const getWrap = function (config: any) {
  let wrap: any = {
    data: [],
    // --- 存放静态资源的加载 url ---
    ip: "",
    _geWrap: () => {
      let data: any = {};
      let navigator = window.navigator;

      data.uuid = wrap._getUuid()

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
      data.url = window?.location?.href;

      // time
      data.time = new Date().getTime();

      // --- referrer
      data.referrer = document?.referrer;

      // --- performance.timing - For SSR ---
      const timing: any = performance?.timing || {};
      data.time = {
        newPage: timing?.fetchStart - timing?.navigationStart || 0,
        redirect: timing?.redirectEnd  - timing?.redirectStart || 0,
        appcache: timing?.domainLookupStart  - timing?.fetchStart || 0,
        unload: timing?.unloadEventEnd - timing?.unloadEventStart || 0,
        dnsLooking: timing?.domainLookupEnd - timing?.domainLookupStart || 0,
        tcpConnect: timing?.connectEnd - timing?.connectStart || 0,
        request: timing?.responseEnd - timing?.requestStart || 0,
        whiteScreen: timing?.responseStart - timing?.navigationStart || 0,
        domParse: timing?.domComplete - timing?.domInteractive || 0,
      }

      // --- performance.getEntriesByType - For resource loading time ---
      data.resourceLoading = [];
      // --- 是否开启资源上报监控 ---
      if (config.sendResource) {
        performance?.getEntriesByType('resource')?.forEach((item: any, index: number) => {
          // 资源 url 已经被记录 且不是 ajax 请求, 之前出现过的 index 跳过 只使用最新的
          if (config.resourceUrl.indexOf(item.name) !== -1 && item.initiatorType !== 'xmlhttprequest' || index <= config.resourceIndex) {
            return
          }
          config.resourceUrl.push(item.name);
          config.resourceIndex = index;
          
          let value: any = {
            name: item.name,
            entryType: item.entryType,
            initiatorType: item.initiatorType,
            nextHopProtocol: item.nextHopProtocol,
            transferSize: item.transferSize,
          }
          /**
           * --- 请求类型
           * - link script img css other
           * - fetch xmlhttprequest
           */
          if (item.initiatorType !== 'xmlhttprequest' && item.initiatorType !== 'fetch') {
            let loadTime = item.responseEnd?.toFixed(0) - item.responseStart?.toFixed(0);
            if (loadTime < 500) { return }
            // --- 加载资源花费的时间 ---
            value.loading = item.responseEnd?.toFixed(0) - item.responseStart?.toFixed(0) || undefined,
            // --- startTime： 开始进入下载的时间 - responseStart 真正开始下载的时间 ---
            value.prepareLoading = item.responseStart?.toFixed(0) - item.startTime?.toFixed(0) || undefined,
            data.resourceLoading.push(value);
          } else {
            let loadTime = item.responseEnd?.toFixed(0) - item.fetchStart?.toFixed(0);
            if (loadTime < 500) { return }
            // --- 加载资源花费的时间 ---
            value.loading = item.responseEnd?.toFixed(0) - item.fetchStart?.toFixed(0) || undefined;
            value.prepareLoading = 0,
            data.resourceLoading.push(value);
          }
        });
      }
      return data;
    },
    // webrtc 获取 IP
    _getIP: function (onNewIP: any) {
      var myPeerConnection =
        window?.RTCPeerConnection ||
        window?.mozRTCPeerConnection ||
        window?.webkitRTCPeerConnection;
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
        }),
        noop = function () {},
        localIPs = {},
        ipRegex =
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

      function iterateIP(ip: any) {
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
        .then(function (sdp: any) {
          sdp.sdp.split("\n").forEach(function (line: any) {
            if (line.indexOf("candidate") < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });
          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch(function (reason) {
          // An error occurred, so handle the failure to connect
        });

      //listen for candidate events
      pc.onicecandidate = function (ice: any) {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    },
    // - 新增 uuid -
    _getUuid: function () {
      let uuid = localStorage.getItem("eagle-uuid") || generateUUID();

      if (uuid) {
        localStorage.setItem("eagle-uuid", uuid)
      }

      return uuid;
    },
    // 处理错误信息
    _getErrorMessage: function (err: any, resource: any) {
      const self = this;
      let data = self._geWrap();
      self._getIP(function (ip: any) {
        data.ip = ip;
      });
      data.detail = {};
      data.detail = {
        ...err.detail
      }
      data.event_type = err.type;

      if (err.type === "error") {
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
    _getEventMessage: function(type: string, eventData: any) {
      let data = this._geWrap();
      if (!this.ip) {
        this._getIP((ip: any) => {
          this.ip = ip;
          data.ip = ip;
        });
      }
      data.detail = {
        ...eventData
      };
      data.event_type = type;
      return data;
    },
  };
  return wrap;
};
