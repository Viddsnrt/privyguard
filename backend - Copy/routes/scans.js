const express = require("express");
const router = express.Router();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Warning: Supabase environment variables are missing."
  );
}

const supabase = createClient(
  supabaseUrl || "",
  supabaseKey || ""
);

/**
 * GET /api/scans
 *
 * Mengambil daftar riwayat privacy scan.
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(
      Number(req.query.limit) || 20,
      100
    );

    const { data, error } = await supabase
      .from("scans")
      .select(`
        id,
        file_name,
        file_type,
        file_size,
        privacy_score,
        risk_level,
        total_findings,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      })
      .limit(limit);

    if (error) {
      console.error(
        "Supabase GET /api/scans error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to retrieve scan history.",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "GET /api/scans error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;