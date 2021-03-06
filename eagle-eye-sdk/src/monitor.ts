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
import { userRepoet } from './event';

interface IConfigProps{
  [propName: string]: any;
}

const monitor = function(config: IConfigProps): any {
  return {
    config: config,
    // ---- 销毁监控 ----
    destory: function() {
      const array = this.config?.eventCenter?._get();
      for (let i = 0; i < array.length; i++) {
        // event type add different stage
        if (array[i].type === 'error') {
          window.removeEventListener(array[i].type, array[i].func, true);
        } else {
          window.removeEventListener(array[i].type, array[i].func);
        }
      }
    },
    // ---- 获取监控数据 ----
    getRecord: function() {
      const array = this.config._getRrwebEvent();
      return array;
    },
    // ---- 主动上报 ----
    report: function(type: string, eventData: any = {}) {
      return userRepoet(type, eventData, this.config);
    },
    // ---- 计时开始 ----
    start: function () {
      this.config.beginTiming = new Date().getTime();
    },
    stop: function() {
      // --- 只有开始计时的时候才算时间 ---
      if (this.config.beginTiming > 0) {
        this.config.costTime = new Date().getTime() - this.config.beginTiming;
        this.config.beginTiming = 0;
      } else {
        // --- 否则使用 startTime 作为默认时间 ---
        this.config.costTime = new Date().getTime() - this.config.startTime;
      }
    }
  };
}

export default monitor;
