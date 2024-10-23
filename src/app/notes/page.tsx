"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Plus, Search, Calendar, Tag, MoreVertical, Edit2 } from "lucide-react";
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
import { Eye } from 'lucide-react'; // Import Eye icon

export default function NotesApp() {
  const [notes, setNotes] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteTag, setNewNoteTag] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [editText, setEditText] = useState("");
  const [editTag, setEditTag] = useState("");

  const fetch = async () => {
    const supabase = createSupabaseClientSide();
    let { data, error } = await supabase.from("notes").select("*");
    if (!error) setNotes(data);
  };

  const createNote = async () => {
    const supabase = createSupabaseClientSide();
    const { data, error } = await supabase
      .from("notes")
      .insert([{ text: newNoteText, tag: newNoteTag }])
      .select();
    if (!error && data) {
      setNotes([...notes, data[0]]);
      setNewNoteText("");
      setNewNoteTag("");
      setIsAddDialogOpen(false);
    }
  };

  const deleteNote = async (id: string) => {
    const supabase = createSupabaseClientSide();
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) {
      setNotes(notes.filter((note: any) => note.id !== id));
    }
  };

  const openEditDialog = (note: any) => {
    setSelectedNote(note);
    setEditText(note.text);
    setEditTag(note.tag);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedNote(null);
    setEditText("");
    setEditTag("");
  };

  const updateNote = async () => {
    if (!selectedNote) return;
    const supabase = createSupabaseClientSide();
    const { data, error } = await supabase
      .from("notes")
      .update({ text: editText, tag: editTag })
      .eq("id", selectedNote.id)
      .select();
    if (!error && data) {
      setNotes(notes.map((note: any) => (note.id === selectedNote.id ? data[0] : note)));
      closeEditDialog();
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const filteredNotes = notes.filter((note: any) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note: any) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow relative">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openEditDialog(note)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteNote(note.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-gray-700 mb-2">{note.text}</p>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{note.tag}</span>
                </div>
                
                {/* Eye icon for linking to the note's details */}
                <Link href={`/notes/${note.id}`} className="absolute right-4 bottom-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-5 w-5 text-gray-600" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Dialog for Adding Note */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Note text"
                className="mb-4"
              />
              <Input
                value={newNoteTag}
                onChange={(e) => setNewNoteTag(e.target.value)}
                placeholder="Tag"
              />
            </div>
            <DialogFooter>
              <Button onClick={createNote}>Add</Button>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for Editing Note */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit note text"
                className="mb-4"
              />
              <Input
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                placeholder="Edit tag"
              />
            </div>
            <DialogFooter>
              <Button onClick={updateNote}>Save</Button>
              <Button variant="ghost" onClick={closeEditDialog}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notes found. Create one to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
