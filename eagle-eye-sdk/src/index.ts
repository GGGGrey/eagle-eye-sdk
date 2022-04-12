/**
 * @description 监控 SDK 入口文件
 * @params { Object } userConfig
 * @returns 
 */
import initUserConfig from './initUserConfig';
import monitor from './monitor';
import { eventCenter } from './eventCenter';

interface IUserConfig {
  id: string;
  host: string;
  rote: string;
  startTime: number;
}

const initMonitor = (userConfig: IUserConfig) => {
  const event = eventCenter();

  const config = initUserConfig(userConfig, event);

  // @ts-ignore
  const newMonitor = monitor(config);
  
  return newMonitor;
};

export {
  initMonitor
}