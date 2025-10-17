import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pzdhzqoetioxoegrapfe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZGh6cW9ldGlveG9lZ3JhcGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjA4OTUsImV4cCI6MjA3NjE5Njg5NX0.PA1h2OI-4vNuq_U98BoioRZPcjagC2lWbGIkLD5ElEs";

export const supabase = createClient(supabaseUrl, supabaseKey);
