import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./useCopyToClipboard";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../helpers/copyToClipboard", () => ({
  copyToClipboard: vi.fn(),
}));

const { normalizeWhitespaceInQuotesMock } = vi.hoisted(() => ({
  normalizeWhitespaceInQuotesMock: vi.fn((t: string) => t),
}));

vi.mock("../helpers/normalizeWhitespaceInQuotes", () => ({
  normalizeWhitespaceInQuotes: (t: string) => normalizeWhitespaceInQuotesMock(t),
}));

const toast = await import("react-hot-toast").then((m) => m.default);
const { copyToClipboard } = await import("../helpers/copyToClipboard");

describe("useCopyToClipboard", () => {
  afterEach(() => {
    vi.mocked(copyToClipboard).mockReset();
    normalizeWhitespaceInQuotesMock.mockImplementation((t: string) => t);
  });

  it("returns onCopy function", () => {
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result } = renderHook(() => useCopyToClipboard("text"));

    expect(result.current.onCopy).toBeTypeOf("function");
  });

  it("calls toast.success when copy succeeds", async () => {
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result } = renderHook(() => useCopyToClipboard("text"));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(toast.success).toHaveBeenCalledWith("Code copied to clipboard");
  });

  it("calls toast.error when copy fails", async () => {
    vi.mocked(copyToClipboard).mockResolvedValue(false);

    const { result } = renderHook(() => useCopyToClipboard("text"));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to copy to clipboard");
  });

  it("passes normalized text to copyToClipboard", async () => {
    normalizeWhitespaceInQuotesMock.mockImplementation((t) => `normalized:${t}`);
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result } = renderHook(() => useCopyToClipboard("  raw  text  "));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(copyToClipboard).toHaveBeenCalledWith("normalized:  raw  text  ");
  });
});
