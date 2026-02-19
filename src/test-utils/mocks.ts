import type {
  ImageDraftState,
  ImageId,
  ImageRecordWithFile,
  ImageRecordWithUrl,
  ImageState,
} from "../types";

const defaultBreakpoints: ImageDraftState["breakpoints"] = [{ objectPosition: "50% 50%" }];

export function createMockImageDraftState(
  overrides: Partial<ImageDraftState> = {},
): ImageDraftState {
  return {
    name: "test.png",
    type: "image/png",
    createdAt: 1000,
    breakpoints: defaultBreakpoints,
    ...overrides,
  };
}

export function createMockImageState(overrides: Partial<ImageState> = {}): ImageState {
  return {
    ...createMockImageDraftState(overrides),
    url: "blob:http://localhost/test",
    naturalAspectRatio: 16 / 9,
    ...overrides,
  };
}

type createMockImageRecordWithFileOverrides = Omit<Partial<ImageRecordWithFile>, "id"> & {
  id?: string;
};

export function createMockImageRecordWithFile({
  id,
  ...overrides
}: createMockImageRecordWithFileOverrides = {}): ImageRecordWithFile {
  const typedId = (id ?? "mock-record-1") as ImageId;

  return {
    ...createMockImageDraftState(overrides),
    id: typedId,
    file: new Blob(["mock"], { type: "image/png" }),
    ...overrides,
  };
}

export function createMockImageRecordWithUrl({
  id,
  url = "https://example.com/image.png",
  ...overrides
}: Omit<Partial<ImageRecordWithUrl>, "id"> & { id?: string } = {}): ImageRecordWithUrl {
  const typedId = (id ?? "mock-url-record-1") as ImageId;

  return {
    ...createMockImageDraftState(overrides),
    id: typedId,
    url,
    ...overrides,
  };
}
