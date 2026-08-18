import {
  AlertTriangle,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  FileSearch,
  FileText,
  History,
  Home,
  Info,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DashboardPage.css";

// const API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = "https://privyguard-backend-production.up.railway.app";

function DashboardPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Overview");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [scanError, setScanError] = useState("");
  const [scanResult, setScanResult] = useState(null);

  const [isLoadingDashboard, setIsLoadingDashboard] =
    useState(true);

  const [recentScans, setRecentScans] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    totalScans: 0,
    highRisk: 0,
    protected: 0,
    findings: 0,
    privacyScore: 0,
  });

  const [riskDistribution, setRiskDistribution] =
    useState({
      high: 0,
      medium: 0,
      low: 0,
    });

  const menuItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      label: "Scan Center",
      icon: FileSearch,
    },
    {
      label: "Scan History",
      icon: History,
    },
    {
      label: "Protection",
      icon: ShieldCheck,
    },
  ];

  // =====================================================
  // HELPERS
  // =====================================================

  const getFileType = (file) => {
    if (!file) {
      return "Unknown";
    }

    if (file.type?.startsWith("image/")) {
      return "Image";
    }

    if (file.type === "application/pdf") {
      return "PDF";
    }

    if (
      file.type?.includes("word") ||
      file.name?.toLowerCase().endsWith(".docx") ||
      file.name?.toLowerCase().endsWith(".doc")
    ) {
      return "Document";
    }

    if (file.type?.startsWith("text/")) {
      return "Text";
    }

    if (file.name?.toLowerCase().endsWith(".csv")) {
      return "CSV";
    }

    if (file.name?.toLowerCase().endsWith(".json")) {
      return "JSON";
    }

    return "File";
  };

  const getScanFileType = (mimeType, fileName = "") => {
    if (mimeType?.startsWith("image/")) {
      return "Image";
    }

    if (mimeType === "application/pdf") {
      return "PDF";
    }

    if (
      mimeType?.includes("word") ||
      mimeType?.includes("document")
    ) {
      return "Document";
    }

    if (mimeType?.startsWith("text/")) {
      return "Text";
    }

    const lowerName = fileName.toLowerCase();

    if (lowerName.endsWith(".csv")) {
      return "CSV";
    }

    if (lowerName.endsWith(".json")) {
      return "JSON";
    }

    if (lowerName.endsWith(".txt")) {
      return "Text";
    }

    return "File";
  };

  const normalizeRisk = (risk) => {
    const value = String(risk || "").toLowerCase();

    if (value === "critical") {
      return "critical";
    }

    if (value === "high") {
      return "high";
    }

    if (value === "medium") {
      return "medium";
    }

    return "low";
  };

  const getRiskLabel = (risk) => {
    const normalized = normalizeRisk(risk);

    if (normalized === "critical") {
      return "Critical";
    }

    if (normalized === "high") {
      return "High";
    }

    if (normalized === "medium") {
      return "Medium";
    }

    return "Low";
  };

  const formatScanDate = (dateString) => {
    if (!dateString) {
      return "Unknown";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setIsLoadingDashboard(true);

      // const response = await fetch(
      //   `${API_BASE_URL}/api/scans`
      // );
      // const response = await fetch(
      //   `${API_BASE_URL}http://localhost:5000/api/scanner`
      // );
      const response = await fetch(
        `${API_BASE_URL}/api/scanner`
      );

      if (!response.ok) {
        throw new Error(
          `Dashboard API returned ${response.status}`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to load scan history."
        );
      }

      const scans = Array.isArray(result.data)
        ? result.data
        : [];

      const totalScans = scans.length;

      const highRisk = scans.filter((scan) => {
        const risk = normalizeRisk(
          scan.riskLevel
        );

        return (
          risk === "high" ||
          risk === "critical"
        );
      }).length;

      const mediumRisk = scans.filter((scan) => {
        return (
          normalizeRisk(scan.riskLevel) ===
          "medium"
        );
      }).length;

      const lowRisk = scans.filter((scan) => {
        return (
          normalizeRisk(scan.riskLevel) ===
          "low"
        );
      }).length;

      const findings = scans.reduce(
        (total, scan) => {
          return (
            total +
            Number(
              scan.totalFindings || 0
            )
          );
        },
        0
      );

      const protectedFiles = scans.filter(
        (scan) => {
          const risk = normalizeRisk(
            scan.riskLevel
          );

          return (
            risk !== "high" &&
            risk !== "critical"
          );
        }
      ).length;

      const averageScore =
        totalScans > 0
          ? Math.round(
              scans.reduce(
                (total, scan) =>
                  total +
                  Number(
                    scan.privacyScore || 0
                  ),
                0
              ) / totalScans
            )
          : 0;

      setDashboardStats({
        totalScans,
        highRisk,
        protected: protectedFiles,
        findings,
        privacyScore: averageScore,
      });

      setRiskDistribution({
        high: highRisk,
        medium: mediumRisk,
        low: lowRisk,
      });

      const formattedScans = scans
        .slice(0, 5)
        .map((scan, index) => ({
          id:
            scan.id ||
            scan.scanId ||
            `scan-${index}`,

          name:
            scan.fileName ||
            scan.filename ||
            "Unknown file",

          type: getScanFileType(
            scan.mimeType ||
              scan.fileType,
            scan.fileName ||
              scan.filename ||
              ""
          ),

          score: Number(
            scan.privacyScore || 0
          ),

          risk: getRiskLabel(
            scan.riskLevel
          ),

          date: formatScanDate(
            scan.createdAt ||
              scan.created_at ||
              scan.analyzedAt
          ),
        }));

      setRecentScans(formattedScans);
    } catch (error) {
      console.warn(
        "Dashboard data could not be loaded:",
        error.message
      );

      /*
       * Jangan membuat dashboard crash
       * jika endpoint /api/scans belum tersedia.
       *
       * Scanner tetap dapat digunakan.
       */
      setRecentScans([]);
      setDashboardStats({
        totalScans: 0,
        highRisk: 0,
        protected: 0,
        findings: 0,
        privacyScore: 0,
      });

      setRiskDistribution({
        high: 0,
        medium: 0,
        low: 0,
      });
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // FILE HANDLING
  // =====================================================

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setScanResult(null);
    setScanError("");
    setIsAnalyzing(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    handleFile(file);

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    handleFile(file);
  };

  // =====================================================
  // FRONTEND → BACKEND SCANNER
  // =====================================================

  const analyzePrivacyRisk = async () => {
    if (!selectedFile || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setScanError("");
    setScanResult(null);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      // const response = await fetch(
      //   `${API_BASE_URL}/api/scan`,
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );
      const response = await fetch(
        `${API_BASE_URL}/api/scanner`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Privacy analysis failed."
        );
      }

      const backendData =
        result.data || {};

      const backendFindings =
        Array.isArray(
          backendData.findings
        )
          ? backendData.findings
          : [];

      const findings =
        backendFindings.map(
          (finding) => {
            const severity =
              String(
                finding.severity || "LOW"
              ).toUpperCase();

            return {
              label:
                finding.label ||
                "Sensitive information",

              risk:
                severity === "CRITICAL"
                  ? "Critical"
                  : severity === "HIGH"
                    ? "High"
                    : severity === "MEDIUM"
                      ? "Medium"
                      : "Low",

              level:
                severity === "CRITICAL"
                  ? "critical"
                  : severity === "HIGH"
                    ? "high"
                    : severity === "MEDIUM"
                      ? "medium"
                      : "low",

              count:
                Number(
                  finding.count || 0
                ),
            };
          }
        );

      const riskLevel =
        normalizeRisk(
          backendData.riskLevel
        );

      const privacyScore = Number(
        backendData.privacyScore || 0
      );

      let summary =
        "Limited sensitive information was detected in this file.";

      if (riskLevel === "critical") {
        summary =
          "Critical sensitive information was detected and should be protected immediately.";
      } else if (riskLevel === "high") {
        summary =
          "Sensitive personal information was detected and should be reviewed before sharing.";
      } else if (riskLevel === "medium") {
        summary =
          "Potential personal information was detected and should be reviewed before sharing.";
      } else if (
        backendFindings.length === 0
      ) {
        summary =
          "No obvious sensitive information was detected in this file.";
      }

      const recommendations =
        Array.isArray(
          backendData.recommendations
        )
          ? backendData.recommendations
          : [];

      const recommendationText =
        recommendations.length > 0
          ? recommendations
              .map(
                (item) =>
                  item.description ||
                  item.text ||
                  ""
              )
              .filter(Boolean)
              .join(" ")
          : "Review the document before sharing it publicly.";

      const scan = {
        id:
          backendData.id ||
          backendData.scanId ||
          null,

        fileName:
          backendData.fileName ||
          selectedFile.name,

        fileSize:
          Number(
            backendData.fileSize ||
              selectedFile.size ||
              0
          ),

        fileType:
          backendData.mimeType ||
          selectedFile.type ||
          "Unknown",

        score: privacyScore,

        risk:
          riskLevel === "critical"
            ? "CRITICAL RISK"
            : riskLevel === "high"
              ? "HIGH RISK"
              : riskLevel === "medium"
                ? "MEDIUM RISK"
                : "LOW RISK",

        riskLevel,

        summary,

        findings,

        recommendation:
          recommendationText,

        totalFindings:
          Number(
            backendData.totalFindings ||
              findings.reduce(
                (total, item) =>
                  total +
                  Number(
                    item.count || 0
                  ),
                0
              )
          ),

        analyzedAt:
          new Date().toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
      };

      setScanResult(scan);

      /*
       * Refresh dashboard statistics
       * from backend / Supabase.
       *
       * Jika backend sudah menyimpan
       * scan ke database, hasil baru
       * akan langsung masuk Recent Scans.
       */
      await fetchDashboardData();

      setTimeout(() => {
        document
          .getElementById(
            "scan-result"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    } catch (error) {
      console.error(
        "Privacy Scan Error:",
        error
      );

      setScanError(
        error.message ||
          "Unable to connect to the PrivyGuard backend."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleLogout = () => {
    navigate("/login");
  };

  const scrollToScanner = () => {
    setActiveMenu("Scan Center");

    setTimeout(() => {
      document
        .getElementById(
          "privacy-scanner"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const handleMenuClick = (label) => {
    setActiveMenu(label);
    setSidebarOpen(false);

    if (label === "Overview") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    if (label === "Scan Center") {
      scrollToScanner();
    }

    if (label === "Scan History") {
      document
        .getElementById(
          "scan-history"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }

    if (label === "Protection") {
      document
        .getElementById(
          "protection-center"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  };

  // =====================================================
  // SCORE LABEL
  // =====================================================

  const getPrivacyScoreLabel = () => {
    const score =
      dashboardStats.privacyScore;

    if (score >= 80) {
      return "GOOD";
    }

    if (score >= 60) {
      return "FAIR";
    }

    if (score >= 40) {
      return "AT RISK";
    }

    return "CRITICAL";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-overlay"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >
        <div className="sidebar-logo-section">

          <button
            type="button"
            className="brand-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <div className="brand-icon">
              <ShieldCheck size={21} />
            </div>

            <div className="brand-text">
              <div className="brand-name">
                Privy
                <span>Guard</span>
              </div>

              <div className="brand-subtitle">
                PRIVACY PLATFORM
              </div>
            </div>
          </button>

          <button
            type="button"
            className="mobile-close-button"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={19} />
          </button>

        </div>

        {/* USER */}

        <div className="sidebar-user-section">
          <div className="sidebar-user-card">

            <div className="avatar">
              GF
            </div>

            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                Privacy User
              </div>

              <div className="sidebar-user-plan">
                Free Protection
              </div>
            </div>

            <MoreHorizontal
              size={17}
              className="user-more"
            />

          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          <div className="navigation-label">
            WORKSPACE
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              activeMenu === item.label;

            return (
              <button
                key={item.label}
                type="button"
                className={`navigation-item ${
                  active
                    ? "navigation-active"
                    : ""
                }`}
                onClick={() =>
                  handleMenuClick(
                    item.label
                  )
                }
              >
                <Icon size={18} />

                <span>
                  {item.label}
                </span>

                {active && (
                  <span className="active-dot" />
                )}
              </button>
            );
          })}

          <div className="navigation-divider" />

          <div className="navigation-label">
            SUPPORT
          </div>

          <button
            type="button"
            className="navigation-item"
          >
            <CircleHelp size={18} />

            <span>
              Help Center
            </span>
          </button>

        </nav>

        {/* SIGN OUT */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="sign-out-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />

            <span>
              Sign Out
            </span>
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div className="header-left">

            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="header-small-text">
                Workspace
              </div>

              <div className="header-title">
                Privacy Dashboard
              </div>
            </div>

          </div>

          <div className="header-right">

            <div className="protection-status">
              <span className="status-dot" />
              Protection Active
            </div>

            <button
              type="button"
              className="header-avatar"
            >
              GF
            </button>

          </div>

        </header>

        {/* CONTENT */}

        <main className="dashboard-content">

          {/* INTRO */}

          <section className="dashboard-intro">

            <div>

              <div className="breadcrumb">

                <Home size={14} />

                <span>/</span>

                <span>
                  Dashboard
                </span>

              </div>

              <h1>
                Good to see you.
              </h1>

              <p>
                Monitor your privacy exposure
                and protect sensitive
                information before you
                share it.
              </p>

            </div>

            <button
              type="button"
              className="new-scan-button"
              onClick={
                scrollToScanner
              }
            >
              <Upload size={17} />

              New Scan
            </button>

          </section>

          {/* SCORE */}

          <section className="dashboard-top-grid">

            <div className="privacy-score-card">

              <div className="card-glow" />

              <div className="score-card-header">

                <div>

                  <div className="section-label">
                    OVERALL PRIVACY SCORE
                  </div>

                  <div className="section-description">
                    Based on your recent scans
                  </div>

                </div>

                <div className="small-card-icon">
                  <Shield size={18} />
                </div>

              </div>

              <div className="score-content">

                <div className="score-circle">

                  <div className="score-circle-inner">

                    <div className="score-number">
                      {isLoadingDashboard
                        ? "—"
                        : dashboardStats
                            .privacyScore}
                    </div>

                    <div className="score-label">
                      {isLoadingDashboard
                        ? "LOADING"
                        : getPrivacyScoreLabel()}
                    </div>

                  </div>

                </div>

                <div className="score-explanation">

                  <div className="score-status">
                    <Zap size={16} />

                    {isLoadingDashboard
                      ? "Loading privacy health..."
                      : dashboardStats
                            .privacyScore >=
                          80
                        ? "Privacy health is good"
                        : "Privacy health needs attention"}
                  </div>

                  <p>
                    {isLoadingDashboard
                      ? "Loading your latest privacy analysis."
                      : dashboardStats
                            .totalScans ===
                          0
                        ? "Complete your first privacy scan to calculate your privacy posture."
                        : "Your privacy posture is calculated from your recent privacy scans."}
                  </p>

                  <div className="improvement">
                    <span />

                    Live data from your
                    privacy scans
                  </div>

                </div>

              </div>

            </div>

            {/* STATISTICS */}

            <div className="statistics-grid">

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon blue">
                    <FileSearch size={18} />
                  </div>

                  <span>
                    Total
                  </span>

                </div>

                <div className="stat-number">
                  {isLoadingDashboard
                    ? "—"
                    : dashboardStats
                        .totalScans}
                </div>

                <div className="stat-label">
                  Documents scanned
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon red">
                    <ShieldAlert size={18} />
                  </div>

                  <span className="red-text">
                    Attention
                  </span>

                </div>

                <div className="stat-number">
                  {isLoadingDashboard
                    ? "—"
                    : dashboardStats
                        .highRisk}
                </div>

                <div className="stat-label">
                  High-risk findings
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon green">
                    <FileCheck2 size={18} />
                  </div>

                  <span className="green-text">
                    Safe
                  </span>

                </div>

                <div className="stat-number">
                  {isLoadingDashboard
                    ? "—"
                    : dashboardStats
                        .protected}
                </div>

                <div className="stat-label">
                  Files protected
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-top">

                  <div className="stat-icon purple">
                    <BarChart3 size={18} />
                  </div>

                  <span>
                    Detected
                  </span>

                </div>

                <div className="stat-number">
                  {isLoadingDashboard
                    ? "—"
                    : dashboardStats
                        .findings}
                </div>

                <div className="stat-label">
                  Privacy findings
                </div>

              </div>

            </div>

          </section>

          {/* SCANNER */}

          <section
            id="privacy-scanner"
            className="scanner-section"
          >

            <div className="section-heading">

              <div>

                <div className="section-title-row">

                  <Sparkles size={17} />

                  <h2>
                    Privacy Scanner
                  </h2>

                </div>

                <p>
                  Upload a file and let
                  PrivyGuard analyze
                  potential privacy risks.
                </p>

              </div>

              <div className="privacy-first">
                <LockKeyhole size={14} />
                Privacy-first analysis
              </div>

            </div>

            <div
              className={`scanner-box ${
                isDragging
                  ? "scanner-dragging"
                  : ""
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={handleDrop}
            >

              <div className="scanner-content">

                <div className="scanner-icon">
                  <Upload size={27} />
                </div>

                <h3>
                  {selectedFile
                    ? selectedFile.name
                    : "Upload a document to scan"}
                </h3>

                <p>
                  {selectedFile
                    ? `${(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(
                        2
                      )} MB selected. Ready for privacy analysis.`
                    : "Drag and drop your file here, or select a file from your device."}
                </p>

                <label className="choose-file-button">

                  <FileSearch size={17} />

                  {selectedFile
                    ? "Choose Another File"
                    : "Choose File"}

                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt,.csv,.json"
                    onChange={
                      handleFileChange
                    }
                  />

                </label>

                <div className="supported-files">

                  <span>PNG</span>
                  <span>•</span>
                  <span>JPG</span>
                  <span>•</span>
                  <span>PDF</span>
                  <span>•</span>
                  <span>DOCX</span>
                  <span>•</span>
                  <span>TXT</span>

                </div>

              </div>

              {/* SELECTED FILE */}

              {selectedFile && (

                <div className="selected-file-bar">

                  <div className="selected-file-info">

                    <div className="selected-file-icon">
                      <FileText size={18} />
                    </div>

                    <div>

                      <div className="selected-file-name">
                        {selectedFile.name}
                      </div>

                      <div className="selected-file-status">

                        {isAnalyzing
                          ? "Connecting to PrivyGuard AI Scanner..."
                          : scanResult
                            ? "Analysis complete"
                            : "Ready to analyze"}

                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="analyze-button"
                    onClick={
                      analyzePrivacyRisk
                    }
                    disabled={
                      isAnalyzing
                    }
                  >

                    {isAnalyzing ? (
                      <>
                        <span className="scanner-loading-spinner" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Analyze Privacy Risk
                        <ChevronRight size={16} />
                      </>
                    )}

                  </button>

                </div>

              )}

            </div>

            {/* ERROR */}

            {scanError && (

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300">

                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <div>

                  <div className="font-semibold">
                    Scan failed
                  </div>

                  <div className="mt-1 text-red-300/70">
                    {scanError}
                  </div>

                </div>

              </div>

            )}

          </section>

          {/* SCAN RESULT */}

          {scanResult && (

            <section
              id="scan-result"
              className="mt-8 scroll-mt-24"
            >

              <div className="rounded-2xl border border-white/10 bg-[#0b1019] p-6 shadow-2xl shadow-cyan-950/10 md:p-8">

                {/* HEADER */}

                <div className="flex flex-col gap-5 border-b border-white/[0.06] pb-6 md:flex-row md:items-start md:justify-between">

                  <div>

                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">

                      <Sparkles size={14} />

                      Privacy Analysis Complete

                    </div>

                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
                      Scan Result
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {scanResult.fileName}
                    </p>

                  </div>

                  <div
                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                      scanResult.riskLevel ===
                      "critical"
                        ? "border-red-400/30 bg-red-500/10 text-red-300"
                        : scanResult.riskLevel ===
                            "high"
                          ? "border-orange-400/30 bg-orange-500/10 text-orange-300"
                          : scanResult.riskLevel ===
                              "medium"
                            ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
                            : "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                    }`}
                  >

                    <span className="h-2 w-2 rounded-full bg-current" />

                    {scanResult.risk}

                  </div>

                </div>

                {/* BODY */}

                <div className="mt-7 grid gap-8 lg:grid-cols-[230px_1fr]">

                  {/* SCORE */}

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">

                    <div
                      className={`relative flex h-40 w-40 items-center justify-center rounded-full border-[10px] ${
                        scanResult.riskLevel ===
                        "critical"
                          ? "border-red-400/20"
                          : scanResult.riskLevel ===
                              "high"
                            ? "border-orange-400/20"
                            : scanResult.riskLevel ===
                                "medium"
                              ? "border-yellow-400/20"
                              : "border-emerald-400/20"
                      }`}
                    >

                      <div
                        className={`absolute inset-[-10px] rounded-full border-[10px] border-transparent ${
                          scanResult.riskLevel ===
                          "critical"
                            ? "border-t-red-400 border-r-red-400"
                            : scanResult.riskLevel ===
                                "high"
                              ? "border-t-orange-400 border-r-orange-400"
                              : scanResult.riskLevel ===
                                  "medium"
                                ? "border-t-yellow-400 border-r-yellow-400"
                                : "border-t-emerald-400 border-r-emerald-400"
                        }`}
                      />

                      <div className="text-center">

                        <div className="text-5xl font-bold tracking-tight text-white">
                          {scanResult.score}
                        </div>

                        <div className="mt-1 text-[9px] uppercase tracking-[0.25em] text-slate-500">
                          Privacy Score
                        </div>

                      </div>

                    </div>

                    <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                      {scanResult.summary}
                    </p>

                    <div className="mt-3 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[10px] text-slate-600">
                      {scanResult.totalFindings} findings detected
                    </div>

                  </div>

                  {/* FINDINGS */}

                  <div>

                    <div className="mb-4 flex items-center justify-between">

                      <div>

                        <h3 className="text-sm font-semibold text-white">
                          Detected Sensitive Information
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Results generated by the PrivyGuard Privacy Engine.
                        </p>

                      </div>

                      <AlertTriangle
                        size={19}
                        className={
                          scanResult.riskLevel ===
                          "critical"
                            ? "text-red-300"
                            : scanResult.riskLevel ===
                                "high"
                              ? "text-orange-300"
                              : scanResult.riskLevel ===
                                  "medium"
                                ? "text-yellow-300"
                                : "text-emerald-300"
                        }
                      />

                    </div>

                    {scanResult.findings.length ===
                    0 ? (

                      <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">

                            <ShieldCheck
                              size={18}
                            />

                          </div>

                          <div>

                            <div className="text-sm font-semibold text-emerald-200">
                              No obvious sensitive data detected
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              The document passed the current privacy detection rules.
                            </div>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="space-y-2">

                        {scanResult.findings.map(
                          (finding) => (

                            <div
                              key={`${finding.label}-${finding.count}`}
                              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                            >

                              <div className="flex items-center gap-3">

                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                    finding.level ===
                                    "critical"
                                      ? "bg-red-500/10 text-red-300"
                                      : finding.level ===
                                          "high"
                                        ? "bg-orange-500/10 text-orange-300"
                                        : finding.level ===
                                            "medium"
                                          ? "bg-yellow-500/10 text-yellow-300"
                                          : "bg-emerald-500/10 text-emerald-300"
                                  }`}
                                >

                                  {finding.level ===
                                  "critical" ? (
                                    <ShieldAlert
                                      size={15}
                                    />
                                  ) : (
                                    <FileSearch
                                      size={15}
                                    />
                                  )}

                                </div>

                                <div>

                                  <div className="text-sm text-slate-300">
                                    {finding.label}
                                  </div>

                                  <div className="mt-0.5 text-[10px] text-slate-600">
                                    {finding.count} detected
                                  </div>

                                </div>

                              </div>

                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  finding.level ===
                                  "critical"
                                    ? "text-red-300"
                                    : finding.level ===
                                        "high"
                                      ? "text-orange-300"
                                      : finding.level ===
                                          "medium"
                                        ? "text-yellow-300"
                                        : "text-emerald-300"
                                }`}
                              >
                                {finding.risk}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </div>

                {/* RECOMMENDATION */}

                <div className="mt-7 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-5">

                  <div className="flex gap-3">

                    <Sparkles
                      size={18}
                      className="mt-0.5 shrink-0 text-cyan-300"
                    />

                    <div>

                      <p className="text-sm font-semibold text-cyan-200">
                        Privacy Recommendation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {scanResult.recommendation}
                      </p>

                    </div>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2">

                    <Check
                      size={14}
                      className="text-emerald-400"
                    />

                    Analysis completed at{" "}
                    {scanResult.analyzedAt}

                  </div>

                  <span>

                    {getFileType(
                      selectedFile
                    )}{" "}
                    ·{" "}
                    {(
                      scanResult.fileSize /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB

                  </span>

                </div>

              </div>

            </section>

          )}

          {/* RECENT SCANS */}

          <section
            id="scan-history"
            className="lower-dashboard-grid scroll-mt-24"
          >

            <div className="recent-scans-section">

              <div className="section-heading">

                <div>

                  <h2>
                    Recent Scans
                  </h2>

                  <p>
                    Your latest privacy analysis activity.
                  </p>

                </div>

                <button
                  type="button"
                  className="view-all-button"
                  onClick={() =>
                    setActiveMenu(
                      "Scan History"
                    )
                  }
                >
                  View all
                  <ChevronRight size={14} />
                </button>

              </div>

              <div className="recent-scans-card">

                <div className="scan-table-header">

                  <span>File</span>
                  <span>Type</span>
                  <span>Score</span>
                  <span>Risk</span>
                  <span>Date</span>

                </div>

                {isLoadingDashboard ? (

                  <div className="scan-row">

                    <div className="scan-file">
                      <div className="scan-file-icon">
                        <FileSearch size={16} />
                      </div>

                      <div>
                        <div className="scan-file-name">
                          Loading scans...
                        </div>
                      </div>
                    </div>

                  </div>

                ) : recentScans.length === 0 ? (

                  <div className="scan-row">

                    <div className="scan-file">

                      <div className="scan-file-icon">
                        <FileText size={16} />
                      </div>

                      <div>

                        <div className="scan-file-name">
                          No scans yet
                        </div>

                        <div className="mobile-scan-meta">
                          Upload a document above to start your first scan.
                        </div>

                      </div>

                    </div>

                  </div>

                ) : (

                  recentScans.map(
                    (scan, index) => (

                      <div
                        className="scan-row"
                        key={
                          scan.id ||
                          `${scan.name}-${index}`
                        }
                      >

                        <div className="scan-file">

                          <div className="scan-file-icon">
                            <FileText size={16} />
                          </div>

                          <div>

                            <div className="scan-file-name">
                              {scan.name}
                            </div>

                            <div className="mobile-scan-meta">
                              {scan.type} ·{" "}
                              {scan.date}
                            </div>

                          </div>

                        </div>

                        <div className="scan-type">
                          {scan.type}
                        </div>

                        <div
                          className={`scan-score ${
                            scan.risk ===
                            "High"
                              ? "score-high"
                              : scan.risk ===
                                  "Medium"
                                ? "score-medium"
                                : "score-low"
                          }`}
                        >

                          {scan.score}

                          <span>
                            /100
                          </span>

                        </div>

                        <div>

                          <span
                            className={`risk-badge risk-${scan.risk.toLowerCase()}`}
                          >
                            {scan.risk}
                          </span>

                        </div>

                        <div className="scan-date">
                          {scan.date}
                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

            {/* RIGHT */}

            <div className="right-dashboard-column">

              <div>

                <div className="section-heading compact">

                  <div>

                    <h2>
                      Risk Distribution
                    </h2>

                    <p>
                      Findings across your scanned files.
                    </p>

                  </div>

                </div>

                <div className="risk-card">

                  <div className="risk-item">

                    <div className="risk-item-header">

                      <div>
                        <span className="risk-dot high" />
                        High Risk
                      </div>

                      <strong>
                        {riskDistribution.high}
                      </strong>

                    </div>

                    <div className="risk-progress">

                      <div
                        className="progress-high"
                        style={{
                          width: `${
                            dashboardStats
                              .totalScans > 0
                              ? Math.min(
                                  100,
                                  (riskDistribution.high /
                                    dashboardStats.totalScans) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="risk-item">

                    <div className="risk-item-header">

                      <div>
                        <span className="risk-dot medium" />
                        Medium Risk
                      </div>

                      <strong>
                        {riskDistribution.medium}
                      </strong>

                    </div>

                    <div className="risk-progress">

                      <div
                        className="progress-medium"
                        style={{
                          width: `${
                            dashboardStats
                              .totalScans > 0
                              ? Math.min(
                                  100,
                                  (riskDistribution.medium /
                                    dashboardStats.totalScans) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="risk-item">

                    <div className="risk-item-header">

                      <div>
                        <span className="risk-dot low" />
                        Low Risk
                      </div>

                      <strong>
                        {riskDistribution.low}
                      </strong>

                    </div>

                    <div className="risk-progress">

                      <div
                        className="progress-low"
                        style={{
                          width: `${
                            dashboardStats
                              .totalScans > 0
                              ? Math.min(
                                  100,
                                  (riskDistribution.low /
                                    dashboardStats.totalScans) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* PROTECTION */}

              <div
                id="protection-center"
                className="protection-card scroll-mt-24"
              >

                <div className="protection-card-glow" />

                <div className="protection-content">

                  <div className="protection-top">

                    <div>

                      <div className="protection-icon">
                        <ShieldCheck size={21} />
                      </div>

                      <h2>
                        Protection Center
                      </h2>

                      <p>
                        Your protected files are ready whenever you need them.
                      </p>

                    </div>

                    <Check
                      size={20}
                      className="check-icon"
                    />

                  </div>

                  <div className="protection-stats">

                    <div>

                      <strong>
                        {dashboardStats.protected}
                      </strong>

                      <span>
                        Protected
                      </span>

                    </div>

                    <div>

                      <strong>
                        {dashboardStats.highRisk}
                      </strong>

                      <span>
                        Exposed
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="manage-protection"
                    onClick={() =>
                      setActiveMenu(
                        "Protection"
                      )
                    }
                  >

                    Manage Protection

                    <ChevronRight size={15} />

                  </button>

                </div>

              </div>

            </div>

          </section>

          {/* PRIVACY TIP */}

          <section className="privacy-tip">

            <div className="privacy-tip-icon">
              <Info size={17} />
            </div>

            <div>

              <strong>
                Privacy Tip
              </strong>

              <p>
                Before posting a screenshot
                publicly, check whether it
                contains email addresses,
                phone numbers, identity
                documents, addresses, or
                other information that could
                identify you.
              </p>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default DashboardPage;