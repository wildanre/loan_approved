import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { BarChart3, ClipboardList, Info, Menu, X, Zap } from "lucide-react";
import AboutPage from "./pages/AboutPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import PredictPage from "./pages/PredictPage.jsx";

const navItems = [
  { to: "/", label: "Prediksi", icon: Zap, desc: "Simulasi real-time" },
  { to: "/history", label: "History", icon: ClipboardList, desc: "Riwayat prediksi" },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3, desc: "Metrik model" },
  { to: "/about", label: "Tentang", icon: Info, desc: "Info aplikasi" },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface text-ink">
      {/* ── Sidebar Overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-full w-64 flex-col bg-white border-r border-slate-100 shadow-xl
          transition-transform duration-300 lg:translate-x-0 lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <span className="section-label">LoanSight</span>
            <p className="mt-0.5 text-xs text-slate-400 font-medium">ML Loan Classifier</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, desc }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition`}>
                <Icon size={17} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block">{label}</span>
                <span className="block text-xs font-normal opacity-60 mt-0.5">{desc}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 leading-5">
            Powered by Logistic Regression, Random Forest, LightGBM & CatBoost
          </p>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-slate-100 bg-white/90 px-5 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / page title filled by routes */}
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-slate-400">
              ML-Powered Loan Approval Classifier
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              Backend Live
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-5 py-7 lg:px-8">
          <Routes>
            <Route path="/" element={<PredictPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
