"use client";

import { Button, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { FiCopy, FiEye, FiEyeOff, FiUpload } from "react-icons/fi";
import { useState } from "react";

import { useGetDocumentQuery } from "@/features/api/apiSlice";
import UploadDocumentModal from "./upload-modal";

export type EmbeddingStatus = "pending" | "processing" | "completed" | "failed";

export interface DocumentWithApiKey {
  document_id: string;

  title: string;
  description?: string | null;

  chunks_count: number;
  embedding_status: EmbeddingStatus;

  api_key: string | null;
  allowed_origin: string | null;

  usage_count: number;
  last_used_at: string | null;

  created_at: string;
  updated_at: string;
}

export default function DocumentsPage() {
  const { data, isLoading, isFetching } = useGetDocumentQuery(undefined);

  const documents: DocumentWithApiKey[] = data?.data?.documents ?? [];

  const [openUpload, setOpenUpload] = useState(false);
  const [visibleKey, setVisibleKey] = useState<string | null>(null);

  const copyKey = (key?: string | null) => {
    if (!key) {
      toast.error("API key not available");
      return;
    }
    navigator.clipboard.writeText(key);
    toast.success("API key copied");
  };

  const isBusy = isLoading || isFetching;

  return (
    <div className="p-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Documents</h1>

        <Button
          startIcon={<FiUpload />}
          onClick={() => setOpenUpload(true)}
          sx={{
            bgcolor: "var(--foreground)",
            color: "var(--background)",
            "&:hover": {
              bgcolor: "var(--foreground)",
              opacity: 0.9,
            },
          }}
        >
          Upload document
        </Button>
      </div>

      {/* Loading */}
      {isBusy && (
        <div className="flex justify-center py-20">
          <CircularProgress size={40} sx={{ color: "var(--foreground)" }} />
        </div>
      )}

      {/* Empty */}
      {!isBusy && documents.length === 0 && (
        <div className="opacity-70 text-center py-20">No documents found</div>
      )}

      {/* List */}
      {!isBusy && (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className="border border-white/10 rounded-xl p-5"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-sm opacity-70">{doc.description}</p>
                  )}
                </div>

                <span className="text-xs opacity-60">
                  {doc.embedding_status}
                </span>
              </div>

              <div className="mt-4 text-sm space-y-2">
                <p>Chunks: {doc.chunks_count}</p>
                <p>Usage count: {doc.usage_count}</p>
                <p>Allowed origin: {doc.allowed_origin ?? "-"}</p>

                <div className="flex items-center gap-2">
                  <span>API Key:</span>

                  <code className="bg-white/10 px-2 py-1 rounded">
                    {visibleKey === doc.document_id
                      ? (doc.api_key ?? "N/A")
                      : "••••••••••••••••••••"}
                  </code>

                  <button
                    onClick={() =>
                      setVisibleKey(
                        visibleKey === doc.document_id ? null : doc.document_id,
                      )
                    }
                  >
                    {visibleKey === doc.document_id ? <FiEyeOff /> : <FiEye />}
                  </button>

                  <button onClick={() => copyKey(doc.api_key)}>
                    <FiCopy />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadDocumentModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
      />
    </div>
  );
}
