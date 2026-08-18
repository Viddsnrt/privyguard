const { supabase } = require("../../config/supabase");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =====================================================
   FUNGSI CEK LINK SCAM MENGGUNAKAN AI
===================================================== */
const checkScamLink = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = 1; // Sementara hardcoded, nanti ambil dari JWT token

    if (!url) {
      return res.status(400).json({ success: false, message: "URL diperlukan." });
    }

    // Validasi format URL dasar
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Format URL tidak valid." });
    }

    // Panggil Gemini AI
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-001",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Sebagai ahli keamanan siber, analisis URL berikut untuk menentukan apakah ini link scam/phishing/malware atau aman.
    URL: "${url}"

    Pertimbangkan indikator berikut:
    1. Typosquatting (domain mirip brand terkenal tapi salah ketik, misal: paypa1.com, faceb00k.com)
    2. TLD mencurigakan (misal: .xyz, .top, .click dengan kombinasi kata random)
    3. Penggunaan IP address mentah sebagai domain
    4. Subdomain berlebihan yang mencurigakan
    5. Pola URL shortener yang sering disalahgunakan

    Kembalikan HANYA JSON dengan struktur persis seperti ini:
    {
      "is_scam": boolean,
      "risk_score": number (0-100, di mana 100 = sangat berbahaya, 0 = sangat aman),
      "risk_level": "CRITICAL | HIGH | MEDIUM | LOW",
      "explanation": "string (Alasan singkat mengapa dianggap scam atau aman dalam bahasa Indonesia)"
    }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const aiResult = JSON.parse(responseText);

    // Simpan hasil ke Supabase
    const { data, error } = await supabase
      .from("scam_checks")
      .insert([{
        user_id: userId,
        input_type: "URL",
        input_value: url,
        is_scam: aiResult.is_scam,
        risk_score: aiResult.risk_score,
        ai_explanation: aiResult.explanation
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      data: {
        ...data,
        risk_level: aiResult.risk_level // Kirim level risiko ke frontend
      } 
    });

  } catch (error) {
    console.error("Scam Link Check Error:", error);
    return res.status(500).json({ success: false, message: "Gagal memeriksa link." });
  }
};

module.exports = { checkScamLink };