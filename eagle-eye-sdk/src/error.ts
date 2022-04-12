/**
 * @file error event center
 * @author JYkidrecord
 * @version 0.0.1-beta
 */

/* eslint-disable */
import ajax from "./ajax";
import { getWrap } from "./wrap";

const getErrorData = function(err: any, config: any, resource?: boolean) {
  const wrap: any = getWrap(config);
  let data = wrap._getErrorMessage(err, resource);
  data.record = [];
  data.app_key = config.app_key
  return data;
};

// 服务端返回错误
export const getServerError = function() {};

// ajaxError
export const ajaxError = function(err: any, config: any) {
  // 处理err 上报
  let data = getErrorData(err, config);
  ajax.post(config.protocol + config.url, data);
}

// js 抛出的错误
export const getJsError = function(err: any, config: any) {
  let data = getErrorData(err, config);
  ajax.post(config.protocol + config.url, data);
}

// 资源加载错误
export const getResourceError = function (err: any, config: any) {
  let data = getErrorData(err, config, true);
  ajax.post(config.protocol + config.url, data);
}
