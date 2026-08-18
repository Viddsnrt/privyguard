import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:5000";

// Helper untuk menentukan style badge berdasarkan skor (0-100)
function getRiskStyle(score) {
  if (score === undefined || score === null) {
    return { background: "#f1f5f9", color: "#64748b", label: "UNKNOWN", icon: <AlertTriangle size={14} /> };
  }

  if (score < 40) {
    return { background: "#fee2e2", color: "#b91c1c", label: "CRITICAL", icon: <AlertTriangle size={14} /> };
  }

  if (score < 60) {
    return { background: "#ffedd5", color: "#c2410c", label: "HIGH", icon: <AlertTriangle size={14} /> };
  }

  if (score < 80) {
    return { background: "#fef3c7", color: "#a16207", label: "MEDIUM", icon: <AlertTriangle size={14} /> };
  }

  return { background: "#dcfce7", color: "#15803d", label: "LOW", icon: <CheckCircle2 size={14} /> };
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ScanHistoryPage() {
  const navigate = useNavigate();
  
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadScans() {
    try {
      setLoading(true);
      setError("");

      // PASTIKAN ENDPOINT INI /api/scanner (BUKAN /api/scans)
      const response = await fetch(`${API_URL}/api/scanner`);

      if (!response.ok) {
        throw new Error("Failed to retrieve scan history.");
      }

      const result = await response.json();

      // Pastikan data adalah array
      setScans(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load scan history. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScans();
  }, []);

  const filteredScans = scans.filter((scan) =>
    String(scan.file_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold">PrivyGuard</h1>
              <p className="text-xs text-slate-500">Privacy Security Platform</p>
            </div>
          </div>

          <button
            onClick={loadScans}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        
        {/* TITLE */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
            <Clock3 size={16} />
            Scan Activity
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Scan History</h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Review previous privacy scans and inspect detected privacy risks.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search size={19} className="text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search scanned files..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Unable to load scan history</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Loader2 size={30} className="animate-spin" />
              <span className="text-sm">Loading scan history...</span>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredScans.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <FileText size={25} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold">No scan results found</h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Your completed privacy scans will appear here.
            </p>
          </div>
        )}

        {/* TABLE */}
        {!loading && filteredScans.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            
            {/* TABLE HEADER */}
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid">
              <div>File</div>
              <div>Privacy Score</div>
              <div>Risk Level</div>
              <div>Scanned</div>
              <div />
            </div>

            {filteredScans.map((scan) => {
              // Hitung style berdasarkan risk_score (bukan risk_level lagi)
              const risk = getRiskStyle(scan.risk_score);

              return (
                <div
                  key={scan.id}
                  className="grid cursor-pointer gap-4 border-b border-slate-100 px-6 py-5 transition last:border-b-0 hover:bg-slate-50 md:grid-cols-[2fr_1fr_1fr_1fr_40px] md:items-center"
                  onClick={() => navigate(`/scan/${scan.id}`)}
                >
                  
                  {/* FILE */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {scan.file_name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {/* Backend mengirim file_size sebagai string ("15.20 KB") */}
                        {scan.file_size} 
                      </p>
                    </div>
                  </div>

                  {/* SCORE */}
                  <div>
                    <span className="text-lg font-bold text-slate-900">
                      {scan.risk_score}
                    </span>
                    <span className="ml-1 text-xs text-slate-400">/ 100</span>
                  </div>

                  {/* RISK BADGE */}
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={{ background: risk.background, color: risk.color }}
                    >
                      {risk.icon}
                      {risk.label}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="text-sm text-slate-500">
                    {formatDate(scan.created_at)}
                  </div>

                  {/* DETAIL ARROW */}
                  <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg text-slate-400">
                    <ChevronRight size={18} />
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER INFO */}
        {!loading && scans.length > 0 && (
          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {filteredScans.length} of {scans.length} scans
            </span>
            <span>PrivyGuard Privacy Engine</span>
          </div>
        )}

      </main>
    </div>
  );
}