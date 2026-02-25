import { useCallback } from "react";
import toast from "react-hot-toast";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { normalizeWhitespaceInQuotes } from "../helpers/normalizeWhitespaceInQuotes";

export function useCopyToClipboard(text: string): { onCopy: () => Promise<void> } {
  const onCopy = useCallback(async () => {
    const textToCopy = normalizeWhitespaceInQuotes(text);
    const success = await copyToClipboard(textToCopy);

    if (!success) {
      toast.error("Failed to copy to clipboard");
      return;
    }

    toast.success("Code copied to clipboard");
  }, [text]);

  return { onCopy };
}
