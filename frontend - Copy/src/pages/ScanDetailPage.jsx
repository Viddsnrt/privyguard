import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  CalendarDays,
  Database,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function getRisk(level) {
  const value = String(level || "").toUpperCase();

  if (value === "CRITICAL") {
    return {
      color: "text-red-700",
      background: "bg-red-50",
      border: "border-red-200",
    };
  }

  if (value === "HIGH") {
    return {
      color: "text-orange-700",
      background: "bg-orange-50",
      border: "border-orange-200",
    };
  }

  if (value === "MEDIUM") {
    return {
      color: "text-yellow-700",
      background: "bg-yellow-50",
      border: "border-yellow-200",
    };
  }

  return {
    color: "text-green-700",
    background: "bg-green-50",
    border: "border-green-200",
  };
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString(
    "en-US",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  );
}

export default function ScanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadScan() {

      try {

        const response = await fetch(
          `${API_URL}/api/scans/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Scan result not found."
          );
        }

        const result =
          await response.json();

        setScan(result.data);

      } catch (err) {

        console.error(err);

        setError(
          "Unable to retrieve this scan result."
        );

      } finally {

        setLoading(false);

      }

    }

    loadScan();

  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2
            size={32}
            className="animate-spin"
          />

          <p className="text-sm">
            Loading scan result...
          </p>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <AlertTriangle
            size={40}
            className="mx-auto mb-4 text-red-500"
          />

          <h2 className="text-xl font-bold">
            Scan Result Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/scan-history")
            }
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Scan History
          </button>

        </div>
      </div>
    );
  }

  const risk =
    getRisk(scan.risk_level);

  const findings =
    Array.isArray(scan.findings)
      ? scan.findings
      : [];

  const recommendations =
    Array.isArray(
      scan.recommendations
    )
      ? scan.recommendations
      : [];

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
              <h1 className="font-bold">
                PrivyGuard
              </h1>

              <p className="text-xs text-slate-500">
                Privacy Security Platform
              </p>
            </div>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/scan-history")
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />

          Back to Scan History
        </button>


        {/* TITLE */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={24} />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-2xl font-bold">
                {scan.file_name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Privacy analysis result
              </p>

            </div>

          </div>

        </div>


        {/* SCORE CARD */}

        <div className="mb-6 grid gap-6 md:grid-cols-3">

          {/* PRIVACY SCORE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Privacy Score
            </p>

            <div className="mt-4 flex items-end gap-2">

              <span className="text-5xl font-bold">
                {scan.privacy_score}
              </span>

              <span className="mb-2 text-sm text-slate-400">
                / 100
              </span>

            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(
                      Number(
                        scan.privacy_score
                      ) || 0,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          {/* RISK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Risk Level
            </p>

            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${risk.background} ${risk.border} ${risk.color}`}
            >

              {scan.risk_level ===
              "LOW" ? (
                <CheckCircle2 size={19} />
              ) : (
                <AlertTriangle size={19} />
              )}

              {scan.risk_level}

            </div>

          </div>


          {/* FINDINGS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Privacy Findings
            </p>

            <div className="mt-4 text-4xl font-bold">
              {scan.total_findings}
            </div>

            <p className="mt-1 text-sm text-slate-400">
              detected privacy issues
            </p>

          </div>

        </div>


        {/* DETAILS */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* FINDINGS */}

          <section className="lg:col-span-2">

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-6 py-5">

                <div className="flex items-center gap-2">

                  <Database
                    size={19}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold">
                    Detected Privacy Information
                  </h3>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Information detected by the
                  PrivyGuard privacy engine.
                </p>

              </div>


              <div className="divide-y divide-slate-100">

                {findings.length === 0 ? (

                  <div className="p-8 text-center">

                    <CheckCircle2
                      size={32}
                      className="mx-auto mb-3 text-green-600"
                    />

                    <p className="font-semibold">
                      No privacy findings detected
                    </p>

                  </div>

                ) : (

                  findings.map(
                    (finding, index) => (

                      <div
                        key={index}
                        className="px-6 py-5"
                      >

                        <div className="flex gap-4">

                          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <AlertTriangle
                              size={18}
                            />
                          </div>

                          <div>

                            <h4 className="font-semibold">
                              {typeof finding ===
                              "string"
                                ? finding
                                : finding.type ||
                                  finding.name ||
                                  "Privacy Finding"}
                            </h4>

                            {typeof finding !==
                              "string" &&
                              finding.description && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {
                                    finding.description
                                  }
                                </p>
                              )}

                          </div>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </section>


          {/* SIDE INFO */}

          <aside className="space-y-6">

            {/* RECOMMENDATIONS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <Lightbulb
                  size={19}
                  className="text-amber-500"
                />

                <h3 className="font-bold">
                  Recommendations
                </h3>

              </div>

              <div className="mt-5 space-y-3">

                {recommendations.length ===
                0 ? (

                  <p className="text-sm text-slate-500">
                    No recommendations available.
                  </p>

                ) : (

                  recommendations.map(
                    (recommendation, index) => (

                      <div
                        key={index}
                        className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
                      >
                        {typeof recommendation ===
                        "string"
                          ? recommendation
                          : recommendation.text ||
                            recommendation.message ||
                            "Review detected privacy information."}
                      </div>

                    )
                  )

                )}

              </div>

            </div>


            {/* SCAN INFORMATION */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="font-bold">
                Scan Information
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-start gap-3">

                  <CalendarDays
                    size={17}
                    className="mt-0.5 text-slate-400"
                  />

                  <div>

                    <p className="text-xs text-slate-400">
                      Scanned at
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(
                        scan.created_at
                      )}
                    </p>

                  </div>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Scanner Engine
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {scan.scanner_engine ||
                      "PrivyGuard Privacy Engine"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Scanner Version
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {scan.scanner_version ||
                      "1.0.0"}
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}