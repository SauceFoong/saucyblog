"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Plus, Search, Calendar, Tag, MoreVertical, Edit2, Eye, LogOut, BookOpen, User } from "lucide-react"; // Added LogOut icon
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";
import { useRouter } from "next/navigation";
import { fetchAllProfiles } from "@/action/profiles";
import { isPostOwnByUser } from "@/action/posts";

export default function BlogPostsApp() {
  const [posts, setPosts] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTag, setEditTag] = useState("");
  const [user, setUser] = useState<any>(null); // State for user
  const router = useRouter();

// Fetch posts and user data
const fetchPosts = async () => {
    try {
      const supabase = createSupabaseClientSide();
  
      // Fetch blog posts
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select("*")
        .order('created', { ascending: false });
  
      if (postsError) {
        console.error("Error fetching posts:", postsError);
        return;
      }

      if (!postsData) {
        return;
      }

      // Fetch profiles
      const profilesData = await fetchAllProfiles();

      if(!profilesData) {
        const formattedPosts = postsData.map(post => ({
          ...post,
          author_name: '-',
          tag: Array.isArray(post.tag) ? post.tag : post.tag?.split(',') || []
        }));
        setPosts(formattedPosts);
     } else {
      // Create a mapping of user IDs to usernames
      const userMap = profilesData.reduce((acc, profile) => {
        acc[profile.user_id] = profile.first_name + " " + profile.last_name; // Map user_id to username
        return acc;
      }, {});

      const formattedPosts = postsData.map(post => ({
        ...post,
        author_name: userMap[post.author] || '-', // Use the userMap to find the username
        tag: Array.isArray(post.tag) ? post.tag : post.tag?.split(',') || []
      }));
      setPosts(formattedPosts);
     }
  
    } catch (error) {
      console.error("Error in fetchPosts:", error);
    }
  };
  

  // Handle user logout
  const handleLogout = async () => {
    const supabase = createSupabaseClientSide();
    await supabase.auth.signOut();
    setUser(null); // Reset user state
    router.push("/login");
  };

  const createPost = async () => {
    const tagsArray = newTag.split(",").map((tag) => tag.trim()); // Convert to array and trim spaces
    const supabase = createSupabaseClientSide();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([{ title: newTitle, description: newDescription, tag: tagsArray, created: new Date(), modified: new Date() }])
      .select();
    if (!error && data) {
      setPosts([{...data[0], author_name: user.user_metadata.display_name}, ...posts]);
      setNewTitle("");
      setNewDescription("");
      setNewTag("");
      setIsAddDialogOpen(false);
    } else {
      console.log(error.message);
    }
  };

  const deletePost = async (postId: string, author: string) => {
    const canDelete = await isPostOwnByUser(author, user.id);
    if(canDelete) {
        const supabase = createSupabaseClientSide();
        const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
        if (!error) {
          setPosts(posts.filter((post: any) => post.id !== postId));
        }
    } else {
        console.log("You have no permission to delete this post.")
    }

  };

  const openEditDialog = (post: any) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setEditTag(post.tag);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedPost(null);
    setEditTitle("");
    setEditDescription("");
    setEditTag("");
  };

  const updatePost = async () => {
    if (!selectedPost) return;
    const canEdit = await isPostOwnByUser(selectedPost.author, user.id)

    if(!canEdit) {
        console.log("You have no permission to edit this post.")     
        return;   
    }

    const tagsArray = editTag.split(",").map((tag) => tag.trim()); // Convert to array and trim spaces
    const supabase = createSupabaseClientSide();
    const { data, error } = await supabase
      .from("blog_posts")
      .update({ title: editTitle, description: editDescription, tag: tagsArray, modified: new Date() })
      .eq("id", selectedPost.id)
      .select();
    if (!error && data) {
      setPosts(posts.map((post: any) => (post.id === selectedPost.id ? data[0] : post)));
      closeEditDialog();
    } else {
      console.log(error.message);
    }
  };
  


  useEffect(() => {
    const checkUserAuth = async () => {
      const supabase = createSupabaseClientSide();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        // If the user is not authenticated, redirect to the login page
        router.push("/login");
      } else {
        // Set the user state if authenticated
        setUser(currentUser);
      }
    };

    checkUserAuth();
    fetchPosts();
  }, [router]);

  if (!user) {
    // Optionally render a loading state while checking authentication
    return <p>Loading...</p>;
  }
  
  const filteredPosts = posts.filter((post: any) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* <Link href="/" className="text-lg font-bold">My Blog</Link> */}
             <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">SaucyBlog</span>
            </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">{user.user_metadata.display_name}</span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post: any) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow relative">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {new Date(post.created).toLocaleDateString()}
                    </span>
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {post.author_name}
                    </span>
                  </div>    
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openEditDialog(post)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deletePost(post.id, post.author)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-2">{post.description}</p>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{post.tag.join(", ")}</span>
                </div>
                {/* Eye icon for linking to the blog post's details */}
                <Link href={`/posts/${post.id}`} className="absolute right-4 bottom-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-5 w-5 text-gray-600" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog for Adding Blog Post */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Post</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
                className="mb-4"
              />
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description"
                className="mb-4"
              />
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tags (comma-separated)"
              />
            </div>
            <DialogFooter>
              <Button onClick={createPost}>Add</Button>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for Editing Blog Post */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Edit title"
                className="mb-4"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Edit description"
                className="mb-4"
              />
              <Input
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                placeholder="Edit tags (comma-separated)"
              />
            </div>
            <DialogFooter>
              <Button onClick={updatePost}>Save</Button>
              <Button variant="ghost" onClick={closeEditDialog}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts found. Create one to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
