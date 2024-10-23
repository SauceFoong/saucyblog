import { fetchPost } from "@/action/posts";
import { fetchPostAuthorProfile } from "@/action/posts";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Import an icon for back navigation
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  const authorProfile = await fetchPostAuthorProfile(post.author);

  // If post is not found, return a message
  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-700">Blog post not found</h1>
      </div>
    );
  }else {
    console.log(post)
    console.log(authorProfile)

  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <Link href="/posts">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2" />
          Back to Blog Posts
        </Button>
      </Link>

      {/* Blog Post Content */}
      <Card className="w-full max-w-3xl bg-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title || "Untitled Post"}</h1>
          <p className="text-gray-700 mb-6">{post.description}</p>
          {post.tag && post.tag.length > 0 && (
            <div className="mb-4">
              {post.tag.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        <div className="mt-4 text-gray-500 text-sm">
            <div>Author: {authorProfile.first_name} {authorProfile.last_name}</div>
            <div>Created on: {new Date(post.created).toLocaleString()}</div>
            <div>Last modified: {new Date(post.modified).toLocaleString()}</div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
