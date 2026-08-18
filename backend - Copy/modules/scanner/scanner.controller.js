const { supabase } = require("../../config/supabase");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =====================================================
   1. POLA DATA SENSITIF & BERBAHAYA
===================================================== */
const PATTERNS = {
  nik: { 
    label: "Nomor Induk Kependudukan (NIK) / KTP", 
    severity: "CRITICAL", 
    description: "Identitas resmi kewarganegaraan yang rentan disalahgunakan untuk pinjaman online atau penipuan identitas.",
    regex: /\b\d{16}\b/g 
  },
  passport: { 
    label: "Nomor Paspor", 
    severity: "CRITICAL", 
    description: "Dokumen identitas perjalanan internasional yang sangat kritikal jika bocor.",
    regex: /\b[A-Z]{1,2}\d{6,7}\b/g 
  },
  npwp: { 
    label: "Nomor Pokok Wajib Pajak (NPWP)", 
    severity: "CRITICAL", 
    description: "Data perpajakan pribadi atau badan usaha yang bersifat rahasia.",
    regex: /\b\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}\b/g 
  },
  creditCard: { 
    label: "Nomor Kartu Kredit / Debit", 
    severity: "CRITICAL", 
    description: "Informasi finansial mentah yang membuka celah akses langsung ke rekening bank atau pencurian dana.",
    regex: /\b(?:\d[ -]*?){13,19}\b/g 
  },
  apiKey: { 
    label: "Kunci API (API Keys)", 
    severity: "CRITICAL", 
    description: "Kredensial autentikasi sistem atau akun digital yang memberikan akses penuh bagi peretas.",
    regex: /\b(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z\-_]{35}|sk-[A-Za-z0-9]{48})\b/g 
  },
  password: { 
    label: "Kata Sandi (Passwords)", 
    severity: "HIGH", 
    description: "Kredensial autentikasi sistem atau akun digital yang memberikan akses penuh bagi peretas.",
    regex: /(?:password|passwd|pwd|kata sandi)\s*[:=]\s*["']?[^\s"']+/gi 
  },
  email: { 
    label: "Alamat Email Pribadi", 
    severity: "HIGH", 
    description: "Titik masuk utama untuk pemulihan akun digital dan target empuk peretasan kredensial.",
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g 
  },
  phone: { 
    label: "Nomor Telepon Seluler Pribadi", 
    severity: "HIGH", 
    description: "Kontak langsung yang sering menjadi target serangan social engineering, phishing, atau spam masif.",
    regex: /(?:\+62|62|0)[8-9][0-9]{7,12}/g 
  },
  address: { 
    label: "Alamat Rumah / Domisili Lengkap", 
    severity: "HIGH", 
    description: "Informasi lokasi fisik yang berisiko mengancam keamanan personal atau properti.",
    regex: /\b(?:Jl\.|Jalan|Dusun|RT\.?\s*\d+|RW\.?\s*\d+|Kelurahan|Kecamatan)\b[^\n.]+/gi 
  },
  medical: { 
    label: "Riwayat Medis & Kondisi Kesehatan", 
    severity: "CRITICAL", 
    description: "Catatan diagnosis, resep obat, atau informasi kesehatan pribadi yang dilindungi undang-undang privasi.",
    regex: /\b(?:diagnosa|rekam medis|tekanan darah|gula darah|asuransi kesehatan)\b[^\n.]+/gi 
  },
  salary: { 
    label: "Data Gaji & Slip Pembayaran (Payroll)", 
    severity: "HIGH", 
    description: "Informasi kompensasi finansial karyawan yang bersifat rahasia internal.",
    regex: /(?:gaji|salary|slip gaji|tunjangan)\s*[:=]?\s*Rp\.?\s*\d+(?:\.\d{3})*/gi 
  },
  ipAddress: { 
    label: "Alamat IP (IP Address) & Metadata Perangkat", 
    severity: "MEDIUM", 
    description: "Data teknis jaringan yang dapat melacak lokasi atau celah sistem operasional pengguna.",
    regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g 
  }
};

