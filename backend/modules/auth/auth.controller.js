const { supabase } = require("../../config/supabase");

const login = async (req, res) => {
  try {
    // CCTV 1: Cek apakah data dari Postman benar-benar masuk
    console.log(">>> 1. Menerima request login:", req.body); 

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
    }

    // Membersihkan spasi gaib di awal/akhir teks
    email = email.trim(); 
    password = password.trim();

    console.log(`>>> 2. Mencari email persis seperti ini: '${email}' di database...`);

    const { data, error } = await supabase
      .from("users")
      .select("id, email, password")
      .eq("email", email)
      .single();

    // CCTV 2: Cek apa kata Supabase! (Ini yang paling penting)
    if (error) {
      console.log(">>> 3. ERROR DARI SUPABASE:", error); 
    } else {
      console.log(">>> 3. DATA DITEMUKAN:", data);
    }

    if (error || !data) {
      // Sekarang error aslinya akan tampil di Postman!
      return res.status(401).json({ 
        success: false, 
        message: "Email tidak ditemukan.",
        bocoranError: error 
      });
    }

    if (data.password !== password) {
      return res.status(401).json({ success: false, message: "Password salah." });
    }

    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      user: { id: data.id, email: data.email },
    });
  } catch (error) {
    console.error("Login error fatal:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
    }

    // MEMASUKKAN PENGGUNA BARU KE DATABASE
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password }])
      .select("id, email")
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: "Gagal mendaftar. Email mungkin sudah terpakai." });
    }

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil!",
      user: data,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { login, register };