"use client";

import { Controller, useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUserLoginMutation } from "@/features/api/apiSlice";
import type { ApiErrorResponse } from "@/features/api/apiSlice";

interface SigninForm {
  email: string;
  password: string;
}

export default function SigninPage() {
  const router = useRouter();
  const [login] = useUserLoginMutation();
  const { control, handleSubmit } = useForm<SigninForm>();

  const onSubmit = async (form: SigninForm) => {
    try {
      await login(form).unwrap();
      toast.success("Login successful");
      router.push("/documents");
    } catch (err: unknown) {
      const error = err as Partial<ApiErrorResponse> | Error;
      const message =
        error instanceof Error
          ? error.message
          : (error.data?.error ?? "Login failed");
      toast.error(message);
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center"
      sx={{ background: "var(--background)", color: "var(--foreground)" }}
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
          Sign in
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
            sx={{
              mt: 3,
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.85)",
              },
            }}
          >
            Sign in
          </Button>
        </form>

        <Typography mt={3} textAlign="center" sx={{ opacity: 0.8 }}>
          Don’t have an account?{" "}
          <Link href="/signup" underline="hover" color="inherit">
            Create one
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
