"use server";
import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";
import { revalidatePath } from "next/cache";

// Fetch all blog posts
export const fetchPosts = async () => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("blog_posts").select("*");
  if (!error) return data;
  else return [];
};

// Fetch a single blog post by ID
export const fetchPost = async (id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("blog_posts").select("*").eq("id", id);
  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const fetchPostAuthorProfile = async (id: string) => {
    const supabase = createSupabaseReqRes();
    let { data, error } = await supabase.from("profiles").select("*").eq("user_id", id);
    if (!error && data && data.length > 0) return data[0];
    else return null;
};

// Create a new blog post
export const createPost = async (formData: any) => {
  const supabase = createSupabaseReqRes();
  const title = formData.get("title");
  const description = formData.get("description");
  const tags = formData.get("tags") ? formData.get("tags").split(",").map((tag: string) => tag.trim()) : [];

  let { data, error } = await supabase
    .from("blog_posts")
    .insert([{ title, description, tag: tags }])
    .select();
  
  if (!error) {
    revalidatePath("/posts"); // Revalidate to update the cache
  } else {
    console.error("Error creating post:", error);
  }
};

// Update an existing blog post
export const updatePost = async (id: string, formData: any) => {
  const supabase = createSupabaseReqRes();
  const title = formData.get("title");
  const description = formData.get("description");
  const tags = formData.get("tags") ? formData.get("tags").split(",").map((tag: string) => tag.trim()) : [];

  let { data, error } = await supabase
    .from("blog_posts")
    .update({ title, description, tag: tags }) // Update the specified fields
    .eq("id", id)
    .select();

  if (!error) {
    revalidatePath("/posts");
    return data;
  } else {
    console.error("Error updating post:", error);
    return null;
  }
};

// Delete a blog post
export const deletePost = async (id: string) => {
  const supabase = createSupabaseReqRes();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("Unable to delete post:", error);
  }
};

export const isPostOwnByUser = async (author: string, userId: string) => {
    return author == userId;
}
