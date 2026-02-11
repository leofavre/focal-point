import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { IndexedDBProps } from "react-indexed-db-hook";
import type { Result } from "../helpers/errorHandling";
import { getInMemoryStorageServiceResultBased } from "./inMemoryStorageServiceResultBased";
import { getIndexedDBServiceResultBased } from "./indexedDBServiceResultBased";
import { getSessionStorageServiceResultBased } from "./sessionStorageServiceResultBased";
import type { ResultBasedDatabaseService } from "./types";

/**
 * Test-specific IndexedDB configuration.
 * Creates multiple stores to support tests that need unique table names.
 * We create enough stores to support the test suite (27 tests, each may use 1-2 tables).
 */
const testDBConfig: IndexedDBProps = {
  name: "FocalPointEditorTest",
  version: 1,
  objectStoresMeta: Array.from({ length: 50 }, (_, i) => ({
    store: `test_table_${i + 1}`,
    storeConfig: {
      keyPath: "id",
      autoIncrement: false,
    },
    storeSchema: [],
  })),
};

/**
 * Clears the IndexedDB stores used by tests.
 * This ensures tests start with empty stores and don't leak state.
 * If the DB doesn't exist yet, this is a no-op (initDB will create it when needed).
 */
/**
 * Clears the IndexedDB stores used by tests.
 * This ensures tests start with empty stores and don't leak state.
 * If the DB doesn't exist yet, this is a no-op (initDB will create it when needed).
 */
async function clearIndexedDBStores(): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.open(testDBConfig.name, testDBConfig.version);

    request.onsuccess = () => {
      const db = request.result;
      const storeNames = Array.from(db.objectStoreNames);
      if (storeNames.length === 0) {
        db.close();
        resolve();
        return;
      }

      const transaction = db.transaction(storeNames, "readwrite");

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        db.close();
        // Ignore errors - stores might not exist yet
        resolve();
      };

      for (const storeName of storeNames) {
        transaction.objectStore(storeName).clear();
      }
    };

    request.onerror = () => {
      // DB doesn't exist yet, which is fine
      resolve();
    };

    request.onupgradeneeded = () => {
      // DB doesn't exist yet or needs upgrade, but we'll let initDB handle that
      request.transaction?.abort();
      resolve();
    };
  });
}

async function expectAccepted<T, R extends string>(
  promise: Promise<Result<T, R>>,
): Promise<T> {
  const result = await promise;
  if (result.rejected != null) {
    throw new Error(`Expected accepted result but got rejected: ${result.rejected.reason}`);
  }
  return result.accepted as T;
}

let tableCounter = 0;

function getUniqueTableName(): string {
  tableCounter += 1;
  // For indexedDB, cycle through the available test stores
  // For other services, use unique names to avoid collisions
  return `test_table_${tableCounter}`;
}

type ServiceConfig = {
  name: string;
  getService: <T, K extends string = string>(
    tableName: string,
  ) => ResultBasedDatabaseService<T, K, string>;
  getTableName: () => string;
};

const serviceConfigs: ServiceConfig[] = [
  {
    name: "sessionStorage",
    getService: (tableName) => getSessionStorageServiceResultBased(tableName),
    getTableName: getUniqueTableName,
  },
  {
    name: "inMemory",
    getService: (tableName) => getInMemoryStorageServiceResultBased(tableName),
    getTableName: getUniqueTableName,
  },
  {
    name: "indexedDB",
    getService: <T, K extends string = string>(tableName: string) => {
      // Use the table name directly since testDBConfig has stores matching the pattern
      const { result } = renderHook(() =>
        getIndexedDBServiceResultBased<T, K>(testDBConfig, tableName),
      );
      return result.current as ResultBasedDatabaseService<T, K, string>;
    },
    getTableName: getUniqueTableName,
  },
];

