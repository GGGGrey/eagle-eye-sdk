/**
 * EventCenter save data in array
 * @returns Array
 */
declare type dataArray = Array<any>;
declare type recordArray = Array<any>;
interface IEvent {
    data: dataArray;
    record: recordArray;
    _get: () => dataArray;
    _getRecord: () => recordArray;
    _set: (event: any) => void;
    _setRecord: (event: any) => void;
    _clearRecord: () => void;
}
export declare const eventCenter: () => IEvent;
export {};
