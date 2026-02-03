"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useUploadDocumentMutation } from "@/features/api/apiSlice";
import type { ApiErrorResponse } from "@/features/api/apiSlice";

interface FormValues {
  title: string;
  description: string;
  allowed_origin: string;
  document: FileList;
}

export default function UploadDocumentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      allowed_origin: "*",
    },
  });

  const [upload, { isLoading }] = useUploadDocumentMutation();

  const onSubmit = async (form: FormValues) => {
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("allowed_origin", form.allowed_origin);
      fd.append("document", form.document[0]);

      await upload(fd).unwrap();
      toast.success("Document uploaded");

      reset();
      onClose();
    } catch (err: unknown) {
      const error = err as Partial<ApiErrorResponse> | Error;
      toast.error(
        error instanceof Error
          ? error.message
          : (error.data?.error ?? "Upload failed"),
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload document</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Title" />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Description" />
            )}
          />

          <Controller
            name="allowed_origin"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Allowed origin" />
            )}
          />

          <Controller
            name="document"
            control={control}
            render={({ field }) => (
              <TextField
                type="file"
                fullWidth
                inputProps={{ accept: ".txt" }}
                onChange={(e) => field.onChange((e.target as HTMLInputElement).files)}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress
                  size={18}
                  sx={{ color: "var(--foreground)" }}
                />
              ) : null
            }
          >
            Upload
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
