/**
 * EventCenter save data in array
 * @returns Array
 */

type dataArray = Array<any>;
type recordArray = Array<any>;

interface IEvent {
  data: dataArray;
  record: recordArray;
  _get: () => dataArray;
  _getRecord: () => recordArray;
  _set: (event: any) => void;
  _setRecord: (event: any) => void;
  _clearRecord: () => void;
}

export const eventCenter = function() {
  let event: IEvent = {
    data: [],
    record: [],
    _get: function() {
      return this.data
    },
    _getRecord: function() {
      return this.record;
    },
    _set: function(event: any) {
      this.data.push(event);
    },
    _setRecord: function(event: any) {
      this.record.push(event);
    },
    _clearRecord() {
      this.record.splice(0, self.record.length);
    },
  };
  return event;
}


