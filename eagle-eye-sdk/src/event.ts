/**
 * @file user report event 
 * @author JYkidrecord
 * @version 0.0.1
 */

/* eslint-disable */
import ajax from "./ajax";
import { getWrap } from "./wrap";

const getEventData = function(type: string, event: any, config: any) {
  const wrap: any =  getWrap(config);
  let data = wrap._getEventMessage(type, event);
  data.app_key = config.app_key;
  data.firstScreenTime = config.firstScreenTime || 0;
  
  return data;
};

/**
 * 
 * @param { String } type
 * @param { Object } eventData
 */
export const userRepoet = function(type: string, eventData: any, config: any) {
  let data = getEventData(type, eventData, config);
  ajax.post(config.protocol + config.url, data, function() {
    config._clearEvent();
  });
}


