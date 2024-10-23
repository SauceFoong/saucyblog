"use server";
import { createSupabaseReqRes } from "@/lib/supabase/supabase-req-res";

export const fetchAllProfiles = async () => {
    try {
        const supabase = createSupabaseReqRes();
        const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name"); // Select only necessary fields

        if (profilesError) {
            console.error("Error fetching all profiles:", profilesError.message);
            return null;  // Return null if there's an error
        }

        return profilesData;

    } catch (err) {
        console.error("Unexpected error:", err);
        return null;
    }
}
