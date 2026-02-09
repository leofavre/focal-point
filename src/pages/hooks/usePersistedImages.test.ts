import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockImageDraftState, createMockImageRecord } from "../../test-utils/mocks";
import type { ImageId, ImageRecord } from "../../types";
import { usePersistedImages } from "./usePersistedImages";

const { mockAddRecord, mockGetRecord, mockGetAllRecords, mockUpdateRecord, mockDeleteRecord } =
  vi.hoisted(() => ({
    mockAddRecord: vi.fn(),
    mockGetRecord: vi.fn(),
    mockGetAllRecords: vi.fn(),
    mockUpdateRecord: vi.fn(),
    mockDeleteRecord: vi.fn(),
  }));

vi.mock("../../services/indexedDBService", () => ({
  getIndexedDBService: vi.fn(() => ({
    accepted: {
      addRecord: mockAddRecord,
      getRecord: mockGetRecord,
      getAllRecords: mockGetAllRecords,
      updateRecord: mockUpdateRecord,
      deleteRecord: mockDeleteRecord,
    },
    rejected: undefined,
  })),
}));

describe("usePersistedImages", () => {
  const testFile = new Blob(["test"], { type: "image/png" });

  beforeEach(() => {
    mockGetAllRecords.mockResolvedValue([]);
    mockAddRecord.mockResolvedValue(undefined);
    mockGetRecord.mockResolvedValue(undefined);
    mockUpdateRecord.mockResolvedValue(undefined);
    mockDeleteRecord.mockResolvedValue(undefined);
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
    expect(mockGetAllRecords).toHaveBeenCalledTimes(3); // initial load + getAll for id + refresh after add
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
    expect(mockGetAllRecords).toHaveBeenCalledTimes(1); // only initial load
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
    expect(mockGetAllRecords).toHaveBeenCalledTimes(1); // only initial load
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

    mockGetAllRecords.mockRejectedValue(new Error("IndexedDB unavailable"));

    let refreshResult: Awaited<ReturnType<typeof result.current.refreshImages>> | undefined;
    await act(async () => {
      refreshResult = await result.current.refreshImages();
    });

    expect(refreshResult?.rejected).toEqual({ reason: "RefreshFailed" });
  });

  it("returns rejected when addImage fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockGetAllRecords.mockResolvedValue([]);
    mockAddRecord.mockRejectedValue(new Error("IndexedDB write failed"));

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const imageDraft = createMockImageDraftState();

    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile });
    });

    expect(addResult?.rejected).toEqual({ reason: "AddImageFailed" });
  });

  it("propagates errors when getImage fails", async () => {
    mockGetRecord.mockRejectedValue(new Error("IndexedDB read failed"));
    mockGetAllRecords.mockResolvedValue([]);

    const id = "any-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await expect(
      act(async () => {
        await result.current.getImage(id);
      }),
    ).rejects.toThrow("IndexedDB read failed");
  });

  it("returns rejected when updateImage fails", async () => {
    const id = "update-id" as ImageId;

    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState(),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(existing);
    mockUpdateRecord.mockRejectedValue(new Error("IndexedDB update failed"));
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let updateResult: Awaited<ReturnType<typeof result.current.updateImage>> | undefined;
    await act(async () => {
      updateResult = await result.current.updateImage(id, { name: "new.png" });
    });

    expect(updateResult?.rejected).toEqual({ reason: "UpdateImageFailed" });
  });

  it("propagates errors when deleteImage fails", async () => {
    mockDeleteRecord.mockRejectedValue(new Error("IndexedDB delete failed"));
    mockGetAllRecords.mockResolvedValue([]);

    const id = "delete-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await expect(
      act(async () => {
        await result.current.deleteImage(id);
      }),
    ).rejects.toThrow("IndexedDB delete failed");
  });
});
