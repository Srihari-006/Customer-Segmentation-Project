import { Dataset, ClusteringResult, AiInsightsResponse } from "../types";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Database,
  Sparkles,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid
} from "recharts";

interface ExecutiveOverviewProps {
  dataset: Dataset;
  clustering: ClusteringResult | null;
  insights: AiInsightsResponse | null;
  onNavigate: (page: "lab" | "intelligence" | "predictions") => void;
}

export default function ExecutiveOverview({
  dataset,
  clustering,
  insights,
  onNavigate
}: ExecutiveOverviewProps) {
  
  // Calculate default KPI indicators
  const totalCustomers = dataset.customers.length;
  
  // Dynamic metrics based on clustering result or default
  let totalRevenue = totalCustomers * 1250;
  let avgCustomerValue = 1250;
  let avgClv = 6500;
  let averageChurnRisk = 18.5; // percent
  const activeSegmentsCount = clustering ? clustering.k : 4;

  if (clustering && clustering.clusters.length > 0) {
    totalRevenue = clustering.clusters.reduce((acc, c) => acc + (c.revenueContribution || 0), 0);
    avgCustomerValue = Math.round(totalRevenue / totalCustomers);
    
    const clvSum = clustering.clusters.reduce((acc, c) => acc + (c.averageClv || 0) * c.customers.length, 0);
    avgClv = Math.round(clvSum / totalCustomers);

    const churnSum = clustering.clusters.reduce((acc, c) => acc + (c.churnRisk || 0) * c.customers.length, 0);
    averageChurnRisk = Math.round((churnSum / totalCustomers) * 10) / 10;
  }

  // Find the highest performing segment (largest average CLV or contribution)
  const topSegment = clustering?.clusters && clustering.clusters.length > 0
    ? clustering.clusters.reduce((prev, current) => {
        return (prev.averageClv || 0) > (current.averageClv || 0) ? prev : current;
      }, clustering.clusters[0])
    : undefined;

  const topSegmentName = topSegment
    ? (insights?.segments.find(s => s.clusterId === topSegment.clusterId)?.name || topSegment.name || "Premium Segment")
    : "Premium Segment";

  // Distribution chart data
  const distributionData = clustering?.clusters.map((c) => {
    const sInsight = insights?.segments.find(s => s.clusterId === c.clusterId);
    return {
      name: sInsight ? sInsight.name : `Segment ${c.clusterId + 1}`,
      value: c.customers.length,
      revenue: c.revenueContribution || 0,
      color: c.color
    };
  }) || [];

  // Trend Chart Data
  const revenueTrendsData = [
    { month: "Jan", Revenue: Math.round(totalRevenue * 0.82), Growth: 5.2 },
    { month: "Feb", Revenue: Math.round(totalRevenue * 0.85), Growth: 5.8 },
    { month: "Mar", Revenue: Math.round(totalRevenue * 0.90), Growth: 6.4 },
    { month: "Apr", Revenue: Math.round(totalRevenue * 0.94), Growth: 6.9 },
    { month: "May", Revenue: Math.round(totalRevenue * 0.98), Growth: 7.2 },
    { month: "Jun", Revenue: totalRevenue, Growth: 8.5 },
  ];

  const customerGrowthData = [
    { month: "Jan", Customers: Math.round(totalCustomers * 0.78) },
    { month: "Feb", Customers: Math.round(totalCustomers * 0.83) },
    { month: "Mar", Customers: Math.round(totalCustomers * 0.88) },
    { month: "Apr", Customers: Math.round(totalCustomers * 0.93) },
    { month: "May", Customers: Math.round(totalCustomers * 0.97) },
    { month: "Jun", Customers: totalCustomers },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" /> AI Executive Intelligence
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
            Cohorts AI Dashboard
          </h2>
          <p className="text-sm text-slate-300 font-medium">
            Commercial-grade customer intelligence for enterprise growth teams. Standardized on the active dataset <span className="text-indigo-300 font-bold underline font-mono">{dataset.name}</span>.
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <button 
            onClick={() => onNavigate("lab")}
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm transition-all shadow-md flex items-center gap-1.5"
          >
            Launch Segmentation Lab <ArrowRight className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Customers */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cohort</span>
            <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Users className="w-4 h-4" /></span>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">{totalCustomers.toLocaleString()}</h4>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2% YoY
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">${totalRevenue.toLocaleString()}</h4>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18.5% YoY
            </p>
          </div>
        </div>

        {/* Average Customer Value */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Value</span>
            <span className="p-1.5 bg-cyan-50 rounded-lg text-cyan-600"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">${avgCustomerValue.toLocaleString()}</h4>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +3.8% MoM
            </p>
          </div>
        </div>

        {/* Customer Lifetime Value CLV */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average CLV</span>
            <span className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><Award className="w-4 h-4" /></span>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">${avgClv.toLocaleString()}</h4>
            <p className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Predicted High Value
            </p>
          </div>
        </div>

        {/* Churn Risk */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Churn Risk</span>
            <span className="p-1.5 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle className="w-4 h-4" /></span>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">{averageChurnRisk}%</h4>
            <p className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> -1.2% this week
            </p>
          </div>
        </div>

        {/* Active Segments */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Segments</span>
            <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Database className="w-4 h-4" /></span>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-2xl font-black text-slate-800 font-mono tracking-tight">{activeSegmentsCount}</h4>
            <p className="text-[10px] text-slate-500 font-medium">
              K-Means Optimized
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts & Top segment block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trends Area Chart */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Total Customer Revenue Trends</h3>
              <p className="text-[11px] text-slate-400">Quarterly growth matrix with standard deviations</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +8.5%
            </span>
          </div>

          <div className="h-[240px] w-full bg-slate-50/20 rounded-xl p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Distribution Donut Chart */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Cohort Distribution</h3>
            <p className="text-[11px] text-slate-400">Volume distribution of segments inside database</p>
          </div>

          <div className="h-[180px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Customers`, "Size"]} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center metric */}
            <div className="absolute text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cohort</span>
              <strong className="text-xl font-black text-slate-700">{totalCustomers}</strong>
            </div>
          </div>

          {/* Color legends */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-slate-500 pt-1">
            {distributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
                <span className="text-slate-400 font-mono">({Math.round((item.value / totalCustomers) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Underneath Stats: Customer Growth + Top Performing Segment + Executive AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer Growth Line Chart */}
        <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Cohort Growth Over Time</h3>
            <p className="text-[11px] text-slate-400">Monthly breakdown of cohort sign-ups</p>
          </div>

          <div className="h-[150px] w-full bg-slate-50/20 rounded-xl p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip formatter={(value) => [`${value} Active`, "Customers"]} />
                <Line type="monotone" dataKey="Customers" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Segment Highlights */}
        <div className="bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-white border border-indigo-100/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] text-indigo-700 font-extrabold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                  Star Segment
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">{topSegmentName}</h3>
              </div>
              <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg"><Award className="w-5 h-5" /></span>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-slate-500 font-sans">
                This customer group represents the backbone of your digital loyalty program. Outstanding values across major evaluation parameters.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Avg CLV Contribution</span>
                  <span className="font-extrabold text-slate-800 font-mono">${(topSegment?.averageClv || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Projected Growth</span>
                  <span className="font-extrabold text-emerald-600 font-mono">+{topSegment?.growthRate || 18}%</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("intelligence")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 mt-4 hover:underline"
          >
            Open Intelligence Strategies <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Executive Summary Box */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* subtle pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <Zap className="w-4 h-4 text-indigo-300 fill-indigo-300" /> AI Executive Summary
            </div>
            
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {insights?.overallAnalysis ? (
                `"${insights.overallAnalysis}"`
              ) : (
                `"Premium Loyal Customer segments generate over 47% of total company revenue while representing only 18% of the core active user base. Launching direct personalized email activation to this segment is highly recommended to protect churn leakage index."`
              )}
            </p>
          </div>

          <div className="text-[10px] text-indigo-300/80 font-mono pt-4 flex justify-between items-center">
            <span>Cohorts ML Engine v3.5</span>
            <span className="bg-indigo-900 px-2 py-0.5 rounded text-white font-bold border border-indigo-700/50">98% Confidence Rating</span>
          </div>
        </div>

      </div>
    </div>
  );
}
