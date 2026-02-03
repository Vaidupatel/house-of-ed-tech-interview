"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import toast from "react-hot-toast";
import { FiLogOut, FiUser } from "react-icons/fi";

import {
  ApiErrorResponse,
  useGetUserProfileQuery,
  useUserLogoutMutation,
} from "@/features/api/apiSlice";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "@/features/Auth/AuthSlice";

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetUserProfileQuery(undefined);
  const [logout, { isLoading: isLoggingOut }] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(clearAuth());
      toast.success("Logged out");
      router.push("/signin");
    } catch (err: unknown) {
      const error = err as Partial<ApiErrorResponse> | Error;
      toast.error(
        error instanceof Error
          ? error.message
          : (error.data?.error ?? "Logout failed"),
      );
    }
  };

  const user = data?.data?.user;

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header
        className="w-full border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left */}
          <div
            className="font-semibold text-lg cursor-pointer"
            onClick={() => router.push("/")}
          >
            RAG Platform
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            {isLoading ? (
              <span className="opacity-60 text-sm">Loading…</span>
            ) : user ? (
              <div className="flex items-center gap-2 text-sm opacity-90">
                <FiUser />
                <span>{user.name}</span>
              </div>
            ) : null}

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
