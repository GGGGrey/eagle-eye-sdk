/**
 * @file config detail file
 * @author JYkid
 * @version 0.0.1-beta
 */

function newConfig(conf: any) {
  let config = {
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
    // - 禁用 fetch -
    disableFetch: false,
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
    _extend: (self: any, conf: any) => {
      Object.keys(conf).map((x) => {
        self[x] = conf[x];
        return;
      });
      return self;
    },
  }
  return config._extend(config, conf);
}

export default newConfig;
