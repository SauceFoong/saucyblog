import { fetchTask } from "@/action/notes";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Import an icon for back navigation
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  const note = await fetchTask(params.slug);

  // If note is not found, return a message
  if (!note) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-700">Note not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <Link href="/notes">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2" />
          Back to Notes
        </Button>
      </Link>

      {/* Note Content */}
      <Card className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{note.title || "Untitled Note"}</h1>
          <p className="text-gray-700 mb-4">{note.text}</p>
          {note.tag && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              #{note.tag}
            </span>
          )}
          <div className="mt-4">
            <span className="text-gray-500 text-sm">
              Created on: {new Date(note.created_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
