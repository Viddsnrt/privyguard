const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL belum ditemukan di file .env");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY belum ditemukan di file .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };