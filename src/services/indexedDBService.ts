import { initDB, useIndexedDB } from "react-indexed-db-hook";
import type { Result } from "../helpers/errorHandling";
import { accept, reject } from "../helpers/errorHandling";
import { DBConfig } from "./databaseConfig";
import type { DatabaseKey, DatabaseService } from "./types";

let databaseInitialized = false;

/**
 * Returns a DatabaseService backed by IndexedDB.
 * Same signature as getSessionStorageService: returns a Result so callers can handle
 * IndexedDBUnavailable without try/catch.
 */
export function getIndexedDBService<T, K extends DatabaseKey = string>(
  tableName: string,
): Result<DatabaseService<T, K>, "IndexedDBUnavailable"> {
  if (databaseInitialized === false) {
    initDB(DBConfig);
    databaseInitialized = true;
  }

  const indexedDB = useIndexedDB(tableName);

  if (typeof window === "undefined" || !window.indexedDB) {
    return reject({ reason: "IndexedDBUnavailable" });
  }

  return accept({
    async addRecord(value: T, key?: K) {
      await indexedDB.add(value, key);
    },
    getRecord: indexedDB.getByID,
    getAllRecords: indexedDB.getAll,
    updateRecord: indexedDB.update,
    async deleteRecord(key: K) {
      await indexedDB.deleteRecord(key);
    },
  });
}
