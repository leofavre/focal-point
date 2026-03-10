import type { PropsWithChildren } from "react";
import { ToasterInPopover } from "@/components/ToasterInPopover/ToasterInPopover";
import { UploadBackdropProvider } from "@/components/UploadBackdrop/UploadBackdropContext";
import { AppContextProvider } from "@/src/AppContext";
import { IndexedDBServiceRoot } from "@/src/services/IndexedDBServiceRoot";
import SharedLayout from "./(layout)/Layout";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ToasterInPopover />
      <IndexedDBServiceRoot>
        <AppContextProvider>
          <UploadBackdropProvider>
            <SharedLayout>{children}</SharedLayout>
          </UploadBackdropProvider>
        </AppContextProvider>
      </IndexedDBServiceRoot>
    </>
  );
}
