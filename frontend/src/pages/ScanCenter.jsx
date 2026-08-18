import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ScanCenter = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    document.title = "Scan Center - PrivyGuard";
  }, []);

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [
      ".pdf", ".jpg", ".jpeg", ".png", ".txt", ".doc", ".docx",
    ];

    const extension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      alert("File tidak didukung. Gunakan PDF, JPG, PNG, DOC, DOCX, atau TXT.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // PERUBAHAN UTAMA: Fetch ke Backend
  const handleScan = async () => {
    if (!selectedFile) {
      alert("Silakan pilih dokumen terlebih dahulu.");
      return;
    }

    setIsScanning(true);

    // Buat FormData dan append file dengan key "file"
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // const response = await fetch("http://localhost:5000/api/scanner", {
      const response = await fetch(`${API_BASE_URL}/api/scanner`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Navigasi ke /scan-result membawa data dari backend
        navigate("/scan-result", { state: { scanData: result.data } });
      } else {
        alert(result.message || "Gagal melakukan scan dokumen.");
      }
    } catch (error) {
      console.error("Scan Error:", error);
      alert("Terjadi kesalahan koneksi saat menghubungi server.");
    } finally {
      setIsScanning(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  return (
    <div className="privy-scan-page">
      <style>{`
        /* (CSS tetap sama persis seperti milikmu untuk menjaga UI-nya) */
        * { box-sizing: border-box; }
        .privy-scan-page {
          min-height: 100vh;
          background: radial-gradient(circle at 80% 0%, rgba(49, 213, 237, 0.055), transparent 30%), #060910;
          color: #f4f8fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .privy-scan-header {
          height: 92px; padding: 0 42px; border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(5,8,14,0.86); backdrop-filter: blur(18px);
        }
        .privy-scan-header-left { display: flex; align-items: center; gap: 15px; }
        .privy-scan-back {
          width: 40px; height: 40px; border-radius: 11px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025); color: #8294a7; display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: 0.2s ease;
        }
        .privy-scan-back:hover { color: #55dceb; border-color: rgba(85,220,235,0.25); }
        .privy-scan-breadcrumb { color: #5e7185; font-size: 10px; margin-bottom: 5px; }
        .privy-scan-breadcrumb span { color: #354657; margin: 0 6px; }
        .privy-scan-title { margin: 0; font-size: 19px; font-weight: 650; letter-spacing: -0.025em; }
        .privy-scan-protection {
          display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 999px;
          border: 1px solid rgba(83,227,193,0.22); background: rgba(83,227,193,0.035); color: #55dfc0; font-size: 11px;
        }
        .privy-scan-protection-dot { width: 7px; height: 7px; border-radius: 50%; background: #55dfc0; box-shadow: 0 0 12px rgba(85,223,192,0.75); }
        .privy-scan-main { width: min(1100px, calc(100% - 48px)); margin: 0 auto; padding: 55px 0 80px; }
        .privy-scan-kicker { color: #4dd8ea; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; margin-bottom: 10px; }
        .privy-scan-heading { margin: 0; font-size: 40px; line-height: 1.1; letter-spacing: -0.045em; font-weight: 700; }
        .privy-scan-heading-accent { color: #4edbea; }
        .privy-scan-description { color: #687b90; font-size: 13px; line-height: 1.7; max-width: 680px; margin: 14px 0 0; }
        .privy-scan-card {
          margin-top: 32px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.075);
          background: linear-gradient(145deg, rgba(16,22,31,0.92), rgba(7,11,17,0.98)); overflow: hidden;
        }
        .privy-scan-dropzone {
          min-height: 365px; padding: 42px; display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; border: 1px dashed rgba(91,215,235,0.16); margin: 16px;
          border-radius: 14px; transition: 0.2s ease;
        }
        .privy-scan-dropzone.active { border-color: rgba(78,219,234,0.55); background: rgba(78,219,234,0.035); }
        .privy-scan-dropzone.has-file { border-style: solid; border-color: rgba(78,219,234,0.16); }
        .privy-scan-upload-icon {
          width: 66px; height: 66px; border-radius: 18px; display: flex; align-items: center; justify-content: center;
          color: #4dd8ea; border: 1px solid rgba(78,216,234,0.16); background: rgba(78,216,234,0.055); margin-bottom: 20px;
        }
        .privy-scan-drop-title { font-size: 17px; font-weight: 650; margin: 0; }
        .privy-scan-drop-description { color: #627589; font-size: 11px; margin: 9px 0 20px; }
        .privy-scan-choose {
          height: 42px; padding: 0 17px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.035); color: #d8e1e8; font-size: 11px; font-weight: 600; cursor: pointer; transition: 0.2s ease;
        }
        .privy-scan-choose:hover { border-color: rgba(78,216,234,0.28); color: #53dceb; }
        .privy-scan-formats { margin-top: 14px; color: #3e5266; font-size: 8px; letter-spacing: 0.12em; }
        .privy-scan-selected {
          width: min(520px, 100%); padding: 19px; border-radius: 14px; border: 1px solid rgba(78,216,234,0.14);
          background: rgba(78,216,234,0.035); display: flex; align-items: center; gap: 13px; text-align: left;
        }
        .privy-scan-file-icon {
          width: 46px; height: 46px; flex-shrink: 0; border-radius: 12px; background: rgba(78,216,234,0.06);
          border: 1px solid rgba(78,216,234,0.13); color: #4ed9eb; display: flex; align-items: center; justify-content: center;
        }
        .privy-scan-file-info { min-width: 0; flex: 1; }
        .privy-scan-file-name { color: #e2e9ef; font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .privy-scan-file-meta { color: #53677b; font-size: 9px; margin-top: 5px; }
        .privy-scan-remove { width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); color: #718397; cursor: pointer; }
        .privy-scan-remove:hover { color: #ff858d; border-color: rgba(255,133,141,0.2); }
        .privy-scan-bottom { border-top: 1px solid rgba(255,255,255,0.055); padding: 17px 22px; display: flex; align-items: center; justify-content: space-between; gap: 15px; }
        .privy-scan-security { display: flex; align-items: center; gap: 8px; color: #52667a; font-size: 9px; }
        .privy-scan-security svg { color: #4cd7b9; }
        .privy-scan-analyze {
          height: 43px; padding: 0 19px; border: none; border-radius: 10px; background: linear-gradient(135deg,#51ddef,#28c6df);
          color: #041117; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 9px; cursor: pointer; transition: 0.2s ease;
        }
        .privy-scan-analyze:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(43,205,229,0.16); }
        .privy-scan-analyze:disabled { opacity: 0.35; cursor: not-allowed; }
        .privy-scan-analyze.scanning { opacity: 0.75; cursor: wait; }
        .privy-scan-spinner { width: 15px; height: 15px; border: 2px solid rgba(4,17,23,0.25); border-top-color: #041117; border-radius: 50%; animation: privySpin 0.7s linear infinite; }
        @keyframes privySpin { to { transform: rotate(360deg); } }
        .privy-scan-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 17px; }
        .privy-scan-info-card { padding: 17px; border-radius: 13px; border: 1px solid rgba(255,255,255,0.055); background: rgba(255,255,255,0.015); }
        .privy-scan-info-icon { color: #4dd8ea; margin-bottom: 11px; }
        .privy-scan-info-title { font-size: 11px; font-weight: 600; margin-bottom: 5px; }
        .privy-scan-info-text { color: #586c80; font-size: 9px; line-height: 1.55; }
        @media (max-width: 750px) {
          .privy-scan-header { padding: 0 18px; }
          .privy-scan-protection { display: none; }
          .privy-scan-main { width: calc(100% - 28px); padding-top: 38px; }
          .privy-scan-heading { font-size: 32px; }
          .privy-scan-dropzone { padding: 25px 15px; }
          .privy-scan-bottom { flex-direction: column; align-items: stretch; }
          .privy-scan-analyze { justify-content: center; }
          .privy-scan-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="privy-scan-header">
        <div className="privy-scan-header-left">
          <button className="privy-scan-back" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="privy-scan-breadcrumb">Dashboard <span>/</span> Scan Center</div>
            <h1 className="privy-scan-title">Privacy Scanner</h1>
          </div>
        </div>
        <div className="privy-scan-protection">
          <span className="privy-scan-protection-dot"></span> Protection Active
        </div>
      </header>

      <main className="privy-scan-main">
        <div className="privy-scan-kicker">AI-POWERED PRIVACY ANALYSIS</div>
        <h2 className="privy-scan-heading">Scan before you <span className="privy-scan-heading-accent">share.</span></h2>
        <p className="privy-scan-description">
          Upload a document and PrivyGuard will analyze it for potentially sensitive information, helping you understand privacy exposure before the document is shared.
        </p>

        <section className="privy-scan-card">
          <div className={`privy-scan-dropzone ${dragActive ? "active" : ""} ${selectedFile ? "has-file" : ""}`}
            onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
            
            {!selectedFile ? (
              <>
                <div className="privy-scan-upload-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M5 20h14" />
                  </svg>
                </div>
                <h3 className="privy-scan-drop-title">Upload your document</h3>
                <p className="privy-scan-drop-description">Drag and drop your file here, or choose a file from your computer.</p>
                <button className="privy-scan-choose" onClick={handleChooseFile}>Choose File</button>
                <div className="privy-scan-formats">PDF • JPG • PNG • DOC • DOCX • TXT</div>
              </>
            ) : (
              <>
                <div className="privy-scan-upload-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" />
                    <path d="M8 13h8" /><path d="M8 17h5" />
                  </svg>
                </div>
                <div className="privy-scan-selected">
                  <div className="privy-scan-file-icon">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" />
                    </svg>
                  </div>
                  <div className="privy-scan-file-info">
                    <div className="privy-scan-file-name">{selectedFile.name}</div>
                    <div className="privy-scan-file-meta">{formatFileSize(selectedFile.size)} • Ready to scan</div>
                  </div>
                  <button className="privy-scan-remove" onClick={handleRemoveFile} aria-label="Remove file">×</button>
                </div>
                <button className="privy-scan-choose" onClick={handleChooseFile} style={{ marginTop: 17 }}>Choose Another File</button>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          <div className="privy-scan-bottom">
            <div className="privy-scan-security">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 3l8 4v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V7l8-4z" /><path d="M9 12l2 2 4-4" />
              </svg>
              Privacy-first analysis • Your document is protected
            </div>
            <button className={`privy-scan-analyze ${isScanning ? "scanning" : ""}`} onClick={handleScan} disabled={!selectedFile || isScanning}>
              {isScanning ? (
                <>
                  <span className="privy-scan-spinner"></span> Analyzing Privacy Risk...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3v5" /><path d="M12 16v5" /><path d="M3 12h5" /><path d="M16 12h5" />
                    <path d="M5.6 5.6l3.5 3.5" /><path d="M14.9 14.9l3.5 3.5" /><path d="M18.4 5.6l-3.5 3.5" /><path d="M9.1 14.9l-3.5 3.5" />
                  </svg>
                  Analyze Privacy Risk <span>→</span>
                </>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScanCenter;