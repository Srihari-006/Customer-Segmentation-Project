import { useState } from "react";
import { 
  Projector, 
  Layers, 
  Cpu, 
  BookOpen, 
  Binary, 
  Brackets, 
  ChevronDown, 
  ChevronUp, 
  Network, 
  Workflow, 
  Sigma, 
  CornerDownRight, 
  Briefcase,
  ExternalLink,
  Milestone
} from "lucide-react";

export default function RecruiterShowcase() {
  const [expandedSection, setExpandedSection] = useState<string | null>("math");

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-indigo-500/20 max-w-7xl mx-auto mt-12">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-505/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300">
            <Briefcase className="w-3.5 h-3.5" /> Recruiter Portfolio Showcase Mode
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
            Advanced Data Science & Engineering Infrastructure
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            System architectural schematics, mathematical models, and deployment flow details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* SVG System Architecture Schematics (Span 7) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6.5 border border-slate-800/80 space-y-4">
          <div className="flex justify-between items-center">
            <strong className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-indigo-400" /> Interactive System Pipeline Schema
            </strong>
            <span className="text-[10px] text-slate-500 font-mono">FLOW: RAW CSV TO ADVISORY</span>
          </div>

          {/* Clean Interactive SVG Platform Architecture */}
          <div className="w-full overflow-x-auto bg-slate-900 border border-slate-800/50 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
            <svg viewBox="0 0 720 300" className="w-full max-w-3xl h-auto text-slate-300 font-sans select-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                </marker>
                <linearGradient id="gradBox" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              {/* Step 1: Raw Data */}
              <rect x="10" y="110" width="110" height="70" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="65" y="140" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Synthetics / CSV</text>
              <text x="65" y="160" fill="#94a3b8" fontSize="9" textAnchor="middle">Customer Profiles</text>

              <line x1="120" y1="145" x2="150" y2="145" stroke="#818cf8" strokeWidth="1.5" markerEnd="url(#arrow)" />

              {/* Step 2: Normalization */}
              <rect x="160" y="110" width="120" height="70" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="220" y="140" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Normalize Vector</text>
              <text x="220" y="160" fill="#94a3b8" fontSize="9" textAnchor="middle">Standard Euler Scaling</text>

              <line x1="280" y1="145" x2="310" y2="145" stroke="#818cf8" strokeWidth="1.5" markerEnd="url(#arrow)" />

              {/* Step 3: K-Means Iteration Loop */}
              <rect x="320" y="110" width="130" height="70" rx="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
              <text x="385" y="140" fill="#818cf8" fontSize="11" fontWeight="bold" textAnchor="middle">K-Means Converge</text>
              <text x="385" y="160" fill="#c7d2fe" fontSize="9" textAnchor="middle">Centroids Distance Loop</text>

              {/* Loop arrow */}
              <path d="M 370 180 Q 385 205 400 180" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow)" />
              <text x="385" y="215" fill="#c7d2fe" fontSize="8" textAnchor="middle">iter &lt; 35</text>

              <line x1="450" y1="145" x2="480" y2="145" stroke="#818cf8" strokeWidth="1.5" markerEnd="url(#arrow)" />

              {/* Split: Dimensional Projections (X: 490, Y: 30) & Stats Aggregator (X: 490, Y: 180) */}
              {/* Branch 1 */}
              <path d="M 450 145 L 490 60" stroke="#818cf8" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <rect x="500" y="20" width="120" height="60" rx="10" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
              <text x="560" y="50" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">Proj (PCA / t-SNE)</text>
              <text x="560" y="65" fill="#a7f3d0" fontSize="8" textAnchor="middle">2D Spatial Scatter</text>

              {/* Branch 2 */}
              <path d="M 450 145 L 490 220" stroke="#818cf8" strokeWidth="1.5" markerEnd="marker" />
              <rect x="500" y="200" width="120" height="60" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="560" y="230" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Segment Evaluator</text>
              <text x="560" y="245" fill="#fde68a" fontSize="8" textAnchor="middle">Calinski / Silhouette Score</text>

              {/* Node Proxy Endpoint to Strategic Analytics Engine */}
              <line x1="620" y1="50" x2="650" y2="120" stroke="#818cf8" strokeWidth="1.5" />
              <line x1="620" y1="230" x2="650" y2="160" stroke="#818cf8" strokeWidth="1.5" />
              
              <rect x="635" y="105" width="75" height="70" rx="10" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
              <text x="672" y="135" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">Strategy</text>
              <text x="672" y="155" fill="#f3e8ff" fontSize="9" textAnchor="middle">Cloud model API</text>
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 font-sans font-medium">
            This modular pipeline isolates normalized vector calculations dynamically. Node's proxy executes backend queries to protect secure secrets.
          </div>
        </div>

        {/* Accordions detailing data formulas & glossaries (Span 5) */}
        <section className="lg:col-span-5 space-y-4 text-xs font-sans">
          <strong className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Core Scientific Glossaries</strong>

          {/* Section: Euclidean math formula */}
          <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
            <button 
              onClick={() => toggleSection("math")}
              className="w-full p-4 flex justify-between items-center hover:bg-slate-900 transition"
            >
              <span className="font-bold text-slate-205 flex items-center gap-2">
                <Sigma className="w-4 h-4 text-indigo-400" /> K-Means Euclidean Formulation
              </span>
              {expandedSection === "math" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection === "math" && (
              <div className="p-4 border-t border-slate-900 space-y-2.5 text-slate-350 leading-relaxed max-h-[180px] overflow-y-auto">
                <p>
                  Euler metrics measure geometric distances for coordinate variables:
                </p>
                <code className="block bg-slate-900 text-indigo-300 p-2.5 rounded-lg text-center font-mono text-[11px] my-1">
                  d(p, q) = √ ∑ (p_i - q_i)²
                </code>
                <p>
                  Normalization isolates individual variables into a <code>0 - 1</code> dimension bounds to prevent high magnitude variables (like Revenue USD) from overriding lower variables (like NPS ratings).
                </p>
              </div>
            )}
          </div>

          {/* Section: PCA / t-SNE projections math */}
          <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
            <button 
              onClick={() => toggleSection("projections")}
              className="w-full p-4 flex justify-between items-center hover:bg-slate-900 transition"
            >
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Projector className="w-4 h-4 text-emerald-400" /> Dimensional Projections
              </span>
              {expandedSection === "projections" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection === "projections" && (
              <div className="p-4 border-t border-slate-900 space-y-2.5 text-slate-350 leading-relaxed max-h-[180px] overflow-y-auto">
                <p>
                  When clustering across 5 input coordinates, directly plotting on 2D planes is mathematically restricted. We employ dimensional reduction alternatives:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>PCA (Principal Component Analysis)</strong>: Identifies linear eigen-matrices representing dimensions with the heaviest variances.</li>
                  <li><strong>t-SNE / UMAP</strong>: Applies non-linear mathematical probabilities mapping local attraction coordinates to separate dense clusters.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section: ML Glossaries */}
          <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
            <button 
              onClick={() => toggleSection("metrics")}
              className="w-full p-4 flex justify-between items-center hover:bg-slate-900 transition"
            >
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Evaluation Metrics Glossaries
              </span>
              {expandedSection === "metrics" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection === "metrics" && (
              <div className="p-4 border-t border-slate-900 space-y-2.5 text-slate-300 leading-relaxed max-h-[180px] overflow-y-auto">
                <div className="space-y-1">
                  <strong className="text-slate-200">Silhouette Coefficient (S)</strong>
                  <p>Represents how similar an item is to its assigned cluster compared to adjacent structures. Boundary values run from <code>-1 (poor)</code> to <code>+1 (optimal)</code>.</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-200">Davies-Bouldin Index (DBI)</strong>
                  <p>Formulates ratios of spatial dispersion against distance centroids. Lower output numbers translate to tighter clusters.</p>
                </div>
              </div>
            )}
          </div>

        </section>

      </div>

      <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium font-sans">
        <span>Portfolio Showcase Module v1.2</span>
        <span>Standardized on standard React 19 + Express full-stack architecture</span>
      </div>
    </div>
  );
}
