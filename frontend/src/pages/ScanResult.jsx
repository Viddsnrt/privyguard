import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Brain, 
  ArrowLeft, 
  Lock,
  ShieldAlert
} from "lucide-react";

const ScanResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil data dari navigasi state
  const scanData = location.state?.scanData;

  // Handle error jika diakses langsung tanpa data
  useEffect(() => {
    if (!scanData) {
      // Redirect kembali ke scan center jika tidak ada data
      navigate("/scan-center", { replace: true });
    }
  }, [scanData, navigate]);

  if (!scanData) {
    return null; // Return null sambil menunggu redirect
  }

  // Ekstrak data dari response backend
  const { 
    file_name, 
    risk_score, 
    ai_explanation, 
    detected_info 
  } = scanData;

  const items = detected_info?.items || [];

  // Helper untuk warna skor
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Helper untuk styling severity
  const getSeverityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "HIGH":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/5 bg-[#05080e]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">PrivyGuard</h1>
              <p className="text-xs text-slate-500">Privacy Security Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/scan-center")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors duration-200"
        >
          <ArrowLeft size={18} />
          Scan Another Document
        </button>

        {/* TITLE SECTION */}
        <div className="mb-10 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <FileText className="text-cyan-400" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Privacy Scan Result
            </h2>
            <p className="mt-1 text-slate-400 flex items-center gap-2 text-sm">
              <span className="font-mono bg-white/5 px-2 py-0.5 rounded">{file_name}</span>
            </p>
          </div>
        </div>

        {/* GRID SUMMARY: SCORE & AI EXPLANATION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* RISK SCORE CARD */}
          <div className="lg:col-span-1 bg-[#0d121b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium mb-4">Privacy Score</p>
              <div className="flex items-end gap-2">
                <span className={`text-6xl font-bold ${getScoreColor(risk_score)}`}>
                  {risk_score}
                </span>
                <span className="text-lg text-slate-500 mb-2">/ 100</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {risk_score >= 80 ? "Document is relatively safe" : 
                 risk_score >= 50 ? "Moderate privacy risk detected" : 
                 "High privacy risk detected"}
              </p>
            </div>
            <div className="mt-6 h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getScoreBg(risk_score)} transition-all duration-700`}
                style={{ width: `${risk_score}%` }}
              />
            </div>
          </div>

          {/* AI EXPLANATION CARD */}
          <div className="lg:col-span-2 bg-[#0d121b] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Brain size={18} className="text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-200">AI Security Analysis</h3>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-5">
              <p className="text-slate-300 leading-relaxed text-sm">
                {ai_explanation}
              </p>
            </div>
          </div>

        </div>

        {/* DETECTED SENSITIVE INFO */}
        <div className="bg-[#0d121b] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert size={22} className="text-red-400" />
              <div>
                <h3 className="font-semibold text-lg">Detected Sensitive Information</h3>
                <p className="text-sm text-slate-500">Data breaches found in this document</p>
              </div>
            </div>
            <span className="text-sm font-mono bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
              {items.length} Found
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {items.length === 0 ? (
              <div className="p-10 text-center">
                <div className="inline-flex p-3 bg-emerald-500/10 rounded-full mb-3">
                  <Lock className="text-emerald-400" size={24} />
                </div>
                <p className="text-slate-400 font-medium">No sensitive information detected.</p>
                <p className="text-slate-600 text-sm mt-1">This document is clean from common PII data.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <AlertTriangle size={20} className="text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 capitalize">
                        {item.type} <span className="text-slate-500 font-normal">({item.label})</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Occurrences found: <span className="font-mono text-slate-400">{item.count}</span>
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getSeverityStyle(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default ScanResult;