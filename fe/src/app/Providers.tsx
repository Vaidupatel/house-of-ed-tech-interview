"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { store } from "../store";
import { PermissionProvider } from "./providers/PermissionProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} />
      <PermissionProvider>{children}</PermissionProvider>
    </Provider>
  );
}
