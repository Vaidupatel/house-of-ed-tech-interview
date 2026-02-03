"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

import {
  useGetAdminProfileQuery,
  useAdminLogoutMutation,
} from "@/features/api/apiSlice";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const { data, isLoading } = useGetAdminProfileQuery(undefined);
  const [logout, { isLoading: isLoggingOut }] = useAdminLogoutMutation();

  const admin = data?.data?.admin;

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      toast.success("Logged out");
      router.push("/admin/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Navbar */}
      <header
        className="w-full flex items-center justify-between px-6 py-4 border-b"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex flex-col">
          <span className="text-lg font-semibold">Admin Panel</span>
          <span className="text-sm opacity-70">{admin?.email}</span>
        </div>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.85)",
            },
          }}
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </Button>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
