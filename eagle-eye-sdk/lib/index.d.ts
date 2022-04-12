interface IUserConfig {
    id: string;
    host: string;
    rote: string;
    startTime: number;
}
declare const initMonitor: (userConfig: IUserConfig) => any;
export { initMonitor };
