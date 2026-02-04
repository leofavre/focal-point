export type DatabaseKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBKeyRange;

export type DatabaseService<T, K extends DatabaseKey> = {
  addRecord: (value: T, key?: K) => Promise<void>;
  getRecord: (id: number | string) => Promise<T>;
  getAllRecords: () => Promise<T[]>;
  updateRecord: (value: T, key?: K) => Promise<void>;
  deleteRecord: (key: K) => Promise<void>;
};
