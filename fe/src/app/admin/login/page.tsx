"use client";

import { Controller, useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAdminLoginMutation } from "@/features/api/apiSlice";
import type { ApiErrorResponse } from "@/features/api/apiSlice";

interface AdminLoginForm {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useAdminLoginMutation();

  const { control, handleSubmit } = useForm<AdminLoginForm>();

  const onSubmit = async (form: AdminLoginForm) => {
    try {
      await login(form).unwrap();
      toast.success("Admin login successful");
      router.push("/admin");
    } catch (err: unknown) {
      const error = err as Partial<ApiErrorResponse> | Error;

      const message =
        error instanceof Error
          ? error.message
          : (error.data?.message ?? "Login failed");

      toast.error(message);
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center"
      sx={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Box
        className="w-full max-w-md p-8 rounded-xl"
        sx={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography variant="h5" mb={3}>
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                margin="normal"
                InputLabelProps={{ style: { color: "var(--foreground)" } }}
                sx={{
                  input: { color: "var(--foreground)" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.4)",
                    },
                  },
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                InputLabelProps={{ style: { color: "var(--foreground)" } }}
                sx={{
                  input: { color: "var(--foreground)" },
                  "& .MuiOutlinedInput-root fieldset": {
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                }}
              />
            )}
          />

          <Button
            fullWidth
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 3,
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.85)",
              },
            }}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
