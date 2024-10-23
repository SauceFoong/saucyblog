"use server";
import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";
import { revalidatePath } from "next/cache";

export const fetchTasks = async () => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("notes").select("*");
  if (!error) return data;
  else return [];
};

export const fetchTask = async (id: string) => {
  const supabase = createSupabaseReqRes();
  let { data, error } = await supabase.from("notes").select("*").eq("id", id);
  if (!error && data && data.length > 0) return data[0];
  else return null;
};

export const createTask = async (formData: any) => {
    const supabase = createSupabaseReqRes();
    let { data, error } = await supabase
      .from("notes")
      .insert([{ text: formData.get("text") }])
      .select();
    if (!error) {
      revalidatePath("/notes");
    } else {
      console.error("Error inserting task:", error);
    }
  };

  export const updateTask = async (id: string, formData: any) => {
    const supabase = createSupabaseReqRes();
    
    let { data, error } = await supabase
      .from("notes")
      .update({ text: formData.get("text") }) // Update the "text" column
      .eq("id", id) // Match the record with the given id
      .select();
  
    if (!error) {
      revalidatePath("/notes"); // Revalidate the cache to reflect the changes
      return data; // Optionally, return the updated data
    } else {
      console.error("Error updating task:", error); // Log any errors
      return null; // Return null if an error occurs
    }
  };

  export const deleteNote = async (id: string) => {
    const supabase = createSupabaseReqRes();

    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
        console.log("Unable to delete note");
    }
  };
  
  