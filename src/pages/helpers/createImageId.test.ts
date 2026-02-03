import { describe, expect, it } from "vitest";
import { createImageId } from "./createImageId";

describe("createImageId", () => {
  it("returns slugified filename when no collision", () => {
    const usedIds = new Set<string>();
    expect(createImageId("My Photo.jpg", usedIds)).toBe("my-photo.jpg");
    expect(usedIds).toContain("my-photo.jpg");
  });

  it("appends -2 when base ID exists", () => {
    const usedIds = new Set(["my-photo.jpg"]);
    expect(createImageId("My Photo.jpg", usedIds)).toBe("my-photo-2.jpg");
    expect(usedIds).toContain("my-photo-2.jpg");
  });

  it("increments suffix for successive collisions", () => {
    const usedIds = new Set(["photo.jpg", "photo-2.jpg", "photo-3.jpg"]);
    expect(createImageId("photo.jpg", usedIds)).toBe("photo-4.jpg");
  });

  it("tracks IDs within batch so duplicates in same batch get unique IDs", () => {
    const usedIds = new Set<string>();
    expect(createImageId("image.png", usedIds)).toBe("image.png");
    expect(createImageId("image.png", usedIds)).toBe("image-2.png");
    expect(createImageId("image.png", usedIds)).toBe("image-3.png");
    expect(usedIds).toEqual(new Set(["image.png", "image-2.png", "image-3.png"]));
  });

  it("handles different files with same base name", () => {
    const usedIds = new Set<string>();
    expect(createImageId("photo.jpg", usedIds)).toBe("photo.jpg");
    expect(createImageId("photo.png", usedIds)).toBe("photo.png");
    expect(createImageId("photo.jpg", usedIds)).toBe("photo-2.jpg");
  });

  it("strips path separators", () => {
    const usedIds = new Set<string>();
    expect(createImageId("folder/photo.jpg", usedIds)).toBe("photo.jpg");
    expect(createImageId("path\\to\\image.png", usedIds)).toBe("image.png");
  });

  it("transliterates accented Latin characters", () => {
    const usedIds = new Set<string>();
    expect(createImageId("café.jpg", usedIds)).toBe("cafe.jpg");
    expect(createImageId("Déjà Vu!.png", usedIds)).toBe("deja-vu.png");
  });

  it("falls back to 'image' when filename would be empty", () => {
    expect(createImageId("....", new Set())).toBe("image");
    expect(createImageId("", new Set())).toBe("image");
  });
});
