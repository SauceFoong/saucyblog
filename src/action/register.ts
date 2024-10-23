"use server";
import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";

// Check if the username exists in the profiles table
export const isUsernameExist = async (username: string) => {
  try {
    const supabase = createSupabaseReqRes();
    let { data, error } = await supabase
      .from("profiles")
      .select("id, username")  // Select only necessary fields
      .eq("username", username)
      .limit(1); // Fetch at most one record

    if (error) {
      console.error("Error checking username existence:", error);
      return null;  // Return null if there's an error
    }

    // Return true if a user with the given username exists, otherwise false
    return data && data.length > 0;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};
