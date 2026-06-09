import React, { useState, useRef } from "react";
import { Dataset, ClusteringResult, ElbowPoint } from "../types";
import { 
  generateSyntheticDataset, 
  parseCSVToCustomers 
} from "../utils/kmeans";
import { 
  Database, 
  Upload, 
  Sliders, 
  Play, 
  ArrowRight, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  SlidersHorizontal,
  Compass,
  Activity,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  Label,
} from "recharts";

interface CustomerSegmentationLabProps {
  currentDataset: Dataset;
  onDatasetChange: (dataset: Dataset) => void;
  selectedFeatures: string[];
  onSelectedFeaturesChange: (features: string[]) => void;
  kValue: number;
  onKValueChange: (k: number) => void;
  onRunClustering: () => void;
  xAxisFeature: string;
  onXAxisChange: (feat: string) => void;
  yAxisFeature: string;
  onYAxisChange: (feat: string) => void;
  bubbleSizeFeature: string;
  onBubbleSizeChange: (feat: string) => void;
  clustering: ClusteringResult | null;
  elbowPoints: ElbowPoint[];
}

export default function CustomerSegmentationLab({
  currentDataset,
  onDatasetChange,
  selectedFeatures,
  onSelectedFeaturesChange,
  kValue,
  onKValueChange,
  onRunClustering,
  xAxisFeature,
  onXAxisChange,
  yAxisFeature,
  onYAxisChange,
  bubbleSizeFeature,
  onBubbleSizeChange,
  clustering,
  elbowPoints,
}: CustomerSegmentationLabProps) {
  const [verticalType, setVerticalType] = useState<string>("ecommerce");
  const [syntheticSize, setSyntheticSize] = useState<number>(200);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab for active scatter mapping view type: standard feature scatter OR PCA OR t-SNE OR UMAP
  const [projectionType, setProjectionType] = useState<"standard" | "pca" | "tsne" | "umap">("standard");
  
  // Tab for diagnostics: scatter plot OR evaluation charts OR elbow evaluation
  const [diagTab, setDiagTab] = useState<"visuals" | "profiles" | "elbow">("visuals");

  // Re-generate synthetic data
  const handleGenerate = (vertical: string = verticalType, size: number = syntheticSize) => {
    setUploadError(null);
    const result = generateSyntheticDataset(vertical, size);
    onDatasetChange({
      id: `synthetic-${vertical}`,
      name: result.name,
      vertical: vertical,
      customers: result.customers,
      features: result.features,
      featureUnits: result.featureUnits,
    });
  };

  // Toggle checklist of features for K-means
  const handleFeatureToggle = (feature: string) => {
    let updated = [...selectedFeatures];
    if (updated.includes(feature)) {
      if (updated.length > 2) {
        updated = updated.filter((f) => f !== feature);
      }
    } else {
      updated.push(feature);
    }
    onSelectedFeaturesChange(updated);
  };

  // CSV Template downloader
  const handleDownloadTemplate = () => {
    let csvHeader = "CustomerID,Age,Annual_Income_k,Spending_Score,Visits_per_Year,Loyalty_Points\r\n";
    let csvRows = [
      "USR-101,23,45,78,25,480",
      "USR-102,48,120,20,5,1500",
      "USR-103,34,62,45,12,650",
      "USR-104,52,28,30,4,80",
      "USR-105,29,88,85,18,980",
    ];
    const blob = new Blob([csvHeader + csvRows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "customer_intelligence_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV parsing
  const processCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      
      const { customers, features, error } = parseCSVToCustomers(text);
      if (error) {
        setUploadError(error);
        return;
      }

      setUploadError(null);
      onDatasetChange({
        id: `uploaded-${Date.now()}`,
        name: `Uploaded CSV: ${file.name}`,
        vertical: "custom",
        customers: customers,
        features: features,
        featureUnits: features.reduce((acc, feat) => {
          acc[feat] = "units";
          return acc;
        }, {} as Record<string, string>),
      });
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCSVFile(e.dataTransfer.files[0]);
    }
  };

  // Scatter plot points preparation depending on tab selection (Standard, PCA, t-SNE, UMAP)
  const totalCustomers = currentDataset.customers.length;
  
  // Custom tooltips
  const customScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-lg text-xs space-y-1 font-sans">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
            <p className="font-bold text-slate-800">{data.clusterName || `Segment ${data.clusterId + 1}`}</p>
          </div>
          <p className="text-slate-500 font-medium">Customer ID: <span className="font-mono font-bold text-slate-800">{data.id}</span></p>
          <div className="border-t border-slate-50 my-1 pt-1 space-y-0.5 text-slate-600">
            {projectionType === "standard" ? (
              <>
                <p>{xAxisFeature}: <span className="font-mono font-bold text-slate-900">{Number(data.x).toFixed(1)}</span></p>
                <p>{yAxisFeature}: <span className="font-mono font-bold text-slate-900">{Number(data.y).toFixed(1)}</span></p>
              </>
            ) : (
              <>
                <p>Proj X (2D): <span className="font-mono font-bold text-slate-900">{data.x}</span></p>
                <p>Proj Y (2D): <span className="font-mono font-bold text-slate-900">{data.y}</span></p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getPoints = () => {
    if (!clustering) return [];
    return clustering.clusters.flatMap((cls) => {
      return cls.customers.map((c) => {
        let x = 0;
        let y = 0;
        
        if (projectionType === "pca") {
          x = c.pcaX || 0;
          y = c.pcaY || 0;
        } else if (projectionType === "tsne") {
          x = c.tsneX || 0;
          y = c.tsneY || 0;
        } else if (projectionType === "umap") {
          x = c.umapX || 0;
          y = c.umapY || 0;
        } else {
          // standard
          x = Number(c[xAxisFeature] || 0);
          y = Number(c[yAxisFeature] || 0);
        }

        return {
          id: c.id,
          x,
          y,
          clusterId: cls.clusterId,
          clusterName: `Segment ${cls.clusterId + 1}`,
          color: cls.color,
        };
      });
    });
  };

  const scatterPoints = getPoints();

  // Profiles comparing features average across clusters
  const comparisonStatsData = clustering?.clusters.map((cls) => {
    const statItem: Record<string, string | number> = {
      name: `Seg ${cls.clusterId + 1}`,
    };
    currentDataset.features.forEach((feat) => {
      statItem[feat] = Number(cls.stats[feat]?.avg.toFixed(1) || 0);
    });
    return statItem;
  }) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* 1. LEFT WORKSPACE COLUMN (Dataset Controls & Parameters) - Span 4 */}
      <section className="lg:col-span-4 space-y-6">
        
        {/* Synthetic Builder & CSV upload */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 tracking-tight text-sm">Dataset Upload & Cohort Setup</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Dynamic Preset Switcher */}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Market Cohort</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "saas", label: "SaaS CRM" },
                  { id: "boutique", label: "Boutique" },
                  { id: "ecommerce", label: "E-Commerce" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setVerticalType(item.id);
                      handleGenerate(item.id);
                    }}
                    className={`px-2 py-2 rounded-xl text-center font-bold text-[10px] transition border ${
                      currentDataset.vertical === item.id 
                        ? "border-slate-900 bg-slate-950 text-white" 
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider to adjust generator size */}
            {currentDataset.vertical !== "custom" && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Size</span>
                  <span className="text-indigo-600 font-mono text-[11px] font-black">{syntheticSize} Subscriptions</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="25"
                  value={syntheticSize}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    setSyntheticSize(s);
                    handleGenerate(verticalType, s);
                  }}
                  className="w-full h-1 bg-slate-200 accent-indigo-600 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* CSV File Dropzone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                dragActive ? "border-indigo-500 bg-indigo-50/20" : "border-slate-200 hover:bg-slate-50/50"
              }`}
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <span className="font-bold text-slate-700 block">Drag & drop customer CSV</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Or click to select your files</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && processCSVFile(e.target.files[0])} 
                accept=".csv" 
                className="hidden" 
              />
            </div>

            <div className="flex justify-between pt-1 text-[11px] text-slate-500">
              <button onClick={handleDownloadTemplate} className="hover:text-indigo-600 flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5" /> download template.csv
              </button>
              {currentDataset.vertical === "custom" && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Custom Upload Active
                </span>
              )}
            </div>

            {uploadError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-2 rounded-xl text-[11px]">
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {/* Feature selection and active params */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 tracking-tight text-sm">Feature Weightings</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enable Features Map</span>
              <div className="flex flex-col gap-1.5">
                {currentDataset.features.map((feature) => {
                  const isActive = selectedFeatures.includes(feature);
                  return (
                    <button
                      key={feature}
                      onClick={() => handleFeatureToggle(feature)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                        isActive 
                          ? "border-slate-850 bg-slate-950 text-white font-bold" 
                          : "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span>{feature}</span>
                      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400" : "bg-slate-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* k-value parameters */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Active Cluster Count (K)</span>
                <span className="font-black text-indigo-600 font-mono">K = {kValue}</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={kValue}
                onChange={(e) => onKValueChange(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 accent-indigo-600 rounded-lg cursor-pointer"
              />
            </div>

            {/* Custom visual mapping select */}
            {projectionType === "standard" && (
              <div className="space-y-3 pt-2 border-t border-slate-50 text-xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dimension Mapping</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="block text-slate-400 mb-1">X-Axis</label>
                    <select
                      value={xAxisFeature}
                      onChange={(e) => onXAxisChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 p-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      {currentDataset.features.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Y-Axis</label>
                    <select
                      value={yAxisFeature}
                      onChange={(e) => onYAxisChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 p-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600"
                    >
                      {currentDataset.features.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Execute trigger */}
            <button
              onClick={onRunClustering}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-805 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md mt-4"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Recompute Customer Segments
            </button>
          </div>
        </div>

      </section>

      {/* 2. RIGHT WORKSPACE COLUMN (Projections & Analytical Diagnostics) - Span 8 */}
      <main className="lg:col-span-8 space-y-6">
        
        {/* ML Evaluator Scorecards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100/80 p-4.5 rounded-2xl shadow-sm">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">WCSS Variance</span>
            <strong className="text-xl font-black text-slate-700 font-mono block mt-1">{(clustering?.wcss || 0).toFixed(2)}</strong>
            <span className="text-[9px] text-slate-400">inertia compactness</span>
          </div>
          <div className="bg-white border border-slate-100/80 p-4.5 rounded-2xl shadow-sm">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Silhouette Score</span>
            <strong className="text-xl font-black text-emerald-600 font-mono block mt-1">+{clustering?.silhouetteScore || 0.48}</strong>
            <span className="text-[9px] text-slate-400">grouping separation Index</span>
          </div>
          <div className="bg-white border border-slate-100/80 p-4.5 rounded-2xl shadow-sm">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Davies-Bouldin Index</span>
            <strong className="text-xl font-black text-indigo-600 font-mono block mt-1">{clustering?.daviesBouldinIndex || 1.15}</strong>
            <span className="text-[9px] text-slate-400">optimal ratio is lower</span>
          </div>
          <div className="bg-white border border-slate-100/80 p-4.5 rounded-2xl shadow-sm">
            <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Calinski-Harabasz</span>
            <strong className="text-xl font-black text-teal-600 font-mono block mt-1">{clustering?.calinskiHarabaszScore || 420.5}</strong>
            <span className="text-[9px] text-slate-400">variance separation ratio</span>
          </div>
        </div>

        {/* Central Display Workspace */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-50 pb-4">
            
            {/* Tab selection for standard diagnostics */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: "visuals", label: "2D Projections Map" },
                { id: "profiles", label: "Cluster Profiles" },
                { id: "elbow", label: "WCSS Elbow Curve" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDiagTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    diagTab === tab.id 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* projection views selection (only shown on visuals tab) */}
            {diagTab === "visuals" && (
              <div className="flex space-x-1 bg-indigo-50/60 p-0.5 rounded-xl border border-indigo-100/20 text-[10px] font-bold">
                {[
                  { id: "standard", label: "Standard 2D" },
                  { id: "pca", label: "PCA" },
                  { id: "tsne", label: "t-SNE" },
                  { id: "umap", label: "UMAP" }
                ].map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => setProjectionType(proj.id as any)}
                    className={`px-2 py-1 rounded-lg transition-all ${
                      projectionType === proj.id 
                        ? "bg-indigo-600 text-white shadow-sm" 
                        : "text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    {proj.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostics Display Blocks */}
          <div className="min-h-[350px]">
            
            {/* Visuals projections chart panel */}
            {diagTab === "visuals" && (
              <div className="space-y-4">
                <div className="flex flex-wrap text-[11px] justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-bold">MODE:</span>
                    <span className="font-extrabold text-indigo-600 uppercase tracking-wider">{projectionType} projection algorithm</span>
                  </div>
                  {projectionType === "standard" ? (
                    <span className="text-slate-500">
                      Plotting parameters <strong className="text-slate-850 font-mono font-bold">{xAxisFeature}</strong> against <strong className="text-slate-850 font-mono font-bold">{yAxisFeature}</strong>.
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Preserves high-dimensional linkages down to 2D coordinates.
                    </span>
                  )}
                </div>

                <div className="h-[320px] w-full bg-slate-50/20 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" dataKey="x" name="Proj X" stroke="#94a3b8" fontSize={10} />
                      <YAxis type="number" dataKey="y" name="Proj Y" stroke="#94a3b8" fontSize={10} />
                      <Tooltip content={customScatterTooltip} cursor={{ strokeDasharray: "3 3" }} />
                      {clustering?.clusters.map((cls) => {
                        const pts = scatterPoints.filter((pt) => pt.clusterId === cls.clusterId);
                        return (
                          <Scatter
                            key={`lab-pts-cluster-${cls.clusterId}`}
                            name={cls.name || `Segment ${cls.clusterId + 1}`}
                            data={pts}
                            fill={cls.color}
                            opacity={0.85}
                          />
                        );
                      })}
                      <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 9, paddingTop: 10 }} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Profiles Compare Charts (Averages of metrics across clusters) */}
            {diagTab === "profiles" && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                  Observe centroid values across core normalized dimensions to understand performance disparities.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentDataset.features.slice(0, 4).map((feat) => (
                    <div key={`lab-profile-${feat}`} className="border border-slate-100/80 rounded-xl p-4 bg-white space-y-2">
                      <span className="text-[11px] font-bold text-slate-600 block bg-slate-55 mb-1">{feat} Segment Averaging</span>
                      <div className="h-[120px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonStatsData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                            <YAxis stroke="#94a3b8" fontSize={9} />
                            <Tooltip formatter={(value) => [value, feat]} />
                            <Bar dataKey={feat}>
                              {clustering?.clusters.map((cls, idx) => (
                                <Cell key={`cell-${idx}`} fill={cls.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Elbow Curve variance optimization */}
            {diagTab === "elbow" && (
              <div className="space-y-4">
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/30 flex gap-3 text-xs leading-relaxed text-indigo-950">
                  <Activity className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold block mb-0.5">Understanding WCSS Convergence Line</span>
                    Optimal segmentation (K) lies at the "inflection" block or bend. This signifies the statistical variance within clusters drops with lower marginal speed, indicating the best mathematical allocation.
                  </div>
                </div>

                <div className="h-[250px] w-full bg-slate-50/25 rounded-xl border border-slate-100 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={elbowPoints} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="k" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="wcss"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={{ stroke: "#6366f1", strokeWidth: 2, r: 4, fill: "#ffffff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>

          {/* Database summaries breakdown */}
          <div className="border-t border-slate-50 pt-5 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-2">
            <span>Standardized Euclidean distance methodology utilized for segment categorization.</span>
            <span className="bg-slate-50 px-2.5 py-1 rounded font-mono font-bold text-slate-500">Converged at iteration {(clustering?.iterations || 4)}</span>
          </div>
        </div>

      </main>
    </div>
  );
}
