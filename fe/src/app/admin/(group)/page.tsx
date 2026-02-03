"use client";

import { useAdminGetDocumentQuery } from "@/features/api/apiSlice";
import { format } from "date-fns";
import { useMemo } from "react";

export interface Document {
  title: string;
  description: string;
  chunks_count: number;
  embedding_status: string;
  document_id: string;
  api_key: string;
  allowed_origin: string;
  usage_count: number;
  user: {
    user_id: string;
    name: string;
    email: string;
    is_active: boolean;
    last_login_at: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const { data, isLoading, isError } = useAdminGetDocumentQuery(undefined);

  const documents: Document[] = useMemo(
    () => data?.data?.documents || [],
    [data?.data?.documents],
  );

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>
      <p className="text-gray-500 mt-2 mb-6">
        Manage users, documents, and API keys.
      </p>

      {isLoading && <p className="text-gray-400">Loading documents...</p>}

      {isError && <p className="text-red-500">Failed to fetch documents.</p>}

      {documents?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 rounded-lg">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Chunks
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  API Key
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Allowed Origin
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Usage Count
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  User
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.map((doc) => (
                <tr
                  key={doc.document_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2">{doc.title}</td>
                  <td className="px-4 py-2">{doc.description || "-"}</td>
                  <td className="px-4 py-2">{doc.chunks_count}</td>
                  <td className="px-4 py-2 capitalize">
                    {doc.embedding_status}
                  </td>
                  <td className="px-4 py-2 break-all">{doc.api_key}</td>
                  <td className="px-4 py-2">{doc.allowed_origin}</td>
                  <td className="px-4 py-2">{doc.usage_count}</td>
                  <td className="px-4 py-2">
                    <p className="font-medium">{doc.user.name}</p>
                    <p className="text-sm text-gray-500">{doc.user.email}</p>
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(doc.created_at), "dd MMM yyyy HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p className="text-gray-400">No documents found.</p>
      )}
    </div>
  );
}
