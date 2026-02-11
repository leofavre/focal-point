import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockImageDraftState, createMockImageRecord } from "../../test-utils/mocks";
import type { ImageId, ImageRecord } from "../../types";
import { usePersistedImages } from "./usePersistedImages";

const {
  mockAddRecord,
  mockGetRecord,
  mockGetAllRecords,
  mockUpdateRecord,
  mockDeleteRecord,
  mockUpsertRecord,
} = vi.hoisted(() => ({
  mockAddRecord: vi.fn(),
  mockGetRecord: vi.fn(),
  mockGetAllRecords: vi.fn(),
  mockUpdateRecord: vi.fn(),
  mockDeleteRecord: vi.fn(),
  mockUpsertRecord: vi.fn(),
}));

function asResult<T>(value: T): { accepted: T } | { rejected: unknown } {
  if (value != null && typeof value === "object" && "rejected" in value) {
    return value as { rejected: unknown };
  }
  return { accepted: value };
}

function createMockResultBasedService() {
  return {
    addRecord: async (record: ImageRecord) => {
      const out = await mockAddRecord(record);
      return asResult(out ?? undefined);
    },
    getRecord: async (id: string | number) => asResult(await mockGetRecord(id)),
    getAllRecords: async () => asResult(await mockGetAllRecords()),
    updateRecord: async (record: ImageRecord) => {
      const out = await mockUpdateRecord(record);
      return asResult(out ?? undefined);
    },
    upsertRecord: async (record: ImageRecord) => {
      const out = await mockUpsertRecord(record);
      return asResult(out ?? undefined);
    },
    deleteRecord: async (id: string) => {
      const out = await mockDeleteRecord(id);
      return asResult(out ?? undefined);
    },
  };
}

vi.mock("../../helpers/indexedDBAvailability", () => ({
  isIndexedDBAvailable: vi.fn(() => true),
}));

vi.mock("../../services/indexedDBServiceResultBased", () => ({
  getIndexedDBServiceResultBased: vi.fn(() => createMockResultBasedService()),
}));

vi.mock("../../services/inMemoryStorageServiceResultBased", () => ({
  getInMemoryStorageServiceResultBased: vi.fn(() => createMockResultBasedService()),
}));

