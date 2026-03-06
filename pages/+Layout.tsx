import type { PropsWithChildren } from "react";
import { AppContext } from "../src/AppContext";
import { ToasterInPopover } from "../src/components/ToasterInPopover/ToasterInPopover";
import SharedLayout from "../src/pages/Layout";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ToasterInPopover />
      <AppContext>
        <SharedLayout>{children}</SharedLayout>
      </AppContext>
    </>
  );
}
