import { useState, useEffect } from "react";
import { Dataset, ClusteringResult, ElbowPoint, ActivePage, AiInsightsResponse } from "./types";
import { generateSyntheticDataset, runKMeans, calculateElbowPoints } from "./utils/kmeans";
import ExecutiveOverview from "./components/ExecutiveOverview";
import CustomerSegmentationLab from "./components/CustomerSegmentationLab";
import SegmentIntelligence from "./components/SegmentIntelligence";
import PredictionsAIPanel from "./components/PredictionsAIPanel";
import ReportingCenter from "./components/ReportingCenter";
import RecruiterShowcase from "./components/RecruiterShowcase";

import { 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  Target,
  FileText,
  Layers,
  Cpu,
  Tv2,
  FileBarChart2,
  Menu,
  X,
  Briefcase,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export default function App() {
  // Page Navigation State
  const [activePage, setActivePage] = useState<ActivePage>("executive");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Recruiter Showcase Toggle State
  const [portfolioShowcaseMode, setPortfolioShowcaseMode] = useState<boolean>(true); // default true for recruiters

  // Initialize default customer dataset (ecommerce Shoppers)
  const initialData = generateSyntheticDataset("ecommerce", 180);
  const initialDataset: Dataset = {
    id: "synthetic-ecommerce",
    name: initialData.name,
    vertical: "ecommerce",
    customers: initialData.customers,
    features: initialData.features,
    featureUnits: initialData.featureUnits,
  };

  const [dataset, setDataset] = useState<Dataset>(initialDataset);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Annual Income (k$)",
    "Spending Score (1-100)"
  ]);
  const [kValue, setKValue] = useState<number>(4);
  const [xAxisFeature, setXAxisFeature] = useState<string>("Annual Income (k$)");
  const [yAxisFeature, setYAxisFeature] = useState<string>("Spending Score (1-100)");
  const [bubbleSizeFeature, setBubbleSizeFeature] = useState<string>("none");

  const [clusteringResult, setClusteringResult] = useState<ClusteringResult | null>(null);
  const [elbowPoints, setElbowPoints] = useState<ElbowPoint[]>([]);

  // AI Insights State
  const [insights, setInsights] = useState<AiInsightsResponse | null>(null);
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // recalculate local K-Means results on param adjustments
  const handleRunClustering = () => {
    if (dataset.customers.length === 0 || selectedFeatures.length < 2) return;
    const res = runKMeans(dataset.customers, selectedFeatures, kValue);
    setClusteringResult(res);

    // Compute elbow points curve
    const elbow = calculateElbowPoints(dataset.customers, selectedFeatures, 8);
    setElbowPoints(elbow);
  };

  // Trigger server-side structured cohort insights pipeline
  const triggerAiInsights = async () => {
    if (!clusteringResult || clusteringResult.clusters.length === 0) return;

    setInsightsLoading(true);
    setInsightsError(null);

    try {
      // Assemble statistical metrics of active cohorts
      const clustersSumStats = clusteringResult.clusters.map((cls) => {
        const payloadObj: Record<string, any> = {
          clusterId: cls.clusterId,
          sizeCount: cls.customers.length,
          sizePct: Math.round((cls.customers.length / dataset.customers.length) * 100),
        };

        selectedFeatures.forEach((feat) => {
          payloadObj[`${feat}_average`] = Number(cls.stats[feat]?.avg.toFixed(1) || 0);
        });

        return payloadObj;
      });

      const response = await fetch("/api/segment-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vertical: dataset.name,
          features: selectedFeatures,
          clustersSumStats,
        }),
      });

      if (!response.ok) {
        throw new Error(`Insights server returned status: ${response.statusText}`);
      }

      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      console.error("Fetch insights error:", err);
      setInsightsError(err.message || "Failed to parse API output. Standard fallbacks are active.");
    } finally {
      setInsightsLoading(false);
    }
  };

  // Run initial clustering upon loading app
  useEffect(() => {
    handleRunClustering();
  }, [dataset, kValue, selectedFeatures]);

  // Handle dataset vertical swap
  const handleDatasetChange = (newDataset: Dataset) => {
    setDataset(newDataset);
    // Clear insights to prompt regeneration when dataset swaps, keeping it consistent
    setInsights(null);
    
    // Choose first two features as defaults
    const feats = newDataset.features;
    if (feats.length >= 2) {
      setSelectedFeatures([feats[0], feats[1]]);
      setXAxisFeature(feats[0]);
      setYAxisFeature(feats[1]);
    }
    setBubbleSizeFeature("none");
  };

  // Sidebar Items
  const sidebarItems = [
    { id: "executive", label: "Executive Overview", icon: Target },
    { id: "lab", label: "Segmentation Lab", icon: Layers },
    { id: "intelligence", label: "Segment Intelligence", icon: Sparkles },
    { id: "predictions", label: "Predictions & AI Forecast", icon: Cpu },
    { id: "reporting", label: "Reporting Exports", icon: FileBarChart2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800 antialiased font-sans flex flex-col md:flex-row relative">
      
      {/* 1. LEFT SIDEBAR/RAIL (Modern SaaS Dashboard Navigation) - Collapsible on Desktop */}
      <aside 
        className={`bg-slate-900 border-r border-slate-850 text-slate-300 transition-all duration-300 z-50 shrink-0 hidden md:flex flex-col justify-between ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-5 flex-grow space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5 truncate">
              <span className="p-2 bg-indigo-600 rounded-xl text-white shrink-0">
                <Target className="w-5 h-5" />
              </span>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <h1 className="text-sm font-black text-white tracking-wider uppercase font-sans">
                    Cohorts AI
                  </h1>
                  <span className="text-[9px] text-[#818cf8] font-bold uppercase tracking-widest block font-mono">
                    Enterprise Edition
                  </span>
                </div>
              )}
            </div>

            {/* Toggle rail button */}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 px-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition hidden md:block"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as ActivePage)}
                  className={`w-full p-3 rounded-xl text-left font-bold text-xs transition flex items-center gap-3 relative group ${
                    isActive 
                      ? "bg-indigo-650 text-white shadow-md border border-indigo-500/20" 
                      : "hover:bg-slate-800/60 text-slate-450 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  
                  {/* Tooltip on collapse mode */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-950 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
          {!sidebarCollapsed ? (
            <span>Cohorts AI Platform © 2026</span>
          ) : (
            <span>cAI</span>
          )}
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Target className="w-4 h-4" />
          </span>
          <span className="font-extrabold text-sm uppercase tracking-wider">Cohorts AI</span>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 bg-slate-800 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE DROPDOWN DRAWER */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-slate-950 text-slate-350 p-4 border-b border-slate-850 flex flex-col gap-1.5 z-40 relative animate-fade-in text-xs font-bold shadow-2xl">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id as ActivePage);
                  setMobileMenuOpen(false);
                }}
                className={`p-3.5 rounded-xl text-left flex items-center gap-3 transition ${
                  isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* 2. MAIN COHORT WORKSPACE CONTENT CONTAINER */}
      <div className="flex-grow flex flex-col justify-between min-w-0">
        
        {/* Top Header Controls bar */}
        <header className="bg-white border-b border-slate-100 p-4 sticky top-0 z-40 hidden md:block select-none shadow-sm/50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>ACTIVE COHORT WORKSPACE AREA:</span>
              <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[11px] font-extrabold font-mono border border-indigo-100">
                {dataset.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Showcase badges toggle */}
              <button
                onClick={() => setPortfolioShowcaseMode(!portfolioShowcaseMode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  portfolioShowcaseMode 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" /> 
                {portfolioShowcaseMode ? "Hide Showcase Scope" : "Show Recruiter Mode"}
              </button>

              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                AI CLUSTERING ENGINE LIVE
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Display Page router switch */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
          {activePage === "executive" && (
            <ExecutiveOverview
              dataset={dataset}
              clustering={clusteringResult}
              insights={insights}
              onNavigate={(page) => setActivePage(page as any)}
            />
          )}

          {activePage === "lab" && (
            <CustomerSegmentationLab
              currentDataset={dataset}
              onDatasetChange={handleDatasetChange}
              selectedFeatures={selectedFeatures}
              onSelectedFeaturesChange={setSelectedFeatures}
              kValue={kValue}
              onKValueChange={setKValue}
              onRunClustering={handleRunClustering}
              xAxisFeature={xAxisFeature}
              onXAxisChange={setXAxisFeature}
              yAxisFeature={yAxisFeature}
              onYAxisChange={setYAxisFeature}
              bubbleSizeFeature={bubbleSizeFeature}
              onBubbleSizeChange={setBubbleSizeFeature}
              clustering={clusteringResult}
              elbowPoints={elbowPoints}
            />
          )}

          {activePage === "intelligence" && (
            <SegmentIntelligence
              clustering={clusteringResult}
              dataset={dataset}
              selectedFeatures={selectedFeatures}
              insights={insights}
              onTriggerInsights={triggerAiInsights}
              loading={insightsLoading}
              error={insightsError}
            />
          )}

          {activePage === "predictions" && (
            <PredictionsAIPanel
              clustering={clusteringResult}
              dataset={dataset}
              insights={insights}
            />
          )}

          {activePage === "reporting" && (
            <ReportingCenter
              clustering={clusteringResult}
              dataset={dataset}
              insights={insights}
            />
          )}

          {/* Under-the-hood: Recruiter Showcase Panel (Enabled by default at bottom for immediate portfolio proof!) */}
          {portfolioShowcaseMode && (
            <RecruiterShowcase />
          )}
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium w-full">
          <div className="max-w-7xl mx-auto px-4">
            <p>© 2026 Cohorts AI: Customer Intelligence SaaS Platform. ISO-27001 Security Standard compliant.</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
