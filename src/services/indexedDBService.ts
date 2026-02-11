import { initDB, useIndexedDB, type IndexedDBProps } from "react-indexed-db-hook";
import { isIndexedDBAvailable } from "../helpers/indexedDBAvailability";
import type { Result } from "../helpers/errorHandling";
import { accept, reject } from "../helpers/errorHandling";
import type { DatabaseKey, DatabaseService } from "./types";

const initializedDatabases = new Set<string>();

/**
 * Returns a DatabaseService backed by IndexedDB.
 * Same signature as getSessionStorageService: returns a Result so callers can handle
 * IndexedDBUnavailable without try/catch.
 */
export function getIndexedDBService<T, K extends DatabaseKey = string>(
  dbConfig: IndexedDBProps,
  tableName: string,
): Result<DatabaseService<T, K>, "IndexedDBUnavailable"> {
  if (!isIndexedDBAvailable()) {
    return reject({ reason: "IndexedDBUnavailable" });
  }

  const dbKey = `${dbConfig.name}_${dbConfig.version}`;

  if (!initializedDatabases.has(dbKey)) {
    initDB(dbConfig);
    initializedDatabases.add(dbKey);
  }

  const indexedDB = useIndexedDB(tableName);

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