const SEVERITY_WEIGHT = { CRITICAL: 25, HIGH: 15, MEDIUM: 8, LOW: 3 };

/* =====================================================
   2. EKSTRAKSI TEKS
===================================================== */
async function extractText(file) {
  if (!file || !file.buffer) return "";
  const mimeType = file.mimetype;

  try {
    if (mimeType === "text/plain" || mimeType === "text/csv" || mimeType === "application/json") {
      return file.buffer.toString("utf-8");
    }
    if (mimeType === "application/pdf") {
      const pdfData = await pdfParse(file.buffer);
      return pdfData.text;
    }
    if (mimeType.includes("word") || mimeType.includes("officedocument.wordprocessingml")) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }
    if (mimeType.startsWith("image/")) {
      console.log("Memulai OCR Gambar, mohon tunggu...");
      const { data: { text } } = await Tesseract.recognize(file.buffer, 'eng+ind');
      return text;
    }
    return "";
  } catch (error) {
    console.error("Error ekstraksi teks:", error);
    return "";
  }
}

/* =====================================================
   3. DETEKSI & SKOR
===================================================== */
function detectSensitiveData(text) {
  const findings = [];
  for (const [key, pattern] of Object.entries(PATTERNS)) {
    const matches = text.match(pattern.regex);
    if (!matches || matches.length === 0) continue;
    findings.push({ 
      type: key, 
      label: pattern.label, 
      count: [...new Set(matches)].length, 
      severity: pattern.severity,
      description: pattern.description 
    });
  }
  return findings;
}

function calculateScore(findings) {
  if (findings.length === 0) return 100;
  let risk = 0;
  findings.forEach(f => risk += (SEVERITY_WEIGHT[f.severity] || 1) * f.count);
  risk = Math.min(risk, 100);
  return Math.max(0, 100 - risk);
}

/* =====================================================
   4. GEMINI AI ANALYSIS
===================================================== */
async function analyzeWithGemini(findings) {
  if (findings.length === 0) {
    return "Dokumen terlihat aman. Tidak ada indikasi data sensitif yang terdeteksi oleh sistem kami.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const labels = findings.map(f => `${f.label} (Severitas: ${f.severity})`).join(", ");
    const prompt = `Sebagai ahli keamanan siber, berikan 1 paragraf singkat (maksimal 3 kalimat) berupa peringatan dan saran tindakan mengenai dokumen yang baru saja dipindai. Dokumen ini terdeteksi mengandung data sensitif berikut: ${labels}. Gunakan bahasa Indonesia yang profesional namun mudah dipahami.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Peringatan: Dokumen ini mengandung data sensitif. Disarankan untuk segera melakukan sensor sebelum dibagikan.";
  }
}

/* =====================================================
   5. CONTROLLER ENDPOINTS
===================================================== */
const scanFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah." });

    const userId = 1; 
    const text = await extractText(file);
    
    // LOGGING PENTING: Lihat teks yang berhasil diekstrak di terminal backend
    console.log(`[DEBUG] Teks yang diekstrak dari ${file.originalname}:\n`, text.substring(0, 500), "\n--------------------");

    const findings = detectSensitiveData(text);
    const score = calculateScore(findings);
    const explanation = await analyzeWithGemini(findings);

    const { data, error } = await supabase
      .from("privacy_scanner")
      .insert([{
        user_id: userId,
        file_name: file.originalname,
        file_type: file.mimetype,
        file_size: `${(file.size / 1024).toFixed(2)} KB`,
        original_file_url: "local-memory",
        masked_file_url: null,
        risk_score: score,
        detected_info: { items: findings },
        ai_explanation: explanation
      }])
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Scan error:", error);
    return res.status(500).json({ success: false, message: "Gagal memindai dokumen." });
  }
};

const getHistory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("privacy_scanner")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Get history error:", error);
    return res.status(500).json({ success: false, message: "Gagal mengambil riwayat." });
  }
};

module.exports = { scanFile, getHistory };