describe("result-based services (shared contract)", () => {
  beforeEach(async () => {
    // Clear IndexedDB stores before each test to prevent state leakage
    try {
      await clearIndexedDBStores();
    } catch (error) {
      // Ignore errors if DB doesn't exist yet (first test)
      // The error will be handled when initDB is called
    }
    // Clear sessionStorage to prevent state leakage
    sessionStorage.clear();
  });

  it.each(serviceConfigs)(
    "addRecord and getRecord round-trip a value ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string; name: string }, string>(tableName);
      const record = { id: "r1", name: "First" };

      await expectAccepted(service.addRecord(record));
      const got = await expectAccepted(service.getRecord("r1"));

      expect(got).toEqual(record);
    },
  );

  it.each(serviceConfigs)(
    "getRecord returns undefined when key is missing ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string }, string>(tableName);

      const got = await expectAccepted(service.getRecord("missing"));

      expect(got).toBeUndefined();
    },
  );

  it.each(serviceConfigs)(
    "getAllRecords returns all records for the table ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string; v: number }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "a", v: 1 }));
      await expectAccepted(service.addRecord({ id: "b", v: 2 }));

      const all = await expectAccepted(service.getAllRecords());

      expect(all).toHaveLength(2);
      expect(all!.map((r) => r.id).sort()).toEqual(["a", "b"]);
    },
  );

  it.each(serviceConfigs)(
    "updateRecord overwrites existing record ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string; count: number }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "r1", count: 1 }));
      await expectAccepted(service.updateRecord({ id: "r1", count: 2 }));

      const got = await expectAccepted(service.getRecord("r1"));
      expect(got).toEqual({ id: "r1", count: 2 });
    },
  );

  it.each(serviceConfigs)(
    "upsertRecord creates record when it does not exist ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string; name: string }, string>(tableName);

      await expectAccepted(service.upsertRecord({ id: "new", name: "Created" }));

      const got = await expectAccepted(service.getRecord("new"));
      expect(got).toEqual({ id: "new", name: "Created" });
    },
  );

  it.each(serviceConfigs)(
    "upsertRecord updates record when it exists ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string; count: number }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "r1", count: 1 }));
      await expectAccepted(service.upsertRecord({ id: "r1", count: 99 }));

      const got = await expectAccepted(service.getRecord("r1"));
      expect(got).toEqual({ id: "r1", count: 99 });
    },
  );

  it.each(serviceConfigs)(
    "deleteRecord removes the record ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "r1" }));
      await expectAccepted(service.deleteRecord("r1"));

      const got = await expectAccepted(service.getRecord("r1"));
      expect(got).toBeUndefined();
    },
  );

  it.each(serviceConfigs)(
    "addRecord uses value.id when present for storage key ($name)",
    async ({ getService, getTableName }) => {
      const tableName = getTableName();
      const service = getService<{ id: string }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "my-id" }));

      const got = await expectAccepted(service.getRecord("my-id"));
      expect(got).toEqual({ id: "my-id" });
    },
  );

  it.each(serviceConfigs)(
    "different table names do not collide ($name)",
    async ({ getService, getTableName }) => {
      // Ensure we get two different table names
      const tableA = getTableName();
      let tableB = getTableName();
      // If we got the same name, get another one
      while (tableB === tableA) {
        tableB = getTableName();
      }
      const serviceA = getService<{ id: string }, string>(tableA);
      const serviceB = getService<{ id: string }, string>(tableB);

      await expectAccepted(serviceA.addRecord({ id: "only-in-a" }));
      await expectAccepted(serviceB.addRecord({ id: "only-in-b" }));

      const fromA = await expectAccepted(serviceA.getAllRecords());
      const fromB = await expectAccepted(serviceB.getAllRecords());

      expect(fromA).toHaveLength(1);
      expect(fromA![0].id).toBe("only-in-a");
      expect(fromB).toHaveLength(1);
      expect(fromB![0].id).toBe("only-in-b");
    },
  );
});
