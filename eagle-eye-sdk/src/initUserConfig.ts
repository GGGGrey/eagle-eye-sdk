/**
 * init user config in page
 * @returns config
 */

import { getJsError, getResourceError, ajaxError } from "./error";
import newConfig from './config';
import { eventCenter } from "./eventCenter";
import { userRepoet } from './event';
import { getDomUniqueId } from './utils/index';
import { isIE } from './utils/index';

const initUserConfig = (userConfig: any, event: any): any => {
  const config = newConfig(userConfig);
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

  // --- 监听 Fetch ---
  if (!config.disableFetch) {
    initListenFetch(config)
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
}

// ----- 监听 Dom 变化 -----
const initListenDom = (config: any) => {
  // 不支持 MutationObserver 的话
  if (!window.MutationObserver) { return }

  let calcFirstScreenTime = "pending";
  let observerData: any = [];
  // const startTime = new Date().getTime();
  let firstScreenTime = 0;

  // --- 没有完成页面初始化加载的时候就关闭 ---
  const unmountObserver = (delayTime: number, immediately?: boolean) => {
    if (observer) {
      // MutationObserver 停止观察变动
      // 如果没有停止的话会间隔 500ms 重复观察
      if (immediately || compare(delayTime)) {
        observer.disconnect();
        observer = null;

        getfirstScreenTime()

        calcFirstScreenTime = 'finished';
      } else {
        setTimeout(() => {
          unmountObserver(delayTime);
        }, 500);
      }
    }
  }
  
  const unmountObserverListener = () => {
    if (calcFirstScreenTime === 'pending') {
      unmountObserver(0, true);
    }
    if(!isIE()){
      window.removeEventListener('beforeunload', unmountObserverListener);
    }
  };
  window.addEventListener('beforeunload', unmountObserverListener);

  const removeSmallScore = (observerData: any): any => {
    for (let i = 1; i < observerData.length; i++) {
      if (observerData[i].score < observerData[i - 1].score) {
        observerData.splice(i, 1);
        return removeSmallScore(observerData);
      }
    }
    return observerData;
  };

  const getfirstScreenTime = () => {
    observerData = removeSmallScore(observerData);
    let data: any;
    for (let i = 1; i < observerData.length; i++) {
      if (observerData[i].time >= observerData[i - 1].time) {
        const scoreDiffer = observerData[i].score - observerData[i - 1].score;
        if (!data || data.rate <= scoreDiffer) {
          data = { time: observerData[i].time, rate: scoreDiffer };
        }
      }
    }

    firstScreenTime = data?.time || 0;
    config.firstScreenTime = firstScreenTime;
    // --- 监听是否自动发送 uv ---
    if (config.autoSendPv) {
      userRepoet('uv', {
        domready: false,
        url: window?.location?.href?.split("?")[0] || "",
        // --- 刷新还是正常访问 - 刷新需要单独记录 ---
        type: performance?.navigation?.type === 1 ? "reload" : "normal",
      }, config);
    }
  }

  const traverseEl = (element: any, layer: number, identify?: boolean) => {
    // 窗口可视高度
    const height = window.innerHeight || 0;
    let score = 0;
    const tagName = element.tagName;
    if (
      tagName !== 'SCRIPT' &&
      tagName !== 'STYLE' &&
      tagName !== 'META' &&
      tagName !== 'HEAD'
    ) {
      const len = element.children ? element.children.length : 0;
      if (len > 0) {
        for (let children = element.children, i = len - 1; i >= 0; i--) {
          score += traverseEl(children[i], layer + 1, score > 0);
        }
      }
      // 如果元素高度超出屏幕可视高度直接返回 0 分
      if (score <= 0 && !identify) {
        if (
          element.getBoundingClientRect &&
          element.getBoundingClientRect().top >= height
        ) {
          return 0;
        }
      }
      score += 1 + 0.5 * layer;
    }
    return score;
  }
  
  // 每次 dom 结构改变时，都会调用里面定义的函数
  let observer: any = new window.MutationObserver(() => {
    // 当前时间 - 性能开始计算时间
    const time = new Date().getTime() - config.startTime;
    const body = document.querySelector('body');
    let score = 0;
    if (body) {
      score = traverseEl(body, 1, false);
      observerData.push({ score, time });
    } else {
      observerData.push({ score: 0, time });
    }
  });
  
  // 设置观察目标，接受两个参数: target：观察目标，options：通过对象成员来设置观察选项
  // 设为 childList: true, subtree: true 表示用来监听 DOM 节点插入、删除和修改时
  observer.observe(document, { childList: true, subtree: true });
  
  observer = observer;

  config.observerData = observerData;

  const compare = (delayTime: any) => {
    // 当前所开销的时间
    const _time = Date.now() - config.startTime;
    // 取最后一个元素时间 time
    const time =
      (
        observerData &&
        observerData.length &&
        observerData[observerData.length - 1].time) ||
      0;
    return _time > delayTime || _time - time > 2 * 500;
  }

  if (document.readyState === 'complete') {
    // MutationObserver监听的最大时间，10秒，超过 10 秒将强制结束
    unmountObserver(10000);
  } else {
    window.addEventListener(
      'load',
      () => {
        unmountObserver(10000);
        // getfirstScreenTime();
      },
      false
    );
  }
};

// ----- 监听 JS 报错 -----
const initListenJS = (config: any) => {
  // --- Promise ---
  const unhandledrejection = function(err: any) {
    console.log(err);
    getJsError(err, config);
  }
  // --- JS ---
  const errorEvent = function(err: any) {
    if (err.cancelable) {
      // 判断错误是否来自 eagle-eye 该方法仅能防止 script 方式引入的重复报错
      if (err.filename.indexOf('eagle-eye') > -1) {
        return;
      }
      // 如果是网络请求错误不管来自那个文件增加静默上报间隔
      // if () {}
      getJsError(err, config);
    } else {
      // 静态资源加载的error事件
      getResourceError(err, config);
    }
  }

  // --- 监听 ---
  window.addEventListener("unhandledrejection", unhandledrejection);
  window.addEventListener("error", errorEvent, true);
  
  // --- 挂载错误 ---
  config.eventCenter._set({
    type: "unhandledrejection",
    func: unhandledrejection
  });
  config.eventCenter._set({
    type: "error",
    func: errorEvent
  });
};

// ----- 监听 Ajax 报错 -----
const initListenAjax = (config: any) => {

  if (window.XMLHttpRequest && window.XMLHttpRequest.prototype) {
    // ----- OPEN -----
    let open = XMLHttpRequest.prototype.open;
	  XMLHttpRequest.prototype.open = function (e, t) {
			try {
        // @ts-ignore
        this.eagleTemp = {
          method: e,
          url: t,
          startTime: (new Date).getTime(),
        }
			} catch (err: any) {}
      // @ts-ignore
			open && open.apply(this, arguments);
		};

    // ----- SEND -----
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (e) {
      try {
        const t: any = this;
				let onloadend = t.onloadend;
        t.onloadend = function (e: any) {
          try {
            // --- 来自 SDK 的请求不监控 ---
            if (this.sendByEagle) { return }
            const currentTime = new Date().getTime();
            const apiCost = currentTime - t.eagleTemp.startTime;
            const method = t.eagleTemp.method;
            const target = e.target;
            const url = target.responseURL || t.eagleTemp.url;
            const status = target.status;
            const statusText = target.statusText
            const response = target.response;
            if (status !== 200) {
              ajaxError({
                type: "ajaxLoad",
                detail: {
                  apiCost: apiCost,
                  method: method,
                  responseURL: url,
                  status: status,
                  statusText: statusText,
                  response: response,
                }
              }, config);
            }
            if (apiCost >= 400) {
              ajaxError({
                type: "ajaxSlow",
                detail: {
                  apiCost: apiCost,
                  method: method,
                  responseURL: url,
                  status: status,
                  statusText: statusText,
                  response: response,
                }
              }, config);
            }
          } catch (f) {
          }
        },
        onloadend && onloadend.apply(this, arguments)
			} catch (err: any) {}
      // @ts-ignore
      send && send.apply(this, arguments);
    }
  }
};

// ----- 监听 Fetch 报错 -----
const initListenFetch = (config: any) => {
  if (window.fetch) {
    let _fetch = fetch;
    window.fetch = function (e: any, u: any) {
      // @ts-ignore
      return _fetch.apply(this, arguments).catch((err: any) => {
        try {
          ajaxError({
            type: "fetchError",
            detail: {
              method: "fetch",
              responseURL: e,
              response: JSON.stringify(err),
            }
          }, config);
        } catch (err: any) {}
        return err
      })
    };
  }
}


/**
 * 初始化监听 URL 变化
 * @param { Object } config
 */
const initListenHash = (config: any) => {
  const hashchange = () => {
    userRepoet('pv', {
      url: window?.location?.href?.split("?")[0] || ""
    }, config);
  };
  window.addEventListener("hashchange", hashchange);
  config.eventCenter._set({
    type: "hashchange",
    func: hashchange
  });

  const historyWrap = function(type: string) {
    const orig = history?.[type];
    const e: any = new Event(type);
    return function() {
      // @ts-ignore
      const rv = orig.apply(this, arguments);
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
const initListenBody = (config: any) => {
  // --- JS ---
  const clickEvent = function(event: any) {
    let target: any = getDomUniqueId(event?.target);
    if (!target.id || !target.type) {
      return
    }
    userRepoet('click', {
      url: window?.location?.href?.split("?")[0] || "",
      dom: target,
    }, config);
  }

  document?.body?.addEventListener("click", clickEvent);

  config.eventCenter._set({
    type: "clickEvent",
    func: clickEvent
  });
};

/**
 * 开启心跳检测
 * @param { Object } config
 */
const initHeartbeat = (config: any) => {
  // -- 如果浏览器支持 serviceWorker --
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js', {
      scope: './'
    }).then((res: any) => {
      if (navigator?.serviceWorker?.controller !== null) {
        // - 每五秒发一次心跳 -
        let HEARTBEAT_INTERVAL = 5 * 1000;
        // - 发送消息的 ID -
        let sessionId = "";
        // --- 发送心跳 ---
        let heartbeat = function () {
          navigator?.serviceWorker?.controller?.postMessage({
            type: 'running',
            id: sessionId,
            // 附加信息，如果页面 crash，上报的附加数据
            data: config,
          });
        }
        // --- 卸载 ---
        window.addEventListener("beforeunload", function () {
          navigator?.serviceWorker?.controller?.postMessage({
            type: 'clear',
            id: sessionId
          });
        });
        setInterval(heartbeat, HEARTBEAT_INTERVAL);
        heartbeat();
      }
    });
  }
};

export default initUserConfig;