describe("usePersistedImages", () => {
  const testFile = new Blob(["test"], { type: "image/png" });

  beforeEach(() => {
    mockGetAllRecords.mockResolvedValue([]);
    mockGetRecord.mockResolvedValue(undefined);
    mockAddRecord.mockResolvedValue(undefined);
    mockUpdateRecord.mockResolvedValue(undefined);
    mockDeleteRecord.mockResolvedValue(undefined);
    mockUpsertRecord.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns images undefined initially, then loaded list after getAll resolves", async () => {
    const persisted: ImageRecord[] = [];
    mockGetAllRecords.mockResolvedValue(persisted);

    const { result } = renderHook(() => usePersistedImages());

    expect(result.current.images).toBeUndefined();

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    expect(mockGetAllRecords).toHaveBeenCalled();
  });

  it("initial load effect does not cause an infinite loop (getAllRecords called exactly once)", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    expect(mockGetAllRecords).toHaveBeenCalledTimes(1);
  });

  it("returns persisted images when getAll resolves with data", async () => {
    const record = createMockImageRecord({
      id: "saved-id",
      ...createMockImageDraftState({ name: "saved.png" }),
      file: testFile,
    });

    mockGetAllRecords.mockResolvedValue([record]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
      expect(result.current.images?.[0]).toMatchObject({
        id: "saved-id",
        name: "saved.png",
      });
    });
  });

  it("addImage generates friendly id from filename, adds record, refreshes, and returns id", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageDraft = createMockImageDraftState({ name: "new.png" });

    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile });
    });

    expect(addResult?.accepted).toBe("new");
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "new",
      ...imageDraft,
      file: testFile,
    });
    expect(mockGetAllRecords).toHaveBeenCalledTimes(3); // initial load + refresh after add
  });

  it("addImage uses collision suffix when filename already exists", async () => {
    const existingRecord = createMockImageRecord({
      id: "my-photo",
      ...createMockImageDraftState({ name: "My Photo.jpg" }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const imageDraft = createMockImageDraftState({ name: "My Photo.jpg" });
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile });
    });

    expect(addResult?.accepted).toBe("my-photo-2");
    expect(mockAddRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "my-photo-2",
        name: "My Photo.jpg",
      }),
    );
  });

  it("addImage with overwrite: true uses base id and overwrites existing record via upsertRecord", async () => {
    const existingRecord = createMockImageRecord({
      id: "my-photo",
      ...createMockImageDraftState({ name: "My Photo.jpg", createdAt: 1000 }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const imageDraft = createMockImageDraftState({
      name: "My Photo.jpg",
      createdAt: 2000,
      breakpoints: [{ objectPosition: "50% 50%" }],
    });
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { overwrite: true },
      );
    });

    expect(addResult?.accepted).toBe("my-photo");
    expect(mockUpsertRecord).toHaveBeenCalledWith({
      id: "my-photo",
      ...imageDraft,
      file: testFile,
    });
    expect(mockAddRecord).not.toHaveBeenCalled();
  });

  it("addImage with overwrite: true when no existing record calls upsertRecord", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageDraft = createMockImageDraftState({ name: "New.png" });
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { overwrite: true },
      );
    });

    expect(addResult?.accepted).toBe("new");
    expect(mockUpsertRecord).toHaveBeenCalledWith({
      id: "new",
      ...imageDraft,
      file: testFile,
    });
    expect(mockAddRecord).not.toHaveBeenCalled();
  });

  it("addImages with overwrite: true overwrites existing and adds new via upsertRecord", async () => {
    const existingRecord = createMockImageRecord({
      id: "photo",
      ...createMockImageDraftState({ name: "photo.jpg" }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const draft1 = createMockImageDraftState({ name: "photo.jpg", createdAt: 2 });
    const draft2 = createMockImageDraftState({ name: "other.png" });
    let addResults: Awaited<ReturnType<typeof result.current.addImages>> | undefined;
    await act(async () => {
      addResults = await result.current.addImages(
        [
          { imageDraft: draft1, file: testFile },
          { imageDraft: draft2, file: testFile },
        ],
        { overwrite: true },
      );
    });

    expect(addResults?.accepted).toEqual(["photo", "other"]);
    expect(mockUpsertRecord).toHaveBeenCalledTimes(2);
    expect(mockUpsertRecord).toHaveBeenNthCalledWith(1, {
      id: "photo",
      ...draft1,
      file: testFile,
    });
    expect(mockUpsertRecord).toHaveBeenNthCalledWith(2, {
      id: "other",
      ...draft2,
      file: testFile,
    });
    expect(mockAddRecord).not.toHaveBeenCalled();
  });

  it("addImage with options.id uses explicit id and upsertRecord", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageDraft = createMockImageDraftState({ name: "any-name.png" });
    const explicitId = "my-custom-id" as ImageId;
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { id: explicitId },
      );
    });

    expect(addResult?.accepted).toBe("my-custom-id");
    expect(mockUpsertRecord).toHaveBeenCalledWith({
      id: "my-custom-id",
      ...imageDraft,
      file: testFile,
    });
  });

  it("addImage with options.id overwrites existing record via upsertRecord", async () => {
    const existingRecord = createMockImageRecord({
      id: "custom-id",
      ...createMockImageDraftState({ name: "old.png" }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const imageDraft = createMockImageDraftState({
      name: "new.png",
      breakpoints: [{ objectPosition: "100% 0%" }],
    });
    const explicitId = "custom-id" as ImageId;
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { id: explicitId },
      );
    });

    expect(addResult?.accepted).toBe("custom-id");
    expect(mockUpsertRecord).toHaveBeenCalledWith({
      id: "custom-id",
      ...imageDraft,
      file: testFile,
    });
  });

  it("addImages generates ids for all items and adds records", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const draft1 = createMockImageDraftState({ name: "first.png" });
    const draft2 = createMockImageDraftState({ name: "second.png" });
    let addResults: Awaited<ReturnType<typeof result.current.addImages>> | undefined;
    await act(async () => {
      addResults = await result.current.addImages([
        { imageDraft: draft1, file: testFile },
        { imageDraft: draft2, file: testFile },
      ]);
    });

    expect(addResults?.accepted).toEqual(["first", "second"]);
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "first",
      ...draft1,
      file: testFile,
    });
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "second",
      ...draft2,
      file: testFile,
    });
  });

  it("getImage returns record when getByID resolves", async () => {
    const id = "lookup-id" as ImageId;

    const record = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "lookup.png" }),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(record);
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage(id);
    });

    expect(mockGetRecord).toHaveBeenCalledWith(id);
    expect(fetched).toMatchObject({ id, name: "lookup.png" });
  });

  it("getImage returns undefined when getByID resolves with null/undefined", async () => {
    mockGetRecord.mockResolvedValue(undefined);
    mockGetAllRecords.mockResolvedValue([]);

    const id = "missing-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage(id);
    });

    expect(fetched).toBeUndefined();
  });

  it("updateImage merges updates and calls update and refreshImages", async () => {
    const id = "update-id" as ImageId;
    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "old.png", createdAt: 1000 }),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(existing);
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.updateImage(id, {
        name: "new.png",
        breakpoints: [{ objectPosition: "25% 75%" }],
      });
    });

    expect(mockGetRecord).toHaveBeenCalledWith(id);
    expect(mockUpdateRecord).toHaveBeenCalledWith({
      ...existing,
      id,
      name: "new.png",
      breakpoints: [{ objectPosition: "25% 75%" }],
      file: existing.file,
    });
    expect(mockGetAllRecords).toHaveBeenCalledTimes(2);
  });

  it("updateImage does nothing when record is not found", async () => {
    mockGetRecord.mockResolvedValue(undefined);
    mockGetAllRecords.mockResolvedValue([]);

    const id = "missing-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.updateImage(id, { name: "ignored.png" });
    });

    expect(mockUpdateRecord).not.toHaveBeenCalled();
    expect(mockGetAllRecords).toHaveBeenCalledTimes(1); // initial load only
  });

  it("updateImage returns undefined and skips update when current and updated are deeply equal", async () => {
    const id = "update-id" as ImageId;
    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "same.png", createdAt: 1000 }),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(existing);
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const updateResult = await act(async () => result.current.updateImage(id, {}));

    expect(updateResult?.accepted).toBe(id);
    expect(mockUpdateRecord).not.toHaveBeenCalled();
    expect(mockGetAllRecords).toHaveBeenCalledTimes(1); // initial load only
  });

  it("deleteImage calls deleteRecord and refreshImages", async () => {
    const id = "delete-id" as ImageId;
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.deleteImage(id);
    });

    expect(mockDeleteRecord).toHaveBeenCalledWith(id);
    expect(mockGetAllRecords).toHaveBeenCalledTimes(2);
  });

  it("refreshImages reloads images from getAll", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const record = createMockImageRecord({
      id: "refreshed-id",
      ...createMockImageDraftState({ name: "refreshed.png" }),
      file: testFile,
    });

    mockGetAllRecords.mockResolvedValue([record]);

    await act(async () => {
      await result.current.refreshImages();
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]).toMatchObject({
      id: "refreshed-id",
      name: "refreshed.png",
    });
    expect(mockGetAllRecords).toHaveBeenCalledTimes(2);
  });

  it("returns rejected when refreshImages (getAll) fails", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    mockGetAllRecords.mockResolvedValue({
      rejected: { reason: "IndexedDBUnavailable", error: new Error("unavailable") },
    });

    let refreshResult: Awaited<ReturnType<typeof result.current.refreshImages>> | undefined;
    await act(async () => {
      refreshResult = await result.current.refreshImages();
    });

    expect(refreshResult?.rejected).toBeDefined();
    expect(refreshResult?.rejected?.reason).toBe("RefreshFailed");
  });

  it("returns rejected when addImage fails", async () => {
    mockGetAllRecords.mockResolvedValue([]);
    mockAddRecord.mockResolvedValue({
      rejected: { reason: "AddImageFailed", error: new Error("write failed") },
    });

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const imageDraft = createMockImageDraftState();

    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile });
    });

    expect(addResult?.rejected).toBeDefined();
    expect(addResult?.rejected?.reason).toBe("AddImageFailed");
  });

  it("returns undefined when getImage (getRecord) returns rejected", async () => {
    mockGetRecord.mockResolvedValue({
      rejected: { reason: "GetImageFailed", error: new Error("read failed") },
    });
    mockGetAllRecords.mockResolvedValue([]);

    const id = "any-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage(id);
    });
    expect(fetched).toBeUndefined();
  });

  it("returns rejected when updateImage fails", async () => {
    const id = "update-id" as ImageId;

    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState(),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(existing);
    mockUpdateRecord.mockResolvedValue({
      rejected: { reason: "UpdateImageFailed", error: new Error("update failed") },
    });
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let updateResult: Awaited<ReturnType<typeof result.current.updateImage>> | undefined;
    await act(async () => {
      updateResult = await result.current.updateImage(id, { name: "new.png" });
    });

    expect(updateResult?.rejected).toBeDefined();
    expect(updateResult?.rejected?.reason).toBe("UpdateImageFailed");
  });

  it("returns undefined when deleteImage (deleteRecord) returns rejected", async () => {
    mockDeleteRecord.mockResolvedValue({
      rejected: { reason: "DeleteImageFailed", error: new Error("delete failed") },
    });
    mockGetAllRecords.mockResolvedValue([]);

    const id = "delete-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let deleted: string | undefined;
    await act(async () => {
      deleted = await result.current.deleteImage(id);
    });
    expect(deleted).toBeUndefined();
  });

  describe("forceInMemoryStorage option", () => {
    it("when forceInMemoryStorage is true, uses in-memory storage and operations succeed", async () => {
      mockGetAllRecords.mockResolvedValue([]);

      const { result } = renderHook(() =>
        usePersistedImages({ forceInMemoryStorage: true }),
      );

      await waitFor(() => {
        expect(result.current.images).toBeDefined();
      });

      const imageDraft = createMockImageDraftState({ name: "ephemeral.png" });
      let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
      await act(async () => {
        addResult = await result.current.addImage({ imageDraft, file: testFile });
      });

      expect(addResult?.accepted).toBe("ephemeral");
      expect(mockAddRecord).toHaveBeenCalled();
    });
  });
});
